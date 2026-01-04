// ==UserScript==
// @name         "app.kuaijing" free
// @namespace    http://tampermonkey.net/
// @version      2025-01-07T11:44
// @description  "app.kuaijing" free. Automatically remove elements with class "ant-modal-root"
// @author       Sufjan
// @match        *://app.kuaijingai.com/*
// @grant        none
// @license      Sufjan
// @downloadURL https://update.greasyfork.org/scripts/522973/%22appkuaijing%22%20free.user.js
// @updateURL https://update.greasyfork.org/scripts/522973/%22appkuaijing%22%20free.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("\"app.kuaijing\" free");

    // 定义一个函数，用于删除 class="ant-modal-root" 的整个元素
    function removeAntModalRootElements() {
        const elements = document.querySelectorAll('.ant-modal-root');
        elements.forEach(element => {
            if(element.innerHTML.indexOf('到期提醒') !== -1) element.remove();
        });
        console.log(`Removed ${elements.length} ant-modal-root element(s).`);
    }

    removeAntModalRootElements();

    setInterval(() => {
        console.log("Executing periodic check...");
        removeAntModalRootElements();
    }, 2000);

})();