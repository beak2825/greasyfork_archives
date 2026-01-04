// ==UserScript==
// @name         GPT清理助手
// @namespace    airbash/GptCleaner
// @author       airbash
// @homepageURL  https://github.com/AirBashX/UserScript
// @version      0.0.2
// @description  每次进入gpt页面,删除之前的聊天记录
// @match        *://*.aichatos.xyz/*
// @license      GPL-3.0
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/478050/GPT%E6%B8%85%E7%90%86%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/478050/GPT%E6%B8%85%E7%90%86%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    "use strict";
    localStorage.removeItem("chatStorage");
})();