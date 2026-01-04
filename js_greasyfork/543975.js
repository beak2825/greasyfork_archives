// ==UserScript==
// @name         GitHub Issue Triage Helper
// @namespace    https://github.com/nbolton/github-triage-helper
// @source       https://github.com/nbolton/github-triage-helper
// @license      MIT
// @version      0.6
// @description  Suggest triage questions for GitHub issues using AI
// @author       nbolton
// @match        https://github.com/*
// @connect      api.openai.com
// @connect      api.github.com
// @grant        GM_xmlhttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @require      https://update.greasyfork.org/scripts/34138/223779/markedjs.js
// @downloadURL https://update.greasyfork.org/scripts/543975/GitHub%20Issue%20Triage%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/543975/GitHub%20Issue%20Triage%20Helper.meta.js
// ==/UserScript==

const css =
`
#ai-suggestions-box {
    margin: 16px 0 0 55px;
    padding: 12px 16px;
    border: 1px solid #30363d;
    border-radius: 6px;
    line-height: 1.5;
    font-size: 14px;
}

#ai-suggestions-box ol {
    margin-left: 20px;
    padding-left: 0;
}

#ai-suggestions-box li {
    margin-bottom: 6px;
}

#ai-suggestions-box h3 {
    margin-bottom: 15px;
}
`;

