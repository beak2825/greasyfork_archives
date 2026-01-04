// ==UserScript==
// @name         自动刷新MZ首页
// @namespace    bluemz
// @version      0.1
// @description  Auto Refresh
// @author       You
// @match        https://www.managerzone.com/?p=clubhouse
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476275/%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0MZ%E9%A6%96%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/476275/%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0MZ%E9%A6%96%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function() {
        location.reload();
    }, 30 * 60 * 1000);

})();