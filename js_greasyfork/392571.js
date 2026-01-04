// ==UserScript==
// @name         移除知乎页面title
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  删除掉知乎页面的title, 摸鱼用
// @author       sumuzhe
// @match        *://*.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392571/%E7%A7%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E9%A1%B5%E9%9D%A2title.user.js
// @updateURL https://update.greasyfork.org/scripts/392571/%E7%A7%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E9%A1%B5%E9%9D%A2title.meta.js
// ==/UserScript==

(function() {
    'use strict';
    fish();
    setInterval(fish, 2000);
})();

function fish() {
    var titles = document.getElementsByTagName("title");
    for (var i = 0; i < titles.length; i++) {
        titles[i].text = "";
    }
}