// Remember: Secrets be reset/edited on the script's 'Storage' tab in Tampermonkey (when using advanced config mode).
(function () {
    'use strict';

    const logger = createLogger("triage-helper");
    let apiKey = null;
    let githubToken = null;
    let box = null;

    async function init() {
        logger.log("GitHub Issue Triage Helper");

        apiKey = await GM.getValue("openai_api_key");
        if (!apiKey) {
            apiKey = prompt("OpenAI API key:");
            if (apiKey) {
                await GM.setValue("openai_api_key", apiKey);
            }
        }

        githubToken = await GM.getValue("github_token");
        if (!githubToken) {
            githubToken = prompt("GitHub API token:");
            if (githubToken) {
                await GM.setValue("github_token", githubToken);
            }
        }

        let lastUrl = location.href;
        const observer = new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                logger.debug("URL changed:", lastUrl);
                run();
                return;
            }

            if (!isValidUrl(location.href)) {
                logger.debug("Ignoring:", location.href);
                return;
            }

            // prevent recursion
            if (document.getElementById('ai-suggestions-box')) return;

            logger.debug("DOM changed, injecting suggestion box");

            box = injectSuggestionBox();
            if (!box) {
                logger.debug("No where to inject suggestion box");
                return;
            }

            box.innerHTML = "Loading AI suggestions...";
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        run();
    }

    async function getIssueContext() {
        const pathMatch = window.location.pathname.match(/^\/([^/]+)\/([^/]+)\/issues\/(\d+)/);
        if (!pathMatch) return null;

        const [, owner, repo, issueNumber] = pathMatch;
        return { owner, repo, issueNumber };
    }

    async function fetchIssueText(githubToken) {
        logger.log("Fetching issue text...");

        const context = await getIssueContext();
        if (!context) throw new Error("Invalid GitHub URL");

        logger.debug("Issue number:", context.issueNumber);

        const { owner, repo, issueNumber } = context;

        const headers = {
            'Accept': 'application/vnd.github+json',
            'Authorization': `token ${githubToken}`,
            'User-Agent': 'GitHub-Issue-Triage-Script'
        };

        const fetchWithGM = (url, timeoutMs = 5000) => {
            return Promise.race([
                new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url,
                        headers,
                        onload: (res) => {
                            if (res.status !== 200) return reject(`GitHub API error ${res.status} for ${url}`);
                            try {
                                resolve(JSON.parse(res.responseText));
                            } catch (e) {
                                reject(`Failed to parse JSON from ${url}`);
                            }
                        },
                        onerror: () => reject(`Network error for ${url}`)
                    });
                }),
                new Promise((_, reject) => setTimeout(() => reject(new Error(`Request timed out after ${timeoutMs}ms`)), timeoutMs))
            ])
        }

        const readmeUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;
        const issueUrl = `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`;
        const commentsUrl = `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments`;

        const [readme, issue, comments] = await Promise.all([
            fetchWithGM(readmeUrl),
            fetchWithGM(issueUrl),
            fetchWithGM(commentsUrl)
        ]);

        const readmeDecoded = atob(readme.content || '');
        logger.debug("GitHub response:", readmeDecoded, issue, comments);

        const allText = [
            `GitHub repo: https://github.com/${owner}/${repo}`,
            "#Readme\n\n```markdown\n" + readmeDecoded + "\n```",
            `#Issue\n\nUser: @${issue.user.login}\nTitle: ${issue.title}\nBody:\n${issue.body}`,
            ...comments.map(c => `@${c.user.login}:\n${c.body}`)
        ].join('\n\n---\n\n');

        return allText;
    }

    async function fetchAISuggestions(commentsText, apiKey) {
        logger.log("Fetching AI suggestions...");

        const payload = JSON.stringify({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: (
                        "You are a senior GitHub issue triage assistant. " +
                        "Your job is to help maintainers understand, reproduce, and fix bugs by asking the most useful clarifying questions. " +
                        "Focus on uncovering missing information, narrowing scope, and identifying blockers to resolution. " +
                        "Avoid repeating what has already been said. " +
                        "Format responses in Markdown."
                    )
                },
                {
                    role: "user",
                    content: (
                        `Here is a GitHub issue thread including the original report and comments:\n\n${commentsText}\n\n` +
                        `Your task:\n` +
                        `1. Summarize the current understanding of the issue in one short paragraph.\n` +
                        `2. Then, list up to 5 concise, helpful questions that would help clarify, reproduce, or scope the issue further.\n\n` +
                        `Use clear, technical language and avoid redundancy.`
                    )
                }
            ],
            temperature: 0.3, // Lower numbers give safer, less creative answers.
            max_tokens: 600
        });

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://api.openai.com/v1/chat/completions',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                data: payload,
                onload: function (response) {
                    try {
                        const json = JSON.parse(response.responseText);
                        logger.debug("AI response:", json);
                        const content = json.choices?.[0]?.message?.content || 'No response';
                        resolve(content);
                    } catch (e) {
                        reject('Failed to parse AI response');
                    }
                },
                onerror: function () {
                    reject('Failed to reach AI server');
                }
            });
        });
    }

    function injectSuggestionBox(content) {
        const timeline = document.querySelector('[class*="Timeline-Timeline"]');

        if (!timeline) {
            return null;
        }

        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);

        const box = document.createElement('div');
        box.id = 'ai-suggestions-box';
        timeline.parentNode.insertBefore(box, timeline.nextSibling);

        return box;
    }

    function isValidUrl(url) {
        if (/\/issues\/\d+\?notification_referrer_id.+/.test(url)) {
            // Page loads twice when URL contains 'notification_referrer_id', so ignore this.
            logger.debug("URL has 'notification_referrer_id'");
            return false;
        }

        if(!/\/issues\/\d+/.test(url)) {
            return false;
        }

        return true;
    }

    async function run() {

        logger.log("Running");

        if (!isValidUrl(location.href)) {
            logger.debug("Ignoring:", location.href);
            return;
        }

        const aiInput = await fetchIssueText(githubToken);
        logger.log("AI input length:", aiInput.length);
        logger.debug("AI input:", aiInput);

        const aiSuggestions = await fetchAISuggestions(aiInput, apiKey);
        logger.log("AI response length:", aiSuggestions.length);
        logger.debug("AI suggestions:", aiSuggestions);

        if (!box) {
            // TODO: delay rendering until it is loaded
            logger.error("Suggestions box didn't load in time");
            return;
        }

        const html = marked.parse(aiSuggestions);
        box.innerHTML = html;
    }

    function createLogger(scriptName) {
        function formatMessage(level, ...args) {
            const prefix = `[${scriptName}]`;
            return [prefix, ...args];
        }

        return {
            log: (...args) => console.log(...formatMessage('log', ...args)),
            info: (...args) => console.info(...formatMessage('info', ...args)),
            warn: (...args) => console.warn(...formatMessage('warn', ...args)),
            error: (...args) => console.error(...formatMessage('error', ...args)),
            debug: (...args) => console.debug(...formatMessage('debug', ...args)),
        };
    }

    init();
})();