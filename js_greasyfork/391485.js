// ==UserScript==
// @name         Douban imdb to rarbg
// @namespace    https://github.com/lycloudqaq/Douban-imdb-to-rarbg
// @version      1.1
// @description  豆瓣的imdb链接转换为rarbg页面
// @author       lycloud
// @match        https://movie.douban.com/subject/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391485/Douban%20imdb%20to%20rarbg.user.js
// @updateURL https://update.greasyfork.org/scripts/391485/Douban%20imdb%20to%20rarbg.meta.js
// ==/UserScript==


(function () {
    var rarbg = document.querySelectorAll("#info a")
    for (var i = 0; i <= rarbg.length; i++) {
        if (i == rarbg.length - 1) {
            var rarbglink = rarbg[i].innerText;
            rarbg[i].href = "https://rarbgprx.org/torrents.php?imdb=" + rarbglink + "&order=size&by=DESC"; break;
        }
    }
})();