// ==UserScript==
// @name         Add "Mute User" Button to Bluesky Posts
// @namespace    plonked
// @description  Add a mute button to Bluesky posts, to allow you to quickly mute a user
// @author       @plonked.bsky.social
// @match        *://bsky.app/*
// @grant        none
// @version 0.0.1.20241128204020
// @downloadURL https://update.greasyfork.org/scripts/519195/Add%20%22Mute%20User%22%20Button%20to%20Bluesky%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/519195/Add%20%22Mute%20User%22%20Button%20to%20Bluesky%20Posts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BUTTON_CLASS = 'bsky-mute-btn';
    const PROCESSED_CLASS = 'bsky-mute-processed';
    const POST_SELECTORS = {
        feedItem: '[data-testid^="feedItem-by-"]',
        postPage: '[data-testid^="postThreadItem-by-"]',
        searchItem: 'div[role="link"][tabindex="0"]'
    };

    let hostApi = 'https://cordyceps.us-west.host.bsky.network';
    let token = null;

    function getTokenFromLocalStorage() {
        const storedData = localStorage.getItem('BSKY_STORAGE');
        if (storedData) {
            try {
                const localStorageData = JSON.parse(storedData);
                token = localStorageData.session.currentAccount.accessJwt;
            } catch (error) {
                console.error('Failed to parse session data', error);
            }
        }
    }

    function createMuteButton() {
        const button = document.createElement('div');
        button.className = `css-175oi2r r-1loqt21 r-1otgn73 ${BUTTON_CLASS}`;
        button.setAttribute('role', 'button');
        button.setAttribute('tabindex', '0');
        button.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            border-radius: 999px;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            padding: 5px;
            cursor: pointer;
            transition: background-color 0.2s ease;
            opacity: 0.5;
            z-index: 10;
        `;

        const icon = document.createElement('div');
        icon.textContent = '🔇';
        icon.style.cssText = `
            font-size: 16px;
            filter: grayscale(1);
        `;

        button.appendChild(icon);

        button.onmouseover = () => {
            button.style.backgroundColor = 'rgba(29, 161, 242, 0.1)';
            button.style.opacity = '1';
        };
        button.onmouseout = () => {
            button.style.backgroundColor = '';
            button.style.opacity = '0.5';
        };

        return button;
    }

    async function muteUser(userId) {
        if (!token) {
            console.error('Failed to get authorization token');
            return false;
        }

        try {
            const response = await fetch(
                `${hostApi}/xrpc/app.bsky.graph.muteActor`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ actor: userId })
                }
            );

            return response.ok;
        } catch (error) {
            console.error('Error muting user:', error);
            return false;
        }
    }

    function extractDidPlc(element) {
        const html = element.innerHTML;
        const match = html.match(/did:plc:[^/"]+/);
        return match ? match[0] : null;
    }

    function findNameInPost(post) {
        const testId = post.getAttribute('data-testid');
        if (testId) {
            const match = testId.match(/(?:feedItem-by-|postThreadItem-by-)([^.]+)/);
            if (match) return match[1];
        }

        const profileLinks = post.querySelectorAll('a[href^="/profile/"]');
        for (const link of profileLinks) {
            const nameElement = link.querySelector('.css-1jxf684[style*="font-weight: 600"]');
            if (nameElement) {
                let name = nameElement.textContent.trim();
                if (name.startsWith('@')) name = name.slice(1);
                if (name.endsWith('.bsky.social')) name = name.replace('.bsky.social', '');
                return name;
            }
        }

        return null;
    }

    function hideAllPostsForUser(didPlc) {
        document.querySelectorAll(Object.values(POST_SELECTORS).join(',')).forEach(post => {
            if (post.innerHTML.includes(didPlc)) {
                post.style.display = 'none';
            }
        });
    }

    async function addMuteButton(post) {
        if (post.classList.contains(PROCESSED_CLASS)) return;

        if (window.getComputedStyle(post).position === 'static') {
            post.style.position = 'relative';
        }

        const didPlc = extractDidPlc(post);
        if (!didPlc) return;

        const username = findNameInPost(post);
        if (!username) return;

        const button = createMuteButton();
        button.setAttribute('data-did-plc', didPlc);

        button.onclick = async (e) => {
            e.preventDefault();
            e.stopPropagation();

            const success = await muteUser(didPlc);
            if (success) {
                hideAllPostsForUser(didPlc);
            }
        };

        post.appendChild(button);
        post.classList.add(PROCESSED_CLASS);
    }

    function initialize() {
        console.log('Initializing Bluesky Direct Mute Button');
        getTokenFromLocalStorage();

        const observer = new MutationObserver((mutations) => {
            if (mutations.some(mutation => mutation.addedNodes.length)) {
                const unprocessedPosts = document.querySelectorAll(
                    Object.values(POST_SELECTORS)
                        .map(selector => `${selector}:not(.${PROCESSED_CLASS})`)
                        .join(',')
                );
                unprocessedPosts.forEach(addMuteButton);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        document.querySelectorAll(
            Object.values(POST_SELECTORS)
                .map(selector => `${selector}:not(.${PROCESSED_CLASS})`)
                .join(',')
        ).forEach(addMuteButton);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();