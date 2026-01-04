// ==UserScript==
// @name         巨量广告素材下载
// @namespace    http://tampermonkey.net/
// @version      2024-04-11
// @description  巨量广告方便下载
// @author       You
// @match        https://ad.oceanengine.com/material_center/outer/video_player?token=*
// @icon         https://ad.oceanengine.com/material_center/outer/video_player
// @license      Apache-2.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492318/%E5%B7%A8%E9%87%8F%E5%B9%BF%E5%91%8A%E7%B4%A0%E6%9D%90%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/492318/%E5%B7%A8%E9%87%8F%E5%B9%BF%E5%91%8A%E7%B4%A0%E6%9D%90%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let URLscr = document.querySelector('.video-player>video');

    if (URLscr==''||URLscr==null){
    let item = setTimeout(function() {
    let URL = document.querySelector('.video-player>video').src;
    let link=document.createElement('a');
    link.href = URL;link.download = 'video.mp4';
    link.style.display ='none';document.body.appendChild(link);
    link.click();document.body.removeChild(link);
     }, 1000);
    }else{
    let URL = URLscr.src;
    let link=document.createElement('a');
    link.href = URL;link.download = 'video.mp4';
    link.style.display ='none';document.body.appendChild(link);
    link.click();document.body.removeChild(link);
    }
    // Your code here...
})();
