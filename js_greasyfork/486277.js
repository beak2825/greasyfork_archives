// ==UserScript==
// @name         Tự động làm mới trang
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Tự động làm mới trang sau mỗi 15 phút
// @author       Cáo
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486277/T%E1%BB%B1%20%C4%91%E1%BB%99ng%20l%C3%A0m%20m%E1%BB%9Bi%20trang.user.js
// @updateURL https://update.greasyfork.org/scripts/486277/T%E1%BB%B1%20%C4%91%E1%BB%99ng%20l%C3%A0m%20m%E1%BB%9Bi%20trang.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    const refreshIntervalInMinutes = 15;
    const refreshIntervalInMillis = refreshIntervalInMinutes * 60 * 1000;
    function refreshPage() {
        location.reload(true);
    }
    setInterval(refreshPage, refreshIntervalInMillis);
})();