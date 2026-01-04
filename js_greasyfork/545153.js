// ==UserScript==
// @name         广东开放大学 刷课脚本 - 全自动 - 焕新版🚀！
// @namespace    http://blog.arthur.lvvv.cc/
// @version      1.3.8
// @description  广东开放大学 广开  国开实验  广东开放大学 上海开放大学  四川开放大学  成都开放大学 .全自动.全能型.大作业.终考.直播.视频.自动，作业辅导，全能型，能直接使用，请自行尝试使用，专业视频加速解决方案
// @author       arthur
// @match        http://www.wenku8.net/*
// @resource     customCSS https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/5.2.3/css/bootstrap.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/545153/%E5%B9%BF%E4%B8%9C%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%20%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC%20-%20%E5%85%A8%E8%87%AA%E5%8A%A8%20-%20%E7%84%95%E6%96%B0%E7%89%88%F0%9F%9A%80%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/545153/%E5%B9%BF%E4%B8%9C%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%20%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC%20-%20%E5%85%A8%E8%87%AA%E5%8A%A8%20-%20%E7%84%95%E6%96%B0%E7%89%88%F0%9F%9A%80%EF%BC%81.meta.js
// ==/UserScript==

(function(){
    function bubbleSort(arr) {
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                // 交换元素
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}
})();