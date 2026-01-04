// ==UserScript==
// @name         山东驾考自动记住
// @author       Oneton
// @version      2024-02-04
// @description  自动点击山东驾考登录节面的"记住登录信息"
// @match        http*://103.239.155.248:3700/studentCoaInfo
// @match        http*://103.239.155.248:3700/stuLogin
// @match        http*://103.239.155.248:3700/loginOut
// @grant        none
// @namespace https://greasyfork.org/users/1257229
// @downloadURL https://update.greasyfork.org/scripts/486560/%E5%B1%B1%E4%B8%9C%E9%A9%BE%E8%80%83%E8%87%AA%E5%8A%A8%E8%AE%B0%E4%BD%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/486560/%E5%B1%B1%E4%B8%9C%E9%A9%BE%E8%80%83%E8%87%AA%E5%8A%A8%E8%AE%B0%E4%BD%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var box = document.getElementById("remember");
    if (!box.checked) {
        box.click();
    }
})();