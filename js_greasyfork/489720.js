// ==UserScript==
// @name         四川凉山专业技术2倍速自动放,高倍没用
// @description  快速代看+VX:zengyi136
// @license       zengyi136
// @version      0.113
// @description  倍速播放_自动播放视频
// @author
// @match        *://www.lszjxjy.com/*
// @grant        none
// @namespace https://greasyfork.org/users/852302
// @downloadURL https://update.greasyfork.org/scripts/489720/%E5%9B%9B%E5%B7%9D%E5%87%89%E5%B1%B1%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF2%E5%80%8D%E9%80%9F%E8%87%AA%E5%8A%A8%E6%94%BE%2C%E9%AB%98%E5%80%8D%E6%B2%A1%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/489720/%E5%9B%9B%E5%B7%9D%E5%87%89%E5%B1%B1%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF2%E5%80%8D%E9%80%9F%E8%87%AA%E5%8A%A8%E6%94%BE%2C%E9%AB%98%E5%80%8D%E6%B2%A1%E7%94%A8.meta.js
// ==/UserScript==


window.onload = function () {
    if (true) {
    setInterval(() => {
    document.querySelector("video").playbackRate = 2;
    var mv = document.getElementById("video");
    mv.play();
    }, 0);
    }
}