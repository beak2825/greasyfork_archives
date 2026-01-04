// ==UserScript==
// @name         NTUT Portal Force Desktop Version
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  強制北科大入口網站使用桌面版
// @author       zre
// @match        https://nportal.ntut.edu.tw/index.do*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513402/NTUT%20Portal%20Force%20Desktop%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/513402/NTUT%20Portal%20Force%20Desktop%20Version.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 檢查當前 URL 是否包含 forceMobile 參數
    if (!window.location.href.includes('forceMobile=pc')) {
        let currentUrl = new URL(window.location.href);
        let params = currentUrl.searchParams;
        
        // 設置 forceMobile 參數為 pc
        params.append('forceMobile', 'pc');
        
        // 重新導向到新的 URL
        window.location.href = currentUrl.toString();
    }
})();