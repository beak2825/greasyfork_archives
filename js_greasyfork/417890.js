// ==UserScript==
// @name         修復Udemy Subtitle Google翻譯問題
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fix Udemy Subtitle Translate Bug, Open the Google translate and Viedo transcript to use.
// @author       You
// @match        *://www.udemy.com/course/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417890/%E4%BF%AE%E5%BE%A9Udemy%20Subtitle%20Google%E7%BF%BB%E8%AD%AF%E5%95%8F%E9%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/417890/%E4%BF%AE%E5%BE%A9Udemy%20Subtitle%20Google%E7%BF%BB%E8%AD%AF%E5%95%8F%E9%A1%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (typeof window.i !== 'undefined') { clearInterval(window.i) } else {
        let lastText = ''
        function check() {
            let toEl = $('.well--container--2edq4 span');
            let fromEl = $('p[data-purpose="transcript-cue-active"] span')
            let currentText = fromEl.html()
            if (lastText !== currentText) {
                toEl.html(currentText);
            }
            lastText = fromEl.html()
        }
        window.i = setInterval(check, 200);
    }
})();