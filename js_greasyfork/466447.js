// ==UserScript==
// @name         成都信息工程大学课程中心助手
// @namespace    https://kczx.cuit.edu.cn/learn/
// @version      1.0.0
// @author       ooyq
// @description  成都信息工程大学课程中心网课助手 自动完成视频课程/文档
// @match        https://kczx.cuit.edu.cn/learn/course/spoc/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @license      Apache License 2.0
// @downloadURL https://update.greasyfork.org/scripts/466447/%E6%88%90%E9%83%BD%E4%BF%A1%E6%81%AF%E5%B7%A5%E7%A8%8B%E5%A4%A7%E5%AD%A6%E8%AF%BE%E7%A8%8B%E4%B8%AD%E5%BF%83%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/466447/%E6%88%90%E9%83%BD%E4%BF%A1%E6%81%AF%E5%B7%A5%E7%A8%8B%E5%A4%A7%E5%AD%A6%E8%AF%BE%E7%A8%8B%E4%B8%AD%E5%BF%83%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取URL中的courseId和subsectionId
    var urlParts = window.location.href.match(/\/spoc\/([a-zA-Z0-9]+)\/([a-zA-Z0-9]+)/);
    var courseId = urlParts[1];
    var subsectionId = urlParts[2];

    // 构建获取id的URL
    var idUrl = "https://kczx.cuit.edu.cn/learn/v1/learningsituation?courseId=" + courseId + "&subsectionId=" + subsectionId;

    // 获取id
    GM_xmlhttpRequest({
        method: "GET",
        url: idUrl,
        onload: function(response) {
            var data = JSON.parse(response.responseText);

            // 获取id
            var id = data.data.id;

            // 构建学习情况状态页面的URL
            var statusUrl = "https://kczx.cuit.edu.cn/learn/v1/learningsituation/status?id=" + id + "&status=2";

            // 获取学习情况状态页面的数据
            GM_xmlhttpRequest({
                method: "GET",
                url: statusUrl,
                onload: function(response) {
                    var statusData = JSON.parse(response.responseText);

                    // 判断学习情况状态页面的数据内容
                    if (statusData.status === 200 && statusData.message === "OK") {
                        // 如果课程已完成，则显示通知
                        GM_notification({
                            text: "课程已完成，请刷新查看",
                            title: "课程状态",
                            timeout: 2000, // 持续显示通知的时间（毫秒）
                            silent: true // 静音通知，不会发出声音
                        });
                    }
                }
            });
        }
    });
})();