// ==UserScript==
// @name         AlertReset
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  配合郑州轻工业大学打卡脚本食用。
// @author       Troublemaker
// @match        https://msg.zzuli.edu.cn/morn/view*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zzuli.edu.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449426/AlertReset.user.js
// @updateURL https://update.greasyfork.org/scripts/449426/AlertReset.meta.js
// ==/UserScript==
(function AlertReset() {
    window.alert = function () {
        return true;
    }
})();