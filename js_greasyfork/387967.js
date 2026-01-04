// ==UserScript==
// @name         取消所有輸入框禁用狀態
// @namespace    https://zfdev.com/
// @version      0.1
// @description  定時每隔1秒，檢測網頁是否有禁用的輸入框，並取消禁用狀態。
// @author       ZFDev
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387967/%E5%8F%96%E6%B6%88%E6%89%80%E6%9C%89%E8%BC%B8%E5%85%A5%E6%A1%86%E7%A6%81%E7%94%A8%E7%8B%80%E6%85%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/387967/%E5%8F%96%E6%B6%88%E6%89%80%E6%9C%89%E8%BC%B8%E5%85%A5%E6%A1%86%E7%A6%81%E7%94%A8%E7%8B%80%E6%85%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(()=>document.querySelectorAll('input[disabled]').forEach(e=> e.disabled=false),1000)
})();