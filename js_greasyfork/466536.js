// ==UserScript==
// @name         Fixing Udemy Subtitle Google Translation Issues
// @name:zh-TW   修正 Udemy 字幕的翻譯顯示問題
// @name:zh-CN  修正 Udemy 字幕的翻译显示问题
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Fix Udemy Subtitle Translate Bug, Open the Google translate and Viedo transcript to use.
// @description:zh-tw  修復Udemy Subtitle Translate Bug，打開Google translate和Viedo transcript即可使用。
// @description:zh-cn 修复Udemy Subtitle Translate Bug，打开Google translate和Viedo transcript即可使用。
// @author       You
// @match        *://www.udemy.com/course/*
// @grant        none
// @license MIT
// @require  https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/466536/Fixing%20Udemy%20Subtitle%20Google%20Translation%20Issues.user.js
// @updateURL https://update.greasyfork.org/scripts/466536/Fixing%20Udemy%20Subtitle%20Google%20Translation%20Issues.meta.js
// ==/UserScript==

(function() {
    'use strict';


   var $ = window.jQuery;
    if (typeof window.i !== 'undefined') { clearInterval(window.i) } else {
        let lastText = ''
        function check() {
            // let toEl = $('.well--container--2edq4 span');
            let toEl = $('div[data-purpose="captions-cue-text"]');
            let fromEl = $('p[data-purpose="transcript-cue-active"] span:last')
            let currentText = fromEl.html()
            let subText = $('span[class^="well--text--"]');

            let container = $('div[class^="well--container--"]')
            if (container !== 'undefined')
            {
                container.css('font-size','2em')
            }

            if (lastText !== currentText) {
                if(subText !== 'undefined')
                {
                    subText.html(currentText)
                    subText.css('max-width','100%');

                }
                if(toEl !== 'undefined')
                {
                    toEl.html(currentText);
                    toEl.css('max-width','100%')
                    toEl.css('white-space','inherit')
                    toEl.css('text-align','center')
                }
            }
            lastText = fromEl.html()
        }
        window.i = setInterval(check, 200);
    }
})();