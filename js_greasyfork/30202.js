// ==UserScript==
// @name         JIRA、Confluence外链新窗口打开
// @namespace    jessezhang1986
// @version      0.1.0
// @description  JIRA、Confluence优化
// @author       jessezhang1986@qq.com
// @include      http*://jira*
// @include      http*://confluence*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30202/JIRA%E3%80%81Confluence%E5%A4%96%E9%93%BE%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/30202/JIRA%E3%80%81Confluence%E5%A4%96%E9%93%BE%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //外链新窗口打开
    $('body').on("click", "a.external-link", function(e){
        if($(e.target).attr('target') != "_blank"){
            $(e.target).attr('target', "_blank");
        }
    });
})();