// ==UserScript==
// @name         Microsoft Copilot font family fix
// @name:zh-CN      Microsoft Copilot 字体优化
// @namespace    http://banmiya.com/tamper/bingchat
// @version      1.0.2
// @description  Force set Microsoft Copilot font family as system-ui font
// @description:zh-CN 强制 Microsoft Copilot 的字体为系统字体
// @author       Zhoumin
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @match        https://www.bing.com/chat*
// @match        https://www.bing.com/search*
// @match        https://bing.com/chat*
// @match        https://bing.com/search*
// @match        https://copilot.microsoft.com/*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490526/Microsoft%20Copilot%20font%20family%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/490526/Microsoft%20Copilot%20font%20family%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(':root{--cib-font-text: system-ui!important;}')
})();