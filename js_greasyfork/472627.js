// ==UserScript==
// @name         中兵学堂课时
// @namespace    https://greasyfork.org/zh-CN/scripts/472627
// @version      1.0
// @description  刷课时
// @author       睡神
// @match        *://zh.zhichenghz.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472627/%E4%B8%AD%E5%85%B5%E5%AD%A6%E5%A0%82%E8%AF%BE%E6%97%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/472627/%E4%B8%AD%E5%85%B5%E5%AD%A6%E5%A0%82%E8%AF%BE%E6%97%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 重写 axios.post 函数
    const originalPost = axios.post;
    axios.post = function(url, data, config) {
        if (url.includes('/player/record')) { // 判断请求地址是否是 /player/record
            data.studyProgress.playProcess = 100; // 修改 playProcess 的值为 100
            data.studyProgress.studyTime = data.duration; // 修改 playProcess 的值为 100
            console.log(data);
        }
        return originalPost.call(this, url, data, config);
    };
})();