// ==UserScript==
// @name         新增百度搜索结果第一条，并可以自定义标题和图片
// @version      1.0.1
// @namespace    https://example.com
// @description  将指定关键词的百度搜索结果新增第一条，并可以自定义标题和图片替换。
// @author       Your Name
// @license      MIT
// @match        https://www.baidu.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/462256/%E6%96%B0%E5%A2%9E%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E7%AC%AC%E4%B8%80%E6%9D%A1%EF%BC%8C%E5%B9%B6%E5%8F%AF%E4%BB%A5%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A0%87%E9%A2%98%E5%92%8C%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/462256/%E6%96%B0%E5%A2%9E%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E7%AC%AC%E4%B8%80%E6%9D%A1%EF%BC%8C%E5%B9%B6%E5%8F%AF%E4%BB%A5%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A0%87%E9%A2%98%E5%92%8C%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 将以下关键词替换为您要搜索的关键词
    var keyword = "example";

    // 获取搜索结果列表
    var resultList = document.getElementById("content_left").getElementsByTagName("div");

    // 获取要替换的内容
    var newTitle = "自定义标题";
    var newImageUrl = "https://img1.baidu.com/it/u=3002880503,594574025&fm=253&fmt=auto&app=138&f=JPEG?w=667&h=500";

    // 创建新的搜索结果元素
    var newResult = document.createElement("div");
    newResult.className = "result c-container";
    newResult.innerHTML = "<h3 class='t'><a href='#'>" + newTitle + "</a></h3><div class='c-abstract'>" + keyword + "</div><div class='c-img'><img src='" + newImageUrl + "'></div>";

    // 替换图片
    var newImage = newResult.getElementsByTagName("img")[0];
    GM_xmlhttpRequest({
        method: "GET",
        url: newImageUrl,
        responseType: "blob",
        onload: function(response) {
            var urlCreator = window.URL || window.webkitURL;
            var imageUrl = urlCreator.createObjectURL(response.response);
            newImage.src = imageUrl;
        }
    });

    // 将新的搜索结果插入到搜索结果列表的第一项
    if (resultList.length > 0) {
        var firstResult = resultList[0];
        firstResult.parentNode.insertBefore(newResult, firstResult);
    }
})();
