// ==UserScript==
// @name         Voice All Download!!
// @namespace    https://amania.jp
// @version      2024-07-25
// @description  Hololive Voice All Download!!
// @author       amania
// @match        https://shop.hololivepro.com/apps/downloads/customers/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hololivepro.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501757/Voice%20All%20Download%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/501757/Voice%20All%20Download%21%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addDownloadButton() {
        let featureContent = document.querySelector('.feature-content');

        if (featureContent) {
            let button = document.createElement('button');
            button.className = 'feature-play';
            button.style.width = '190px';
            button.innerHTML = '<span>まとめてダウンロード</span>';

            button.onclick = function() {
                all_download();
            };

            featureContent.appendChild(button);
        }
    }

    function all_download() {
        let actionIcons = document.getElementsByClassName('action-icon');

        for (let icon of actionIcons) {
            icon.click();
        }

        setTimeout(() => {
            let anchors = document.getElementsByTagName('a');

            for (let anchor of anchors) {
                let text = anchor.textContent || anchor.innerText;
                if (text.includes('WAV')) {
                    let href = anchor.getAttribute('href');
                    if (href) {
                        window.open(href, '_blank');
                    }
                }
            }
        }, 500);
    }

    window.onload = addDownloadButton;
})();
