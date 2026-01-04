// ==UserScript==
// @name         Enhanced Faster Webpage Loading (Optimized)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Optimize webpage loading with native prefetching, priority hints, and lazy loading.
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/506713/Enhanced%20Faster%20Webpage%20Loading%20%28Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/506713/Enhanced%20Faster%20Webpage%20Loading%20%28Optimized%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const EXCLUDED_LINKS = ['/login', '/logout', '/signout', '/signin', '/account', '/auth'];

    // Lazy Load Images, Videos, and Iframes
    function setupLazyLoading(root = document) {
        const lazyElements = root.querySelectorAll("img[data-src], video[data-src], iframe[data-src]");

        function loadLazyElement(el) {
            if (el.dataset.src) {
                el.src = el.dataset.src;
                if (el.tagName.toUpperCase() === "VIDEO") el.load();
                el.removeAttribute("data-src");
            }
        }

        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver((entries, observerInstance) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        loadLazyElement(entry.target);
                        observerInstance.unobserve(entry.target);
                    }
                });
            });
            lazyElements.forEach(el => observer.observe(el));
        } else {
            lazyElements.forEach(loadLazyElement);
        }
    }

    // Prefetch and Prioritize Links
    function enhancePrefetching() {
        document.querySelectorAll("a[href]").forEach(link => {
            const href = link.href;
            if (!EXCLUDED_LINKS.some(excluded => href.includes(excluded)) && !link.hasAttribute("data-no-prefetch")) {
                const prefetch = document.createElement("link");
                prefetch.rel = "prefetch";
                prefetch.href = href;
                prefetch.as = "document";
                document.head.appendChild(prefetch);

                // Use Priority Hints (if supported)
                link.setAttribute("importance", "high");
            }
        });
    }

    // Watch for dynamically added content
    function observeDynamicContent() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        setupLazyLoading(node);
                        enhancePrefetching();
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Initialize Enhancements
    function init() {
        setupLazyLoading();
        enhancePrefetching();
        observeDynamicContent();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();