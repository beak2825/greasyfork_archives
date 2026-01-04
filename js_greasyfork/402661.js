// ==UserScript==
// @name         FZDM Chapter Portal
// @namespace    https://mutoo.im
// @version      0.1.1
// @description  link the last image to next chapter.
// @author       gmutoo@gmail.com
// @match        https://manhua.fzdm.com/*
// @match        https://manhua.fffdm.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402661/FZDM%20Chapter%20Portal.user.js
// @updateURL https://update.greasyfork.org/scripts/402661/FZDM%20Chapter%20Portal.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function detectElement(selector, interval = 500, retry = 10) {
        return new Promise((resolve, reject) => {
            setTimeout(function detect() {
                let dom = document.querySelector(selector);
                if (dom) {
                    resolve(dom);
                } else if (retry > 0) {
                    setTimeout(detect, interval);
                    retry -= 1;
                } else {
                    reject(`can not found ${selector} on the page`);
                }
            }, interval);
        });
    }

    Promise.all([
        detectElement('.navigation > [href^="../"]', 500, 20),
        detectElement('#mhpic', 500, 20),
    ])
        .then(([nextChapter, image]) => {
        image.style.cursor = "pointer";
        image.addEventListener('click', () => {window.location.href = nextChapter.href;});
    }, err => null);
})();