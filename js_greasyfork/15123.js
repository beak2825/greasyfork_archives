// ==UserScript==
// @name         屏蔽直播礼物特效
// @version      1.1.5
// @description  自动屏蔽部分直播平台礼物特效，具体看 README
// @author       LisonFan
// @match        *://*.douyu.com/*
// @match        *://*.panda.tv/*
// @match        *://*.zhanqi.tv/*
// @match        *://cc.163.com/*
// @match        *://*.huomao.com/*
// @match        *://live.qq.com/*
// @grant        none
// @namespace	 https://github.com/LisonFan/Shielded-Gift
// @downloadURL https://update.greasyfork.org/scripts/15123/%E5%B1%8F%E8%94%BD%E7%9B%B4%E6%92%AD%E7%A4%BC%E7%89%A9%E7%89%B9%E6%95%88.user.js
// @updateURL https://update.greasyfork.org/scripts/15123/%E5%B1%8F%E8%94%BD%E7%9B%B4%E6%92%AD%E7%A4%BC%E7%89%A9%E7%89%B9%E6%95%88.meta.js
// ==/UserScript==
// test gpg

(function () {
    'use strict';

    document.onreadystatechange = subSomething;

    var hostName = location.href;

    var douyuReg = /douyu.com/;
    var pandaReg = /panda.tv/;
    var zhanqiReg = /zhanqi.tv/;
    var ccReg = /cc.163.com/;
    var huomaoReg = /huomao.com/;
    var liveqqReg = /live.qq.com/;

    function subSomething() {
        if (document.readyState === "complete") {
            if (hostName.search(douyuReg) > 0) {
                douyu();
            } else if (hostName.search(pandaReg) > 0) {
                panda();
            } else if (hostName.search(zhanqiReg) > 0) {
                zhanqi();
            } else if (hostName.search(ccReg) > 0) {
                cc163();
            } else if (hostName.search(huomaoReg) > 0) {
                huomao();
            }
        }
    }

    function douyu() {
        document.getElementById("shie-switch").click(); // 屏蔽所有礼物特效
    }

    function panda() {
        var forbid_chat_gift_status = JSON.parse(localStorage.getItem("panda.tv/user/setting")).forbid_chat_gift;
        var forbid_flash_gift_status = JSON.parse(localStorage.getItem("panda.tv/user/setting")).forbid_flash_gift;
        var forbid_chat_notice_status = JSON.parse(localStorage.getItem("panda.tv/user/setting")).forbid_chat_notice;
        if (forbid_chat_gift_status === "0") {
            document.getElementById("gift-forbid-option-forbid_chat_gift").click(); // 屏蔽聊天框横幅
        }
        if (forbid_flash_gift_status === "0") {
            document.getElementById("gift-forbid-option-forbid_flash_gift").click(); // 屏蔽播放器礼物滚动
        }
        if (forbid_chat_notice_status === "0") {
            document.getElementById("gift-forbid-option-forbid_chat_notice").click(); // 屏蔽聊天框消息通知
        }
    }

    function zhanqi() {
        if (getCookie("beGiftShield") === "0") {
            document.querySelector("#js-gift-shield").click(); // 屏蔽小礼物的显示
        }
    }

    function cc163() {
        // 启用 网易CC 的 HTML5 播放器
        var ccPlayerLocalStorage = localStorage.getItem("cc-player");
        if (!ccPlayerLocalStorage || ccPlayerLocalStorage != "html5") {
            localStorage.setItem("cc-player", "html5");
            window.location.reload();
        }

        document.querySelector("#effectSwitch > div > div:nth-child(1) > ul > li:nth-child(2)").click(); // 屏蔽视频区礼物跑马灯
        document.querySelector("#effectSwitch > div > div:nth-child(1) > ul > li:nth-child(3)").click(); // 屏蔽公屏区横幅特效
    }

    function huomao() {
        document.getElementById("gift_fider").click(); // 屏蔽礼物
    }

    if (hostName.search(liveqqReg) > 0) {
        liveqq();
    }
    function liveqq() {
        document.getElementById("shieSwitch").click();
    }

    function getCookie(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) return unescape(arr[2]);
        return null;
    }
})();
