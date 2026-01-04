// ==UserScript==
// @name         Quickblock And Such (prev. BEPC)
// @version      0.0.24
// @description  Adds quick buttons for weblink, mute, and block, directly on posts, always visible, not even hidden in the post dropdown menu. Also adds a link to clearsky from the three-dot menu on profiles. Tested and works on web as of dec 14, msg me on bsky (lauren1701.bsky.social) if it breaks
// @match        https://bsky.app/*
// @namespace    https://lauren1701.bsky.social
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518858/Quickblock%20And%20Such%20%28prev%20BEPC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/518858/Quickblock%20And%20Such%20%28prev%20BEPC%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("Quickblock: top of script");

    // css for clearsky link hover
    const style = document.createElement('style');
    style.textContent = `
      .menu-item-hover:hover {
        background-color: rgba(128,128,128,0.1) !important;
      }
    `;
    document.head.appendChild(style);

    let profileCache = {};

    // Get auth token from localStorage
    function account() {
        const storedData = localStorage.getItem('BSKY_STORAGE');
        try {
            const localStorageData = JSON.parse(storedData);
            return {account: localStorageData.session.currentAccount, token: localStorageData.session.currentAccount.accessJwt, hostApi: localStorageData.session.currentAccount.pdsUrl.replace(/\/*$/, '')};
        } catch (error) {
            console.error('Failed to parse session data:', error);
            throw error;
        }
    }

    function showToast(message, duration = 3000) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 10000;
            transition: opacity ${duration/1000}s;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), duration);
        }, duration);
    }

    function hideUserPosts(username) {
        // Don't hide posts if we're on a profile page
        if (window.location.pathname.match(/\/profile\/[^\/]+\/?([?#].*)?$/)) {
            return;
        }

        const selectors = [
            `[data-testid="feedItem-by-${username}"]`,
            `[data-testid="postThreadItem-by-${username}"]`
        ];

        selectors.forEach(selector => {
            const posts = document.querySelectorAll(selector);
            posts.forEach(post => {
                // Animate the post out

                post.style.display = 'inherit';
                const height = post.offsetHeight;
                post.style.height = height + 'px';
                post.style.transition = 'opacity 0.3s, height 0.3s';

                // After animation, collapse the height
                setTimeout(() => {
                    post.style.height = '0';
                    post.style.margin = '0';
                    post.style.padding = '0';
                    post.style.opacity = '0';
                    post.style.overflow = 'hidden';
                    setTimeout(() => {
                        if (post.style.display === "initial") return;
                        post.style = 'display: none;';
                    }, 400);
                }, 5);
            });
        });
    }

    function unhideUserPosts(username) {
        // Don't hide posts if we're on a profile page
        if (window.location.pathname.match(/\/profile\/[^\/]+\/?([?#].*)?$/)) {
            return;
        }

        const selectors = [
            `[data-testid="feedItem-by-${username}"]`,
            `[data-testid="postThreadItem-by-${username}"]`
        ];

        selectors.forEach(selector => {
            const posts = document.querySelectorAll(selector);
            posts.forEach(post => {
                post.style = 'display: initial;';
                // Animate the post out

            });
        });
    }



    // Create button container and style it
    function createButtonContainer() {
        const container = document.createElement('div');
        container.className = 'enhanced-post-controls';
        return container;
    }

    // Create a button with common styling
    function createButton(emoji, label, color = 'inherit') {
        const button = document.createElement('button');
        button.innerHTML = emoji;
        button.title = label;
        const opacity = '0.4';
        button.style.cssText = `
            background: none;
            border: none;
            cursor: pointer;
            font-size: 14px;
            padding: 2px;
            margin-left: 4px;
            color: ${color};
            opacity: ${opacity};
            transition: opacity 0.2s, transform 0.2s;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.opacity = '1';
            button.style.transform = 'scale(1.1)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.opacity = opacity;
            button.style.transform = 'scale(1)';
        });

        return button;
    }

    // Extract handle from post element
    function extractHandle(postElement) {
        // Look for the handle link element
        const handleElement = postElement.querySelector('a[href^="/profile/"]');
        if (handleElement) {
            const handle = handleElement.getAttribute('href').split('/profile/')[1];
            return handle.replace(/\/post.*/, "");
        }
        return null;
    }
    const mute_svg = `<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-volume-x"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
    const external_link_svg = `<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-external-link"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;
    const block_svg = `<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-slash"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>`;

    function addClearskyLink(menu, user) {
        if (!menu || menu.querySelector('.clearsky-link')) return;

        const last = menu.children[menu.children.length-1];
        const cloned = last.cloneNode(true);

        const link = document.createElement('a');
        link.href = `https://clearsky.app/${user}/lists`; // Set your target URL
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        link.className = cloned.className + ' menu-item-hover clearsky-link'; // Add our new class
        link.setAttribute('style', cloned.getAttribute('style'));
        link.setAttribute('role', 'menuitem');
        link.setAttribute('tabindex', '-1');
        link.setAttribute('aria-label', 'View on Clearsky');
        link.setAttribute('data-testid', 'profileHeaderDropdownDataBtn');
        //console.log(cloned.children);

        link.appendChild(cloned.children[0]);
        link.appendChild(cloned.children[0]);
        link.children[0].innerText = "View on Clearsky";

        link.children[1].innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(128,128,0)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-moon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

        menu.appendChild(link);
    }

    // Add controls to a post
    function addControlsToPost(post) {
        if (!post || post.querySelector('.enhanced-post-controls')) return;

        const handle = extractHandle(post);
        if (!handle) {
            console.log("Quickblock: No handle found for post", post);
            return;
        }

        console.log("Quickblock: Adding controls for handle:", handle);

        const container = createButtonContainer();

        // Create buttons as before
        const linkButton = createButton(external_link_svg, "Open profile's website");
        linkButton.addEventListener('click', (e) => {
            e.stopPropagation();
            window.open(`https://${handle}`, '_blank');
        });

        const spacer = document.createElement("div");
        spacer.style = "flex-grow: 1;";

        const muteButton = createButton(mute_svg, 'Mute User', 'rgb(200, 128, 68)');
        muteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            handleMute(handle);
        });

        const blockButton = createButton(block_svg, 'Block User', 'rgb(255, 68, 68)');
        blockButton.addEventListener('click', (e) => {
            e.stopPropagation();
            handleBlock(handle);
        });

        container.appendChild(linkButton);
        container.appendChild(spacer);
        container.appendChild(muteButton);
        container.appendChild(blockButton);

        // Adjust container styling
        container.style.cssText = `
            display: flex;
            gap: 2px;
            margin-left: 2px;
            position: relative;
            top: 1px;
            flex: 1;
        `;
        // Determine post type and insertion point
        let insertionPoint;

        // Check if this is a thread root by looking for "who can reply"
        const isThreadRoot = !!post.querySelector('button[aria-label="Who can reply"]');

        if (isThreadRoot) {
            // Find a parent div that contains exactly two role="link" divs
            const allDivs = post.querySelectorAll('div');
            for (const div of allDivs) {
                const linkDivs = div.querySelectorAll(':scope > div[role="link"]');
                if (linkDivs.length === 2) {
                    // Insert after this div's parent
                    insertionPoint = div.parentElement;
                    break;
                }
            }
        } else {
            // Regular feed post or reply - use the date element parent
            const dateLink = post.querySelector('a[href^="/profile/"][href*="/post/"]');
            insertionPoint = dateLink?.parentElement;
        }

        if (insertionPoint) {
            // Insert after the target element
            if (isThreadRoot) {
                insertionPoint.insertBefore(container, insertionPoint.children[2]);
            } else {
                insertionPoint.appendChild(container);
            }
        } else {
            console.error("Quickblock: No suitable insertion point found in post:", post);
        }
    }
    async function getProfile(actor) {
        if (profileCache[actor]) {
            return profileCache[actor];
        }

        const bskyStorage = JSON.parse(localStorage.getItem('BSKY_STORAGE'));
        const url = `${bskyStorage.session?.currentAccount?.pdsUrl}xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(actor)}`;

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${account().token}`,
            },
            method: 'GET'
        });

        if (!response.ok) throw new Error(`Failed to fetch profile: ${response.statusText}`);
        const profile = await response.json();
        profileCache[actor] = profile;
        return profile;
    }

    // Handle muting
    async function handleMute(userId) {
        try {
            hideUserPosts(userId);
            // Get the user's DID first
            const userProfile = await getProfile(userId);

            // Then make the actual mute request
            const response = await fetch(`${account().hostApi}/xrpc/app.bsky.graph.muteActor`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${account().token}`
                },
                body: JSON.stringify({ actor: userProfile.did })
            });

            if (response.ok) {
                showToast(`Muted ${userId}`);
            } else {
                alert('Failed to mute user');
                unhideUserPosts(userId);
            }
        } catch (error) {
            console.error('Error muting user:', error);
        }
    }
    // Handle blocking
    async function handleBlock(userId) {
        try {
            hideUserPosts(userId);
            const userProfile = await getProfile(userId);
            const bskyStorage = JSON.parse(localStorage.getItem('BSKY_STORAGE'));
            const url = `${account().hostApi}/xrpc/com.atproto.repo.createRecord`;
            const body = JSON.stringify({
                collection: 'app.bsky.graph.block',
                repo: bskyStorage.session.currentAccount.did,
                record: {
                    subject: userProfile.did,
                    createdAt: new Date().toISOString(),
                    $type: 'app.bsky.graph.block',
                }
            });

            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${account().token}`,
                },
                body,
                method: 'POST',
            });

            if (!response.ok) throw new Error(`Failed to block user: ${response.statusText}`);

            showToast(`Blocked ${userId}`);
        } catch (error) {
            unhideUserPosts(userId);
            console.error('Block user error:', error);
            alert(`Failed to block user "${userId}". Please check the console for more details.`);
        }
    }

    // Initialize
    function init() {
        console.log("Quickblock: Initializing");
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Look for posts using the role="link" attribute and data-testid pattern
                        const posts = node.querySelectorAll('[data-testid^="feedItem-by-"], [data-testid^="postThreadItem-by-"]');
                        console.log("Quickblock: Found", posts.length, "new posts");
                        posts.forEach(post => {
                          try {
                            addControlsToPost(post)
                          } catch (e) {
                            showToast(`Quickblock: error adding controls to post, see console: ${e}`);
                            console.error(e);
                            throw e;
                          }
                        });

                        const m = window.location.pathname.match(/\/profile\/([^\/]+)\/?([?#].*)?$/);
                        if (m) {
                            const menu = document.querySelector("[data-testid^='profileHeaderDropdownListAddRemoveBtn']")?.parentElement;
                            if (menu) {
                              addClearskyLink(menu, m[1])
                            }
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Handle initial posts
        const initialPosts = document.querySelectorAll('[data-testid^="feedItem-by-"], [data-testid^="postThreadItem-by-"]');
        console.log("Quickblock: Found", initialPosts.length, "initial posts");
        initialPosts.forEach(post => addControlsToPost(post));
    }

    // Start the script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
