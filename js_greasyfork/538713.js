// ==UserScript==
// @name         B站弹幕查询器（查发布者）
// @namespace    PyHaoCoder
// @version      1.2
// @description  通过B站视频查询弹幕并查找指定用户，未经授权禁止修改、分发或商业用途
// @author       PyHaoCoder
// @icon         https://www.bilibili.com/favicon.ico
// @match        https://www.bilibili.com/video/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      api.bilibili.com
// @license      Proprietary
// @copyright    2025, PyHaoCoder (All Rights Reserved)
// @downloadURL https://update.greasyfork.org/scripts/538713/B%E7%AB%99%E5%BC%B9%E5%B9%95%E6%9F%A5%E8%AF%A2%E5%99%A8%EF%BC%88%E6%9F%A5%E5%8F%91%E5%B8%83%E8%80%85%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/538713/B%E7%AB%99%E5%BC%B9%E5%B9%95%E6%9F%A5%E8%AF%A2%E5%99%A8%EF%BC%88%E6%9F%A5%E5%8F%91%E5%B8%83%E8%80%85%EF%BC%89.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // 定时器间隔时间（单位：毫秒）
    const intervalTime = 1000; // 5秒

    // ==================== 获取视频CID ====================
    function fetchCID() {
        const bvid = location.href.split('/')[4].split('?')[0];
        const url = `https://api.bilibili.com/x/player/pagelist?bvid=${bvid}&jsonp=jsonp`

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (response) {
                // 获取页面内容
                const pageContent = response.responseText;
                const data = JSON.parse(pageContent);
                if (data.data) {
                    // 获取视频CID
                    window._cid = data.data[0].cid; // 更新全局变量
                    console.log('获取视频CID:', window._cid);

                    // 更新 _url
                    if (!window._url || location.href !== _url) {
                        window._url = location.href;
                    }
                } else {
                    console.error('获取视频CID失败');
                }
            },
            onerror: function (err) {
                console.log('获取视频CID失败:' + err.statusText);
            }
        });
    }

    // 隐藏表格
    function hideTable() {
        const container = document.getElementById('resultContainer')
        container.style.display = "none"
    }

    // 初始化定时器
    function startTimer() {
        setInterval(() => {
            // 如果 _url 未定义或当前 URL 不等于 _url，则更新 CID
            if (window._url && location.href !== window._url) {
                fetchCID();
                hideTable();
            }
        }, intervalTime);
    }

    // 首次初始化
    fetchCID();

    // 启动定时器
    startTimer();
})();

(function () {
    'use strict';

    // ==================== 哈希转换模块 ====================
    window.BiliBili_midcrc = function () {
        'use strict';
        const CRCPOLYNOMIAL = 0xEDB88320;
        const startTime = new Date().getTime(),
            crctable = new Array(256),
            create_table = function () {
                let crcreg,
                    i, j;
                for (i = 0; i < 256; ++i) {
                    crcreg = i;
                    for (j = 0; j < 8; ++j) {
                        if ((crcreg & 1) != 0) {
                            crcreg = CRCPOLYNOMIAL ^ (crcreg >>> 1);
                        } else {
                            crcreg >>>= 1;
                        }
                    }
                    crctable[i] = crcreg;
                }
            },
            crc32 = function (input) {
                if (typeof (input) != 'string')
                    input = input.toString();
                let crcstart = 0xFFFFFFFF, len = input.length, index;
                for (let i = 0; i < len; ++i) {
                    index = (crcstart ^ input.charCodeAt(i)) & 0xff;
                    crcstart = (crcstart >>> 8) ^ crctable[index];
                }
                return crcstart;
            },
            crc32lastindex = function (input) {
                if (typeof (input) != 'string')
                    input = input.toString();
                let crcstart = 0xFFFFFFFF, len = input.length, index;
                for (let i = 0; i < len; ++i) {
                    index = (crcstart ^ input.charCodeAt(i)) & 0xff;
                    crcstart = (crcstart >>> 8) ^ crctable[index];
                }
                return index;
            },
            getcrcindex = function (t) {
                for (let i = 0; i < 256; i++) {
                    if (crctable[i] >>> 24 == t)
                        return i;
                }
                return -1;
            },
            deepCheck = function (i, index) {
                let tc = 0x00, str = '',
                    hash = crc32(i);
                tc = hash & 0xff ^ index[2];
                if (!(tc <= 57 && tc >= 48))
                    return [0];
                str += tc - 48;
                hash = crctable[index[2]] ^ (hash >>> 8);
                tc = hash & 0xff ^ index[1];
                if (!(tc <= 57 && tc >= 48))
                    return [0];
                str += tc - 48;
                hash = crctable[index[1]] ^ (hash >>> 8);
                tc = hash & 0xff ^ index[0];
                if (!(tc <= 57 && tc >= 48))
                    return [0];
                str += tc - 48;
                hash = crctable[index[0]] ^ (hash >>> 8);
                return [1, str];
            };
        create_table();
        const index = new Array(4);

        // 单次转换函数
        const singleConvert = function (input) {
            let ht = parseInt('0x' + input) ^ 0xffffffff,
                snum, i, lastindex, deepCheckData;
            for (i = 3; i >= 0; i--) {
                index[3 - i] = getcrcindex(ht >>> (i * 8));
                snum = crctable[index[3 - i]];
                ht ^= snum >>> ((3 - i) * 8);
            }
            for (i = 0; i < 100000000; i++) {
                lastindex = crc32lastindex(i);
                if (lastindex == index[3]) {
                    deepCheckData = deepCheck(i, index)
                    if (deepCheckData[0])
                        break;
                }
            }

            if (i == 100000000)
                return -1;
            return i + '' + deepCheckData[1];
        };

        // 批量转换函数
        const batchConvert = function (hashArray) {
            return hashArray.map(function (hash) {
                return singleConvert(hash);
            });
        };

        return {
            singleConvert: singleConvert, // 单次转换
            batchConvert: batchConvert   // 批量转换
        };
    };
})();

