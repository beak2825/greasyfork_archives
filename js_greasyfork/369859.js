// ==UserScript==
// @name         10s自动脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://aaa.wkquan2018.com/?Length=7
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369859/10s%E8%87%AA%E5%8A%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/369859/10s%E8%87%AA%E5%8A%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
setInterval(function () {$('#acceptTask').click(); },10000);
})();