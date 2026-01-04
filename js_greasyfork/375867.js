// ==UserScript==
// @name                mteam adult 新窗口打开
// @author              rachpt
// @version             0.1.4
// @include             https://pt.m-team.cc/adult.php*
// @include             https://pt.m-team.cc//adult.php*
// @include             https://pt.m-team.cc/artist.php*
// @include             https://pt.m-team.cc//artist.php*
// @exclude             https://pt.m-team.cc/adult.php?id=*
// @exclude             https://pt.m-team.cc//adult.php?id=*
// @description         可以在设置中添加自己包含与排除网址
// @namespace           https://greasyfork.org/users/175111
// @icon                https://pt.m-team.cc/favicon.ico
// @grant               none
// @namespace           https://greasyfork.org/users/175111
// @downloadURL https://update.greasyfork.org/scripts/375867/mteam%20adult%20%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/375867/mteam%20adult%20%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

if (window.location.pathname == '/artist.php') {
    var aTag_1 = document.querySelectorAll('td#outer a');
    //table.torrents用于限定a标签的范围
    for (var j = aTag_1.length - 1; j> -1; j--) {
        //去除翻页
        if (! aTag_1[j].getAttribute('href').search("page")) {
            aTag_1[j].setAttribute("target", "_blank");
        }
    }
} else {
    var aTag_2 = document.querySelectorAll('table.torrentname a');
    // table.torrents用于限定a标签的范围
    for (var i = aTag_2.length - 1; i > -1; i--) {
        if (aTag_2[i].getAttribute('title')) {
            aTag_2[i].setAttribute("target", "_blank");
        }
    }
}