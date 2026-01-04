// ==UserScript==
// @name         失焦不停止刷课
// @namespace    http://tampermonkey.net/
// @version      V1.0.1
// @description  国资e学静音刷课、失焦不停止
// @author       my200
// @match        https://elearning.tcsasac.com/*
// @icon        
// @grant        none
// @license      GPL
// @run-at doucument-end
// @downloadURL https://update.greasyfork.org/scripts/494132/%E5%A4%B1%E7%84%A6%E4%B8%8D%E5%81%9C%E6%AD%A2%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/494132/%E5%A4%B1%E7%84%A6%E4%B8%8D%E5%81%9C%E6%AD%A2%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==
setInterval(function () {
    var current_video = document.getElementsByTagName('video')[0]
    document.getElementsByTagName("video")[0].playbackRate=1
    current_video.muted = true
    current_video.play()
}, 1000);