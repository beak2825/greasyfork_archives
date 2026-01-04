// ==UserScript==
// @name         PTT 404 Redirect to PTTWeb
// @namespace    https://github.com/livinginpurple
// @version      2025.11.27.03
// @description  PTT 網頁 404 的時候 導頁到 PTTWeb
// @license      WTFPL
// @author       livinginpurple
// @match        https://*.ptt.cc/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459162/PTT%20404%20Redirect%20to%20PTTWeb.user.js
// @updateURL https://update.greasyfork.org/scripts/459162/PTT%20404%20Redirect%20to%20PTTWeb.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    console.log(`${GM_info.script.name} is loading.`);
    try {
        const response = await fetch(location.href, { method: 'HEAD' });
        if (!response.ok) {
            // 使用 replace 避免 404 頁面卡在瀏覽器歷史紀錄中
            const newUrl = location.href.replace('ptt.cc', 'pttweb.cc');
            location.replace(newUrl);
        }
    } catch (error) {
        console.error(`${GM_info.script.name} Error: `, error);
    }
    console.log(`${GM_info.script.name} is running.`);
})();