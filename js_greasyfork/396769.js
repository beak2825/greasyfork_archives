// ==UserScript==
// @name         EnablePIP-icourse163
// @namespace    EnablePIP
// @version      2.2.0
// @description  Enable Picture in Picture mode in icourse163 在icourse163(中国大学MOOC)中打开画中画模式，使chrome能够使用画中画。
// @author       LXG_Shadow & XenoAmess
// @match        https://www.icourse163.org/*
// @run-at       document-end
// @grant        none
// @supportURL   https://github.com/XenoAmess/EnablePIP.git
// @downloadURL https://update.greasyfork.org/scripts/396769/EnablePIP-icourse163.user.js
// @updateURL https://update.greasyfork.org/scripts/396769/EnablePIP-icourse163.meta.js
// ==/UserScript==

var REFRESH_TIME = 500;
var STRING_OPEN_PICTURE_IN_PICTURE = "显示画中画面板";
var STRING_CLOSE_PICTURE_IN_PICTURE = "隐藏画中画面板";
var STRING_ENTER_PICTURE_IN_PICTURE_DIRECT = "直接进入画中画";
var STRING_EXIT_PICTURE_IN_PICTURE_DIRECT = "直接退出画中画";

var STRING_POPUP_MENU_SELECTOR = "div.u-edu-h5player-popmenu > ul";
var STRING_CONTROL_BAR_SELECTOR = "div.m-controlbar.j-controlbar";
var STRING_VIDEO_SELECTOR = "div.u-edu-h5player-mainvideo > video";
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
        $il0.addClass("u-edu-h5player-popmenu_item j-item");
        $il0.text(b_pipMode ? STRING_CLOSE_PICTURE_IN_PICTURE : STRING_OPEN_PICTURE_IN_PICTURE);
        $il0.attr("id", STRING_PIC_IN_PIC_SWITCH);
        $il0.click(switchPictureInPictureMode);
        $(STRING_POPUP_MENU_SELECTOR).append($il0);

        var $il1 = $("<li></li>");
        $il1.addClass("u-edu-h5player-popmenu_item j-item");
        $il1.text(b_pipMode_direct ? STRING_EXIT_PICTURE_IN_PICTURE_DIRECT : STRING_ENTER_PICTURE_IN_PICTURE_DIRECT);
        $il1.attr("id", STRING_PIC_IN_PIC_DIRECT_SWITCH);
        $il1.click(switchPictureInPictureModeDirect);
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