// ==UserScript==
// @name         No FUCKING ANNOYING pop up website in NCUE
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  goto last page when [Office Library & Information Services, National ChangHua University of Education] give you FUCKING ANNOYING POP UP website
// @match        http://120.107.215.29/web_pop_current.php
// @grant        none
// @run-at       document-start
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/509715/No%20FUCKING%20ANNOYING%20pop%20up%20website%20in%20NCUE.user.js
// @updateURL https://update.greasyfork.org/scripts/509715/No%20FUCKING%20ANNOYING%20pop%20up%20website%20in%20NCUE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 檢查當前頁面是否為指定的 URL
    if (window.location.href === 'http://120.107.215.29/web_pop_current.php') {
        // 如果有上一頁，則返回上一頁
        if (window.history.length > 1) {
            window.history.back();
        } else {
            // 如果沒有上一頁，則嘗試關閉當前分頁
            window.close();
        }
    }
})();

// FUCKING Office Library & Information Services, National ChangHua University of Education.
// Always claim they will remove the FUCKING ANNOYING POP UP website after few days.
// The "few days" always more than zero. I observe these from 2 years ago when I admission.
// The FUCKING ANNOYING POP UP website never give you any useful information.
// The FUCKING ANNOYING POP UP website keep interrupt you by cover the website when you click url.
// The FUCKING ANNOYING POP UP website will make you lose useful information

// FUCKING http://120.107.215.29/web_pop_current.php
// FUCKING http://120.107.215.29/web_pop_current.php
// FUCKING http://120.107.215.29/web_pop_current.php
