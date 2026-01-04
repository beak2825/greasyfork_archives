// ==UserScript==
// @name         Copy Leetcode Question
// @namespace    https://ding-project.web.app/
// @version      0.2
// @description  Copy question text from Leetcode
// @author       DingWDev
// @match        *://leetcode.com/problems/*
// @match        *://leetcode.cn/problems/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481060/Copy%20Leetcode%20Question.user.js
// @updateURL https://update.greasyfork.org/scripts/481060/Copy%20Leetcode%20Question.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.onkeydown = function (e) {
        if (e.ctrlKey && e.key == 'c') {
            e.preventDefault();
            var question = (document.querySelector('.elfjS')||document.querySelector('div[data-track-load="description_content"]')).innerText,
                languageEl = document.querySelector('.popover-wrapper button.whitespace-nowrap')||document.querySelector('.notranslate button div>div'),
                language = languageEl?languageEl.innerText:'';
            [].forEach.call(document.querySelectorAll('sup'), function(sup){
                var previousText = sup.previousSibling.textContent;
                question = question.replace(previousText + sup.innerText, previousText + '^' + sup.innerText);
            });
            navigator.clipboard.writeText(('Solve the following question'+ (language?' in '+ language :'') + ':\n\nQuestion:\n' + question));
        }
     }
})();