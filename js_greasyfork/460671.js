// ==UserScript==
// @name         Xxxxx525.com屏蔽广告后点“下载”无效的修复脚本
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  这是一个修复Xxxxx525.com开启屏蔽广告后，点击“立即下载”按钮无效的脚本
// @author       gzlock88@gmail.com
// @match        https://xxxxx520.com/*.html
// @match        https://xxxxx525.com/*.html
// @match        https://download.fourpetal.com/*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xxxxx525.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460671/Xxxxx525com%E5%B1%8F%E8%94%BD%E5%B9%BF%E5%91%8A%E5%90%8E%E7%82%B9%E2%80%9C%E4%B8%8B%E8%BD%BD%E2%80%9D%E6%97%A0%E6%95%88%E7%9A%84%E4%BF%AE%E5%A4%8D%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/460671/Xxxxx525com%E5%B1%8F%E8%94%BD%E5%B9%BF%E5%91%8A%E5%90%8E%E7%82%B9%E2%80%9C%E4%B8%8B%E8%BD%BD%E2%80%9D%E6%97%A0%E6%95%88%E7%9A%84%E4%BF%AE%E5%A4%8D%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.style.overflow = 'inherit';

    const button = document.querySelector("#cao_widget_pay-4 > div.pay--content > div > a");
    const gameId = button.getAttribute('data-id');
    button.style.background = 'green';
    button.innerHTML = button.getInnerHTML()+'(已修复)';
    button.addEventListener('click',()=>{
        window.location.href=`${location.origin}/go?post_id=${gameId}`;
    });
})();