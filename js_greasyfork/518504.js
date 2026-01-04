// ==UserScript==
// @name         Noise's 2016 Website UI Tweaks
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Multiple UI Tweaks to make the website look more accurate to how it was back in 2016!
// @author       The Noise!
// @match        https://*.roblox.com/*
// @icon        data:image/png;base64,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
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518504/Noise%27s%202016%20Website%20UI%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/518504/Noise%27s%202016%20Website%20UI%20Tweaks.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Define replaceAvatarImages function at the top level
    const replaceAvatarImages = () => {
        // Only run on specified pages
        if (!window.location.href.includes('roblox.com/home') &&
            !window.location.href.includes('roblox.com/communities/') &&
            !window.location.href.includes('roblox.com/users/') &&
            !window.location.href.includes('roblox.com/search/users')) {
            return;
        }

        // First, ensure header avatars are always headshots
        const headerAvatars = [
            '#home-header img.avatar-card-image',
            '.container-header img[src*="AvatarHeadshot"]'
        ];

        headerAvatars.forEach(selector => {
            const headerAvatar = document.querySelector(selector);
            if (headerAvatar && headerAvatar.src.includes('30DAY-Avatar-')) {
                headerAvatar.src = headerAvatar.src.replace('30DAY-Avatar-', '30DAY-AvatarHeadshot-');
                console.log('Restored header avatar to headshot');
            }
        });

        // Handle user search page
        if (window.location.href.includes('roblox.com/search/users')) {
            const searchResultImages = document.querySelectorAll('.avatar-card-container img[src^="https://tr.rbxcdn.com/30DAY-AvatarHeadshot-"]');
            searchResultImages.forEach(image => {
                if (image.closest('.container-header')) return; // Skip container-header images
                const newSrc = image.src.replace("30DAY-AvatarHeadshot-", "30DAY-Avatar-");
                image.src = newSrc;
                console.log(`Updated search result image source to: ${newSrc}`);
            });
            return;
        }

        // Handle friends/followers/following pages
        if (window.location.href.includes('roblox.com/users/') && window.location.href.includes('#!/')) {
            const userListImages = document.querySelectorAll('.list-item img[src^="https://tr.rbxcdn.com/30DAY-AvatarHeadshot-"]');
            userListImages.forEach(image => {
                if (image.closest('.container-header')) return; // Skip container-header images
                const newSrc = image.src.replace("30DAY-AvatarHeadshot-", "30DAY-Avatar-");
                image.src = newSrc;
                console.log(`Updated user list image source to: ${newSrc}`);
            });
            return;
        }

        // Handle avatars in friends carousel on user profile pages
        if (window.location.href.includes('roblox.com/users/')) {
            const friendsCarouselImages = document.querySelectorAll('.friends-carousel-container img[src^="https://tr.rbxcdn.com/30DAY-AvatarHeadshot-"]');
            friendsCarouselImages.forEach(image => {
                if (image.closest('.container-header')) return; // Skip container-header images
                const newSrc = image.src.replace("30DAY-AvatarHeadshot-", "30DAY-Avatar-");
                image.src = newSrc;
                console.log(`Updated friends carousel image source to: ${newSrc}`);
            });
            return;
        }

        // Handle other pages (home and communities)
        const avatarImages = document.querySelectorAll('img[src^="https://tr.rbxcdn.com/30DAY-AvatarHeadshot-"]');
        avatarImages.forEach(image => {
            if (image.closest('#home-header') || image.closest('.container-header')) {
                return;
            }

            if (image.id === "home-avatar-thumb") {
                console.log('Skipped updating home avatar image.');
                return;
            }

            const newSrc = image.src.replace("30DAY-AvatarHeadshot-", "30DAY-Avatar-");
            image.src = newSrc;
            console.log(`Updated image source to: ${newSrc}`);
        });
    };

    const modifyUI = () => {
        // Remove "Money" navigation element
        const moneyNav = document.querySelector('a#nav-money');
        if (moneyNav) {
            moneyNav.remove();
            console.log('Removed "Money" navigation element.');
        }

        // Remove "Premium" navigation element
        const premiumNav = document.querySelector('a#nav-premium');
        if (premiumNav) {
            premiumNav.remove();
            console.log('Removed "Premium" navigation element.');
        }

        // Add Message button to user profile pages
        if (window.location.href.includes('roblox.com/users/')) {
            const addFriendButton = document.querySelector('.details-actions.desktop-action .btn-friends');
            if (addFriendButton && !document.querySelector('.btn-message')) {
                const messageButtonLi = document.createElement('li');
                messageButtonLi.className = 'btn-message';
                messageButtonLi.innerHTML = `
                    <button class="btn-control-md" ng-disabled="!profileHeaderLayout.canMessage || profileHeaderLayout.userId == 0" ng-click="sendMessage()" disabled="disabled">
                        Message
                    </button>
                `;
                addFriendButton.insertAdjacentElement('afterend', messageButtonLi);
                console.log('Added Message button next to Add Friend button');
            }
        }

        // Replace "Communities" with "Groups"
        document.querySelectorAll('span.font-header-2.dynamic-ellipsis-item[title="Communities"]').forEach(element => {
            if (element.textContent.trim() === "Communities") {
                element.textContent = "Groups";
                console.log('Replaced "Communities" with "Groups".');
            }
        });

        // Replace "Communities" in visible text nodes
        document.querySelectorAll('*:not(script):not(style)').forEach(node => {
            if (node.childNodes.length) {
                node.childNodes.forEach(child => {
                    if (child.nodeType === Node.TEXT_NODE && child.nodeValue.includes("Communities")) {
                        child.nodeValue = child.nodeValue.replace(/Communities/g, "Groups");
                    }
                });
            }
        });

        // Replace group-related text
        const elements = {
            'button#group-join-button': 'Join Community|Join Group',
            'button.ng-binding': 'Leave Community|Leave Group',
            'a.ng-binding': 'Configure Community|Configure Group'
        };

        for (const [selector, replacement] of Object.entries(elements)) {
            const [oldText, newText] = replacement.split('|');
            document.querySelectorAll(selector).forEach(element => {
                if (element.textContent.trim() === oldText) {
                    element.textContent = newText;
                    console.log(`Replaced "${oldText}" with "${newText}"`);
                }
            });
        }
    };

    // Comments section functionality - only runs on game pages
    if (window.location.href.includes('roblox.com/games/')) {
        const addCommentsSection = (forceFallback = false) => {
            if (document.getElementById('AjaxCommentsContainer')) return true;

            const commentsHTML = `
                <div id="AjaxCommentsContainer" class="comments-container" data-asset-id="32990482" data-total-collection-size="" data-is-user-authenticated="False" data-signin-url="https://www.roblox.com/newlogin?returnUrl=%2Fgames%2F32990482%2FFlood-Escape">
                    <h3>Comments</h3>
                    <div class="section-content AddAComment">
                        <div class="comment-form">
                            <form class="form-horizontal ng-pristine ng-valid" role="form">
                                <div class="form-group">
                                    <textarea class="form-control input-field rbx-comment-input blur" placeholder="Write a comment!" rows="1"></textarea>
                                    <div class="rbx-comment-msgs">
                                        <span class="rbx-comment-error text-error" style="display: none;"> </span>
                                        <span class="rbx-comment-count small"></span>
                                    </div>
                                </div>
                                <button type="button" class="btn-secondary-md rbx-post-comment">Post Comment</button>
                            </form>
                        </div>
                        <div class="comments vlist">
                            <div class="empty">No comments found.</div>
                        </div>
                    </div>
                </div>
            `;

            if (!forceFallback) {
                const badgesList = document.querySelector('.stack.badge-container.game-badges-list');
                if (badgesList) {
                    badgesList.insertAdjacentHTML('afterend', commentsHTML);
                    setupCommentButton();
                    return true;
                }
                return false;
            }

            const recommendedSection = document.querySelector('.container-list.games-detail');
            if (recommendedSection) {
                recommendedSection.insertAdjacentHTML('beforebegin', commentsHTML);
                setupCommentButton();
                return true;
            }

            return false;
        };

        const setupCommentButton = () => {
            const postCommentButton = document.querySelector('.rbx-post-comment');
            if (postCommentButton) {
                postCommentButton.addEventListener('click', (event) => {
                    event.preventDefault();
                });
            }
        };

        const init = () => {
            let badgeAttempts = 0;
            const maxBadgeAttempts = 15;

            const badgeInterval = setInterval(() => {
                badgeAttempts++;
                if (addCommentsSection(false)) {
                    clearInterval(badgeInterval);
                } else if (badgeAttempts >= maxBadgeAttempts) {
                    clearInterval(badgeInterval);
                    addCommentsSection(true);
                }
            }, 1000);

            addCommentsSection(false);
        };

        init();
    }

    // Run initial modifications
    modifyUI();
    replaceAvatarImages();

    // Observe the DOM for dynamic changes with both functions
    const observer = new MutationObserver(() => {
        modifyUI();
        replaceAvatarImages();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();