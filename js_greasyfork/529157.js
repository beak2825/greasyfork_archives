// ==UserScript==
// @name         Reddit AI BotBuster (Enhanced UX - Complete)
// @namespace    http://tampermonkey.net/
// @version      4.1.0
// @description  Detects suspected bot accounts and AI-generated content on Reddit with a transparent, configurable, and research-based engine.
// @match        https://www.reddit.com/*
// @match        https://old.reddit.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/529157/Reddit%20AI%20BotBuster%20%28Enhanced%20UX%20-%20Complete%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529157/Reddit%20AI%20BotBuster%20%28Enhanced%20UX%20-%20Complete%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /************************************
     * 1. STYLES & UI INJECTION
     ************************************/
    // Use GM_addStyle for compatibility, falling back to a manual injection.
    const addStyle = typeof GM_addStyle !== 'undefined' ? GM_addStyle : (css) => {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    };

    addStyle(`
        .botUsername { color: orange !important; font-size: 14px !important; font-weight: bold !important; }
        .botAndAiContentDetected { outline: 3px dashed purple !important; outline-offset: -3px; }
        /* Confidence-Based Highlighting */
        .aiContentLow { outline: 2px dashed #007bff !important; outline-offset: -2px; } /* Light Blue */
        .aiContentMid { outline: 3px dashed #0056b3 !important; outline-offset: -3px; } /* Medium Blue */
        .aiContentHigh { outline: 3px solid #00234d !important; outline-offset: -3px; }   /* Dark Blue */

        #botCounterPopup { position: fixed; top: 40px; right: 10px; width: 280px; z-index: 9999; background-color: rgba(248,248,248,0.9); backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px); border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.25); font-family: 'Verdana', sans-serif; font-size: 12px; border: 1px solid #ccc; user-select: none; }
        #botPopupHeader { display: flex; justify-content: space-between; align-items: center; font-weight: bold; padding: 10px; border-bottom: 1px solid #eee; cursor: pointer; }
        #settingsIcon { cursor: pointer; font-size: 16px; margin-left: 10px; }
        #settingsPanel { display: none; padding: 10px; border-top: 1px solid #eee; }
        #settingsPanel label { display: block; margin: 5px 0; }
        #settingsPanel input { width: 50px; margin-left: 10px; }
        #saveSettingsBtn { background-color: #007bff; color: white; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer; margin-top: 10px; }
        #saveSettingsBtn:hover { background-color: #0056b3; }
        #botDropdown { display: none; max-height: 300px; overflow-y: auto; padding: 5px 0; }
        #botDropdown a { display: block; padding: 3px 10px; text-decoration: none; color: #333; }
        #botDropdown a:hover { background-color: rgba(0,0,0,0.08); }
        /* On-Hover Tooltip for Score Breakdown */
        #aiScoreTooltip { position: fixed; display: none; background: #222; color: #fff; border-radius: 5px; padding: 8px; font-size: 12px; z-index: 10000; max-width: 300px; pointer-events: none; }
        #aiScoreTooltip ul { margin: 0; padding: 0 0 0 15px; }
        #aiScoreTooltip li { margin-bottom: 3px; }
    `);

    /************************************
     * 2. CONFIGURATION & STATE
     ************************************/
    // Use GM_getValue for persistent settings, with defaults.
    let BOT_THRESHOLD = GM_getValue("bot_threshold", 2.9);
    let AI_THRESHOLD = GM_getValue("ai_threshold", 4.0);

    // Confidence Tiers (relative to AI_THRESHOLD)
    const CONFIDENCE_MID_TIER = 2.5;
    const CONFIDENCE_HIGH_TIER = 5.0;

    // Heuristics patterns
    const suspiciousUserPatterns = [ /bot/i, /^[A-Za-z]+-[A-Za-z]+\d{4}$/, /^[A-Za-z]+[_-][A-Za-z]+\d{2,4}$/, /^[A-Za-z]+\d{4,}$/, /^(user|redditor)\d{6,}$/i ];
    const genericResponses = [ "i agree dude", "yes you are right", "well said", "totally agree", "i agree", "right you are", "well spoken, you are", "perfectly said this is", "lol", "nice", "true", "this.", "same", "agreed", "exactly", "preach" ];
    const scamLinkRegex = /\.(live|life|shop|xyz|buzz|top|click|fun|site|online|store|blog|app|digital|network|cloud)\b/i;
    const CONTENT_SELECTORS = [ 'div[data-testid="post-container"]', 'div[data-testid="comment"]', 'div.comment', 'div.link' ];
    const USERNAME_SELECTORS = 'a[href*="/user/"], a[href*="/u/"], a.author, a[data-click-id="user"]';

    // State
    let botCount = 0;
    let detectedBots = [];
    let detectionIndex = 0;

    /************************************
     * 3. UTILITY FUNCTIONS
     ************************************/
    function countSyllables(word) {
        word = word.toLowerCase();
        if (word.length <= 3) return 1;
        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
        word = word.replace(/^y/, '');
        const matches = word.match(/[aeiouy]{1,}/g);
        return matches ? matches.length : 1;
    }

    function computeReadabilityScore(text) {
        const sentenceMatches = text.match(/[^.!?]+[.!?]+/g);
        if (!sentenceMatches) return null;
        const sentences = sentenceMatches;
        const words = text.split(/\s+/).filter(w => w.length > 0);
        if (words.length === 0 || sentences.length === 0) return null;
        const wordCount = words.length;
        const sentenceCount = sentences.length;
        const syllableCount = words.reduce((acc, word) => acc + countSyllables(word), 0);
        return 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllableCount / wordCount);
    }

    /******************************************************************
     * 4. AI & BOT DETECTION ENGINES
     ******************************************************************/
    function computeAIScore(text, paragraphCount = 1) {
        let score = 0;
        let reasons = [];
        const lowerText = text.toLowerCase();
        const words = lowerText.split(/\s+/).filter(w => w.length > 0);
        const wordCount = words.length;

        if (wordCount < 25) return { score: 0, reasons: [] };

        if (/\bas an (ai|artificial intelligence)( language model)?\b/.test(lowerText)) {
            return { score: 10.0, reasons: ["Self-disclosed as an AI [+10.0]"] };
        }

        const aiFormulaicPhrases = [ "in conclusion", "furthermore", "moreover", "on the other hand", "it is important to note", "ultimately", "in summary", "delve deeper into", "explore the nuances of" ];
        let formulaicPhraseCount = 0;
        aiFormulaicPhrases.forEach(phrase => { if (lowerText.includes(phrase)) formulaicPhraseCount++; });
        if (formulaicPhraseCount > 0) {
            const points = formulaicPhraseCount * 1.2;
            score += points;
            reasons.push(`Formulaic Language [+${points.toFixed(1)}]`);
        }

        const contractions = lowerText.match(/\b(i'm|you're|they're|we're|can't|won't|didn't|isn't|it's)\b/g);
        if (wordCount > 70 && (!contractions || contractions.length < (wordCount / 100))) {
            score += 1.8;
            reasons.push("Lacks Contractions [+1.8]");
        }

        const complexSynonyms = { 'utilize': 'use', 'leverage': 'use', 'commence': 'start', 'facilitate': 'help', 'elucidate': 'explain', 'henceforth': 'from now on', 'nevertheless': 'but', 'demonstrate': 'show' };
        let complexWordCount = 0;
        words.forEach(word => { if (complexSynonyms[word]) complexWordCount++; });
        if (wordCount > 50 && complexWordCount > (wordCount / 75)) {
            const points = complexWordCount * 0.8;
            score += points;
            reasons.push(`Unnatural Synonyms [+${points.toFixed(1)}]`);
        }

        const personalPhrases = ["i think", "i feel", "i believe", "in my opinion", "in my experience"];
        const hasPersonalPhrase = personalPhrases.some(phrase => lowerText.includes(phrase));
        if (wordCount > 60 && !hasPersonalPhrase) {
            score += 1.0;
            reasons.push("Lacks Personal Opinion [+1.0]");
        }

        const sentencesArr = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
        if (sentencesArr.length > 3) {
            const lengths = sentencesArr.map(s => s.split(/\s+/).length);
            const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
            const variance = lengths.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / lengths.length;
            if (wordCount > 50 && variance < 12) {
                score += 1.5;
                reasons.push("Low Sentence Variance [+1.5]");
            }
            if (variance > 40) {
                score -= 1.0;
                reasons.push("High Burstiness (Human-like) [-1.0]");
            }
        }

        if (paragraphCount > 2 && wordCount > 80) {
            score += 1.5;
            reasons.push(`Well-structured (${paragraphCount} Paras) [+1.5]`);
        }

        if (/[\u{1F600}-\u{1F64F}]/gu.test(text)) { score -= 1.0; reasons.push("Contains Emojis [-1.0]"); }

        return { score: Math.max(0, score), reasons };
    }

    function computeUsernameBotScore(username) {
        let score = 0;
        suspiciousUserPatterns.forEach(pattern => {
            if (pattern.test(username)) { score += 1.5; }
        });
        const digits = username.match(/\d/g);
        if (digits && (digits.length / username.length) > 0.4) { score += 0.8; }
        return score;
    }

    function computeBotScore(elem) {
        let score = 0;
        const userElem = elem.querySelector(USERNAME_SELECTORS);
        if (userElem) {
            score += computeUsernameBotScore(userElem.innerText.trim());
        }
        const textContent = elem.innerText.toLowerCase().replace(/\s+/g, ' ').trim();
        if (genericResponses.includes(textContent) && textContent.length < 30) {
            score += 1.5;
        }
        const links = elem.querySelectorAll('a');
        links.forEach(link => {
            if (scamLinkRegex.test(link.href)) { score += 3.0; }
        });
        return score;
    }


    /************************************
     * 5. UI MANAGEMENT & POPUP
     ************************************/
    function createPopupAndTooltip() {
        let popup = document.createElement("div");
        popup.id = "botCounterPopup";
        popup.innerHTML = `
            <div id="botPopupHeader">
                <span>Detected bot/AI: 0</span>
                <span id="settingsIcon" title="Settings">⚙️</span>
            </div>
            <div id="settingsPanel">
                <label>AI Threshold: <input type="number" id="aiThresholdInput" step="0.1" min="1"></label>
                <label>Bot Threshold: <input type="number" id="botThresholdInput" step="0.1" min="1"></label>
                <button id="saveSettingsBtn">Save</button>
            </div>
            <div id="botDropdown"></div>`;
        document.body.appendChild(popup);
        document.getElementById("aiThresholdInput").value = AI_THRESHOLD;
        document.getElementById("botThresholdInput").value = BOT_THRESHOLD;

        let tooltip = document.createElement("div");
        tooltip.id = "aiScoreTooltip";
        document.body.appendChild(tooltip);

        document.getElementById("botPopupHeader").addEventListener("click", (e) => {
            if (e.target.id === "settingsIcon") {
                e.stopPropagation();
                const panel = document.getElementById("settingsPanel");
                panel.style.display = panel.style.display === "block" ? "none" : "block";
            } else {
                 const dropdown = document.getElementById("botDropdown");
                 dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
                 if(dropdown.style.display === 'none') document.getElementById('settingsPanel').style.display = 'none';
            }
        });

        document.getElementById("saveSettingsBtn").addEventListener("click", (e) => {
            e.stopPropagation();
            AI_THRESHOLD = parseFloat(document.getElementById("aiThresholdInput").value);
            BOT_THRESHOLD = parseFloat(document.getElementById("botThresholdInput").value);
            GM_setValue("ai_threshold", AI_THRESHOLD);
            GM_setValue("bot_threshold", BOT_THRESHOLD);
            e.target.innerText = "Saved!";
            setTimeout(() => { e.target.innerText = "Save"; }, 1500);
        });

        document.body.addEventListener('mouseover', (e) => {
            const flaggedElem = e.target.closest('[data-bot-detected="true"]');
            if (flaggedElem) {
                const reasonsHTML = JSON.parse(flaggedElem.dataset.aiReasons || '[]').map(r => `<li>${r}</li>`).join('');
                const botScore = parseFloat(flaggedElem.dataset.botScore).toFixed(1);
                const aiScore = parseFloat(flaggedElem.dataset.aiScore).toFixed(1);
                tooltip.innerHTML = `<strong>Bot Score:</strong> ${botScore} / ${BOT_THRESHOLD}<br><strong>AI Score:</strong> ${aiScore} / ${AI_THRESHOLD}<ul>${reasonsHTML}</ul>`;
                tooltip.style.display = 'block';
            }
        });
        document.body.addEventListener('mouseout', () => { tooltip.style.display = 'none'; });
        document.body.addEventListener('mousemove', (e) => {
            if (tooltip.style.display === 'block') {
                 tooltip.style.left = `${e.pageX + 15}px`;
                 tooltip.style.top = `${e.pageY + 15}px`;
            }
        });
    }

    function updatePopup() {
        document.querySelector("#botPopupHeader > span").innerText = `Detected bot/AI: ${botCount}`;
        const dropdown = document.getElementById("botDropdown");
        dropdown.innerHTML = "";
        if (detectedBots.length === 0) {
            dropdown.innerHTML = `<span style="padding: 3px 10px; color: #777; font-style: italic;">No bots/AI detected yet.</span>`;
        } else {
            detectedBots.sort((a,b) => b.aiScore - a.aiScore || b.botScore - a.botScore); // Sort by highest score
            detectedBots.forEach(item => {
                let link = document.createElement("a");
                link.href = "#" + item.elemID;
                link.innerText = `${item.username} (${item.reason})`;
                link.title = `Bot Score: ${item.botScore.toFixed(1)}, AI Score: ${item.aiScore.toFixed(1)}`;
                link.addEventListener('click', (e) => { e.preventDefault(); document.getElementById(item.elemID)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); });
                dropdown.appendChild(link);
            });
        }
    }

    /************************************
     * 6. CORE DETECTION LOGIC
     ************************************/
    function highlightIfSuspected(elem) {
        if (elem.getAttribute("data-bot-detected")) return;

        const commentBody = elem.querySelector('div[data-testid="comment"] > div:nth-child(2) > div');
        let textToAnalyze = '', paragraphCount = 0;

        if (commentBody && commentBody.querySelectorAll('p').length > 0) {
            const paragraphs = Array.from(commentBody.querySelectorAll('p'));
            textToAnalyze = paragraphs.map(p => p.innerText).join('\n\n');
            paragraphCount = paragraphs.length;
        } else {
            const contentDiv = elem.querySelector('.md, .usertext-body');
            textToAnalyze = contentDiv ? contentDiv.innerText : (elem.innerText || '');
            paragraphCount = textToAnalyze.split(/\n\s*\n/).filter(line => line.trim().length > 10).length;
        }

        if (!textToAnalyze.trim()) return;

        const aiResult = computeAIScore(textToAnalyze, paragraphCount);
        const aiScore = aiResult.score;
        const botScore = computeBotScore(elem);

        const botFlag = botScore >= BOT_THRESHOLD;
        const aiFlag = aiScore >= AI_THRESHOLD;

        if (botFlag || aiFlag) {
            elem.setAttribute("data-bot-detected", "true");
            let reason = "";

            if (botFlag && aiFlag) {
                elem.classList.add("botAndAiContentDetected");
                reason = "Bot & AI";
            } else if (aiFlag) {
                if (aiScore >= AI_THRESHOLD + CONFIDENCE_HIGH_TIER) {
                    elem.classList.add("aiContentHigh");
                    reason = "AI (High Conf)";
                } else if (aiScore >= AI_THRESHOLD + CONFIDENCE_MID_TIER) {
                    elem.classList.add("aiContentMid");
                    reason = "AI (Mid Conf)";
                } else {
                    elem.classList.add("aiContentLow");
                    reason = "AI (Low Conf)";
                }
            } else { // botFlag only
                reason = "Bot";
            }

            if (botFlag) {
                const usernameElem = elem.querySelector(USERNAME_SELECTORS);
                if (usernameElem) usernameElem.classList.add("botUsername");
            }

            elem.dataset.aiScore = aiScore.toFixed(2);
            elem.dataset.botScore = botScore.toFixed(2);
            elem.dataset.aiReasons = JSON.stringify(aiResult.reasons);

            botCount++;
            detectionIndex++;
            const elemID = "botbuster-detected-" + detectionIndex;
            elem.setAttribute("id", elemID);
            const username = elem.querySelector(USERNAME_SELECTORS)?.innerText.trim() || "Unknown";

            detectedBots.push({ username, elemID, reason, botScore, aiScore });
            updatePopup();
        }
    }

    /************************************
     * 7. INITIALIZATION & OBSERVATION
     ************************************/
    function scanForBots(root = document) {
        const query = CONTENT_SELECTORS.map(s => `${s}:not([data-bot-detected])`).join(', ');
        root.querySelectorAll(query).forEach(highlightIfSuspected);
    }

    createPopupAndTooltip();
    setTimeout(() => scanForBots(document.body), 1500);

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    requestAnimationFrame(() => scanForBots(node));
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
