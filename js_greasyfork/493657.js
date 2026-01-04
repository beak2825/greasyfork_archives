// ==UserScript==
// @name         Leak Finder Overlay
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Adds a convenient overlay to check for "leaks" on various sites.
// @author       You (updated by AI)
// @match        https://onlyfans.com/*
// @match        https://fansly.com/*
// @match        https://fantrie.com/*
// @match        *://*.coomer.st/*
// @match        *://*.fapello.com/*
// @match        *://*.topfapgirls1.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/493657/Leak%20Finder%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/493657/Leak%20Finder%20Overlay.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Configuration ---
    const COOMER_DOMAIN = 'coomer.st';
    const MAX_RETRIES = 3;

    // --- UI Creation ---
    function createOverlay(username) {
        // Inject styles
        GM_addStyle(`
            #leak-finder-overlay {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 220px;
                background-color: #1a1a1a;
                border: 1px solid #444;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                color: #f0f0f0;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                font-size: 14px;
                z-index: 9999;
                overflow: hidden;
            }
            #leak-finder-overlay-header {
                padding: 10px;
                background-color: #2a2a2a;
                cursor: pointer;
                user-select: none;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            #leak-finder-overlay-header h3 {
                margin: 0;
                font-size: 1em;
                font-weight: bold;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                padding-right: 5px;
            }
            #leak-finder-overlay-list {
                list-style: none;
                padding: 5px 10px;
                margin: 0;
                max-height: 300px;
                overflow-y: auto;
                transition: all 0.3s ease;
            }
            #leak-finder-overlay.collapsed #leak-finder-overlay-list {
                padding-top: 0;
                padding-bottom: 0;
                max-height: 0;
            }
            #leak-finder-overlay-list li {
                margin: 5px 0;
            }
            #leak-finder-overlay-list a {
                text-decoration: none;
                display: block;
                padding: 4px;
                border-radius: 4px;
                transition: background-color 0.2s, color 0.2s;
            }
            #leak-finder-overlay-list a:hover {
                background-color: #333;
            }
            #leak-finder-overlay-list a.found {
                color: #4CAF50; /* Green for found */
                font-weight: bold;
            }
            #leak-finder-overlay-list a.not-found {
                color: #ff4d4d; /* Red for not found */
            }
            #leak-finder-overlay-list a.pending {
                color: #ffc107; /* Yellow for pending */
            }
        `);

        const overlay = document.createElement('div');
        overlay.id = 'leak-finder-overlay';

        const header = document.createElement('div');
        header.id = 'leak-finder-overlay-header';
        header.innerHTML = `<h3>Checking: ${username}</h3><span id="leak-finder-toggle">▼</span>`;

        const list = document.createElement('ul');
        list.id = 'leak-finder-overlay-list';

        overlay.appendChild(header);
        overlay.appendChild(list);
        document.body.appendChild(overlay);

        header.addEventListener('click', () => {
            overlay.classList.toggle('collapsed');
            document.getElementById('leak-finder-toggle').textContent = overlay.classList.contains('collapsed') ? '▶' : '▼';
        });

        return list;
    }

    function addLink(listElement, siteName, url, note = '') {
        const li = document.createElement('li');
        const a = document.createElement('a');
        const dataSite = siteName.toLowerCase() + (note ? '-' + note.toLowerCase() : '');

        a.href = url;
        a.textContent = siteName + (note ? ` (${note})` : '');
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.classList.add('pending');
        a.dataset.site = dataSite;

        li.appendChild(a);
        listElement.appendChild(li);
    }

    function updateLinkStatus(siteName, note, found) {
        const dataSite = siteName.toLowerCase() + (note ? '-' + note.toLowerCase() : '');
        const link = document.querySelector(`[data-site="${dataSite}"]`);
        if (link) {
            link.classList.remove('pending');
            link.classList.add(found ? 'found' : 'not-found');
        }
    }


    // --- Core Logic ---
    function getUsernameFromUrl() {
        const hostname = window.location.hostname;
        const pathname = window.location.pathname;
        const ignoredPaths = ['my', 'home', 'settings', 'notifications', 'lists', 'chats', 'bookmarks', 'explore'];

        if (hostname.includes('onlyfans.com') || hostname.includes('fantrie.com')) {
            const parts = pathname.split('/');
            if (parts.length > 1 && parts[1] && !ignoredPaths.includes(parts[1])) {
                return parts[1];
            }
        }

        if (hostname.includes('fansly.com')) {
            const matches = pathname.match(/^\/(?:profile\/)?([^/]+)/);
            if (matches && matches[1] && !ignoredPaths.includes(matches[1])) {
                return matches[1];
            }
        }
        return null;
    }

    function createRequest(url, headers, onSuccess, onError, retryCount = 0) {
        GM.xmlHttpRequest({
            method: 'GET',
            url: url,
            headers: headers,
            onload(response) {
                onSuccess(response);
            },
            onerror(response) {
                if (retryCount < MAX_RETRIES) {
                    console.log(`Retrying... Attempt ${retryCount + 1} for ${url}`);
                    setTimeout(() => createRequest(url, headers, onSuccess, onError, retryCount + 1), 1000);
                } else {
                    console.error(`Max retries reached for ${url}`);
                    onError(response);
                }
            },
        });
    }

    // --- Site Checkers ---
    function checkCoomer(service, username, displayName = 'Coomer', note = '') {
        const profileUrl = `https://${COOMER_DOMAIN}/${service}/user/${username}`;
        // *** FIX: Added /profile to the API endpoint ***
        const apiUrl = `https://${COOMER_DOMAIN}/api/v1/${service}/user/${username}/profile`;
        // *** FIX: Added 'Accept' header for coomer requests ***
        const coomerHeaders = { 'Accept': 'text/css' };

        addLink(document.getElementById('leak-finder-overlay-list'), displayName, profileUrl, note);
        createRequest(apiUrl, coomerHeaders,
            (response) => updateLinkStatus(displayName, note, response.status === 200),
            () => updateLinkStatus(displayName, note, false)
        );
    }

    function checkFapello(username, note = '') {
        const profileUrl = `https://fapello.com/${username}/`;
        addLink(document.getElementById('leak-finder-overlay-list'), 'Fapello', profileUrl, note);
        createRequest(profileUrl, {},
            (response) => {
                const found = response.status === 200 && response.finalUrl.startsWith(profileUrl);
                updateLinkStatus('Fapello', note, found);
            },
            () => updateLinkStatus('Fapello', note, false)
        );
    }

    function checkLeakNudes(username, note = '') {
        const profileUrl = `https://leaknudes.com/model/${username}`;
        addLink(document.getElementById('leak-finder-overlay-list'), 'LeakNudes', profileUrl, note);
        createRequest(profileUrl, {},
            (response) => {
                const found = response.status === 200 && response.finalUrl === profileUrl;
                updateLinkStatus('LeakNudes', note, found);
            },
            () => updateLinkStatus('LeakNudes', note, false)
        );
    }

    function checkTopFapGirls(username, note = '') {
        const searchUrl = `https://www.topfapgirls1.com/search/?q=${username}`;
        const dataSite = 'topfapgirls' + (note ? '-' + note.toLowerCase() : '');
        addLink(document.getElementById('leak-finder-overlay-list'), 'TopFapGirls', searchUrl, note);

        createRequest(searchUrl, {},
            (response) => {
                const found = response.status === 200 && !response.finalUrl.includes("?q=");
                updateLinkStatus('TopFapGirls', note, found);
                if (found) {
                    const link = document.querySelector(`[data-site="${dataSite}"]`);
                    if (link) link.href = response.finalUrl;
                }
            },
            () => updateLinkStatus('TopFapGirls', note, false)
        );
    }

    // --- Platform-specific Initializers ---
    function runChecks(username) {
        const oldOverlay = document.getElementById('leak-finder-overlay');
        if (oldOverlay) oldOverlay.remove();

        const listElement = createOverlay(username);
        const hostname = window.location.hostname;

        if (hostname.includes('onlyfans.com')) {
            checkCoomer('onlyfans', username);
            checkFapello(username);
            checkLeakNudes(username);
            checkTopFapGirls(username);
            if (username.includes('_')) {
                checkFapello(username.replace(/_/g, '-'), 'alt');
            }
        } else if (hostname.includes('fansly.com')) {
            const coomerNote = 'Fansly ID';
            const coomerDataSite = 'coomer-' + coomerNote.toLowerCase().replace(' ', '');
            addLink(listElement, 'Coomer', `https://${COOMER_DOMAIN}/`, coomerNote);

            const fanslyApiUrl = `https://apiv3.fansly.com/api/v1/account?usernames=${username}`;
            createRequest(fanslyApiUrl, {},
                (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.success && data.response.length > 0) {
                            const id = data.response[0].id;
                            // *** FIX: Added /profile to the API endpoint ***
                            const coomerApiUrl = `https://${COOMER_DOMAIN}/api/v1/fansly/user/${id}/profile`;
                            const coomerProfileUrl = `https://${COOMER_DOMAIN}/fansly/user/${id}`;
                            const link = document.querySelector(`[data-site="${coomerDataSite}"]`);
                            if (link) link.href = coomerProfileUrl;

                            // *** FIX: Added 'Accept' header for coomer requests ***
                            const coomerHeaders = { 'Accept': 'text/css' };

                            createRequest(coomerApiUrl, coomerHeaders,
                                (coomerRes) => updateLinkStatus('Coomer', coomerNote, coomerRes.status === 200),
                                () => updateLinkStatus('Coomer', coomerNote, false)
                            );
                        } else {
                            updateLinkStatus('Coomer', coomerNote, false);
                        }
                    } catch (e) {
                        updateLinkStatus('Coomer', coomerNote, false);
                    }
                },
                () => updateLinkStatus('Coomer', coomerNote, false)
            );

            checkFapello(username);
            checkLeakNudes(username);
            checkTopFapGirls(username);
            if (username.includes('_')) {
                checkFapello(username.replace(/_/g, '-'), 'alt');
            }

            setTimeout(() => {
                const instaElement = document.querySelector('a[href*="instagram.com"]');
                if (instaElement) {
                    const instaMatch = instaElement.href.match(/instagram\.com\/([a-zA-Z0-9_.]+)/);
                    if (instaMatch && instaMatch[1]) {
                        const instaHandle = instaMatch[1];
                        checkFapello(instaHandle, 'Insta');
                        checkTopFapGirls(instaHandle, 'Insta');
                    }
                }
            }, 2000);

        } else if (hostname.includes('fantrie.com')) {
            checkFapello(username);
            checkLeakNudes(username);
            checkTopFapGirls(username);
        }
    }

    // --- Main Execution ---
    let lastUrl = location.href;
    let lastUsername = null;

    function main() {
        const username = getUsernameFromUrl();
        const overlay = document.getElementById('leak-finder-overlay');

        if (username && username !== lastUsername) {
            lastUsername = username;
            setTimeout(() => runChecks(username), 500);
        } else if (username && overlay && overlay.style.display === 'none') {
             overlay.style.display = 'block';
        } else if (!username && overlay) {
            overlay.style.display = 'none';
            lastUsername = null;
        }
    }

    // Initial run
    setTimeout(main, 1000);

    // Rerun on URL changes for SPAs
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            main();
        }
    }).observe(document.body, { subtree: true, childList: true });

})();