// ==UserScript==
// @name         WaniKani Forum Instagram Embedder
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Automatically convert Instagram reel URLs into embeddable iframes
// @author       Joeni
// @match        https://community.wanikani.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464105/WaniKani%20Forum%20Instagram%20Embedder.user.js
// @updateURL https://update.greasyfork.org/scripts/464105/WaniKani%20Forum%20Instagram%20Embedder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function convertInstagramPostToEmbed() {
        let composeBox = document.querySelector('.d-editor-input');
        if (composeBox) {
            composeBox.addEventListener('input', function() {
                let postPattern = /(^|[^<])((https:\/\/www\.instagram\.com\/(?:reel|p)\/([a-zA-Z0-9_-]+)\/)([^\s]*))/g;
                let matches = composeBox.value.matchAll(postPattern);

                for (const match of matches) {
                    if (match && match[3]) {
                        let iframePattern = new RegExp(`<iframe src="https://www.instagram.com/p/${match[4]}/embed" width="400" height="480" frameborder="0" scrolling="no" allowtransparency="true"><\\/iframe>`, 'g');
                        let iframeExists = composeBox.value.match(iframePattern);

                        if (!iframeExists) {
                            let iframe = `<iframe src="https://www.instagram.com/p/${match[4]}/embed" width="400" height="480" frameborder="0" scrolling="no" allowtransparency="true"></iframe>`;
                            composeBox.value = composeBox.value.replace(match[2], iframe);
                            break;
                        }
                    }
                }
            });
        }
    }

    function waitForComposeBox() {
        let composeBox = document.querySelector('.d-editor-input');
        if (composeBox) {
            convertInstagramPostToEmbed();
        } else {
            setTimeout(waitForComposeBox, 1000);
        }
    }

    waitForComposeBox();
})();