// ==UserScript==
// @name         Line OpenChat 社群跳轉 App 修正 (Firefox Mobile)
// @namespace    https://greasyfork.org/en/users/160457-stan60250
// @version      0.1
// @description  當 Firefox Mobile 瀏覽 Line OpenChat 社群時, 讓跳轉 Line App 按鈕生效
// @author       MapleHuang(stan60250@gmail.com)
// @match        https://line.me/ti/g2/*
// @match        https://line.me/R/ti/g2/*
// @icon         https://line.me/favicon-16x16.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442369/Line%20OpenChat%20%E7%A4%BE%E7%BE%A4%E8%B7%B3%E8%BD%89%20App%20%E4%BF%AE%E6%AD%A3%20%28Firefox%20Mobile%29.user.js
// @updateURL https://update.greasyfork.org/scripts/442369/Line%20OpenChat%20%E7%A4%BE%E7%BE%A4%E8%B7%B3%E8%BD%89%20App%20%E4%BF%AE%E6%AD%A3%20%28Firefox%20Mobile%29.meta.js
// ==/UserScript==
(function () {
    "use strict";
    var special = "line://";
    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        var link = links[i].href;
        if(link.startsWith(special)) {
            var url = link;
            links[i].href = "#";
            links[i].onclick = function() { window.location.href = url; };
        }
    }
})();