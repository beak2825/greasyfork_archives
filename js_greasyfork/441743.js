// ==UserScript==
// @name         自动跳过校园网提醒
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  自动跳过湖北工业大学校园网公告提醒
// @author       摘叶飞镖
// @match        *
// @icon         
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441743/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E6%A0%A1%E5%9B%AD%E7%BD%91%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/441743/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E6%A0%A1%E5%9B%AD%E7%BD%91%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    if (document.documentElement.outerHTML.indexOf("10.0.1.17:8099") != -1) {
        location.reload(true);
    }
})();