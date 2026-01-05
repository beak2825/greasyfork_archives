// ==UserScript==
// @name         清除贴吧帖子广告
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  清除贴吧帖子里的商业推广楼层。
// @author       Artanis
// @match        *://tieba.baidu.com/p/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22437/%E6%B8%85%E9%99%A4%E8%B4%B4%E5%90%A7%E5%B8%96%E5%AD%90%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/22437/%E6%B8%85%E9%99%A4%E8%B4%B4%E5%90%A7%E5%B8%96%E5%AD%90%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removePostAd() {
        var posts = document.getElementsByClassName("l_post j_l_post l_post_bright");
        for (var i = 0; i < posts.length; ++i)
        {
            var tail = posts[i].getElementsByClassName("p_tail");

            if (tail.length > 0 && tail[0].textContent.indexOf("商业推广") !== -1)
            {
                posts[i].style.display = "none";
            }
        }
    }

    setInterval(function(){ removePostAd(); }, 300);
})();