// ==UserScript==
// @name         刷课专用
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @license      AGPL-3.0
// @description  视频自动播放静音
// @author       Tenfond
// @match        http*://www.icourse163.org/*
// @match        http*://*.chaoxing.com/*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/443220/%E5%88%B7%E8%AF%BE%E4%B8%93%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/443220/%E5%88%B7%E8%AF%BE%E4%B8%93%E7%94%A8.meta.js
// ==/UserScript==
 
(style => {
    style.innerHTML = "div#j-anchorContainer" +
        "{display: none !important; height: 0 !important; width: 0 !important; visibility: hidden !important; max-height: 0 !important; max-width: 0 !important; opacity: 0 !important;}";
    document.head.insertBefore(style, document.head.firstChild);
})(document.createElement("style"));
 
setInterval(() => {
    for (let video of document.querySelectorAll("video")) {
        window.focus();
        document.body.focus();
        video.muted = true;
        video.playbackRate = 2;
        video.play();
    }
}, 300);