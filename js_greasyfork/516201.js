// ==UserScript==
// @name         Auto-fetch and Save Request Data-YUYE
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically fetch specific request response and save to local
// @author       You
// @match        https://www.canva.com/templates/?category=*
// @grant        GM_download
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516201/Auto-fetch%20and%20Save%20Request%20Data-YUYE.user.js
// @updateURL https://update.greasyfork.org/scripts/516201/Auto-fetch%20and%20Save%20Request%20Data-YUYE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 设置你想拦截的请求URL关键词
    const targetUrlKeyword = 'marketplace2/card/masonry?continuationToken';

    // 2. 拦截并获取指定请求的响应数据
    const open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        this.addEventListener('load', function() {
            // 检查请求的URL是否包含目标关键词
            if (url.includes(targetUrlKeyword)) {
                console.log("Fetched data from URL:", url);

                // 获取响应数据
                const responseData = this.responseText;

                // 保存到本地
                saveToLocal(responseData);
            }
        });
        open.apply(this, arguments);
    };

    // 3. 保存数据到本地文件
    function saveToLocal(data) {
        // 文件名称
        const filename = `response_${Date.now()}.json`;
        // 将数据转换为字符串并保存到本地文件
        const blob = new Blob([JSON.stringify(data, null, 2)], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        // 创建一个临时的链接
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;  // 指定文件名
        document.body.appendChild(a);
        a.click();  // 模拟点击下载
        document.body.removeChild(a);  // 下载后移除临时链接
        URL.revokeObjectURL(url);  // 释放 Blob URL

        // 使用GM_download API下载文件
        GM_download({
            url: 'data:application/json;charset=utf-8,' + encodeURIComponent(data),
            name: filename,
            saveAs: true
        });
    }
})();
