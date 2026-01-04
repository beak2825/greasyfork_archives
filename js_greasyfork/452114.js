// ==UserScript==
// @name         Twitter Blur
// @namespace    https://twitter.com/
// @version      0.2
// @description  Blur images
// @author       magurofly
// @license      CC0-1.0 Universal
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/452114/Twitter%20Blur.user.js
// @updateURL https://update.greasyfork.org/scripts/452114/Twitter%20Blur.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const pattern = /pbs.twimg.com\/media/;
    const blur = 100;

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if ("dataset" in node && node.dataset.testid == "tweetPhoto") {
                    node._mosaic = 100;
                    node._mosaicTimer = null;
                    node.style.filter = `blur(${blur}px)`;
                    const fn = event => {
                        if (node._mosaicTimer) {
                            clearInterval(node._mosaicTimer);
                            node._mosaicTimer = null;
                            event.preventDefault();
                            event.stopPropagation();
                        } else if (node._mosaic > 0) {
                            node._mosaicTimer = setInterval(() => {
                                if (node._mosaic > 0) {
                                    node._mosaic -= 1;
                                    node.style.filter = `blur(${Math.round((node._mosaic / 100)**2 * blur)}px)`;
                                } else {
                                    clearInterval(node._mosaicTimer);
                                    node._mosaicTimer = null;
                                    node.style.filter = "none";
                                }
                            }, 100);
                            event.preventDefault();
                            event.stopPropagation();
                        }
                    };
                    node.addEventListener("click", fn, true);
                    for (const child of node.children) child.addEventListener("click", fn, true);
                }
            }
        }
    });
    observer.observe(unsafeWindow.document.body, {
        childList: true,
        subtree: true,
    });
})();