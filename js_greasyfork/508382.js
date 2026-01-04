// ==UserScript==
// @name        Base64 Link Decoder for 4chan and Archives
// @namespace   Violentmonkey Scripts
// @match       *://boards.4channel.org/*
// @match       *://boards.4chan.org/*
// @match       *://archived.moe/*
// @match       *://archiveofsins.com/*
// @grant       none
// @version     1.0
// @description Decode base64-encoded links in 4chan posts and various archives
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/508382/Base64%20Link%20Decoder%20for%204chan%20and%20Archives.user.js
// @updateURL https://update.greasyfork.org/scripts/508382/Base64%20Link%20Decoder%20for%204chan%20and%20Archives.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const base64Regex = /^[A-Za-z0-9+/]+=*$/;
    const isURL = (str) => /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(str);

    function decodeAndReplace(element) {
        const html = element.innerHTML;
        const modifiedHtml = html.replace(/<wbr>/g, ''); // Remove <wbr> tags
        element.innerHTML = modifiedHtml;

        const textNodes = [];
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }

        textNodes.forEach(node => {
            const parts = node.textContent.split(/\s+/);
            let changed = false;
            for (let i = 0; i < parts.length; i++) {
                if (base64Regex.test(parts[i])) {
                    try {
                        const decoded = atob(parts[i]);
                        if (isURL(decoded)) {
                            parts[i] = `<a href="${decoded}" target="_blank">${decoded}</a>`;
                            changed = true;
                        }
                    } catch (e) {
                        // Not a valid base64 string, skip
                    }
                }
            }
            if (changed) {
                const span = document.createElement('span');
                span.innerHTML = parts.join(' ');
                node.parentNode.replaceChild(span, node);
            }
        });
    }

    function processNewPosts() {
        // For 4chan
        const posts = document.querySelectorAll('.postMessage');
        posts.forEach(decodeAndReplace);

        // For Archives (ArchiveOfSins, Archived.Moe, etc.)
        const archivePosts = document.querySelectorAll('.text');
        archivePosts.forEach(decodeAndReplace);
    }

    function initScript() {
        // Initial processing
        processNewPosts();

        // Watch for new posts
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // For 4chan
                            if (node.classList.contains('postContainer')) {
                                const postMessage = node.querySelector('.postMessage');
                                if (postMessage) decodeAndReplace(postMessage);
                            }
                            // For Archives
                            if (node.classList.contains('post')) {
                                const textElement = node.querySelector('.text');
                                if (textElement) decodeAndReplace(textElement);
                            }
                        }
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Delay script execution by 5 seconds
    setTimeout(initScript, 5000);
})();