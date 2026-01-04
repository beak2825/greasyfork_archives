// ==UserScript==
// @name         Search resources in Quark Disk on Douban
// @name:zh-CN   豆瓣页面搜索夸克网盘资源
// @namespace    https://github.com/laiczhang
// @description  在豆瓣电影/电视剧页面显示夸克网盘资源搜索结果。目前推荐夸克网盘vip使用。
// @license      GPL 3.0
// @version      0.2
// @author       laiczhang
// @match        https://movie.douban.com/subject/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/523663/Search%20resources%20in%20Quark%20Disk%20on%20Douban.user.js
// @updateURL https://update.greasyfork.org/scripts/523663/Search%20resources%20in%20Quark%20Disk%20on%20Douban.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取电影/电视剧名称
    const movieTitle = document.querySelector('h1 span:first-child').textContent.trim();

    // 构建请求体
    const requestBody = {
        "style": "get",
        "datasrc": "search",
        "query": {
            "id": "",
            "datetime": "",
            "courseid": 1,
            "categoryid": "",
            "filetypeid": "",
            "filetype": "",
            "reportid": "",
            "validid": "",
            "searchtext": movieTitle
        },
        "page": {
            "pageSize": 10,
            "pageIndex": 1
        },
        "order": {
            "prop": "sort",
            "order": "desc"
        },
        "message": "请求资源列表数据"
    };

    const newDiv = document.createElement('div');

    // 发送 POST 请求
    GM_xmlhttpRequest({
        method: "POST",
        url: "https://v.funletu.com/search",
        data: JSON.stringify(requestBody),
        headers: {
            "Content-Type": "application/json"
        },
        onload: function(response) {
            newDiv.style.marginBottom = '20px';
            newDiv.style.padding = '10px';
            newDiv.style.border = '1px solid #ddd';
            console.log('total',JSON.parse(response.responseText))

            // 将响应结果添加到新的 div 中
            newDiv.innerHTML = `<h3>去其他地方看看：</h3>
            <a href="https://pan.funletu.com/#/s/${movieTitle}/1.html" target="_blank">
            <pre>趣盘搜：${JSON.parse(response.responseText).total | 0}条结果</pre></a>`;

            // 将新的 div 插入到目标位置
            const targetDiv = document.getElementById('subject-doulist');
            targetDiv.parentNode.insertBefore(newDiv, targetDiv);
        },
        onerror: function(error) {
            newDiv.innerHTML = `<h3>Funletu 搜索结果：</h3><p>请求失败</p>`;
            console.error("Request error:", error);
        }
    });
})();
