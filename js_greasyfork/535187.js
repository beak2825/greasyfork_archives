// ==UserScript==
// @name         GitHub Top Languages
// @description  Display top programming languages on GitHub profiles.
// @icon         https://github.githubassets.com/favicons/favicon-dark.svg
// @version      1.3
// @author       afkarxyz
// @namespace    https://github.com/afkarxyz/userscripts/
// @supportURL   https://github.com/afkarxyz/userscripts/issues
// @license      MIT
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535187/GitHub%20Top%20Languages.user.js
// @updateURL https://update.greasyfork.org/scripts/535187/GitHub%20Top%20Languages.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Hardcode: let GITHUB_TOKEN = "your_github_personal_access_token";
    let GITHUB_TOKEN = localStorage.getItem("gh_token") || "";
    const CACHE_DURATION = 60 * 60 * 1000;

    window.setGitHubToken = function(token) {
        GITHUB_TOKEN = token;
        localStorage.setItem("gh_token", token);
        console.log("GitHub token has been set successfully!");
        console.log("Refresh the page to see the changes.");
    };

    window.clearGitHubToken = function() {
        GITHUB_TOKEN = "";
        localStorage.removeItem("gh_token");
        console.log("GitHub token has been cleared!");
    };

    function getCachedData(key) {
        const cachedItem = localStorage.getItem(key);
        if (!cachedItem) return null;

        try {
            const { data, timestamp } = JSON.parse(cachedItem);
            if (Date.now() - timestamp < CACHE_DURATION) {
                return data;
            }
            localStorage.removeItem(key);
            return null;
        } catch (e) {
            console.error("Error parsing cached data:", e);
            localStorage.removeItem(key);
            return null;
        }
    }

    function setCachedData(key, data) {
        const cacheItem = {
            data,
            timestamp: Date.now()
        };
        localStorage.setItem(key, JSON.stringify(cacheItem));
    }

    window.clearLanguageCache = function() {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('gh_langs_') || key.startsWith('gh_colors')) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        console.log("Language cache has been cleared!");
    };

    const COLORS_URL = "https://raw.githubusercontent.com/afkarxyz/userscripts/refs/heads/main/assets/github/colors.json";
    let lastUsername = null;

    async function getLanguageColors() {
        const cachedColors = getCachedData('gh_colors');
        if (cachedColors) {
            return cachedColors;
        }

        try {
            const res = await fetch(COLORS_URL);
            const colors = await res.json();
            setCachedData('gh_colors', colors);
            return colors;
        } catch (e) {
            console.error("Failed to fetch language colors:", e);
            return {};
        }
    }

    async function fetchLanguagesGraphQL(username, isOrg = false) {
        const cacheKey = `gh_langs_${username}_${isOrg ? 'org' : 'user'}`;

        const cachedLangs = getCachedData(cacheKey);
        if (cachedLangs) {
            console.log(`Using cached language data for ${username}`);
            return cachedLangs;
        }

        if (!GITHUB_TOKEN) {
            console.warn("GitHub GraphQL API requires a token. Please set one using window.setGitHubToken()");
            return [];
        }

        console.log(`Fetching fresh language data for ${username} using GraphQL`);

        const query = isOrg ? `
            query OrgRepoLanguages($orgName: String!, $cursor: String) {
                organization(login: $orgName) {
                    repositories(first: 100, after: $cursor, privacy: PUBLIC, isFork: false) {
                        pageInfo {
                            hasNextPage
                            endCursor
                        }
                        nodes {
                            languages(first: 100, orderBy: {field: SIZE, direction: DESC}) {
                                edges {
                                    size
                                    node {
                                        name
                                        color
                                    }
                                }
                                totalSize
                            }
                        }
                    }
                }
            }
        ` : `
            query UserRepoLanguages($login: String!, $cursor: String) {
                user(login: $login) {
                    repositories(first: 100, after: $cursor, privacy: PUBLIC, ownerAffiliations: OWNER, isFork: false) {
                        pageInfo {
                            hasNextPage
                            endCursor
                        }
                        nodes {
                            languages(first: 100, orderBy: {field: SIZE, direction: DESC}) {
                                edges {
                                    size
                                    node {
                                        name
                                        color
                                    }
                                }
                                totalSize
                            }
                        }
                    }
                }
            }
        `;

        const allLanguages = {};
        let hasNextPage = true;
        let cursor = null;

        try {
            while (hasNextPage) {
                const variables = isOrg
                    ? { orgName: username, cursor }
                    : { login: username, cursor };

                const response = await fetch("https://api.github.com/graphql", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${GITHUB_TOKEN}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ query, variables })
                });

                if (!response.ok) {
                    throw new Error(`GitHub API error: ${response.status}`);
                }

                const data = await response.json();

                if (data.errors) {
                    console.error("GraphQL errors:", data.errors);
                    break;
                }

                const entityData = isOrg ? data.data?.organization : data.data?.user;
                if (!entityData) break;

                const repositories = entityData.repositories;
                const pageInfo = repositories.pageInfo;

                repositories.nodes.forEach(repo => {
                    if (!repo.languages.edges) return;
                    
                    repo.languages.edges.forEach(edge => {
                        const { name, color } = edge.node;
                        const size = edge.size;
                        
                        if (!allLanguages[name]) {
                            allLanguages[name] = { 
                                size: 0,
                                color: color
                            };
                        }
                        allLanguages[name].size += size;
                    });
                });

                hasNextPage = pageInfo.hasNextPage;
                cursor = pageInfo.endCursor;
            }

            const totalSize = Object.values(allLanguages).reduce((sum, lang) => sum + lang.size, 0);
            
            const result = Object.entries(allLanguages)
                .map(([lang, data]) => ({
                    lang,
                    color: data.color,
                    count: data.size,
                    percent: ((data.size / totalSize) * 100).toFixed(2)
                }))
                .sort((a, b) => b.count - a.count);

            setCachedData(cacheKey, result);
            return result;
        } catch (e) {
            console.error("Error fetching languages with GraphQL:", e);
            return [];
        }
    }

    function createLanguageBar(languages, colorMap) {
        const container = document.createElement("div");
        container.style.marginTop = "16px";
        container.style.width = "100%";

        const barContainer = document.createElement("div");
        barContainer.style.display = "flex";
        barContainer.style.height = "8px";
        barContainer.style.width = "100%";
        barContainer.style.borderRadius = "4px";
        barContainer.style.overflow = "hidden";
        barContainer.style.marginBottom = "8px";

        const legendContainer = document.createElement("div");
        legendContainer.style.display = "flex";
        legendContainer.style.flexWrap = "wrap";
        legendContainer.style.fontSize = "12px";

        languages.forEach((langData) => {
            const { lang, percent, color: langColor } = langData;
            const percentNum = parseFloat(percent);

            const color = langColor || (colorMap[lang] && colorMap[lang].color) || "#ccc";

            const segment = document.createElement("div");
            segment.style.backgroundColor = color;
            segment.style.width = `${percentNum}%`;
            segment.style.height = "100%";
            barContainer.appendChild(segment);

            const legendItem = document.createElement("div");
            legendItem.style.display = "flex";
            legendItem.style.alignItems = "center";
            legendItem.style.marginRight = "16px";
            legendItem.style.marginBottom = "4px";

            const colorDot = document.createElement("span");
            colorDot.style.display = "inline-block";
            colorDot.style.width = "8px";
            colorDot.style.height = "8px";
            colorDot.style.backgroundColor = color;
            colorDot.style.borderRadius = "50%";
            colorDot.style.marginRight = "6px";

            const langNameSpan = document.createElement("span");
            langNameSpan.textContent = lang;
            langNameSpan.style.fontWeight = "600";
            
            const percentSpan = document.createElement("span");
            percentSpan.textContent = ` ${percent}%`;
            percentSpan.style.fontWeight = "400";
            
            const langName = document.createElement("span");
            langName.appendChild(langNameSpan);
            langName.appendChild(percentSpan);

            legendItem.appendChild(colorDot);
            legendItem.appendChild(langName);
            legendContainer.appendChild(legendItem);
        });

        container.appendChild(barContainer);
        container.appendChild(legendContainer);

        return container;
    }

    async function insertLanguageStats() {
        const match = window.location.pathname.match(/^\/([^\/]+)$/);
        if (!match) return;

        const username = match[1];
        if (username === lastUsername) return;
        lastUsername = username;

        try {
            const userContainer = document.querySelector('.vcard-names-container');
            const orgContainer = document.querySelector('.h2.lh-condensed')?.closest('.flex-1.d-flex.flex-column');
            const container = userContainer || orgContainer;

            if (!container) return;
            const isOrg = !userContainer;

            if (container.querySelector('#gh-lang-stats')) return;

            const loadingEl = document.createElement("div");
            loadingEl.id = "lang-stats-loading";
            loadingEl.textContent = "Loading...";
            loadingEl.style.marginTop = "12px";
            loadingEl.style.fontSize = "13px";
            loadingEl.style.color = "#666";
            container.appendChild(loadingEl);

            if (!GITHUB_TOKEN) {
                loadingEl.textContent = "GitHub API token required for language statistics";
                const tokenNotice = document.createElement("div");
                tokenNotice.style.fontSize = "12px";
                tokenNotice.style.color = "#666";
                tokenNotice.style.marginTop = "4px";
                tokenNotice.innerHTML = "Set token with <code>window.setGitHubToken('your_token')</code> in console";
                loadingEl.appendChild(tokenNotice);
                return;
            }

            const [langs, colors] = await Promise.all([
                fetchLanguagesGraphQL(username, isOrg),
                getLanguageColors()
            ]);

            const loadingIndicator = document.getElementById("lang-stats-loading");
            if (loadingIndicator) loadingIndicator.remove();

            if (langs.length === 0) {
                return;
            }

            const statsWrapper = document.createElement("div");
            statsWrapper.id = "gh-lang-stats";

            const topLangs = langs.slice(0, 10);

            const langBar = createLanguageBar(topLangs, colors);
            statsWrapper.appendChild(langBar);

            container.appendChild(statsWrapper);
        } catch (error) {
            console.error("Error inserting language stats:", error);
        }
    }

    let currentPath = location.pathname;
    const observer = new MutationObserver(() => {
        if (location.pathname !== currentPath) {
            currentPath = location.pathname;
            setTimeout(insertLanguageStats, 800);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(insertLanguageStats, 500);
})();