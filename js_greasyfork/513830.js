// ==UserScript==
// @name        Better Instagram
// @namespace   http://tampermonkey.net/
// @version     1.10
// @description An Instagram addon that removes the Reels button and blocks the Reels page.
// @author      Mutedly
// @match       https://www.instagram.com/*
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513830/Better%20Instagram.user.js
// @updateURL https://update.greasyfork.org/scripts/513830/Better%20Instagram.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeReelsButton() {
        const reelsButton = document.querySelector('a[href="/reels/"]');
        if (reelsButton) {
            reelsButton.remove();
        }
    }

    function blockReelsPage() {
        if (window.location.pathname.startsWith('/reels')) {
            if (!document.body.querySelector('.blocked-message')) {
                document.body.innerHTML = '';

                const message = document.createElement('div');
                message.style.cssText = 'font-family: Open Sans, sans-serif; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; font-size: 32px; font-weight: bold; color: red;';
                message.textContent = 'Reels is blocked!';
                message.classList.add('blocked-message');

                const homepageLink = document.createElement('a');
                homepageLink.href = 'https://www.instagram.com';
                homepageLink.textContent = 'Go to Instagram Home';
                homepageLink.style.cssText = 'margin-top: 20px; align-items: center; appearance: none; background-color: #FCFCFD; border-radius: 4px; border-width: 0; box-shadow: rgba(45, 35, 66, 0.4) 0 2px 4px,rgba(45, 35, 66, 0.3) 0 7px 13px -3px,#D6D6E7 0 -3px 0 inset; box-sizing: border-box; color: #36395A; cursor: pointer; display: inline-flex; font-family: "JetBrains Mono", monospace; height: 48px; justify-content: center; line-height: 1; list-style: none; overflow: hidden; padding-left: 16px; padding-right: 16px; position: relative; text-align: left; text-decoration: none; transition: box-shadow .15s, transform .15s; user-select: none; -webkit-user-select: none; touch-action: manipulation; white-space: nowrap; will-change: box-shadow, transform; font-size: 18px;';

                homepageLink.addEventListener('mouseover', () => {
                    homepageLink.style.boxShadow = 'rgba(0, 0, 0, 0.2) 0 2px 4px, rgba(0, 0, 0, 0.1) 0 7px 13px -3px';
                    homepageLink.style.transform = 'scale(1.05)';
                });
                homepageLink.addEventListener('mouseout', () => {
                    homepageLink.style.boxShadow = 'rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px';
                    homepageLink.style.transform = 'scale(1)';
                });

               message.appendChild(homepageLink);
               document.body.appendChild(message);
            }
        }
    }

    removeReelsButton();
    blockReelsPage();

    let timeoutId;
    const observer = new MutationObserver(() => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            removeReelsButton();
            blockReelsPage();
        }, 100);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('popstate', blockReelsPage);
    window.addEventListener('pushstate', blockReelsPage);

})();
