// ==UserScript==
// @name         Instagram Auto Comment Liker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically likes all visible comments on an Instagram post by scrolling through and liking unliked comments.
// @author       YourName
// @match        https://www.instagram.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539260/Instagram%20Auto%20Comment%20Liker.user.js
// @updateURL https://update.greasyfork.org/scripts/539260/Instagram%20Auto%20Comment%20Liker.meta.js
// ==/UserScript==

(async function () {
    const wait = (ms) => new Promise(res => setTimeout(res, ms));

    let likedCount = 0;
    let previousHeight = 0;

    async function likeVisibleComments() {
        const commentContainers = document.querySelectorAll('ul ul > div > li');
        for (let comment of commentContainers) {
            try {
                const likeButton = comment.querySelector('svg[aria-label="Like"]');
                if (likeButton && likeButton.closest('span') && likeButton.getAttribute('fill') !== '#ed4956') {
                    likeButton.closest('span').click();
                    likedCount++;
                    console.log(`❤️ Liked comment #${likedCount}`);
                    await wait(800);
                }
            } catch (err) {
                console.warn('⚠️ Error liking comment:', err);
            }
        }
    }

    async function scrollToLoadMoreComments() {
        const scrollContainer = document.querySelector('div[role="dialog"] ul');
        if (!scrollContainer) return false;

        scrollContainer.scrollTop = scrollContainer.scrollHeight;
        await wait(2000); // Wait for new comments to load

        const newHeight = scrollContainer.scrollHeight;
        const scrolled = newHeight !== previousHeight;
        previousHeight = newHeight;
        return scrolled;
    }

    console.log('🚀 Starting comment like automation...');

    let canScroll = true;
    while (canScroll) {
        await likeVisibleComments();
        canScroll = await scrollToLoadMoreComments();
    }

    console.log(`✅ Done! Liked ${likedCount} comment(s).`);
})();
