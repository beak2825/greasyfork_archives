// ==UserScript==
// @name        a岛板块屏蔽
// @description 记得自己在代码里面改要屏蔽的板块
// @match        http*://adnmb2.com/f/%E6%97%B6%E9%97%B4%E7%BA%BF*
// @match        http*://adnmb2.com/Forum/timeline/page/*
// @match        http*://tnmb.org/f/%E6%97%B6%E9%97%B4%E7%BA%BF*
// @match        http*://tnmb.org/Forum/timeline/page/*
// @version     0.1
// @grant       none
// @namespace https://greasyfork.org/users/186410
// @downloadURL https://update.greasyfork.org/scripts/397150/a%E5%B2%9B%E6%9D%BF%E5%9D%97%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/397150/a%E5%B2%9B%E6%9D%BF%E5%9D%97%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

var HideSections = ["跑团","小说"];        //需要屏蔽的板块

var threads = document.getElementsByClassName("h-threads-item");
var hr = document.getElementsByTagName("hr");
for (i = 0; i < threads.length; i++) {
    var titles = threads[i].getElementsByTagName("spam")[0].innerHTML;
    for (j = 0; j < HideSections.length; j++) {
        if (titles.search(HideSections[j]) != -1) {
            threads[i].style.display="none";
            hr[i].style.display="none";
        }
    }
}

