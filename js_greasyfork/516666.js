// ==UserScript==
// @name         Reddit Advanced Content Filter
// @namespace    https://greasyfork.org/en/users/567951-stuart-saddler
// @version      3.0
// @description  Automatically hides posts in your Reddit feed based on keywords or subreddits you specify. Supports whitelist entries that override filtering. Improved phrase matching with blocked titles displayed and linked in the settings dialog, with better title extraction, smart truncation, and requestIdleCallback fallback for all userscript engines.
// @author       Stuart Saddler
// @license      MIT
// @match        *://www.reddit.com/*
// @match        *://old.reddit.com/*
// @run-at       document-end
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/516666/Reddit%20Advanced%20Content%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/516666/Reddit%20Advanced%20Content%20Filter.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    // Fallback for requestIdleCallback
    function scheduleIdle(cb, opts) {
        if (window.requestIdleCallback) {
            return requestIdleCallback(cb, opts);
        }
        // fallback: schedule after 100ms (or opts.timeout)
        return setTimeout(cb, opts && opts.timeout ? opts.timeout : 100);
    }

    const postSelector = 'article, div[data-testid="post-container"], shreddit-post, .thing';
    let filteredCount = 0;
    let menuCommand = null;
    let processedPosts = new WeakSet();
    let blocklistSet = new Set();
    let blocklistArr = [];
    let whitelistSet = new Set();
    let whitelistArr = [];
    let blockedTitles = [];

    function debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function truncate(str, max = 80) {
        return str.length > max ? str.slice(0, max - 1) + '…' : str;
    }

    function matchBlock(content, list) {
        for (const entry of list) {
            if (entry.includes(' ')) {
                if (content.includes(entry)) return entry;
            } else {
                const regex = new RegExp('\\b' + escapeRegex(entry) + '(s|es|ies)?\\b', 'i');
                const m = content.match(regex);
                if (m) return m[0];
            }
        }
        return null;
    }

    function shouldWhitelist(fullText) {
        return matchBlock(fullText, whitelistArr) !== null;
    }

    const batchUpdateCounter = debounce(updateMenuEntry, 16);

    function updateMenuEntry() {
        if (typeof GM_registerMenuCommand !== 'function') return;
        try {
            if (menuCommand && typeof GM_unregisterMenuCommand === 'function') {
                GM_unregisterMenuCommand(menuCommand);
            }
        } catch (err) {}
        menuCommand = GM_registerMenuCommand(
            'Configure Filter (' + filteredCount + ' blocked)',
            showConfig
        );
    }

    if (!document.querySelector('style[data-reddit-filter]')) {
        const style = document.createElement('style');
        style.setAttribute('data-reddit-filter', 'true');
        style.textContent =
            '.content-filtered { display: none !important; height: 0 !important; overflow: hidden !important; }';
        document.head.appendChild(style);
    }

    async function showConfig() {
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 999999
        });

        const dialog = document.createElement('div');
        Object.assign(dialog.style, {
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white', padding: '20px', borderRadius: '8px',
            zIndex: 1000000, boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            minWidth: '300px', maxWidth: '350px',
            fontFamily: 'Arial, sans-serif', color: '#333'
        });

        dialog.innerHTML =
            '<h2 style="margin-top:0; color:#0079d3;">Reddit Filter: Settings</h2>' +
            '<p><strong>Blocklist:</strong> One entry per line. Matching posts will be hidden.</p>' +
            '<textarea id="blocklist" style="width:100%; height:80px; margin-bottom:10px;"></textarea>' +
            '<p><strong>Whitelist:</strong> One entry per line. If matched, post is NOT hidden.</p>' +
            '<textarea id="whitelist" style="width:100%; height:80px; margin-bottom:10px;"></textarea>' +
            '<p><strong>Blocked Post Titles:</strong></p>' +
            '<div id="blocked-titles" style="height:100px; overflow-y:auto; background:#f9f9f9; border:1px solid #ccc; padding:6px; font-size:0.9em;"></div>' +
            '<div style="margin-top:10px; text-align:right;">' +
            '<button id="cancel-btn">Cancel</button>' +
            '<button id="save-btn" style="background:#0079d3; color:white;">Save</button>' +
            '</div>';

        document.body.appendChild(overlay);
        document.body.appendChild(dialog);

        dialog.querySelector('#blocklist').value = blocklistArr.join('\n');
        dialog.querySelector('#whitelist').value = whitelistArr.join('\n');

        const blockedDiv = dialog.querySelector('#blocked-titles');
        if (blockedTitles.length === 0) {
            blockedDiv.textContent = '(No posts blocked yet)';
        } else {
            blockedDiv.innerHTML = blockedTitles.map(function(item) {
                return '<div>' +
                    '<span style="font-size:1.2em; color:#aaa; margin-right:5px;">&#8226;</span>' +
                    '<a href="' + item.url + '" target="_blank" style="color:#0079d3; text-decoration:none;">' +
                    truncate(item.title) +
                    '</a> ' +
                    '<span style="color:#888;">[' +
                    (item.subreddit ? 'r/' + item.subreddit + ', ' : '') +
                    item.source + ': "' + item.trigger + '"]</span>' +
                    '</div>';
            }).join('');
        }

        dialog.querySelector('#cancel-btn').onclick = function () {
            overlay.remove();
            dialog.remove();
        };

        dialog.querySelector('#save-btn').onclick = async function () {
            var blocklistInput = dialog.querySelector('#blocklist').value;
            var whitelistInput = dialog.querySelector('#whitelist').value;

            blocklistArr = blocklistInput
                .split('\n').map(function(x) { return x.trim().toLowerCase(); }).filter(Boolean);
            whitelistArr = whitelistInput
                .split('\n').map(function(x) { return x.trim().toLowerCase(); }).filter(Boolean);

            blocklistSet = new Set(blocklistArr);
            whitelistSet = new Set(whitelistArr);

            await GM.setValue('blocklist', blocklistArr);
            await GM.setValue('whitelist', whitelistArr);

            overlay.remove();
            dialog.remove();
            location.reload();
        };
    }

    function getPostTitle(post) {
        var el = post.querySelector('h1, h2, h3, h4, h5, h6');
        if (el && el.textContent.trim()) return el.textContent.trim();

        el = post.querySelector('span[data-testid="post-title"]');
        if (el && el.textContent.trim()) return el.textContent.trim();

        el = post.querySelector('a.title');
        if (el && el.textContent.trim()) return el.textContent.trim();

        el = post.querySelector('a[data-click-id="body"]');
        if (el && el.textContent.trim()) return el.textContent.trim().split('\n')[0].trim();

        el = post.querySelector('div[data-adclicklocation="title"]');
        if (el && el.textContent.trim()) return el.textContent.trim();

        var maxLen = 0, maxText = '';
        post.querySelectorAll('*').forEach(function(node) {
            var t = node.textContent.trim();
            if (t.length > maxLen) {
                maxLen = t.length;
                maxText = t;
            }
        });
        if (maxLen > 10) return maxText;

        return '(Untitled)';
    }

    function getPostLink(post) {
        var link = post.querySelector('a[data-click-id="comments"], a[href*="/comments/"]');
        return link && link.href ? link.href : '#';
    }

    function processPost(post) {
        if (!post || processedPosts.has(post)) return;
        processedPosts.add(post);

        var title = getPostTitle(post);
        var titleLower = title.toLowerCase();
        var contentLower = post.textContent.toLowerCase();

        if (shouldWhitelist(titleLower + ' ' + contentLower)) return;

        var reason = '';
        var trigger = '';

        var subEl = post.querySelector('a[data-click-id="subreddit"], .tagline a.subreddit');
        var subName = subEl && subEl.textContent ? subEl.textContent.trim().toLowerCase().replace(/^r\//, '') : '';

        if (blocklistSet.has(subName)) {
            reason = 'subreddit';
            trigger = subName;
        } else {
            var t = matchBlock(titleLower, blocklistArr);
            if (t) {
                reason = 'title';
                trigger = t;
            } else {
                t = matchBlock(contentLower, blocklistArr);
                if (t) {
                    reason = 'content';
                    trigger = t;
                }
            }
        }

        if (reason && trigger) {
            hidePost(
                post,
                title,
                getPostLink(post),
                reason,
                trigger,
                subName || ''
            );
        }
    }

    function hidePost(post, title, url, source, trigger, subreddit) {
        post.classList.add('content-filtered');
        var parent = post.closest(postSelector);
        if (parent) {
            parent.classList.add('content-filtered');
        }
        blockedTitles.push({ title: title, url: url, source: source, trigger: trigger, subreddit: subreddit });
        filteredCount++;
        batchUpdateCounter();
    }

    async function processPostsBatch(posts) {
        var batchSize = 5;
        for (var i = 0; i < posts.length; i += batchSize) {
            var batch = posts.slice(i, i + batchSize);
            await new Promise(function(resolve) {
                scheduleIdle(resolve, { timeout: 800 });
            });
            batch.forEach(processPost);
        }
    }

    var debouncedProcess = debounce(function(posts) {
        processPostsBatch(Array.from(posts));
    }, 100);

    async function init() {
        blocklistArr = await GM.getValue('blocklist', []);
        whitelistArr = await GM.getValue('whitelist', []);
        blocklistSet = new Set(blocklistArr.map(function(x) { return x.toLowerCase(); }));
        whitelistSet = new Set(whitelistArr.map(function(x) { return x.toLowerCase(); }));

        updateMenuEntry();

        var observerTarget =
            document.querySelector('.main-content') ||
            document.querySelector('#siteTable') ||
            document.body;

        var observer = new MutationObserver(function(mutations) {
            var newPosts = new Set();
            for (var mi = 0; mi < mutations.length; mi++) {
                var mutation = mutations[mi];
                for (var ni = 0; ni < mutation.addedNodes.length; ni++) {
                    var node = mutation.addedNodes[ni];
                    if (node.nodeType === 1) {
                        if (node.matches(postSelector)) newPosts.add(node);
                        node.querySelectorAll(postSelector).forEach(function(p) { newPosts.add(p); });
                    }
                }
            }
            if (newPosts.size) debouncedProcess(newPosts);
        });

        observer.observe(observerTarget, { childList: true, subtree: true });

        var initial = document.querySelectorAll(postSelector);
        if (initial.length) debouncedProcess(initial);
    }

    await init();
})();