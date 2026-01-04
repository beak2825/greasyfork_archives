// ==UserScript==
// @name         Comment Extractor
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extract and display comments and images from elements on zno.osvita.ua
// @author       SkeadyD
// @match        https://zno.osvita.ua/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496163/Comment%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/496163/Comment%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to inject the overlay
    function injectOverlay() {
        // Check if the overlay already exists
        if (document.getElementById('comment-extractor-overlay')) {
            return;
        }

        // Create the overlay container
        const overlay = document.createElement('div');
        overlay.id = 'comment-extractor-overlay';
        overlay.style.position = 'absolute';
        overlay.style.top = '10%';
        overlay.style.right = '10%';
        overlay.style.width = '400px';
        overlay.style.height = '500px';
        overlay.style.backgroundColor = 'white';
        overlay.style.border = '1px solid black';
        overlay.style.zIndex = '9999';
        overlay.style.overflowY = 'auto';
        overlay.style.padding = '10px';
        overlay.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        overlay.style.resize = 'both';
        overlay.style.transition = 'transform 0.2s ease-out';
        document.body.appendChild(overlay);

        // Create a header for the overlay
        const header = document.createElement('div');
        header.style.width = '100%';
        header.style.height = '30px';
        header.style.backgroundColor = '#f1f1f1';
        header.style.cursor = 'move';
        header.style.position = 'absolute';
        header.style.top = '0';
        header.style.left = '0';
        overlay.appendChild(header);

        // Create a close button
        const closeButton = document.createElement('div');
        closeButton.innerText = '✖';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '5px';
        closeButton.style.right = '10px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '16px';
        closeButton.style.fontWeight = 'bold';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
        header.appendChild(closeButton);

        // Make the overlay draggable
        header.onmousedown = function(event) {
            event.preventDefault();

            let shiftX = event.clientX - overlay.getBoundingClientRect().left;
            let shiftY = event.clientY - overlay.getBoundingClientRect().top;

            function moveAt(pageX, pageY) {
                overlay.style.left = pageX - shiftX + 'px';
                overlay.style.top = pageY - shiftY + 'px';
            }

            function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);
            }

            document.addEventListener('mousemove', onMouseMove);

            document.onmouseup = function() {
                document.removeEventListener('mousemove', onMouseMove);
                document.onmouseup = null;
            };
        };

        header.ondragstart = function() {
            return false;
        };

        // Create comments container
        const commentsContainer = document.createElement('div');
        commentsContainer.id = 'comments';
        commentsContainer.style.marginTop = '40px'; // Ensure comments don't overlap with header
        overlay.appendChild(commentsContainer);

        // Extract and display comments
        extractComments();

        function extractComments() {
            const elements = document.querySelectorAll("div[id^='commentar_']");
            let extractedComments = [];

            elements.forEach((element, index) => {
                const content = element.innerHTML.trim();
                extractedComments.push({index: index + 1, content: content});
            });

            displayComments(extractedComments);
        }

        function displayComments(comments) {
            commentsContainer.innerHTML = '';

            comments.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.className = 'comment';
                commentElement.style.border = '1px solid #ddd';
                commentElement.style.padding = '10px';
                commentElement.style.marginBottom = '10px';
                commentElement.style.borderRadius = '5px';
                commentElement.style.cursor = 'pointer';
                commentElement.style.transition = 'background-color 0.3s ease';

                const commentHeader = document.createElement('h3');
                commentHeader.innerText = `Comment ${comment.index}`;
                commentElement.appendChild(commentHeader);

                const commentContent = document.createElement('div');
                commentContent.className = 'comment-content';
                commentContent.innerHTML = comment.content;
                commentContent.style.display = 'none';
                commentElement.appendChild(commentContent);

                const images = commentContent.getElementsByTagName("img");
                if (images.length > 0) {
                    for (let img of images) {
                        img.src = `https://zno.osvita.ua${img.getAttribute('src')}`;
                        img.style.maxWidth = "100%";
                        img.style.height = "auto";
                    }
                }

                commentElement.addEventListener('click', () => {
                    commentContent.style.display = commentContent.style.display === 'none' ? 'block' : 'none';
                });

                commentElement.addEventListener('mouseover', () => {
                    commentElement.style.backgroundColor = '#f0f0f0';
                });

                commentElement.addEventListener('mouseout', () => {
                    commentElement.style.backgroundColor = 'white';
                });

                commentsContainer.appendChild(commentElement);
            });
        }
    }

    // Inject the overlay on script load
    injectOverlay();

})();
