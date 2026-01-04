// ==UserScript==
// @name         LoveQ 添加播放倍数
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Xiang
// @match        https://www.loveq.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_log
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license      MIT License
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/419621/LoveQ%20%E6%B7%BB%E5%8A%A0%E6%92%AD%E6%94%BE%E5%80%8D%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/419621/LoveQ%20%E6%B7%BB%E5%8A%A0%E6%92%AD%E6%94%BE%E5%80%8D%E6%95%B0.meta.js
// ==/UserScript==

// 设置播放倍数

const audioSelect = "<select id=\"audioSelect\">\n" +
    "    <option value=\"0.5\">0.5</option>\n" +
    "    <option value=\"1\" selected>1.0</option>\n" +
    "    <option value=\"1.25\">1.25</option>\n" +
    "    <option value=\"1.4\">1.4</option>\n" +
    "    <option value=\"1.5\">1.5</option>\n" +
    "    <option value=\"1.6\">1.6</option>\n" +
    "    <option value=\"1.7\">1.7</option>\n" +
    "    <option value=\"1.8\">1.8</option>\n" +
    "    <option value=\"1.9\">1.9</option>\n" +
    "    <option value=\"2\">2.0</option>\n" +
    "    <option value=\"3\">3.0</option>\n" +
    "</select>";

(function () {
    'use strict';
    $(function () {
        //显示倍数倍数
        function showPlayStyle() {

            let downloadDiv = document.getElementsByClassName("pdl2");
            let audioSelectHTML = document.createElement("li");
            audioSelectHTML.innerHTML = audioSelect;
            downloadDiv[0].appendChild(audioSelectHTML);

            // 添加事件监听
            document.getElementById("audioSelect").addEventListener('change', function () {
                //改变速度
                let audios = document.getElementsByTagName("audio");
                audios[1].playbackRate = this.value;
                console.info("播放速度：" + this.value);
            });
        };
        showPlayStyle();
    });

})();

