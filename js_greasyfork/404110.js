// ==UserScript==
// @name         知乎Pure Reader
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Delete useless elements and clear login form when it appears
// @author       https://github.com/McCarthey
// @match        *://*.zhihu.com/question/*
// @match        *://*.zhihu.com/p/*
// @match        *://link.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404110/%E7%9F%A5%E4%B9%8EPure%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/404110/%E7%9F%A5%E4%B9%8EPure%20Reader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    jumpDirectly();

    displayNone(['.QuestionHeader-title','.ColumnPageHeader','.like','.RichContent-actions', '.AdblockBanner','.AppHeade', 'header','.Question-sideColumn.Question-sideColumn--sticky' ])

    function displayNone(eles) {
        eles.forEach((ele) => {
            if(document.querySelector(ele)) {
                document.querySelector(ele).style.display = 'none'
            }
        })
    };

    setInterval(() => {
        const btn = document.querySelector('.Button.Modal-closeButton.Button--plain');
        if (btn) {
            btn.click();
            document.querySelector('html').style.overflow = 'auto'
        }
    }, 100);

    function jumpDirectly () {
        if(location.href.includes('link.zhihu.com/?target=')) {
            const linkBtn = document.querySelector('.actions .button')
            linkBtn.click()
        }
    }
})();