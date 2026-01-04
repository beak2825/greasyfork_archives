// ==UserScript==
// @name         抖音视频提取
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  抖音视频自动提取并下载，打开短视频页后0.5s，开始自动下载视频
// @author       You
// @match        https://www.douyin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @require https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        none
// @run-at  document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449431/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/449431/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setTimeout(()=>{
        let arr=document.getElementsByTagName("video");
        let src=arr[arr.length-1].currentSrc;
        saveAs(src, "test.mp4");
    }
    ,500);

    //window.open(src);
})();