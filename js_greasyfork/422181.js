// ==UserScript==
// @name         PR TIMESの画像を高画質化
// @namespace    https://greasyfork.org/users/734481
// @version      1
// @description  PR TIMESに埋め込まれている画像を高解像度なものに差し替えます
// @author       pyokopyoko
// @match        https://prtimes.jp/main/html/rd/p/*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422181/PR%20TIMES%E3%81%AE%E7%94%BB%E5%83%8F%E3%82%92%E9%AB%98%E7%94%BB%E8%B3%AA%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/422181/PR%20TIMES%E3%81%AE%E7%94%BB%E5%83%8F%E3%82%92%E9%AB%98%E7%94%BB%E8%B3%AA%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    document.querySelectorAll("img").forEach(function(e){/\/resize\//.test(e.src)&&(e.src=e.src.replace("/resize/","/ogp/"))});
})();