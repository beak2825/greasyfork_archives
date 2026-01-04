// ==UserScript==
// @name         qq客户端点击链接跳转
// @namespace    none
// @version      0.1
// @description  none
// @author       艾斯托维亚
// @match        https://c.pc.qq.com/middlem.html?*
// @icon         https://mat1.gtimg.com/www/icon/favicon2.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427384/qq%E5%AE%A2%E6%88%B7%E7%AB%AF%E7%82%B9%E5%87%BB%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/427384/qq%E5%AE%A2%E6%88%B7%E7%AB%AF%E7%82%B9%E5%87%BB%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var url = getQueryVariable("pfurl");
    if ("http" == url.substr(0, 4)) {
        console.log(decodeURIComponent(url));
        window.location.href = decodeURIComponent(url);
    } else {
        window.location.href = "http://" + decodeURIComponent(url);
    }
})();

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return (false);
}