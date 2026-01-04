// ==UserScript==
// @name         TSDM天使动漫CD封面搜索插件
// @author       MasterJack
// @namespace    https://greasyfork.org/zh-CN/users/833787-masterjack
// @version      1.01
// @description  当鼠标悬停在页面的文本上时，自动搜索该文本并显示相关CD封面。原码使用雅虎JP, 需要使用其他搜索引擎可自行更改"search_first_URL"
// @include      *://www.tsdm39.com/forum.php?mod=forumdisplay&fid=612*
// @include      *://www.tsdm39.com/forum.php?mod=forumdisplay&fid=581*
// @include      *://www.tsdm39.com/forum.php?mod=forumdisplay&fid=356*
// @include      *://www.tsdm39.com/forum.php?mod=forumdisplay&fid=503*
// @include      *://www.tsdm39.com/forum.php?mod=forumdisplay&fid=419*
// @include      *://www.tsdm39.com/forum.php?mod=forumdisplay&fid=612*
// @include      *://www.tsdm39.com/forum.php?mod=forumdisplay&fid=417*
// @include      *://www.tsdm39.com/forum.php?mod=forumdisplay&fid=8*
// @include      *://www.tsdm39.com/forum.php?mod=forumdisplay&fid=334*
// @include      *://www.tsdm39.com/forum.php?mod=forumdisplay&fid=36*
// @include      *://www.tsdm39.com/forum.php?mod=forumdisplay&fid=85*
// @include      *://www.tsdm39.com/forum.php?mod=forumdisplay&fid=467*
// @include      *://www.tsdm39.com/forum.php?mod=forumdisplay&fid=9*
// @include      *://www.tsdm39.com/forum.php?mod=forumdisplay&fid=433*
// @include      *://www.tsdm39.com/forum.php?mod=forumdisplay&fid=63*
// @include      *://www.tsdm39.com/forum.php?mod=forumdisplay&fid=13*
// @include      *://www.tsdm39.com/forum.php?mod=forumdisplay&fid=453*
// @include      *://www.tsdm39.com/forum.php?mod=forumdisplay&fid=247*
// @include      *://www.tsdm39.com/forum.php?mod=forumdisplay&fid=452*
// @include      *://www.tsdm39.com/forum.php?mod=forumdisplay&fid=12*
// @include      *://www.tsdm39.com/forum.php?mod=forumdisplay&fid=249*
// @include      *://www.tsdm39.com/forum.php?mod=forumdisplay&fid=37*
// @include      *://www.tsdm39.com/forum.php?mod=forumdisplay&fid=596*

// @grant        GM_xmlhttpRequest
// @license      GPL version 3
// @downloadURL https://update.greasyfork.org/scripts/500434/TSDM%E5%A4%A9%E4%BD%BF%E5%8A%A8%E6%BC%ABCD%E5%B0%81%E9%9D%A2%E6%90%9C%E7%B4%A2%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/500434/TSDM%E5%A4%A9%E4%BD%BF%E5%8A%A8%E6%BC%ABCD%E5%B0%81%E9%9D%A2%E6%90%9C%E7%B4%A2%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var searchDelay = 200; // 设置延迟时间（以毫秒为单位）
    var searchTimeout; // 用于存储搜索延迟的计时器
       // 创建一个用于显示CD封面的DOM元素
    var coverElement = document.createElement('div5');
    coverElement.style.position = 'fixed';
    coverElement.style.width = '280px'; // 设置固定宽度为200px
    coverElement.style.height = '1000px'; // 设置固定高度为200px
    coverElement.style.background = 'rgba(255, 255, 255, 0)'; // 设置背景为白色
    coverElement.style.opacity = '1'; // 设置不透明度为1
    coverElement.style.transformOrigin = 'top left'; // 设置缩放原点为左上角
    coverElement.style.zIndex = '0'; // 设置元素的层叠顺序为9999
    coverElement.style.left = '-5px'; // 设置固定左边距为10px
    coverElement.style.top = '0px'; // 设置固定上边距为10px

    // 创建一个用于显示CD封面结果的容器
    var resultContainer = document.createElement('div5');
    resultContainer.classList.add('cd-cover-results'); // 添加自定义的CSS类名
    resultContainer.style.padding = '0px'; // 添加内边距，调整样式
    coverElement.appendChild(resultContainer);

    // 将CD封面元素添加到页面
    document.body.appendChild(coverElement);

    // 监听页面的鼠标悬停事件
    document.addEventListener('mouseover', function(event) {
        var target = event.target;
        if ((target.tagName.toLowerCase() === 'th' && target.classList.contains('common')) ||
            (target.tagName.toLowerCase() === 'a' && target.classList.contains('ast'))) {
            var searchText = target.textContent.trim(); // 获取鼠标悬停文本

            // 删除包含方括号内的任意内容
            searchText = searchText.replace(/\[.*?\]/g, '');
            // 删除所有空格
            searchText = searchText.replace(/\s/g, '');
                        // 取消之前的搜索延迟计时器
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(function() {
            // 发起搜索请求
            if (searchText) {
                searchCDCover(searchText, function(response) {
                    // 在CD封面结果容器中显示搜索结果
                    resultContainer.innerHTML = response;
                    // 缩放显示结果到指定大小（例如缩放到宽度为200px，高度为200px）
                    coverElement.style.transform = 'scale(1)';

                });
            }
          }, searchDelay);
        }
        else {
            // 清空CD封面结果容器和缩放样式

            coverElement.style.transform = 'scale(1.0)';
                                document.body.style.zoom = '1.0';
        }
    });

    // 发起搜索请求的函数
    function searchCDCover(searchText, callback) {
        // 替换为实际的搜索请求URL
        var search_first_URL = 'https://search.yahoo.co.jp/image/search?p=+'
        var search_Second_URL = ''
        var searchURL = search_first_URL + encodeURIComponent(searchText) + search_Second_URL+'&result=3';

        GM_xmlhttpRequest({
            method: 'GET',
            url: searchURL,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 13; SM-S908B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36'
            },
            onload: function(response) {
                callback(response.responseText);
            },
            onerror: function(error) {
                console.error('Error fetching CD cover images:', error);
            }
        });
    }
})();