(function () {
    'use strict';

    // ==================== 油猴脚本主逻辑 ====================
    // 创建UI界面
    function createUI() {
        const style = `
        <style>
            .bili-parser-container {
                position: fixed;
                z-index: 9999;
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0,0,0,0.2);
                width: 350px;
                cursor: default;
                transition: transform 0.1s ease-out;
                will-change: transform;
                display: none;
            }
            .bili-parser-header {
                cursor: move;
                padding: 10px 0;
                margin: -10px 0 10px;
                border-bottom: 1px solid #eee;
            }
            #resultContainer {
                max-height: 400px;
                overflow-y: auto;
                margin-top: 0;
                display: none;
            }
            .bili-input {
                width: 100%;
                padding: 8px 0;
                margin: 0 0 8px;
                border: 1px solid #ddd;
                box-sizing: border-box;
            }
            #keywordInput.bili-input {
              padding-left: 8px;
              padding-right: 8px;
            }
            .bili-btn {
                background: #00a1d6;
                color: white;
                border: none;
                padding: 8px 15px;
                cursor: pointer;
                width: 100%;
                box-sizing: border-box;
            }
            .result-table {
                width: 100%;
                border-collapse: collapse;
                display: block;
            }
            .result-table td, .result-table th {
                border: 1px solid #ddd;
                padding: 8px;
                font-size: 12px;
            }
            .bili-toggle-icon {
                position: fixed;
                top: 70px;
                right: 20px;
                z-index: 9998;
                width: 40px;
                height: 40px;
                background: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 0 10px rgba(0,0,0,0.2);
                user-select: none;
                padding: 8px;
            }
            .bili-toggle-icon:hover {
                background: #f0f0f0;
            }
            .bili-toggle-icon img {
                pointer-events: none;
            }
            .time-jump {
                cursor: pointer;
                color: #00a1d6;
                text-decoration: underline;
            }
            .time-jump:hover {
                color: #0084b4;
            }
        </style>
    `;

        const html = `
        <div class="bili-toggle-icon">
            <img src="https://www.bilibili.com/favicon.ico" width="24" height="24">
        </div>
        <div class="bili-parser-container">
           <div class="bili-parser-header"><h3>B站弹幕查询器 <span style="float: right;">By: @PyHaoCoder</span></h3></div>
            <input type="text" class="bili-input" id="keywordInput" placeholder="输入要查找的关键字">
            <button class="bili-btn" id="startSearch">开始搜索</button>
            <div id="resultContainer"></div>
        </div>
    `;

        document.body.insertAdjacentHTML('afterbegin', style + html);

        // 添加悬浮窗移动功能
        addDragFunctionality();

        // 添加图标点击事件
        document.querySelector('.bili-toggle-icon').addEventListener('click', function() {
            const container = document.querySelector('.bili-parser-container');
            if (container.style.display === 'none' || !container.style.display) {
                updateSearchBoxPosition();
                container.style.display = 'block';
            } else {
                container.style.display = 'none';
                document.getElementById('resultContainer').style.display = 'none';
            }
        });
    }

    // 更新搜索框位置（根据图标位置智能调整）
    function updateSearchBoxPosition() {
        const icon = document.querySelector('.bili-toggle-icon');
        const container = document.querySelector('.bili-parser-container');

        const iconRect = icon.getBoundingClientRect();
        const iconCenterX = iconRect.left + iconRect.width / 2;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // 判断图标在屏幕的位置
        const screenLeftThreshold = windowWidth * 0.3;
        const screenRightThreshold = windowWidth * 0.7;

        if (iconCenterX < screenLeftThreshold) {
            // 图标在左侧，搜索框显示在右侧
            container.style.left = `${iconRect.left + iconRect.width + 10}px`;
            container.style.right = 'auto';
            container.style.top = `${iconRect.top}px`;
        } else if (iconCenterX > screenRightThreshold) {
            // 图标在右侧，搜索框显示在左侧
            container.style.right = `${windowWidth - iconRect.left + 10}px`;
            container.style.left = 'auto';
            container.style.top = `${iconRect.top}px`;
        } else {
            // 图标在中间，搜索框显示在下方
            container.style.left = `${iconRect.left + iconRect.width/2 - container.offsetWidth/2}px`;
            container.style.right = 'auto';
            container.style.top = `${iconRect.top + iconRect.height + 10}px`;

            // 检查是否超出底部边界
            const containerBottom = iconRect.top + iconRect.height + 10 + container.offsetHeight;
            if (containerBottom > windowHeight) {
                // 如果超出底部，则显示在上方
                container.style.top = `${iconRect.top - container.offsetHeight - 10}px`;
            }
        }
    }

    // ==================== 添加悬浮窗移动功能 ====================
    function addDragFunctionality() {
        const container = document.querySelector('.bili-parser-container');
        const header = document.querySelector('.bili-parser-header');
        const icon = document.querySelector('.bili-toggle-icon');

        let isDraggingIcon = false;
        let isDraggingContainer = false;
        let startX, startY, initialX, initialY;

        // 图标拖动功能
        icon.addEventListener('mousedown', (e) => {
            isDraggingIcon = true;
            startX = e.clientX;
            startY = e.clientY;
            initialX = icon.offsetLeft;
            initialY = icon.offsetTop;

            // 防止文本选中
            document.body.style.userSelect = 'none';
            document.body.style.webkitUserSelect = 'none';
            e.stopPropagation();
        });

        // 搜索框拖动功能
        header.addEventListener('mousedown', (e) => {
            isDraggingContainer = true;
            startX = e.clientX;
            startY = e.clientY;
            initialX = container.offsetLeft;
            initialY = container.offsetTop;

            // 防止文本选中
            document.body.style.userSelect = 'none';
            document.body.style.webkitUserSelect = 'none';
            e.stopPropagation();
        });

        document.addEventListener('mousemove', (e) => {
            if (isDraggingIcon) {
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                // 计算新位置（限制在窗口范围内）
                const newX = Math.max(0, Math.min(window.innerWidth - icon.offsetWidth, initialX + deltaX));
                const newY = Math.max(0, Math.min(window.innerHeight - icon.offsetHeight, initialY + deltaY));

                icon.style.left = `${newX}px`;
                icon.style.right = 'auto';
                icon.style.top = `${newY}px`;

                // 如果搜索框是显示的，则更新其位置
                if (container.style.display === 'block') {
                    updateSearchBoxPosition();
                }
            }

            if (isDraggingContainer) {
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                // 计算新位置（限制在窗口范围内）
                const newX = Math.max(0, Math.min(window.innerWidth - container.offsetWidth, initialX + deltaX));
                const newY = Math.max(0, Math.min(window.innerHeight - container.offsetHeight, initialY + deltaY));

                container.style.left = `${newX}px`;
                container.style.right = 'auto';
                container.style.top = `${newY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDraggingIcon = false;
            isDraggingContainer = false;
            document.body.style.userSelect = '';
            document.body.style.webkitUserSelect = '';
        });
    }

    // 获取视频CID
    function getVideoCID() {
        if (window._cid) {
            return window._cid
        }
    }

    // ==================== 秒数转时间格式函数 ====================
    function secondsToSmartTime(seconds) {
        seconds = parseInt(seconds);
        if (isNaN(seconds) || seconds < 0) return "00:00";

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        // 格式化为两位数
        const formatNumber = (num) => num.toString().padStart(2, '0');
        const minutesStr = formatNumber(minutes);
        const secondsStr = formatNumber(secs);

        // 智能显示：低于1小时只显示分:秒，高于1小时显示时:分:秒
        if (hours > 0) {
            const hoursStr = formatNumber(hours);
            return `${hoursStr}:${minutesStr}:${secondsStr}`;
        } else {
            return `${minutesStr}:${secondsStr}`;
        }
    }

    // 显示结果
    function showResults(comments) {
        const container = document.getElementById('resultContainer');
        let html = `
        <table class="result-table">
            <tr>
                <th>用户MID</th>
                <th>发布日期</th>
                <th>时间</th>
                <th>内容</th>
            </tr>
        `;

        // 显示所有数据
        comments.forEach(comment => {
            // 如果弹幕长度超过 40，则截断并添加"..."
            const text = comment.text.length > 40 ? comment.text.substring(0, 40) + '...' : comment.text;
            html += `
            <tr>
                <td><a href="https://space.bilibili.com/${comment.mid}" target="_blank">${comment.mid}</a></td>
                <td>${comment.date}</td>
                <td class="time-jump" data-second="${comment.second}" style="cursor: pointer;">${secondsToSmartTime(comment.second)}</td>
                <td>${text}</td>
            </tr>
            `;
        });

        html += '</table>';

        // 添加"共 n 条数据"提示
        html += `
        <div style="margin-top: 10px; color: #666; text-align: center;">
            共 ${comments.length} 条数据
        </div>
        `;

        container.innerHTML = html;
        container.style.marginTop = "10px"
        container.style.display = "block"

        // 动态调整表格高度和滚动条
        const table = container.querySelector('.result-table');
        if (table) {
            if (table.scrollHeight > 280) {
                table.style.maxHeight = '280px';
                table.style.overflowY = 'auto';
            } else {
                table.style.maxHeight = 'none';
                table.style.overflowY = 'visible';
            }
        }

        // 添加事件监听器
        container.addEventListener('click', function (e) {
            if (e.target.classList.contains('time-jump')) {
                const second = parseFloat(e.target.getAttribute('data-second'));
                const video = document.querySelector('video');
                if (video) {
                    video.currentTime = second;
                    video.pause();
                }
            }
        });
    }

    // 主逻辑
    async function main(keyword) {
        const cid = getVideoCID();
        if (!cid) {
            alert('获取视频信息失败，请刷新页面重试');
            return;
        } else {
            console.log(`开始解析：https://api.bilibili.com/x/v1/dm/list.so?oid=${cid}`)
        }

        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.bilibili.com/x/v1/dm/list.so?oid=${cid}`,
            onload: function (response) {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(response.responseText, "text/xml");
                const ds = xmlDoc.getElementsByTagName('d');

                const comments = [];
                for (let d of ds) {
                    const text = d.textContent;
                    if (keyword && !text.includes(keyword)) continue;

                    const p = d.getAttribute('p').split(',');
                    comments.push({
                        second: p[0],
                        hash: p[6],
                        ts: parseInt(p[4]) * 1000,
                        text: text
                    });
                }

                // 使用优化后的哈希转换模块
                const midcrc = new BiliBili_midcrc();
                const midBatch = midcrc.batchConvert(comments.map(comment => comment.hash))

                const results = comments.map((comment, idx) => ({
                    second: comment.second,
                    mid: midBatch[idx],
                    date: new Date(comment.ts).toLocaleString(),
                    text: comment.text
                })).filter(comment => comment.mid); // 过滤无效结果

                console.log('解析结果:', results)
                showResults(results);
            },
            onerror: function (err) {
                alert('获取弹幕失败:' + err.statusText);
            }
        });
    }

    // 初始化
    function init() {
        createUI();

        document.getElementById('startSearch').addEventListener('click', () => {
            const keyword = document.getElementById('keywordInput').value.trim();
            main(keyword || undefined);
        });
    }

    // 启动脚本
    init();
})();