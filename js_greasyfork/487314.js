// ==UserScript==
// @name         bilibili_live_gaoneng
// @namespace    d8e7078b-abee-407d-bcb6-096b59eeac17
// @version      0.0.2
// @description  哔哩哔哩直播高能用户人数
// @author       anonymous
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @match        https://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487314/bilibili_live_gaoneng.user.js
// @updateURL https://update.greasyfork.org/scripts/487314/bilibili_live_gaoneng.meta.js
// ==/UserScript==
const $ = window.jQuery
const retryInterval = 1000
const repeatInterval = 5000
function runWhenReady(readySelector, callback) {
    var tryNow = function() {
        var elem = document.querySelector(readySelector)
        if (elem) {
            callback(elem)
        } else {
            console.log(`Page not ready yet, retrying in ${retryInterval/1000} seconds`)
            setTimeout(tryNow, retryInterval)
        }
    }
    tryNow()
}
function update(id, interval) {
    var url = "https://api.live.bilibili.com/xlive/general-interface/v1/rank/getOnlineGoldRank?ruid=" + id + "&roomId=1&page=1&pageSize=50"
    $.ajax({
        type: "get",
        url: url,
        success: res => {
            $("#rank-list-ctnr-box li:first").text(`高能用户(${res.data.onlineNum})`)
        }
    })
    setTimeout(() => {
        update(id, interval)
    }, interval);
}
(() => {
    'use strict';
    window.onload = function () {
        runWhenReady("#control-panel-ctnr-box", query => {
            GM_addStyle(".content.border-box {display: none;}")
            var dataReportString = $(query).find("div[data-report]").attr("data-report")
            var dataReportObject = JSON.parse(dataReportString)
            var id = dataReportObject.up_id
            if (id) {
                $("#rank-list-ctnr-box li:first").text("高能用户(...)")
                update(id, repeatInterval)
            }
        })
    }
})();