// ==UserScript==
// @name        Base64 Link Decoder for 4chan and Archives
// @match       *://boards.4channel.org/*
// @namespace TOTK
// @version 963.369
// @match       *://boards.4chan.org/*
// @match       *://archived.moe/*
// @license MIT
// @match       *://archiveofsins.com/*
// @grant       none
// @description Decode base64-encoded links in 4chan posts and various archives
// @downloadURL https://update.greasyfork.org/scripts/545978/Base64%20Link%20Decoder%20for%204chan%20and%20Archives.user.js
// @updateURL https://update.greasyfork.org/scripts/545978/Base64%20Link%20Decoder%20for%204chan%20and%20Archives.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Magischer Base64-Finder!
    const base64Regex = /^[A-Za-z0-9+/]{20,}={0,2}$/;

    // Ist das eine URL? Schau mal!
    const isURL = (str) => {
        try {
            return /^https?:\/\//i.test(str);
        } catch (e) {
            return false;
        }
    };

    // Dekodieren und Links machen! Juhu!
    function decodeAndReplace(element) {
        let content = element.innerHTML;
        const lines = content.split(/<br\s*\/?>/i);

        for (let i = 0; i < lines.length; i++) {
            lines[i] = lines[i].replace(/<wbr>/g, '');

            if (base64Regex.test(lines[i])) {
                try {
                    const decoded = atob(lines[i]);

                    if (decoded.includes('http')) {
                        const urls = decoded.split(/[\n\r\s]+/).filter(url => isURL(url));

                        if (urls.length > 0) {
                            lines[i] = urls.map(url => `<a href="${url}" target="_blank">${url}</a>`).join('<br>');
                        } else if (isURL(decoded)) {
                            lines[i] = `<a href="${decoded}" target="_blank">${decoded}</a>`;
                        }
                    } else if (isURL(decoded)) {
                        lines[i] = `<a href="${decoded}" target="_blank">${decoded}</a>`;
                    }
                } catch (e) {}
            } else {
                const parts = lines[i].split(/\s+/);
                for (let j = 0; j < parts.length; j++) {
                    if (base64Regex.test(parts[j])) {
                        try {
                            const decoded = atob(parts[j]);

                            if (decoded.includes('http')) {
                                const urls = decoded.split(/[\n\r\s]+/).filter(url => isURL(url));

                                if (urls.length > 0) {
                                    parts[j] = urls.map(url => `<a href="${url}" target="_blank">${url}</a>`).join('<br>');
                                } else if (isURL(decoded)) {
                                    parts[j] = `<a href="${decoded}" target="_blank">${decoded}</a>`;
                                }
                            } else if (isURL(decoded)) {
                                parts[j] = `<a href="${decoded}" target="_blank">${decoded}</a>`;
                            }
                        } catch (e) {}
                    }
                }
                lines[i] = parts.join(' ');
            }
        }

        element.innerHTML = lines.join('<br>');
    }

    // Neue Posts checken! Hurra!
    function processNewPosts() {
        const posts = document.querySelectorAll('.postMessage');
        posts.forEach(decodeAndReplace);

        const archivePosts = document.querySelectorAll('.text');
        archivePosts.forEach(decodeAndReplace);
    }

    // Los geht's! Script starten!
    function initScript() {
        console.log("Base64 Decoder gestartet! Yeah!");

        processNewPosts();

        // Wie ein Spion beobachten!
        const observer = new MutationObserver((mutations) => {
            let shouldProcess = false;

            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.classList && (
                                node.classList.contains('postContainer') ||
                                node.querySelector('.postMessage')
                            )) {
                                shouldProcess = true;
                            }
                            if (node.classList && (
                                node.classList.contains('post') ||
                                node.querySelector('.text')
                            )) {
                                shouldProcess = true;
                            }
                        }
                    });
                }
            });

            if (shouldProcess) {
                processNewPosts();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // Alle 10 Sekunden gucken! Tick tack!
        setInterval(processNewPosts, 10000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScript);
    } else {
        initScript();
    }
})();
