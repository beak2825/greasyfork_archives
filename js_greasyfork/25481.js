// ==UserScript==
// @name         自动放大Phabricator图片
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://codes.growingio.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25481/%E8%87%AA%E5%8A%A8%E6%94%BE%E5%A4%A7Phabricator%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/25481/%E8%87%AA%E5%8A%A8%E6%94%BE%E5%A4%A7Phabricator%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function autoReplace(e) {
        e.target.value = e.target.value.replace(/\{F(\w+)\}/g, '{F$1, size=full}');
    }
    var tts = document.querySelectorAll('textarea');
    for (var i = 0; i < tts.length; i++) {
        if (tts[i].classList.contains("remarkup-assist-textarea")) {
            tts[i].addEventListener('input', autoReplace);
            console.log('listening', tts[i]);
        }
    }
    // Your code here...
})();