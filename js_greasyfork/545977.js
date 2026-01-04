// ==UserScript==
// @name         Suki-Kira Comment Order Reverser
// @version      1.0
// @description  Reverse comment order on suki-kira.com (from descending to ascending)
// @match        https://suki-kira.com/people/result/*
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/1505333
// @downloadURL https://update.greasyfork.org/scripts/545977/Suki-Kira%20Comment%20Order%20Reverser.user.js
// @updateURL https://update.greasyfork.org/scripts/545977/Suki-Kira%20Comment%20Order%20Reverser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Super Trick: Nur einmal!
    let hasReversed = false;

    // Kommentare umdrehen! Juhu!
    function reverseCommentOrder() {
        if (hasReversed) return; // Nicht nochmal!

        const commentContainer = document.querySelector('.comment.container');
        if (!commentContainer) return;

        const commentElements = commentContainer.querySelectorAll('.comment-container');
        if (commentElements.length === 0) return;

        const fragment = document.createDocumentFragment();
        const elementsArray = Array.from(commentElements);

        for (let i = elementsArray.length - 1; i >= 0; i--) {
            const comment = elementsArray[i];
            let currentElement = comment;

            while (currentElement &&
                   (currentElement.classList.contains('comment-container') ||
                    currentElement.tagName === 'HR' ||
                    currentElement.tagName === 'SCRIPT' ||
                    currentElement.classList.contains('adsbygoogle'))) {

                const nextElement = currentElement.nextElementSibling;
                fragment.appendChild(currentElement);
                currentElement = nextElement;

                if (currentElement && currentElement.classList.contains('comment-container')) {
                    break;
                }
            }
        }

        const firstHr = commentContainer.querySelector('hr');
        if (firstHr && firstHr.nextSibling) {
            commentContainer.insertBefore(fragment, firstHr.nextSibling);
        } else {
            commentContainer.appendChild(fragment);
        }

        hasReversed = true;
        console.log('Kommentare umgedreht! Cool!');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', reverseCommentOrder, { once: true });
    } else {
        reverseCommentOrder();
    }
})();
