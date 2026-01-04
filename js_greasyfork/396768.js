// ==UserScript==
// @name         EnablePIP-bilibili
// @namespace    EnablePIP
// @version      2.2.0
// @description  Enable Picture in Picture mode in Bilibli 在b站中打开画中画模式，使chrome能够使用画中画。
// @author       LXG_Shadow & XenoAmess
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://live.bilibili.com/*
// @run-at       document-end
// @grant        none
// @supportURL   https://github.com/XenoAmess/EnablePIP.git
// @downloadURL https://update.greasyfork.org/scripts/396768/EnablePIP-bilibili.user.js
// @updateURL https://update.greasyfork.org/scripts/396768/EnablePIP-bilibili.meta.js
// ==/UserScript==

var REFRESH_TIME = 500;
var STRING_OPEN_PICTURE_IN_PICTURE = "显示画中画面板";
var STRING_CLOSE_PICTURE_IN_PICTURE = "隐藏画中画面板";
var STRING_ENTER_PICTURE_IN_PICTURE_DIRECT = "直接进入画中画";
var STRING_EXIT_PICTURE_IN_PICTURE_DIRECT = "直接退出画中画";

var BILIBILI_LIVE_REG = RegExp(/^http(s)?:\/\/([a-zA-Z0-9\.]+)?live\.bilibili/);

var IS_BILIBILI_LIVE = (window.location.href.match(BILIBILI_LIVE_REG) != null);
var STRING_POPUP_MENU_SELECTOR = IS_BILIBILI_LIVE ?
    "div.bilibili-live-player > div.bilibili-live-player-context-menu-container > ul" :
    "#bilibiliPlayer > div.bilibili-player-context-menu-container.bilibili-player-context-menu-origin > ul";
var STRING_CONTROL_BAR_SELECTOR = IS_BILIBILI_LIVE ? "div.bilibili-live-player-video-controller" : "div.bilibili-player-video-subtitle";
var STRING_VIDEO_SELECTOR = IS_BILIBILI_LIVE ? "div.bilibili-live-player-video > video" : "div.bilibili-player-video > video";
var STRING_PIC_IN_PIC_SWITCH = "pictureInPictureSwitch";
var STRING_PIC_IN_PIC_DIRECT_SWITCH = "pictureInPictureDirectSwitch";

var b_pipMode = false;
var b_pipMode_direct = false;

function switchPictureInPictureMode() {
    if (b_pipMode) {
        $("video").removeAttr("controls");
        $(STRING_CONTROL_BAR_SELECTOR).css("z-index", "");
        $(STRING_VIDEO_SELECTOR).css("z-index", "");
    } else {
        $("video").attr("controls", "controls");
        $(STRING_CONTROL_BAR_SELECTOR).css("z-index", "-1");
        $(STRING_VIDEO_SELECTOR).css("z-index", "10");
    }
    b_pipMode = !b_pipMode;
    $("#" + STRING_PIC_IN_PIC_SWITCH).text(b_pipMode ? STRING_CLOSE_PICTURE_IN_PICTURE : STRING_OPEN_PICTURE_IN_PICTURE);
}

function switchPictureInPictureModeDirect() {
    if (b_pipMode_direct) {
        document.exitPictureInPicture();
    } else {
        $(STRING_VIDEO_SELECTOR)[0].requestPictureInPicture();
    }
    b_pipMode_direct = !b_pipMode_direct;
    $("#" + STRING_PIC_IN_PIC_DIRECT_SWITCH).text(b_pipMode_direct ? STRING_EXIT_PICTURE_IN_PICTURE_DIRECT : STRING_ENTER_PICTURE_IN_PICTURE_DIRECT);
}

function addToToolBar() {
    if ($(STRING_POPUP_MENU_SELECTOR) != null && document.getElementById(STRING_PIC_IN_PIC_SWITCH) === null) {
        var $il0 = $("<li></li>");
        $il0.addClass("context-line context-menu-function");
        $il0.attr("data-append", "1");
        var $a0 = $("<a></a>");
        $a0.addClass("context-menu-a js-action");
        $a0.attr("title", null);
        $a0.attr("href", "javascript:void(0);");
        $a0.attr("id", STRING_PIC_IN_PIC_SWITCH);
        $a0.attr("data-disabled", "0");
        $a0.text(b_pipMode ? STRING_CLOSE_PICTURE_IN_PICTURE : STRING_OPEN_PICTURE_IN_PICTURE);
        $a0.click(switchPictureInPictureMode);
        $il0.append($a0);
        $(STRING_POPUP_MENU_SELECTOR).append($il0);

        var $il1 = $("<li></li>");
        $il1.addClass("context-line context-menu-function");
        $il1.attr("data-append", "1");
        var $a1 = $("<a></a>");
        $a1.addClass("context-menu-a js-action");
        $a1.attr("title", null);
        $a1.attr("href", "javascript:void(0);");
        $a1.attr("id", STRING_PIC_IN_PIC_DIRECT_SWITCH);
        $a1.attr("data-disabled", "0");
        $a1.text(b_pipMode_direct ? STRING_EXIT_PICTURE_IN_PICTURE_DIRECT : STRING_ENTER_PICTURE_IN_PICTURE_DIRECT);
        $a1.click(switchPictureInPictureModeDirect);
        $il1.append($a1);
        $(STRING_POPUP_MENU_SELECTOR).append($il1);
    }
}

(function () {
    'use strict';
    if (!window.jQuery) {
        var oScript = document.createElement('script');
        oScript.type = "text/javascript";
        oScript.src = "//s1.hdslb.com/bfs/static/jinkela/long/js/jquery/jquery1.7.2.min.js";
        document.head.appendChild(oScript);
    }
    window.onload = window.setInterval(addToToolBar, REFRESH_TIME);
})();