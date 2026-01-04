// ==UserScript==
// @name         X(Twitter) Like, Retweet, and optionally Bookmark with One Click
// @namespace    https://greasyfork.org/en/users/948789
// @version      1.2
// @description  This script adds a button that combines liking, retweeting, and optionally bookmarking in one click
// @author       RayBTA
// @match        https://*.x.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/512297/X%28Twitter%29%20Like%2C%20Retweet%2C%20and%20optionally%20Bookmark%20with%20One%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/512297/X%28Twitter%29%20Like%2C%20Retweet%2C%20and%20optionally%20Bookmark%20with%20One%20Click.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the setting for bookmark functionality
    let useBookmark = GM_getValue('useBookmark', false);

    // Function to like, retweet, and optionally bookmark
    function likeRetweetBookmark(post, button) {
        const likeButton = post.querySelector('[data-testid="like"]');
        const retweetButton = post.querySelector('[data-testid="retweet"]');
        const unlikeButton = post.querySelector('[data-testid="unlike"]');
        const undoRetweetButton = post.querySelector('[data-testid="unretweet"]');
        const bookmarkButton = post.querySelector('[data-testid="bookmark"]');
        const removeBookmarkButton = post.querySelector('[data-testid="removeBookmark"]');

        // Handle action when button is already liked/retweeted/bookmarked
        if (button.liked) {
            unlikeButton?.click();
            undoRetweetButton?.click();
            setTimeout(() => {
                document.querySelector('[data-testid="unretweetConfirm"]')?.click();
            }, 0);

            if (useBookmark) {
                removeBookmarkButton?.click();
            }
        } else {
            likeButton?.click();
            retweetButton?.click();
            setTimeout(() => {
                document.querySelector('[data-testid="retweetConfirm"]')?.click();
            }, 0);

            if (useBookmark) {
                bookmarkButton?.click();
            }
        }

        button.liked = !button.liked;
    }

    // Function to add "L & R" button (or "L/R/B" if bookmark is on)
    function addLikeRetweetBookmarkButton(post) {
        if (post.querySelector('.auto-like-retweet-bookmark')) return;

        const actionBar = post.querySelector('[role="group"]');
        if (!actionBar) return;

        const likeButton = post.querySelector('[data-testid="like"]');
        const retweetButton = post.querySelector('[data-testid="retweet"]');
        if (!likeButton || !retweetButton) return;

        const button = document.createElement('button');
        button.innerText = useBookmark ? "L/R/B" : "L & R";
        button.classList.add('auto-like-retweet-bookmark');
        button.liked = false;

        Object.assign(button.style, {
            marginLeft: "10px",
            padding: "5px 8px",
            backgroundColor: "transparent",
            color: "#1DA1F2",
            border: "1px solid #1DA1F2",
            borderRadius: "20px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
            transition: "background-color 0.3s"
        });

        button.onmouseover = () => button.style.backgroundColor = "rgba(29, 161, 242, 0.1)";
        button.onmouseout = () => button.style.backgroundColor = "transparent";

        button.addEventListener('click', () => likeRetweetBookmark(post, button));
        actionBar.appendChild(button);
    }

    // Function to observe new posts
    function observePosts() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.matches('.css-175oi2r')) {
                        addLikeRetweetBookmarkButton(node);
                    }
                });
            });
        });

        const feed = document.querySelector('main, [role="main"]');
        if (feed) {
            observer.observe(feed, { childList: true, subtree: true });
            feed.querySelectorAll('.css-175oi2r').forEach(post => addLikeRetweetBookmarkButton(post));
        } else {
            setTimeout(observePosts, 2000);
        }
    }

    // Function to toggle the use of the bookmark feature from Tampermonkey settings menu
    function toggleBookmarkFeature() {
        useBookmark = !useBookmark;
        GM_setValue('useBookmark', useBookmark);
        updateButtonLabels();
    }

    // Function to update button labels after toggling the bookmark feature
    function updateButtonLabels() {
        document.querySelectorAll('.auto-like-retweet-bookmark').forEach(button => {
            button.innerText = useBookmark ? "L/R/B" : "L & R";
        });
    }

    // Register the menu command to toggle the bookmark feature
    GM_registerMenuCommand("Toggle Bookmark Feature", toggleBookmarkFeature);

    observePosts();
})();