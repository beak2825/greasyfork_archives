// ==UserScript==
// @name         获取歌曲链接油猴脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  获取歌曲链接
// @author       You
// @license      MIT
// @match        https://www.gequbao.com/music/*
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/491946/%E8%8E%B7%E5%8F%96%E6%AD%8C%E6%9B%B2%E9%93%BE%E6%8E%A5%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/491946/%E8%8E%B7%E5%8F%96%E6%AD%8C%E6%9B%B2%E9%93%BE%E6%8E%A5%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 从 URL 中提取 ID
    const urlParts = window.location.href.split('/');
    const id = urlParts[urlParts.length - 1];

    // 构建 API 请求 URL
    const apiUrl = `https://www.gequbao.com/api/play_url?id=${id}&json=1`;
    console.log(apiUrl)

    GM_xmlhttpRequest({
        method: 'GET',
        url: apiUrl,
        onload: function(response) {
            var data = JSON.parse(response.responseText);
            console.log(data.data.url)
            document.getElementById("music-title").innerHTML="<a href='"+data.data.url+"'>"+data.data.url+"</a>"

        },
        onerror: function() {
            console.log('LP助手请求失败');
        }
    });
})();
