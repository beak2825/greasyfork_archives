// ==UserScript==
// @name         Acfun 自动点赞
// @version      1.0.0.RELEASE
// @license      GNU GPL v3
// @match        https://www.acfun.cn/v/*
// @match        https://www.acfun.cn/a/*
// @icon         http://cdn.aixifan.com/ico/favicon.ico
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.slim.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/js-cookie/latest/js.cookie.min.js
// @grant        unsafeWindow
// @run-at       document-end

// @namespace https://greasyfork.org/users/394849
// @description 点开页面自动点赞
// @downloadURL https://update.greasyfork.org/scripts/429312/Acfun%20%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/429312/Acfun%20%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==
$(document).ready(function(){
 /*
   1.判断是否已登录
   2.判断是视频/文章
   3.判断是否已点过赞
   4.点赞
   */
    var video = /^https?:\/\/www.acfun.cn\/v\/ac(\d)+$/
    var article = /^https?:\/\/www.acfun.cn\/a\/ac(\d)+$/
    var local_storage = localStorage.user

    var if_login = function () {
        return local_storage !== undefined && JSON.parse(local_storage).name !== "游客"
    };

    var mock_click = function(className) {
         var $like = $(className)
             if($like.attr('class').indexOf("active") > 0) {
                 console.log("点过赞了")
             } else {
                 $like.click()
                 console.log("自动点赞")
             }
    }

    if (video.test(window.location.href) && Cookies.get("auth_key") !== unsafeWindow.videoInfo.user.id) {
        // 给视频点赞
        mock_click(".like")
    }
    if (article.test(window.location.href) && Cookies.get("auth_key") !== articleInfo.user.id) {
        // 给文章点赞
        mock_click(".likecount")
    }
})