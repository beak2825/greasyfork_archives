// ==UserScript==
// @name         B站（bilibili）自动续播因未登录而暂停的视频 (Bilibili: Continue playing without logging-in)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  解决B站（bilibili）因未登录而自动暂停视频并弹出登录窗口的问题 / Solve the problem of Bilibili automatically pausing video and popping up a login window because it is not logged in
// @author       TheBeacon
// @match        https://www.bilibili.com/video/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462122/B%E7%AB%99%EF%BC%88bilibili%EF%BC%89%E8%87%AA%E5%8A%A8%E7%BB%AD%E6%92%AD%E5%9B%A0%E6%9C%AA%E7%99%BB%E5%BD%95%E8%80%8C%E6%9A%82%E5%81%9C%E7%9A%84%E8%A7%86%E9%A2%91%20%28Bilibili%3A%20Continue%20playing%20without%20logging-in%29.user.js
// @updateURL https://update.greasyfork.org/scripts/462122/B%E7%AB%99%EF%BC%88bilibili%EF%BC%89%E8%87%AA%E5%8A%A8%E7%BB%AD%E6%92%AD%E5%9B%A0%E6%9C%AA%E7%99%BB%E5%BD%95%E8%80%8C%E6%9A%82%E5%81%9C%E7%9A%84%E8%A7%86%E9%A2%91%20%28Bilibili%3A%20Continue%20playing%20without%20logging-in%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var target = document.getElementsByClassName("bpx-player-row-dm-wrap")[0];
    var config = {attributes: true, attributeFilter: ["class"]};
    var observer = new MutationObserver(function(motationList, observer) {
        setTimeout(function(){
            if (document.getElementsByClassName("bili-mini-mask").length > 0) {
                // console.log("captured!");
                // console.log(motationList[0]);
                document.getElementsByClassName("bili-mini-close-icon")[0].click();
                if (document.getElementsByClassName("bili-paused").length > 0) {
                    document.getElementsByClassName("bpx-player-ctrl-btn bpx-player-ctrl-play")[0].click();
                } //else {
                  //  console.log("but do nothing");
                //}
                observer.takeRecords();
            }
        }, 1000);
    });
    observer.observe(target, config);
})();