// ==UserScript==
// @name         虎牙网页版 - 播放界面纯净模式
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  净化虎牙主界面，让直播回归纯净模式
// @author       yaochao
// @match        https://www.huya.com/*
// @icon         https://www.google.com/s2/favicons?domain=huya.com
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.5.0/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444533/%E8%99%8E%E7%89%99%E7%BD%91%E9%A1%B5%E7%89%88%20-%20%E6%92%AD%E6%94%BE%E7%95%8C%E9%9D%A2%E7%BA%AF%E5%87%80%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/444533/%E8%99%8E%E7%89%99%E7%BD%91%E9%A1%B5%E7%89%88%20-%20%E6%92%AD%E6%94%BE%E7%95%8C%E9%9D%A2%E7%BA%AF%E5%87%80%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.$ || $;

    // 屏蔽虎牙 p2p 上传和下载
    //window.RTCPeerConnection = window.webkitRTCPeerConnection = window.mozRTCPeerConnection = null
    window.RTCDataChannel = window.DataChannel = null

    // 定时3秒后，把多余的元素删除，修改部分组件的样式
    setTimeout(function(){
        // 我的关注列表：移除放录像的直播间
        $(".tag-replay,.off").parent().parent().remove()
        $(".btn-more").remove()
        // 选择最高画质的直播流
        $(".player-videotype-list li")[0].click()
    },3000);

})();
