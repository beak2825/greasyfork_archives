// ==UserScript==
// @name         Comick.dev Comment Counter
// @namespace    https://github.com/GooglyBlox
// @version      1.3
// @description  Displays a counter for comments on comic pages
// @author       GooglyBlox
// @match        https://comick.dev/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538153/Comickdev%20Comment%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/538153/Comickdev%20Comment%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let observer = null;

    function countComments() {
        const commentsContainer = document.getElementById('comments-container');
        if (!commentsContainer) {
            return 0;
        }

        const commentElements = commentsContainer.querySelectorAll('li > div[id^="comment-"]');
        return commentElements.length;
    }

    function addCounterToRevealButton() {
        const revealButton = document.querySelector('.absolute.left-1\\/2.py-10.-translate-x-1\\/2.blur-0.font-semibold.cursor-pointer.z-10.rounded');

        if (!revealButton || revealButton.dataset.counterAdded) {
            return;
        }

        const commentCount = countComments();

        if (commentCount > 0) {
            const originalText = revealButton.textContent.trim();
            const commentText = commentCount === 1 ? 'comment' : 'comments';
            revealButton.textContent = `${originalText} (${commentCount} ${commentText})`;
            revealButton.dataset.counterAdded = 'true';
        }
    }

    function addCounterToCommentSection() {
        const commentSection = document.getElementById('comment-section');
        if (!commentSection || commentSection.querySelector('.comment-count-header')) {
            return;
        }

        const commentCount = countComments();

        if (commentCount > 0) {
            const countHeader = document.createElement('div');
            countHeader.className = 'comment-count-header px-1 xl:px-0 mb-3';

            const commentText = commentCount === 1 ? 'comment' : 'comments';
            countHeader.innerHTML = `
                <div class="text-sm font-medium text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-2 px-2 md:px-0">
                    ${commentCount} ${commentText}
                </div>
            `;

            const commentsContainer = commentSection.querySelector('.px-1.xl\\:px-0.xl\\:mt-3.relative');
            if (commentsContainer) {
                commentsContainer.parentNode.insertBefore(countHeader, commentsContainer);
            }
        }
    }

    function addMobileCounterToTextarea() {
        const textareaContainer = document.querySelector('.flex.items-center.clear-both.relative');
        if (!textareaContainer || textareaContainer.querySelector('.mobile-comment-count')) {
            return;
        }

        const commentCount = countComments();

        if (commentCount > 0 && window.innerWidth <= 768) {
            const mobileCounter = document.createElement('div');
            mobileCounter.className = 'mobile-comment-count text-xs text-gray-500 dark:text-gray-400 mb-2 px-2';

            const commentText = commentCount === 1 ? 'comment' : 'comments';
            mobileCounter.textContent = `${commentCount} ${commentText} below`;

            textareaContainer.parentNode.insertBefore(mobileCounter, textareaContainer);
        }
    }

    function updateCounter() {
        addCounterToRevealButton();
        addCounterToCommentSection();
        addMobileCounterToTextarea();
    }

    function clearExistingCounters() {
        const revealButton = document.querySelector('.absolute.left-1\\/2.py-10.-translate-x-1\\/2.blur-0.font-semibold.cursor-pointer.z-10.rounded');
        if (revealButton && revealButton.dataset.counterAdded) {
            revealButton.textContent = 'Click to reveal comments';
            delete revealButton.dataset.counterAdded;
        }

        const existingHeader = document.querySelector('.comment-count-header');
        if (existingHeader) {
            existingHeader.remove();
        }

        const existingMobileCounter = document.querySelector('.mobile-comment-count');
        if (existingMobileCounter) {
            existingMobileCounter.remove();
        }
    }

    function handleResize() {
        clearExistingCounters();
        setTimeout(updateCounter, 100);
    }

    function startObserving() {
        if (observer) {
            observer.disconnect();
        }

        observer = new MutationObserver(function(mutations) {
            let shouldUpdate = false;

            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    const addedNodes = Array.from(mutation.addedNodes);

                    const hasCommentChanges = addedNodes.some(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            return node.id === 'comments-container' ||
                                   node.id === 'comment-section' ||
                                   (node.querySelector && (
                                       node.querySelector('#comments-container') ||
                                       node.querySelector('#comment-section') ||
                                       node.querySelector('.flex.items-center.clear-both.relative')
                                   )) ||
                                   (node.id && node.id.startsWith('comment-')) ||
                                   (node.querySelector && node.querySelector('[id^="comment-"]'));
                        }
                        return false;
                    });

                    if (hasCommentChanges) {
                        shouldUpdate = true;
                    }
                }
            });

            if (shouldUpdate) {
                clearExistingCounters();
                setTimeout(updateCounter, 200);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function initializeCounter() {
        setTimeout(() => {
            updateCounter();
            startObserving();
            window.addEventListener('resize', handleResize);
        }, 500);
    }

    function handlePageChange() {
        const currentPath = window.location.pathname;
        const isComicPage = /^\/comic\/[^\/]+\/[^\/]+/.test(currentPath);

        if (isComicPage) {
            clearExistingCounters();
            window.removeEventListener('resize', handleResize);
            initializeCounter();
        } else {
            clearExistingCounters();
            window.removeEventListener('resize', handleResize);
            if (observer) {
                observer.disconnect();
                observer = null;
            }
        }
    }

    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            handlePageChange();
        }
    }).observe(document, { subtree: true, childList: true });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', handlePageChange);
    } else {
        handlePageChange();
    }
})();