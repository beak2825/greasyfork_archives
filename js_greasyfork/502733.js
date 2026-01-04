// ==UserScript==
// @name         自动打开消息中的民主评分链接性能模式
// @namespace    https://greasyfork.org/zh-CN/scripts/502733
// @version      1.5.2
// @description  自动打开消息中的民主评分链接
// @author       小楫轻舟
// @match        http://cms.ahluqiao.com:9090/Portal/SubUnit/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABaUExURTMwMJOOjsjDw4aCgrqzs87IyLWvr0xpcQAAABIRETQyMsK8vKehoaynp4SAgCYkJOjh4f/6+uLa2lRRUTY0NJ+ZmW5qaoiDg3x4eEhGRiYkJJiTk/fw8GJfXxZ3+4sAAAAWdFJOU2n2/O39/v0AC0WD/vz+7V////////4sgfxuAAAAk0lEQVQY02XPyRKEIAwEUEBAEJ0iCbv6/785Llg15fTxHdIdNr7CxtFY1mPNCWbiQomSpdTDZA6wfAPwNSn0ONgDmADAFChE7zU7QQGoRjxw7+UDWKnUiHiDQ9ShpFYpxQuWnajtJexrnC8QHmVNnNafGzm5SPkBAYrcllvutZZjWWBbg+zDzPSZlXA66j7977lXvrUYCtAbaK9PAAAAAElFTkSuQmCC
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11.10.7/dist/sweetalert2.all.min.js     
// @downloadURL https://update.greasyfork.org/scripts/502733/%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E6%B6%88%E6%81%AF%E4%B8%AD%E7%9A%84%E6%B0%91%E4%B8%BB%E8%AF%84%E5%88%86%E9%93%BE%E6%8E%A5%E6%80%A7%E8%83%BD%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/502733/%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E6%B6%88%E6%81%AF%E4%B8%AD%E7%9A%84%E6%B0%91%E4%B8%BB%E8%AF%84%E5%88%86%E9%93%BE%E6%8E%A5%E6%80%A7%E8%83%BD%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取配置值
    let batchSize = GM_getValue('batchSize', 5); // 默认每批次打开 5 个页面
    let delayBetweenBatches = GM_getValue('delayBetweenBatches', 10000); // 默认每批次之间的延迟为 10000 毫秒 (10秒)

    // 添加菜单命令来打开设置界面
    GM_registerMenuCommand('⚙️ 设置', showSettingBox);

    // 显示设置界面
    function showSettingBox() {
        let html = `
            <div class="form-group">
                <label for="batchSizeInput">每批次打开页面数量：</label>
                <input type="number" class="form-control" id="batchSizeInput" value="${batchSize}" min="1" max="100">
            </div>
            <div class="form-group">
                <label for="delayBetweenBatchesInput">每批次之间的延迟（毫秒）：</label>
                <input type="number" class="form-control" id="delayBetweenBatchesInput" value="${delayBetweenBatches}" min="0">
            </div>
        `;

        Swal.fire({
            title: '批次设置',
            html: html,
            icon: 'info',
            showCloseButton: true,
            confirmButtonText: '保存',
        }).then((result) => {
            if (result.isConfirmed) {
                batchSize = parseInt(document.getElementById('batchSizeInput').value);
                delayBetweenBatches = parseInt(document.getElementById('delayBetweenBatchesInput').value);
                GM_setValue('batchSize', batchSize);
                GM_setValue('delayBetweenBatches', delayBetweenBatches);
            }
        });
    }

    let currentIndex = 0;
    let links = [];

    function getLinks() {
        // 查找消息列表中的所有消息项
        const messageItems = document.querySelectorAll('#ulMessage1 li');
        messageItems.forEach(item => {
            const linkElement = item.querySelector('a[onclick^="go"]');
            if (linkElement && linkElement.textContent.includes('送民主评分')) {
                links.push(linkElement);
            }
        });
        console.log(`Found ${links.length} performance assessment links.`);
    }

    function openNextBatch() {
        const endIndex = batchSize > 0 ? Math.min(currentIndex + batchSize, links.length) : links.length;

        for (let i = currentIndex; i < endIndex; i++) {
            const link = links[i];
            if (link) {
                console.log(`Clicking item with text: ${link.textContent}`);
                link.click();
            }
        }

        currentIndex = endIndex;

        if (currentIndex < links.length) {
            // 设置延迟后再打开下一批
            setTimeout(openNextBatch, delayBetweenBatches);
        } else {
            console.log('All links processed.');
        }
    }

    window.addEventListener('load', function() {
        console.log('Page loaded, script running...');
        getLinks();
        if (links.length > 0) {
            openNextBatch();
        } else {
            console.log('No performance assessment links found.');
        }
    });
})();