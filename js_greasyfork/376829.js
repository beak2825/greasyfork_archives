// ==UserScript==
// @name         Let's remove youtube title
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  I hate title AT FULLSCREEN. F*** THAT
// @author       Alexandria96
// @match        *.youtube.com/*
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @icon https://stickershop.line-scdn.net/stickershop/v1/product/1100/LINEStorePC/main.png;compress=true
// @grant        none
// @noframes
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/376829/Let%27s%20remove%20youtube%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/376829/Let%27s%20remove%20youtube%20title.meta.js
// ==/UserScript==

'use strict'

let init = () => {
    let targets = [];
    targets = targets.concat(Array.from(document.getElementsByClassName('ytp-gradient-top')));
    targets = targets.concat(Array.from(document.getElementsByClassName('ytp-gradient-bottom')));
    targets = targets.concat(Array.from(document.getElementsByClassName('ytp-chrome-top')));

    for (let i = targets.length - 1; i >= 0; i--) {
        let elem = targets[i];
        if (elem) {
            elem.parentNode.removeChild(elem);
        }
    }
}

let href = '';
setInterval(() => {
    if (location.href !== href) {
        href = location.href;
        let pageLoadingInterval = setInterval(() => {
            if (document.readyState === 'complete') {
                clearInterval(pageLoadingInterval);
                init();
            }
        }, 1000);
    }
}, 1000);