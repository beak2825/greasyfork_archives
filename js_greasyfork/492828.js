// ==UserScript==
// @name         粉笔填答案
// @namespace    http://tampermonkey.net/
// @version      2024-04-18
// @description  粉笔快速填答案
// @author       Sacker
// @match        https://www.fenbi.com/spa/tiku/exam/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fenbi.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492828/%E7%B2%89%E7%AC%94%E5%A1%AB%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/492828/%E7%B2%89%E7%AC%94%E5%A1%AB%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    new MutationObserver(mutations => mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
            ['p[_ngcontent-fenbi-web-exams-c45].options-material.theme-options-content.font-color-gray-mid',
             'article[_ngcontent-fenbi-web-exams-c45]',
             'article[_ngcontent-fenbi-web-exams-c72]',
             'div[_ngcontent-fenbi-web-exams-c73]',
             'div[_ngcontent-fenbi-web-exams-c74].nav-coll-divider'].forEach(selector =>
                document.querySelectorAll(selector).forEach(element => element.parentNode.removeChild(element))
            );

            document.querySelectorAll('li[_ngcontent-fenbi-web-exams-c45].theme-ques-option').forEach(liTag =>
                Object.assign(liTag.style, {display: 'inline-block', width: '44px', marginTop: '0px', marginBottom: '0px'})
            );
            document.querySelectorAll('label[_ngcontent-fenbi-web-exams-c45].fb-label').forEach(labelTag => labelTag.style.width = '56px');
            document.querySelectorAll('div[_ngcontent-fenbi-web-exams-c45]').forEach(div => div.style.paddingTop = '0px');
            document.querySelectorAll('ul[_ngcontent-fenbi-web-exams-c45]').forEach(ul => ul.style.height = '40px');
        }
    })).observe(document.body, { childList: true, subtree: true });
})();