// ==UserScript==
// @name         PC Web端 Bilibili直播 高能用户数量显示
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  使用触发请求方式获取全部高能用户数量，然后加到高能用户后
// @author       NyanKoSenSei
// @license      MIT
// @match        *://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @compatible   chrome
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449429/PC%20Web%E7%AB%AF%20Bilibili%E7%9B%B4%E6%92%AD%20%E9%AB%98%E8%83%BD%E7%94%A8%E6%88%B7%E6%95%B0%E9%87%8F%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/449429/PC%20Web%E7%AB%AF%20Bilibili%E7%9B%B4%E6%92%AD%20%E9%AB%98%E8%83%BD%E7%94%A8%E6%88%B7%E6%95%B0%E9%87%8F%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

window.onload = function() {
    // 延时是为了适配某些老版本内核的浏览器先加载完毕window.__NEPTUNE_IS_MY_WAIFU__.roomInitRes对象
    setTimeout(function() {
        // 获取ruid（uid）和roomId（room_id）
        var nowRuid = window.__NEPTUNE_IS_MY_WAIFU__.roomInitRes.data.uid;
        var nowRoomID = window.__NEPTUNE_IS_MY_WAIFU__.roomInitRes.data.room_id;
        // 定义URL
        var hotUserUrl = "https://api.live.bilibili.com/xlive/general-interface/v1/rank/getOnlineGoldRank?ruid=" + nowRuid + "&roomId=" + nowRoomID + "&page=1&pageSize=1";
        // 创建Ajax对象
        var hotUserXmlHttp = new XMLHttpRequest();
        // 页面初始化出来以后也需要先刷一下
        refreshHotUserSize();

        // 给高能用户区域绑定鼠标移入事件
        $("#rank-list-ctnr-box > div:eq(1)").mouseenter(function(){
            // 检查当前是否指向的是高能用户列表，排除掉选中大航海页签的时候刷新
            if ($("#rank-list-ctnr-box > div > ul > li:eq(0)").hasClass("active")) {
                // 触发刷新
                refreshHotUserSize();
            }
        });

        // 刷新高能用户数量
        function refreshHotUserSize() {
            // 创建请求
            hotUserXmlHttp.open("GET", hotUserUrl, false);
            // 发送Get请求
            hotUserXmlHttp.send();
            // 从返回值内获取总数量
            if (hotUserXmlHttp.response !== undefined && hotUserXmlHttp.response !== '') {
                var hotUserSize = JSON.parse(hotUserXmlHttp.response).data.onlineNum;
                // 重定义
                $("#rank-list-ctnr-box > div > ul > li:eq(0)").text("高能用户(" + hotUserSize + ")");
            }
        }
    }, 3000);
};