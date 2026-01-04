// ==UserScript==
// @name         Bellesa Download
// @name:zh-CN   Bellesa Download
// @namespace    uuvvser
// @version      0.9
// @description  Download videos from www.bellesa.co.
// @description:zh-cn 下载www.bellesa.co站点的视频。
// @author       uuvvser
// @match        https://www.bellesa.co/videos/*
// @grant        none
// @run-at       context-menu
// @downloadURL https://update.greasyfork.org/scripts/395891/Bellesa%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/395891/Bellesa%20Download.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var blurl=document.querySelector("video source[type='video/mp4']").src;
    var bltitle=document.querySelectorAll("h2")[0].textContent;
    var bldom=document.querySelectorAll("h2")[0];
    var newdom=document.createElement("a");
    newdom.textContent="DOWNLOAD";
    newdom.href=blurl;
    newdom.download=bltitle;
    newdom.target="_blank";
    bldom.appendChild(newdom);
})();
