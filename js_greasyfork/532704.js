// ==UserScript==
// @name         GitHub Repository Size Checker
// @namespace	 https://github.com/yookibooki
// @version      1.2
// @description  Displays the repo size without .git
// @match        *://github.com/*/*
// @exclude      *://github.com/*/issues*
// @exclude      *://github.com/*/pulls*
// @exclude      *://github.com/*/actions*
// @exclude      *://github.com/*/projects*
// @exclude      *://github.com/*/wiki*
// @exclude      *://github.com/*/security*
// @exclude      *://github.com/*/pulse*
// @exclude      *://github.com/*/settings*
// @exclude      *://github.com/*/branches*
// @exclude      *://github.com/*/tags*
// @exclude      *://github.com/*/*/commit*
// @exclude      *://github.com/*/*/tree*
// @exclude      *://github.com/*/*/blob*
// @exclude      *://github.com/settings*
// @exclude      *://github.com/notifications*
// @exclude      *://github.com/marketplace*
// @exclude      *://github.com/explore*
// @exclude      *://github.com/topics*
// @exclude      *://github.com/sponsors*
// @exclude      *://github.com/dashboard*
// @exclude      *://github.com/new*
// @exclude      *://github.com/codespaces*
// @exclude      *://github.com/account*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      api.github.com
// @downloadURL https://update.greasyfork.org/scripts/532704/GitHub%20Repository%20Size%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/532704/GitHub%20Repository%20Size%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CACHE_KEY = 'repoSizeCache';
    const PAT_KEY = 'github_pat_repo_size';
    const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000;
    const GITHUB_API_BASE = 'https://api.github.com';
    const TARGET_ELEMENT_SELECTOR = '#repo-title-component > span.Label.Label--secondary';
    const DISPLAY_ELEMENT_ID = 'repo-size-checker-display';

    const STYLE_LOADING = 'color: orange; margin-left: 6px; font-size: 12px; font-weight: 600;';
    const STYLE_ERROR = 'color: red; margin-left: 6px; font-size: 12px; font-weight: 600;';
    const STYLE_SIZE = 'color: #6a737d; margin-left: 6px; font-size: 12px; font-weight: 600;';

    let currentRepoKey = null;
    let pat = null;
    let observer = null;

    function log(...args) { console.log('[RepoSizeChecker]', ...args); }

    function getRepoInfoFromUrl() {
        const match = window.location.pathname.match(/^\/([^/]+)\/([^/]+)(?:\/?$|\/(?:tree|find|graphs|network|releases)(?:\/.*)?$)/);
        if (match && match[1] && match[2] && document.querySelector('#repository-container-header')) {
            return { owner: match[1], repo: match[2], key: `${match[1]}/${match[2]}` };
        }
        return null;
    }

    function formatBytes(bytes, decimals = 1) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    function getPAT() {
        if (pat) return pat;
        pat = GM_getValue(PAT_KEY, null);
        return pat;
    }

    function setPAT(newPat) {
        if (newPat && typeof newPat === 'string' && newPat.trim().length > 0) {
            pat = newPat.trim();
            GM_setValue(PAT_KEY, pat);
            log('GitHub PAT saved.');
            run();
            return true;
        } else {
             GM_setValue(PAT_KEY, '');
             pat = null;
             log('Invalid PAT input. PAT cleared.');
             updateDisplay('Invalid PAT', STYLE_ERROR);
             return false;
        }
    }

    function promptForPAT() {
        const newPat = prompt('GitHub Personal Access Token (PAT) required. Please enter your PAT (needs `repo` scope):', '');
        if (newPat === null) {
            updateDisplay('PAT Required', STYLE_ERROR);
            return false;
        }
        return setPAT(newPat);
    }

    function getCache() {
        try { return JSON.parse(GM_getValue(CACHE_KEY, '{}')); }
        catch (e) { return {}; }
    }
    function setCache(repoKey, data) {
        try {
            const cache = getCache();
            cache[repoKey] = data;
            GM_setValue(CACHE_KEY, JSON.stringify(cache));
        } catch (e) { log('Error writing cache', e); }
    }

    function getDisplayElement() {
        let element = document.getElementById(DISPLAY_ELEMENT_ID);
        if (element) return element;

        const target = document.querySelector(TARGET_ELEMENT_SELECTOR);
        if (target) {
            element = document.createElement('span');
            element.id = DISPLAY_ELEMENT_ID;
            target.insertAdjacentElement('afterend', element);
            log('Display element injected.');
            return element;
        }
        return null;
    }

    function updateDisplay(text, style = STYLE_SIZE, isLoading = false) {
        const displayElement = getDisplayElement();
        if (!displayElement) return;
        displayElement.textContent = isLoading ? `(${text}...)` : text;
        displayElement.style.cssText = style;
    }

    function makeApiRequest(url) {
        return new Promise((resolve, reject) => {
            const currentPat = getPAT();
            if (!currentPat) return reject(new Error('PAT Required'));

            GM_xmlhttpRequest({
                method: 'GET', url,
                headers: { "Authorization": `token ${currentPat}`, "Accept": "application/vnd.github.v3+json" },
                onload: res => {
                    if (res.status >= 200 && res.status < 300) {
                        try { resolve(JSON.parse(res.responseText)); }
                        catch (e) { reject(new Error('Failed to parse API response.')); }
                    } else if (res.status === 401) { reject(new Error('Invalid PAT')); }
                    else if (res.status === 403) { reject(new Error('API rate limit or permission issue.')); }
                    else if (res.status === 404) { reject(new Error('Repo not found or PAT lacks access.')); }
                    else { reject(new Error(`API Error: ${res.status}`)); }
                },
                onerror: () => reject(new Error('Network error.')),
                ontimeout: () => reject(new Error('Request timed out.'))
            });
        });
    }

    async function fetchLatestDefaultBranchSha(owner, repo) {
        const repoData = await makeApiRequest(`${GITHUB_API_BASE}/repos/${owner}/${repo}`);
        if (!repoData.default_branch) throw new Error('No default branch.');
        const branchData = await makeApiRequest(`${GITHUB_API_BASE}/repos/${owner}/${repo}/branches/${repoData.default_branch}`);
        return branchData.commit.sha;
    }

    async function fetchRepoTreeSize(owner, repo, sha) {
        const treeData = await makeApiRequest(`${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees/${sha}?recursive=1`);
        if (treeData.truncated && (!treeData.tree || treeData.tree.length === 0)) {
            throw new Error('Repo too large for API.');
        }
        let totalSize = 0;
        if (treeData.tree) {
            totalSize = treeData.tree.reduce((acc, item) => (item.type === 'blob' && item.size) ? acc + item.size : acc, 0);
        }
        log(`Calculated size for ${owner}/${repo}: ${totalSize} bytes. Truncated: ${treeData.truncated}`);
        return { size: totalSize, truncated: !!treeData.truncated };
    }

    async function fetchAndDisplaySize(repoInfo) {
        updateDisplay('loading', STYLE_LOADING, true);
        if (!getPAT()) {
            promptForPAT();
            return;
        }
        const cache = getCache();
        const cachedData = cache[repoInfo.key];
        const now = Date.now();

        if (cachedData && (now - (cachedData.timestamp || 0) < CACHE_EXPIRY_MS)) {
            log('Using fresh cache.');
            updateDisplay(`${cachedData.truncated ? '~' : ''}${formatBytes(cachedData.size)}`, STYLE_SIZE);
            return;
        }

        try {
            updateDisplay('validating', STYLE_LOADING, true);
            const latestSha = await fetchLatestDefaultBranchSha(repoInfo.owner, repoInfo.repo);

            if (cachedData && cachedData.sha === latestSha) {
                log('Stale cache validated by SHA. Re-using data.');
                cachedData.timestamp = now;
                setCache(repoInfo.key, cachedData);
                updateDisplay(`${cachedData.truncated ? '~' : ''}${formatBytes(cachedData.size)}`, STYLE_SIZE);
                return;
            }

            log('Fetching new repository size.');
            updateDisplay('loading', STYLE_LOADING, true);
            const { size, truncated } = await fetchRepoTreeSize(repoInfo.owner, repoInfo.repo, latestSha);
            const newData = { size, sha: latestSha, timestamp: now, truncated };
            setCache(repoInfo.key, newData);
            updateDisplay(`${truncated ? '~' : ''}${formatBytes(size)}`, STYLE_SIZE);

        } catch (error) {
            log('Error during fetch:', error);
            let msg = `Error: ${error.message}`;
            if (error.message === 'Invalid PAT') { setPAT(''); promptForPAT(); }
            else if (error.message === 'PAT Required') { promptForPAT(); }
            updateDisplay(msg, STYLE_ERROR);
        }
    }

    function run() {
        const repoInfo = getRepoInfoFromUrl();
        if (!repoInfo) {
            if (currentRepoKey) {
                log('Navigated away from repo page. Resetting state.');
                currentRepoKey = null;
            }
            return;
        }
        if (currentRepoKey === repoInfo.key) {
            return;
        }
        if (!document.querySelector(TARGET_ELEMENT_SELECTOR)) {
            return;
        }
        log(`New repo page detected and ready: ${repoInfo.key}`);
        currentRepoKey = repoInfo.key;
        fetchAndDisplaySize(repoInfo);
    }

    function init() {
        log("Script initializing...");
        GM_registerMenuCommand('Set/Update GitHub PAT for Repo Size', () => {
             const newPat = prompt('Enter your GitHub PAT (needs `repo` scope):', GM_getValue(PAT_KEY, ''));
             if (newPat !== null) setPAT(newPat);
        });
        observer = new MutationObserver(run);
        observer.observe(document.body, { childList: true, subtree: true });
        run();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
