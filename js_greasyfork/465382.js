// ==UserScript==
// @name         linovelib restore volumn
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.4.1
// @description  Restore volumn deleted by the detector
// @author       gwsl
// @match        https://*.linovelib.com/novel/*/catalog
// @match        https://*.bilinovel.com/novel/*/catalog
// @match        https://*.linovelib.com/novel/*/*.html
// @match        https://*.bilinovel.com/novel/*/*.html
// @match        https://*.linovelib.com/download/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linovelib.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/465382/linovelib%20restore%20volumn.user.js
// @updateURL https://update.greasyfork.org/scripts/465382/linovelib%20restore%20volumn.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (location.href.endsWith('catalog')) {
        restoreVolumns();
    }

    if (/novel\/\d+\/\d+(_\d+)?.html$/.test(location.href)) {
        restoreChapterContent();
    }
})();

function restoreChapterContent() {
    var content = document.querySelector('#acontent');
    if (content == null) return;

    console.log('observe content display.')
    var config = { attributes: true };
    var observer = new MutationObserver((mutationsList) => {
        for (let record of mutationsList) {
            if (record.type == 'attributes') {
                /** @type {HTMLElement} */
                var target = record.target;
                if (target.style.getPropertyValue('display') == 'none') {
                    target.style.setProperty('display', 'block');
                    target.previousElementSibling?.remove();
                    target.classList.remove('adv-box');
                    console.log('restore chapter content.');
                }
            }
        }
    });
    observer.observe(content, config);
}

function restoreVolumns() {
    var ele = document.querySelector('#volume-list,#volumes');
    if (ele == null) return;

    console.log('observe volumns display.')
    var config = { attributes: true };
    var observer = new MutationObserver((mutationsList) => {
        for (let record of mutationsList) {
            if (record.type == 'attributes') {
                /** @type {HTMLElement} */
                var target = record.target;
                if (target.style.getPropertyValue('display') == 'none') {
                    target.style.setProperty('display', 'block');
                    target.previousElementSibling?.remove();
                    console.log('restore volumns.')
                }
            }
        }
    });
    observer.observe(ele, config);
}