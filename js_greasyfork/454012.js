// ==UserScript==
// @name         CSDN 代码复制限制
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于解除 CSDN 博客内代码复制限制
// @author       Bright Xu
// @match        *.csdn.net/*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454012/CSDN%20%E4%BB%A3%E7%A0%81%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/454012/CSDN%20%E4%BB%A3%E7%A0%81%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==
function removeLimit() {
    if (window.csdn) {
        if (window.csdn.copyright) window.csdn.copyright.textData = '';
        if (window.csdn.loginBox) window.csdn.loginBox.show = function(){}
    }
    const d = document.getElementById('article_content');
    if(d) d.style.height = 'unset';
}

(function() {
    'use strict';
    const style = document.createElement('style');
    style.innerHTML = `
    #articleSearchTip, #csdn-redpack, .csdn-redpack-container, .toolbar-advert, .csdn-reapck-select {
        display: none !important;
    }
    .hide-article-box {
        display: none !important;
    }
    #content_views {
        user-select: unset !important;
        -webkit-user-select: unset !important;
    }
    `;
    document.head.append(style);

    if (window.$ !== undefined) $('pre,code').css('user-select', 'unset');

    removeLimit()
    setInterval(function() {
        removeLimit();
    }, 3000);
})();