// ==UserScript==
// @name         CM3D2 Shop Boughtlist Downloader
// @namespace    http://mizle.net/
// @version      0.1
// @description  CM3D2 Shopの購入済みファイルをブラウザからダウンロード出来るようにします。
// @author       eai04191
// @license      MIT
// @supportURL   https://github.com/eai04191/CM3D2-Shop-Boughtlist-Downloader/issues
// @match        https://cm3d2-shop.s-court.me/boughtlist.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367574/CM3D2%20Shop%20Boughtlist%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/367574/CM3D2%20Shop%20Boughtlist%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll("a[href^='http://localhost:'] ").forEach(function(link){
        let url = link.getAttribute("href");
        let split = url.split("/");
        let newUrl = "http://cm3d2-shop-dl2.s-court.me/api/download.php"+
            "?itemid=" + split[5] +
            "&ott=" + split[7] +
            "&itoken=" + split[9];
        link.setAttribute("href", newUrl);
        $("b:contains('カスタムメイド3D2が起動している状態でないとダウンロードできません。')").css("display", "none");
    });
})();
