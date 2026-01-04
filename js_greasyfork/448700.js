// ==UserScript==
// @name         300百合会快速翻页
// @namespace    https://bbs.yamibo.com
// @version      0.5
// @description  按键盘左右键翻页
// @author       whitewagtail
// @include      /https?://bbs.yamibo.com/(thread|forum)*
// @icon         https://www.yamibo.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448700/300%E7%99%BE%E5%90%88%E4%BC%9A%E5%BF%AB%E9%80%9F%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/448700/300%E7%99%BE%E5%90%88%E4%BC%9A%E5%BF%AB%E9%80%9F%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let nxt = document.getElementsByClassName('nxt')[0];
    let prev = document.getElementsByClassName('prev')[0];
    document.addEventListener('keydown', function (e) {
        let inputs = [];
        Object.values(document.getElementsByTagName('input')).map(input=>{inputs.push(input)});
        Object.values(document.getElementsByTagName('textarea')).map(input=>{inputs.push(input)});
        if (!inputs.includes(document.activeElement)) {
            let keyCode = event.keyCode;
            if (keyCode === 37 && prev) { prev.click() }
            if (keyCode === 39 && nxt) { nxt.click() }
        }
    })
})();