// ==UserScript==
// @name         Enlarge the control bar while watching Zoom Recordings
// @name:zh-TW   放大Zoom錄像工具欄
// @name:zh-CN   放大Zoom录像工具栏
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Bigger is better, isn't it?
// @description:zh-cn  让移动设备更好点击
// @description:zh-TW  讓觸屏設備更好點擊
// @author       You
// @match        *.zoom.us/rec/play/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433320/Enlarge%20the%20control%20bar%20while%20watching%20Zoom%20Recordings.user.js
// @updateURL https://update.greasyfork.org/scripts/433320/Enlarge%20the%20control%20bar%20while%20watching%20Zoom%20Recordings.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function enlarge(){
        const bar = document.getElementsByClassName("vjs-control-bar")[0];

        bar.style["zoom"] = "2.5";
    }

    window.addEventListener('load', enlarge, false);
})();