// ==UserScript==
// @name         pixiv收藏整理①你的收藏
// @namespace    http://your.homepage/
// @version      0.1
// @description  enter something useful
// @author       You
// @match        https://www.pixiv.net/bookmark.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32697/pixiv%E6%94%B6%E8%97%8F%E6%95%B4%E7%90%86%E2%91%A0%E4%BD%A0%E7%9A%84%E6%94%B6%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/32697/pixiv%E6%94%B6%E8%97%8F%E6%95%B4%E7%90%86%E2%91%A0%E4%BD%A0%E7%9A%84%E6%94%B6%E8%97%8F.meta.js
// ==/UserScript==

if (confirm("是否进行整理？")) {
    var li_temp = document.getElementsByClassName('view_mypixiv')[0].childNodes[1];
    var href_class = li_temp.getElementsByTagName('a')[0];
    var url0 = href_class.href;
    window.location.href = url0;
}