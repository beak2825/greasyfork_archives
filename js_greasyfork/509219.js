// ==UserScript==
// @name         活动专用
// @author       pigo
// @namespace    http://tampermonkey.net/
// @version      0.5.3
// @description  pig活动专用
// @author       You
// @match        *://*/forums.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509219/%E6%B4%BB%E5%8A%A8%E4%B8%93%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/509219/%E6%B4%BB%E5%8A%A8%E4%B8%93%E7%94%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建悬浮按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.bottom = '20px';
    buttonContainer.style.right = '20px';
    buttonContainer.style.zIndex = '1000';
    document.body.appendChild(buttonContainer);

    // 创建"设置参数"按钮
    const setButton = document.createElement('button');
    setButton.textContent = '设置参数';
    setButton.style.marginRight = '10px';
    setButton.style.padding = '10px';
    setButton.style.backgroundColor = '#007bff';
    setButton.style.color = 'white';
    setButton.style.border = 'none';
    setButton.style.borderRadius = '5px';
    setButton.style.cursor = 'pointer';
    buttonContainer.appendChild(setButton);

    // 创建"开始/停止"按钮
    const startStopButton = document.createElement('button');
    startStopButton.textContent = '开始';
    startStopButton.style.padding = '10px';
    startStopButton.style.backgroundColor = '#28a745';
    startStopButton.style.color = 'white';
    startStopButton.style.border = 'none';
    startStopButton.style.borderRadius = '5px';
    startStopButton.style.cursor = 'pointer';
    buttonContainer.appendChild(startStopButton);
    // 获取当前 URL 中的 topicid
    function getTopicIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('topicid');
    }
    // 获取 localStorage 中的设置
    let topicId = getTopicIdFromUrl() || localStorage.getItem('topicId'); // 首先从 URL 获取，如果不存在则从 localStorage 获取
    let startPage = localStorage.getItem('startPage');
    let endPage = localStorage.getItem('endPage');
    let isRunning = localStorage.getItem('isRunning') === 'true'; // 检查是否正在运行

    // 更新按钮状态
    updateButtonState();

    // 显示工作信息
    showWorkStatus();

    // "设置参数"按钮点击事件
    setButton.addEventListener('click', function () {
        startPage = parseInt(prompt("请输入开始页码：", startPage || "1"), 10) - 1;
        endPage = parseInt(prompt("请输入结束页码：", endPage || ""), 10) - 1;

        // 检查输入是否有效
        if (!topicId || isNaN(startPage) || isNaN(endPage) || startPage > endPage) {
            alert("输入无效，请检查页面范围。");
            return;
        }

        // 存储设置
        localStorage.setItem('topicId', topicId);
        localStorage.setItem('startPage', startPage);
        localStorage.setItem('endPage', endPage);
        localStorage.setItem('startPages', startPage + 1);
        localStorage.setItem('endPages', endPage + 1);

        // 更新工作状态
        showWorkStatus();
    });

    // "开始/停止"按钮点击事件
    startStopButton.addEventListener('click', function () {
        // 检查参数是否已设置
        if (!topicId || startPage === null || endPage === null) {
            alert("请先设置参数再开始。");
            return;
        }

        // 切换运行状态
        isRunning = !isRunning;
        localStorage.setItem('isRunning', isRunning); // 存储运行状态
        updateButtonState();

        if (isRunning) {
            // 如果开始，跳转到指定的起始页面
            window.location.href = `/forums.php?action=viewtopic&topicid=${topicId}&page=${startPage}`;
        } else {
            // 停止时，清除"正在进行中"状态
            clearSettings();
            showWorkStatus();
        }
    });

    // 更新按钮的文本和状态
    function updateButtonState() {
        startStopButton.textContent = isRunning ? '停止' : '开始';
        startStopButton.style.backgroundColor = isRunning ? '#dc3545' : '#28a745';
    }

    // 显示当前工作状态
    function showWorkStatus() {
        let workStatus = document.getElementById('work-status');
        if (!workStatus) {
            workStatus = document.createElement('div');
            workStatus.id = 'work-status';
            workStatus.style.position = 'fixed';
            workStatus.style.top = '20px';
            workStatus.style.right = '20px';
            workStatus.style.padding = '10px';
            workStatus.style.backgroundColor = '#ffc107';
            workStatus.style.color = '#212529';
            workStatus.style.border = '1px solid #ffc107';
            workStatus.style.borderRadius = '5px';
            workStatus.style.zIndex = '1000';
            document.body.appendChild(workStatus);
        }

        if (topicId && startPage !== null && endPage !== null) {
            // 从存储中读取 startPages 和 endPages
            const startPages = parseInt(localStorage.getItem('startPages'), 10);
            const endPages = parseInt(localStorage.getItem('endPages'), 10);
            const currentPage = (parseInt(new URLSearchParams(window.location.search).get('page'), 10) || startPage) + 1;
            workStatus.textContent = `当前设置: Topic ID=${topicId}, 页码范围=${startPages} 到 ${endPages}` +
            (isRunning ? ` - 正在进行中... 当前页: ${currentPage}` : '');
        } else {
            workStatus.textContent = '请设置参数';
        }
    }

    // 开始处理提取数据的功能
    if (isRunning && topicId && startPage !== null && endPage !== null) {
        startProcessing(topicId, parseInt(startPage, 10), parseInt(endPage, 10));
    }

    function startProcessing(topicId, startPage, endPage) {
        // 用于存储提取的用户 ID 和楼层信息
        const userIds = JSON.parse(localStorage.getItem('userIds') || '[]');

        // 获取当前页面的 URL 参数
        const urlParams = new URLSearchParams(window.location.search);
        const currentPage = parseInt(urlParams.get('page'));
        const currentTopicId = urlParams.get('topicid');

        // 如果 topicid 匹配且当前页在指定范围内，提取信息
        if (currentTopicId === topicId && currentPage >= startPage && currentPage <= endPage) {
            // 查找具有特定 style 的所有元素
            const elements = document.querySelectorAll('div[style="margin-top: 8pt; margin-bottom: 8pt;"]');

            elements.forEach(function (element) {
                // 在元素中查找包含 userdetails.php?id= 的链接
                const links = element.querySelectorAll('a[href*="userdetails.php?id="]');

                links.forEach(function (link) {
                    // 获取 href 属性
                    const href = link.getAttribute('href');

                    // 使用正则表达式提取 ID
                    const match = href.match(/userdetails\.php\?id=(\d+)/);
                    if (match && match[1]) {
                        const userId = match[1];
                        const floorNumber = getFloorNumber(element); // 获取楼层信息
                        userIds.push({ page: currentPage + 1, userId: userId, floor: floorNumber }); // 存储页面、ID 和楼层
                    }
                });
            });

            // 将结果存储在 localStorage 中
            localStorage.setItem('userIds', JSON.stringify(userIds));

            // 自动加载下一个页面（如果还在范围内）
            if (currentPage < endPage) {
                setTimeout(() => {
                    window.location.href = `/forums.php?action=viewtopic&topicid=${topicId}&page=${currentPage + 1}`;
                }, 3000); // 延时 3 秒后跳转
            } else {
                // 如果已经是最后一页，下载 CSV 文件并清除设置
                downloadCSV();
                clearSettings();
                location.reload();
            }
        }
    }

    function getFloorNumber(element) {
        // 查找楼层信息，假设楼层信息在 <font class="big"><b>1</b>楼</font> 中
        const floorElement = element.querySelector('font.big b');
        return floorElement ? floorElement.textContent : '未知';
    }

    function downloadCSV() {
        // 构建 CSV 内容
        let csvContent = '页码,UID,楼层\n';
        const userIds = JSON.parse(localStorage.getItem('userIds') || '[]');
        userIds.forEach(item => {
            csvContent += `${item.page},${item.userId},${item.floor}\n`;
        });

        // 创建 Blob 对象
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

        // 创建下载链接
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'user_ids.csv';

        // 触发下载
        link.click();
    }

    // 清除所有设置和状态
    function clearSettings() {
        localStorage.removeItem('userIds');
        localStorage.removeItem('isRunning');
        localStorage.removeItem('topicId');
        localStorage.removeItem('startPage');
        localStorage.removeItem('endPage');
        localStorage.removeItem('startPages');
        localStorage.removeItem('endPages');

        // 更新按钮状态和提示信息
        isRunning = false;
        updateButtonState();
        showWorkStatus();
    }
})();
