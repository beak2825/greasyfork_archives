// ==UserScript==
// @name         Acfun 自动投香蕉
// @version      1.0.3.RELEASE
// @license      GNU GPL v3
// @match        https://www.acfun.cn/v/*
// @match        https://www.acfun.cn/a/*
// @icon         http://cdn.aixifan.com/ico/favicon.ico
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.slim.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/js-cookie/latest/js.cookie.min.js
// @grant        unsafeWindow
// @run-at       document-end

// @namespace https://greasyfork.org/users/394849
// @description 默认视频5蕉/文章1蕉（建议自己控制数量）
// @downloadURL https://update.greasyfork.org/scripts/391992/Acfun%20%E8%87%AA%E5%8A%A8%E6%8A%95%E9%A6%99%E8%95%89.user.js
// @updateURL https://update.greasyfork.org/scripts/391992/Acfun%20%E8%87%AA%E5%8A%A8%E6%8A%95%E9%A6%99%E8%95%89.meta.js
// ==/UserScript==

(function () {
    /*
   1.判断是否已登录
   2.判断是视频/文章
   3.判断是否是自己的稿
   4.判断是否已投蕉
   5.投蕉
   */
    var video = /^https?:\/\/www.acfun.cn\/v\/ac(\d)+$/
    var article = /^https?:\/\/www.acfun.cn\/a\/ac(\d)+$/
    var local_storage = localStorage.user
    
    var if_login = function () {
        return local_storage !== undefined && JSON.parse(local_storage).name !== "游客"
    };

    var mock_click = function (value) {
        if ($(".banana").html() !== "已投蕉") {
            $(".div-banana").children().eq(parseInt(value) - 1).click()
            console.log("投了" + value + "蕉")
        } else {
            console.log("已投过蕉")
        }
    };

    if (video.test(window.location.href) && Cookies.get("auth_key") !== unsafeWindow.videoInfo.user.id) {
        // 给视频投5蕉
        mock_click(5)
    }
    if (article.test(window.location.href) && Cookies.get("auth_key") !== articleInfo.user.id) {
        // 给文章投5蕉
        mock_click(5)
    }
})();