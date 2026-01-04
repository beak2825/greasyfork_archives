// ==UserScript==
// @name         zhihuTopBannerRemove
// @namespace    http://yyzg.group/
// @version      0.1
// @description  Remove the top banner of the pages for zhuanlan and question.
// @author       yyzg
// @match        https://www.zhihu.com/question/*
// @match        https://zhuanlan.zhihu.com/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464896/zhihuTopBannerRemove.user.js
// @updateURL https://update.greasyfork.org/scripts/464896/zhihuTopBannerRemove.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const url = window.location.href;
    if (url.match('.*zhuanlan.zhihu.com/p/.*')!=null) {
        document.querySelector('.ColumnPageHeader-Wrapper').style.display='none';
    } else if (url.match('.*zhihu.com/question/.*')!=null) {
        const mutationObserver = new MutationObserver(function(mutations){
            mutations.forEach(function(mutation){
                if(document.querySelector('div.PageHeader').classList.contains('is-shown')){
                    document.querySelector('header[role="banner"]').style.height=0;
                } else {
                    document.querySelector('header[role="banner"]').style.height='';
                }
            });
        });
        document.querySelector('div.PageHeader').style.display='none';
        mutationObserver.observe(document.querySelector('div.PageHeader'),{
            attributes: true
/*             ,characterData: true
            ,childList: true
            ,subtree: true
            ,attributeOldValue: true
            ,characterDataOldValue: true */
        });
    }
})();