// ==UserScript==
// @name         One Click PR
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  make pr more quick !
// @author       kevin.ql
// @match        https://dev.sankuai.com/code/repo-detail/*
// @icon         https://p0.meituan.net/travelcube/9215d23b78ead652745defc43dbf7ecc3238.png?domain=eastmoney.com
// @grant        window.location
// @grant        window.alert
// @grant        window.encodeURIComponent
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/434118/One%20Click%20PR.user.js
// @updateURL https://update.greasyfork.org/scripts/434118/One%20Click%20PR.meta.js
// ==/UserScript==

(function() {
    'use strict';

    try {
        const isPrOpen = document.querySelector('.pr-status-tag').textContent.indexOf('开启') > -1

        if (!isPrOpen) {
            window.alert('当前PR不是Open状态哦～')
            return
        }
    
        const title = window.encodeURIComponent(`麻烦帮忙PR，以下是详细内容：`)
        const prContent = window.encodeURIComponent(document.querySelector('.pr-description-container').textContent)
        const prLink = window.location.href
        const prAuthor = window.encodeURIComponent(document.querySelector('.pr-author').textContent)
        const prTitle = window.encodeURIComponent(document.querySelector('.pr-title-container').textContent)

        GM_xmlhttpRequest({
          method: "GET",
          url: `https://yida.fe.dev.sankuai.com/api/runtime?code=98&title=${title}&prTitle=${prTitle}&prLink=${prLink}&prContent=${prContent}&prAuthor=${prAuthor}`,
        });
    } catch (e) {
        window.alert(e && e.message || '发生错误啦～')
    }

    
})();