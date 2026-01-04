// ==UserScript==
// @name         哔咔：新页面打开+列表大图平铺Bika Global showComic Override & Conditional Thumbnail View
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  为方便电脑横屏使用：1. 覆盖原本的点击漫画打开逻辑，现在点击漫画会从新的标签页面打开并且列表页面不会刷新；2. 在漫画列表将图片放大并进行平铺，现在点击漫画图片不会显示放大的图片而是直接打开漫画。Overrides showComic globally to open books in a new tab. Also conditionally applies a full-width thumbnail view with 50px top/bottom margins, and makes both image and text clicks open the book.
// @match        https://manhuabika.com/*
// @match        https://picawang.com/*
// @match        https://manhuapica.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527719/%E5%93%94%E5%92%94%EF%BC%9A%E6%96%B0%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80%2B%E5%88%97%E8%A1%A8%E5%A4%A7%E5%9B%BE%E5%B9%B3%E9%93%BABika%20Global%20showComic%20Override%20%20Conditional%20Thumbnail%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/527719/%E5%93%94%E5%92%94%EF%BC%9A%E6%96%B0%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80%2B%E5%88%97%E8%A1%A8%E5%A4%A7%E5%9B%BE%E5%B9%B3%E9%93%BABika%20Global%20showComic%20Override%20%20Conditional%20Thumbnail%20View.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*****************************
     * 1. Global showComic Override
     *****************************/
    (function overrideGlobalShowComic() {
        function newShowComic(id) {
            // Build the URL using the comic id and open it in a new tab.
            window.open("https://manhuabika.com/pcomicview/?cid=" + id, "_blank");
        }

        try {
            // If showComic is already defined, override it immediately.
            if (typeof window.showComic === "function") {
                window.showComic = newShowComic;
            } else {
                // Use a property getter/setter to intercept future assignments.
                Object.defineProperty(window, 'showComic', {
                    configurable: true,
                    enumerable: true,
                    get: function() {
                        return newShowComic;
                    },
                    set: function(fn) {
                        // Ignore any attempts to reassign showComic.
                    }
                });
            }
        } catch (e) {
            console.error("Error overriding showComic:", e);
        }
    })();

    /*************************************************
     * 2. Conditional Thumbnail View & Event Bindings
     *************************************************/
    function injectStyles() {
        const css = `
            /* Full viewport width and margins on main containers */
            #appCapsule, html, body {
              width: 100vw !important;
              max-width: none !important;
              margin-top: 50px !important;
              margin-bottom: 50px !important;
              padding: 0 !important;
            }
            /* Full-width container for the card list */
            ul.catListview {
              width: 100% !important;
              text-align: center !important;
            }
            /* Each list item becomes a thumbnail cell */
            ul.catListview li {
              display: inline-block !important;
              width: 250px !important;  /* Adjust width for desired cell size */
              margin: 5px !important;
              vertical-align: top !important;
              text-align: left !important;
            }
            /* Force the link to be block-level so content stacks vertically */
            ul.catListview li a {
              display: block !important;
            }
            /* Image wrapper fills its container */
            ul.catListview li .imageWrapper {
              display: block !important;
              width: 100% !important;
              height: auto !important;
            }
            /* Images fill the container */
            ul.catListview li img {
              display: block !important;
              width: 100% !important;
              height: auto !important;
              max-width: none !important;
              object-fit: cover !important;
            }
            /* Truncate title text to 2 lines */
            .comic-title {
              display: -webkit-box !important;
              -webkit-line-clamp: 2 !important;
              -webkit-box-orient: vertical !important;
              overflow: hidden !important;
            }
        `;
        let style = document.getElementById('thumbnailViewStyle');
        if (!style) {
            style = document.createElement('style');
            style.id = 'thumbnailViewStyle';
            style.type = 'text/css';
            style.appendChild(document.createTextNode(css));
            document.head.appendChild(style);
        }
    }

    // Remove any fixed width classes (e.g. w64, w50) from images.
    function removeFixedClasses() {
        document.querySelectorAll('ul.catListview li img').forEach(img => {
            img.classList.remove('w64');
            img.classList.remove('w50');
        });
    }

    // Replace the inline onclick on the ".in" element so that it uses our global showComic.
    function bindInElements() {
        document.querySelectorAll('ul.catListview li .in').forEach(inElem => {
            let onclickVal = inElem.getAttribute('onclick');
            if (onclickVal) {
                // Expected format: showComic('comicID')
                const match = onclickVal.match(/showComic\('([^']+)'\)/);
                if (match && match[1]) {
                    const comicId = match[1];
                    inElem.removeAttribute('onclick');
                    inElem.removeEventListener('click', inElem._customClickHandler);
                    const handler = function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        window.showComic(comicId);
                    };
                    inElem._customClickHandler = handler;
                    inElem.addEventListener('click', handler);
                }
            }
        });
    }

    // Bind click on images so that clicking an image triggers the click on its sibling .in element.
    function bindImageClickToOpenBook() {
        document.querySelectorAll('ul.catListview li img').forEach(img => {
            img.removeAttribute('onclick');
            img.removeEventListener('click', imageClickHandler);
            img.addEventListener('click', imageClickHandler);
        });
    }

    function imageClickHandler(e) {
        e.preventDefault();
        e.stopPropagation();
        const li = this.closest('li');
        if (!li) return;
        const inElem = li.querySelector('.in');
        if (inElem) {
            inElem.click();
        }
    }

    // Check if target elements exist within a .blog-post container.
    function isTargetPresent() {
        return document.querySelector('.blog-post .fab-button.animate.top-center.dropdown') &&
               document.querySelector('.blog-post ul.listview.image-listview.media.mt-5.mb-2.catListview');
    }

    // Initialize the modifications when target elements are present.
    function init() {
        if (isTargetPresent()) {
            injectStyles();
            removeFixedClasses();
            bindInElements();
            bindImageClickToOpenBook();
        }
    }

    // Run on initial page load.
    window.addEventListener('DOMContentLoaded', init);

    // Reapply if new content is loaded (e.g., via infinite scroll).
    const observer = new MutationObserver(() => {
        if (isTargetPresent()) {
            injectStyles();
            removeFixedClasses();
            bindInElements();
            bindImageClickToOpenBook();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();