// ==UserScript==
// @name         OT! Post Counter v1.1
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Displays the number of OT! forum posts below the user's regular post count.
// @author       Behrauder
// @match        https://osu.ppy.sh/*
// @license      MIT
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/539915/OT%21%20Post%20Counter%20v11.user.js
// @updateURL https://update.greasyfork.org/scripts/539915/OT%21%20Post%20Counter%20v11.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // —— Hook into History API and dispatch a custom event on URL changes ——
    ['pushState','replaceState'].forEach(method => {
        const orig = history[method];
        history[method] = function(...args) {
            const ret = orig.apply(this, args);
            window.dispatchEvent(new Event('locationchange'));
            return ret;
        };
    });

    // Debounced navigation handler
    let debounceTimer;
    function onNavChange() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(scanContainers, 200);
    }

    // Listen for navigation events using the debounced handler
    window.addEventListener('popstate', onNavChange);
    window.addEventListener('locationchange', onNavChange);
    document.addEventListener('pjax:end', onNavChange);

    // Toggle verbose debug logging
    const DEBUG = false;

    /**
     * Conditional logger: prints only if DEBUG is true
     */
    function log(...args) {
        if (DEBUG) console.log(...args);
    }

    // Time-to-live for cached counts (milliseconds)
    const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
    // Initial delay between requests (milliseconds)
    const INIT_DELAY_MS = 300;
    // Maximum random additional delay (milliseconds)
    const JITTER_MS = 150;
    // Factor by which to back off delay on failures
    const BACKOFF_FACTOR = 1.6;

    /**
     * Retrieve a cached count for the given URL if still valid.
     * @param {string} url
     * @returns {number|null}
     */
    function cacheGet(url) {
        const raw = localStorage.getItem(url);
        if (!raw) return null;
        try {
            const { count, ts } = JSON.parse(raw);
            if (Date.now() - ts < CACHE_TTL_MS) return count;
        } catch (e) {}
        localStorage.removeItem(url);
        return null;
    }

    /**
     * Store a count in cache with current timestamp.
     * @param {string} url
     * @param {number} count
     */
    function cacheSet(url, count) {
        localStorage.setItem(url, JSON.stringify({ count, ts: Date.now() }));
    }

    // Treat queue as a deque for pending forum link fetches
    const queue = [];
    let isProcessing = false;
    let delay = INIT_DELAY_MS;
    // Flag to alternate between taking from front/back
    let takeFromBack = false;

    function processQueue() {
        if (!queue.length) {
            isProcessing = false;
            log('[queue] empty');
            return;
        }
        isProcessing = true;
        // alternate between popping from the end and shifting from the start
        const { forumLink } = takeFromBack ? queue.pop() : queue.shift();

        log(`[queue] fetching ${forumLink} (remaining ${queue.length})`);

        fetchPostCount(forumLink)
            .then(count => {
            log(`[fetch] ${forumLink} → ${count}`);
            cacheSet(forumLink, count);
            const lista = linkContainers.get(forumLink) || [];
            lista.forEach(container => insert(container, forumLink, count));
            delay = Math.max(200, delay / BACKOFF_FACTOR);
        })
            .catch(err => {
            console.warn(`[fetch] failed ${forumLink} →`, err);
            delay *= BACKOFF_FACTOR;
            queue.push({ forumLink });
        })
            .finally(() => {
            const wait = delay + Math.random() * JITTER_MS;
            log(`[queue] next in ${Math.round(wait)} ms`);
            setTimeout(processQueue, wait);
        });
    }

    // Map to track containers for each forum link and set of requested links
    const linkContainers = new Map();
    const requested = new Set();

    /**
     * Scan page for user post info elements and enqueue fetches as needed.
     */
    function scanContainers() {
        document.querySelectorAll('.forum-post-info__row--posts').forEach(c => {
            if (c.dataset.added) return;
            const linkElem = c.querySelector('a');
            const href = linkElem && linkElem.href;
            const m = href && href.match(/\/users\/\d+\/posts/);
            if (!m) return;

            const forumLink = `https://osu.ppy.sh${m[0]}?forum_id=52`;
            c.dataset.added = 'true';

            if (!linkContainers.has(forumLink)) {
                linkContainers.set(forumLink, []);
            }
            linkContainers.get(forumLink).push(c);

            const cached = cacheGet(forumLink);
            if (cached !== null) {
                insert(c, forumLink, cached);
            } else if (!requested.has(forumLink)) {
                requested.add(forumLink);
                queue.push({ forumLink });
                if (!isProcessing) processQueue();
            }
        });
    }

    // Observe DOM changes to detect new post info rows
    const observer = new MutationObserver(scanContainers);
    observer.observe(document.body, { childList: true, subtree: true });
    // Initial scan
    scanContainers();

    /**
     * Insert the post count link into the container element.
     * @param {Element} container
     * @param {string} forumLink
     * @param {number} count
     */
    function insert(container, forumLink, count) {
        const formatted = count >= 10000 ? '10000+' : count.toLocaleString();
        const label = count === 1 ? 'post' : 'posts';
        const br = document.createElement('br');
        const a = document.createElement('a');
        a.href = forumLink;
        a.textContent = `OT: ${formatted} ${label}`;
        a.style.fontWeight = 'bold';
        container.appendChild(br);
        container.appendChild(a);
    }

    /**
     * Fetch the total number of posts from the forum by performing up to two requests.
     * @param {string} baseUrl
     * @returns {Promise<number>}
     */
    function fetchPostCount(baseUrl) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: baseUrl,
                onload({ status, responseText }) {
                    // Handle rate limiting or Cloudflare checks
                    if (status === 429 ||
                        /<title>.*(Access Denied|Just a moment).*<\/title>/i.test(responseText)) {
                        return reject('blocked');
                    }
                    if (status !== 200) return reject(`status1-${status}`);

                    const parser = new DOMParser();
                    const doc = parser.parseFromString(responseText, 'text/html');
                    const items = [...doc.querySelectorAll('.pagination-v2__item a')];
                    let lastPage = 1;
                    items.forEach(a => {
                        const mm = a.href.match(/page=(\d+)/);
                        if (mm) lastPage = Math.max(lastPage, +mm[1]);
                    });

                    // Fetch the last page to count entries
                    const url2 = `${baseUrl}&page=${lastPage}`;
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: url2,
                        onload({ status: st2, responseText: txt2 }) {
                            if (st2 !== 200) return reject(`status2-${st2}`);
                            const doc2 = parser.parseFromString(txt2, 'text/html');
                            const countOnLast = doc2.querySelectorAll('.search-entry').length;
                            resolve((lastPage - 1) * 50 + countOnLast);
                        },
                        onerror: () => reject('network2')
                    });
                },
                onerror: () => reject('network1')
            });
        });
    }

    // Fallback: scan every 2 seconds in case something slips past the observer
    setInterval(scanContainers, 2000);

})();
