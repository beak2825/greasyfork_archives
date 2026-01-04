// ==UserScript==
// @name         某书笔记采集器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  采集某书笔记信息的工具
// @author       Your name
// @match        *://*.xiaohongshu.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/517866/%E6%9F%90%E4%B9%A6%E7%AC%94%E8%AE%B0%E9%87%87%E9%9B%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/517866/%E6%9F%90%E4%B9%A6%E7%AC%94%E8%AE%B0%E9%87%87%E9%9B%86%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    const style = `
        #collector-panel {
            position: fixed;
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
            background: white;
            border: 1px solid black;
            padding: 10px;
            z-index: 9999;
            width: 300px;
            border-radius: 5px;
        }
        #collector-count {
            margin-bottom: 10px;
            font-weight: bold;
        }
        #collected-data {
            width: 100%;
            height: 200px;
            margin-bottom: 10px;
            resize: vertical;
        }
        .collector-btn {
            margin: 5px;
            padding: 5px 10px;
            cursor: pointer;
        }
         #collector-count1 {
            margin-bottom: 10px;
            font-weight: bold;
        }

    `;

    $('<style>').text(style).appendTo('head');

    // 创建采集面板
    const panel = `
        <div id="collector-panel">
            <div id="collector-count1">小某书采集器</div>
            <div id="collector-count">已采集: 0条数据</div>
            <textarea id="collected-data" readonly></textarea>
            <button class="collector-btn" id="copy-btn">复制数据</button>
            <button class="collector-btn" id="reset-btn">重新开始</button>
        </div>
    `;

    $('body').append(panel);

    let collectedData = [];
    let processedUrls = new Set();

    // 复制数据到剪贴板
    $('#copy-btn').click(function() {
        const textarea = document.getElementById('collected-data');
        textarea.select();
        document.execCommand('copy');
        alert('数据已复制到剪贴板！');
    });

    // 重置数据
    $('#reset-btn').click(function() {
        collectedData = [];
        processedUrls = new Set();
        updateDisplay();
        alert('数据已重置！');
    });

    // 更新显示
    function updateDisplay() {
        $('#collector-count').text(`已采集: ${collectedData.length}条数据`);
        // 添加表头
        const header = '作者\t标题\t点赞数\t详情页URL\n';
        const formattedData = header + collectedData.map(item =>
            `${item.author}\t${item.title}\t${item.likes}\t${item.url}`
        ).join('\n');
        $('#collected-data').val(formattedData);
    }

    // 采集数据
    function collectData() {
        $('.note-item').each(function() {
            const $item = $(this);
            const url = $item.find('a.cover').attr('href');

            if (!url || processedUrls.has(url)) return;
            processedUrls.add(url);

            const data = {
                author: $item.find('.author .name').text().trim(),
                title: $item.find('a.title span').text().trim(),
                likes: $item.find('.like-wrapper .count').text().trim(),
                url: 'https://www.xiaohongshu.com' + url
            };

            // 检查数据是否完整
            if (data.author && data.title) {
                collectedData.push(data);
                updateDisplay();
            }
        });
    }

    // 监听DOM变化
    const observer = new MutationObserver((mutations) => {
        collectData();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始采集
    collectData();
})();




