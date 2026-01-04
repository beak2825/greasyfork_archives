// ==UserScript==
// @name         Comick.dev Comment Image Minimizer
// @namespace    https://github.com/GooglyBlox
// @version      1.1
// @description  Minimizes images in comments on comick.dev by default
// @author       GooglyBlox
// @match        https://comick.dev/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540889/Comickdev%20Comment%20Image%20Minimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/540889/Comickdev%20Comment%20Image%20Minimizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .comment-image-minimized {
                display: none;
            }

            .comment-image-toggle {
                background: #374151;
                color: #f3f4f6;
                border: 1px solid #4b5563;
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                margin: 4px 0;
                display: inline-block;
                transition: background-color 0.2s;
            }

            .comment-image-toggle:hover {
                background: #4b5563;
            }

            .comment-image-expanded {
                max-width: 300px;
                height: auto;
                border-radius: 4px;
            }

            .imgflip-link-minimized {
                display: none;
            }
        `;
        document.head.appendChild(style);
    }

    function processComments() {
        const comments = document.querySelectorAll('[id^="comment-"]');

        comments.forEach(comment => {
            if (comment.dataset.imageProcessed) return;

            const commentText = comment.querySelector('p.break-words');
            if (!commentText) return;

            const images = commentText.querySelectorAll('img');
            if (images.length === 0) return;

            images.forEach((img, index) => {
                if (img.dataset.minimized) return;

                img.classList.add('comment-image-minimized');
                img.classList.add('comment-image-expanded');
                img.dataset.minimized = 'true';

                const imgflipLinks = commentText.querySelectorAll('a[href*="imgflip.com"]');
                imgflipLinks.forEach(link => {
                    if (link !== img.parentNode) {
                        link.classList.add('imgflip-link-minimized');
                    }
                });

                const toggleButton = document.createElement('button');
                toggleButton.className = 'comment-image-toggle';
                toggleButton.textContent = 'Show Image';
                toggleButton.dataset.imageIndex = index;

                toggleButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    const isMinimized = img.classList.contains('comment-image-minimized');

                    if (isMinimized) {
                        img.classList.remove('comment-image-minimized');
                        imgflipLinks.forEach(link => {
                            if (link !== img.parentNode) {
                                link.classList.remove('imgflip-link-minimized');
                            }
                        });
                        toggleButton.textContent = 'Hide Image';
                    } else {
                        img.classList.add('comment-image-minimized');
                        imgflipLinks.forEach(link => {
                            if (link !== img.parentNode) {
                                link.classList.add('imgflip-link-minimized');
                            }
                        });
                        toggleButton.textContent = 'Show Image';
                    }
                });

                const toggleContainer = document.createElement('div');
                toggleContainer.appendChild(toggleButton);

                img.parentNode.insertBefore(toggleContainer, img);
            });

            comment.dataset.imageProcessed = 'true';
        });
    }

    function init() {
        addStyles();
        processComments();

        const observer = new MutationObserver(function(mutations) {
            let shouldProcess = false;

            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) {
                            if (node.id && node.id.startsWith('comment-')) {
                                shouldProcess = true;
                            } else if (node.querySelector && node.querySelector('[id^="comment-"]')) {
                                shouldProcess = true;
                            }
                        }
                    });
                }
            });

            if (shouldProcess) {
                setTimeout(processComments, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        window.addEventListener('scroll', function() {
            setTimeout(processComments, 250);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();