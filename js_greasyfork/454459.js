// ==UserScript==
// @name         哔哩哔哩直播高能榜
// @namespace    http://tampermonkey.net/
// @version      0.6.1
// @license MIT License
// @description  哔哩哔哩直播高能榜小工具
// @author       Namishibuki
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @match        https://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/454459/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E9%AB%98%E8%83%BD%E6%A6%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/454459/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E9%AB%98%E8%83%BD%E6%A6%9C.meta.js
// ==/UserScript==

(function () {
    'use strict';
    window.onload = function () {
        GM_addStyle(".content.border-box {display: none;}"); //屏蔽"获得轮播资源位推荐奖励！"弹窗
        var id = __NEPTUNE_IS_MY_WAIFU__.roomInitRes.data.uid
        $("#rank-list-ctnr-box li:first").text("高能用户(...)")
        //立即执行一次
        $.ajax({
            type: "get",
            url: "https://api.live.bilibili.com/xlive/general-interface/v1/rank/getOnlineGoldRank?ruid=" + id + "&roomId=1&page=1&pageSize=50",
            success: function (res) {
                $("#rank-list-ctnr-box li:first").text("高能用户(" + res.data.onlineNum + ")")
            }
        })
        //每5s获取一次
        setInterval(function () {
            $.ajax({
                type: "get",
                url: "https://api.live.bilibili.com/xlive/general-interface/v1/rank/getOnlineGoldRank?ruid=" + id + "&roomId=1&page=1&pageSize=50",
                success: function (res) {
                    $("#rank-list-ctnr-box li:first").text("高能用户(" + res.data.onlineNum + ")")
                }
            })
        }, 10000)
    }
    // Your code here...
})();