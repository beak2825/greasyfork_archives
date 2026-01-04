// ==UserScript==
// @name         干掉无聊的贴吧包打听
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  让贴吧网页不再显示这个人工智障的回复
// @author       qh
// @match        https://tieba.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475810/%E5%B9%B2%E6%8E%89%E6%97%A0%E8%81%8A%E7%9A%84%E8%B4%B4%E5%90%A7%E5%8C%85%E6%89%93%E5%90%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/475810/%E5%B9%B2%E6%8E%89%E6%97%A0%E8%81%8A%E7%9A%84%E8%B4%B4%E5%90%A7%E5%8C%85%E6%89%93%E5%90%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var posts = document.getElementsByClassName('l_post');
    for (var i = 0; i < posts.length; i++) {
        if (posts[i].innerText.trim().substring(0,5) == '贴吧包打听') {
            posts[i].style.display = 'none';
        }
    }

})();