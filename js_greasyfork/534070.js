// ==UserScript==
// @name         Patreon Kemono Buttons
// @namespace    MoodyMonkey
// @version      3.4
// @description  Adds links to Kemono pages on Patreon links 😤✅🧠
// @author       MoodyMonkey
// @match        *://www.patreon.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/534070/Patreon%20Kemono%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/534070/Patreon%20Kemono%20Buttons.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getDataJson() {
        try {
            const jsonScript = document.querySelector('#__NEXT_DATA__');
            if (!jsonScript) return null;
            const parsed = JSON.parse(jsonScript.textContent);
            console.log('[Kemono DEBUG] FULL Patreon JSON loaded.');
            return parsed;
        } catch (e) {
            console.error('[Kemono DEBUG] Failed to parse #__NEXT_DATA__ JSON:', e);
            return null;
        }
    }

    function getUserIdFromJson(data) {
        try {
            const id = data?.query?.u;
            if (id) console.log('[Kemono DEBUG] User ID from query.u:', id);
            return id;
        } catch {
            return null;
        }
    }

    function getUsernameFromJson(data) {
        let username = null;

        try {
            username = data?.props?.pageProps?.creator?.vanity || data?.props?.pageProps?.creator?.slug;
            if (username) {
                console.log('[Kemono DEBUG] Username from JSON:', username);
                return username;
            }
        } catch {}

        try {
            const canonical = document.querySelector('link[rel="canonical"]');
            if (!canonical) return null;
            const href = canonical.getAttribute('href');
            const match = href.match(/https:\/\/www\.patreon\.com\/([a-zA-Z0-9_-]+)/);
            if (!match) return null;
            const fallback = match[1];
            console.log('[Kemono DEBUG] Username from canonical:', fallback);
            return fallback;
        } catch (e) {
            console.warn('[Kemono DEBUG] Fallback username parse threw error:', e);
        }

        return username || null;
    }

    function getPostId() {
        const match = window.location.pathname.match(/-(\d+)/);
        if (match) console.log('[Kemono DEBUG] Found postid:', match[1]);
        return match ? match[1] : null;
    }

    function buildProfileUrl(idOrUsername) {
        return `https://kemono.su/patreon/user/${idOrUsername}`;
    }

    function buildPostUrl(idOrUsername, postid) {
        return `https://kemono.su/patreon/user/${idOrUsername}/post/${postid}`;
    }

    function addKemonoButtons(idOrUsername, postid) {
        if (!idOrUsername || !postid) return;

        const existingButtons = document.querySelector('.kemono-buttons');
        if (existingButtons) return;

        const profileUrl = buildProfileUrl(idOrUsername);
        const postUrl = buildPostUrl(idOrUsername, postid);

        console.log('[Kemono DEBUG] Adding buttons:', profileUrl, postUrl);

        const container = document.createElement('div');
        container.className = 'kemono-buttons';
        container.style.marginTop = '10px';

        const profileBtn = document.createElement('a');
        profileBtn.href = profileUrl;
        profileBtn.textContent = 'Kemono Profile';
        profileBtn.target = '_blank';
        profileBtn.style.marginRight = '10px';
        profileBtn.style.padding = '5px 10px';
        profileBtn.style.background = '#ff7f50';
        profileBtn.style.color = 'white';
        profileBtn.style.borderRadius = '5px';
        profileBtn.style.textDecoration = 'none';

        const postBtn = document.createElement('a');
        postBtn.href = postUrl;
        postBtn.textContent = 'Kemono Post';
        postBtn.target = '_blank';
        postBtn.style.padding = '5px 10px';
        postBtn.style.background = '#6495ed';
        postBtn.style.color = 'white';
        postBtn.style.borderRadius = '5px';
        postBtn.style.textDecoration = 'none';

        container.appendChild(profileBtn);
        container.appendChild(postBtn);

        const targetContainer = document.querySelector('[data-tag="post-title"]') || document.querySelector('main') || document.body;
        console.log('[Kemono DEBUG] Inserting Kemono buttons into:', targetContainer);
        targetContainer.appendChild(container);
    }

    function addKemonoUserLinkButtons(idOrUsername) {
        if (!idOrUsername) return;
        if (document.querySelector('.kemono-profile-container')) return;

        const avatar = document.querySelector('img#avatar-image');
        if (!avatar) return;

        const profileUrl = buildProfileUrl(idOrUsername);

        console.log('[Kemono DEBUG] Adding profile button after avatar for:', idOrUsername);

        const container = document.createElement('div');
        container.className = 'kemono-profile-container';
        container.style.marginTop = '10px';

        const profileBtn = document.createElement('a');
        profileBtn.href = profileUrl;
        profileBtn.textContent = 'Kemono Profile';
        profileBtn.target = '_blank';
        profileBtn.style.padding = '5px 10px';
        profileBtn.style.background = '#ff7f50';
        profileBtn.style.color = 'white';
        profileBtn.style.borderRadius = '5px';
        profileBtn.style.textDecoration = 'none';
        profileBtn.style.display = 'inline-block';

        container.appendChild(profileBtn);
        avatar.parentElement.insertAdjacentElement('afterend', container);
    }

    function addKemonoPostLinksToList(idOrUsername, attempt = 0) {
        if (!idOrUsername) return;

        const links = document.querySelectorAll('span[data-tag="post-title"] a[href*="/posts/"]');
        if (!links.length) {
            if (attempt < 5) {
                console.log(`[Kemono DEBUG] No post links yet, retrying (${attempt + 1}/5)`);
                setTimeout(() => addKemonoPostLinksToList(idOrUsername, attempt + 1), 1000);
            } else {
                console.warn('[Kemono DEBUG] Gave up retrying to add Kemono Post links.');
            }
            return;
        }

        links.forEach((link) => {
            const href = link.getAttribute('href');
            const match = href.match(/-(\d+)$/);
            if (!match) return;
            const postid = match[1];

            if (link.parentElement.querySelector('.kemono-post-link')) return;

            const btn = document.createElement('a');
            btn.href = buildPostUrl(idOrUsername, postid);
            btn.textContent = 'Kemono Post';
            btn.className = 'kemono-post-link';
            btn.target = '_blank';
            btn.style.marginLeft = '10px';
            btn.style.padding = '2px 6px';
            btn.style.background = '#6495ed';
            btn.style.color = 'white';
            btn.style.borderRadius = '4px';
            btn.style.textDecoration = 'none';
            btn.style.fontSize = '12px';

            link.parentElement.appendChild(btn);
        });
    }

    function initWithRetries(retries = 10) {
        let attempts = 0;
        console.log('[Kemono DEBUG] Initializing retry loop');
        const interval = setInterval(() => {
            const data = getDataJson();
            const userid = getUserIdFromJson(data);
            const username = getUsernameFromJson(data);
            const idOrUsername = userid || username;

            console.log('[Kemono DEBUG] Using idOrUsername:', idOrUsername);

            const postid = getPostId();
            const isProfilePage = document.querySelector('#search-posts');
            if (isProfilePage) console.log('[Kemono DEBUG] Detected profile via #search-posts input');

            if (idOrUsername && (postid || isProfilePage)) {
                clearInterval(interval);
                addKemonoUserLinkButtons(idOrUsername);
                addKemonoPostLinksToList(idOrUsername);
                if (postid) addKemonoButtons(idOrUsername, postid);
            } else if (attempts++ >= retries) {
                clearInterval(interval);
                console.warn('[Kemono DEBUG] ❌ Failed to fetch required data after retries');
            }
        }, 1000);
    }

    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            const path = location.pathname;
            console.log('[Kemono DEBUG] URL changed to:', lastUrl);
            if (path.includes('/posts') || path.includes('/user') || document.querySelector('#search-posts')) {
                initWithRetries();
            }
        }
    });

    observer.observe(document, { subtree: true, childList: true });

    const initialPath = location.pathname;
    console.log('[Kemono DEBUG] Initial page path:', initialPath);
    if (initialPath.includes('/posts') || initialPath.includes('/user') || document.querySelector('#search-posts')) {
        initWithRetries();
    }
})();
