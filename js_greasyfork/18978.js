// ==UserScript==
// @name         清除神盾局吧垃圾回复
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  神盾局吧里总会出现一些0经验值用户，发布一些与帖子主题完全无关的回复，同时附上宣传其他网站的签名图。这个脚本用于清除这些垃圾回复。
// @author       Artanis
// @match        *://tieba.baidu.com/p/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18978/%E6%B8%85%E9%99%A4%E7%A5%9E%E7%9B%BE%E5%B1%80%E5%90%A7%E5%9E%83%E5%9C%BE%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/18978/%E6%B8%85%E9%99%A4%E7%A5%9E%E7%9B%BE%E5%B1%80%E5%90%A7%E5%9E%83%E5%9C%BE%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    //'use strict';

    var posts = document.getElementsByClassName("l_post j_l_post l_post_bright");
    for (var i = 0; i < posts.length; ++i)
    {
        var content = JSON.parse(posts[i].getAttribute("data-field"));
        if (content.author.cur_score === 0)
        {
            // 检查是否带签名图
            var img = posts[i].getElementsByClassName("j_user_sign");
            if (img.length === 0)
            {
                continue;
            }

            // 检查贴吧等级
            var titles = posts[i].getElementsByClassName("d_badge_title");
            if (titles.length > 0 && titles[0].textContent === "神盾新秀")
            {
                posts[i].style.display = "none";
            }
        }
    }
})();