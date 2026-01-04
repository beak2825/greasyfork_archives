// ==UserScript==
// @name         天津理工大学就业信息网去除浮动
// @namespace    http://tjut.bysjy.com.cn/index
// @version      0.1
// @description  去除浮动
// @author       ZZY
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425510/%E5%A4%A9%E6%B4%A5%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E5%B0%B1%E4%B8%9A%E4%BF%A1%E6%81%AF%E7%BD%91%E5%8E%BB%E9%99%A4%E6%B5%AE%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/425510/%E5%A4%A9%E6%B4%A5%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E5%B0%B1%E4%B8%9A%E4%BF%A1%E6%81%AF%E7%BD%91%E5%8E%BB%E9%99%A4%E6%B5%AE%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function () {
        document.getElementById('float_window_0').style.display = 'none';
    }
})();