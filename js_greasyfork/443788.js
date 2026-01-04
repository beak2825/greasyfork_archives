// ==UserScript==
// @name         蛐蛐hook
// @namespace    ququ.taozhiyu.gitee.io
// @version      0.2
// @description  绕过referrer检测
// @author       涛之雨
// @match        *://www.gangqinpu.com/sheetplayer/web.html?*
// @icon         https://www.gangqinpu.com/favicon.ico
// @run-at       document-start
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443788/%E8%9B%90%E8%9B%90hook.user.js
// @updateURL https://update.greasyfork.org/scripts/443788/%E8%9B%90%E8%9B%90hook.meta.js
// ==/UserScript==

(function(){
    'use strict';
    !document.referrer&&(location.href+="");
    GM_addStyle(`.print{display:none!important}`);
})();