// ==UserScript==
// @name         Bilibili 分P时长计算器（优化版）
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  计算 Bilibili 视频分 P 的总时长
// @author       NightRaid
// @match        https://www.bilibili.com/video/*
// @grant        none
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/526763/Bilibili%20%E5%88%86P%E6%97%B6%E9%95%BF%E8%AE%A1%E7%AE%97%E5%99%A8%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/526763/Bilibili%20%E5%88%86P%E6%97%B6%E9%95%BF%E8%AE%A1%E7%AE%97%E5%99%A8%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载
    setTimeout(function() {

        // 解析时间字符串为秒
        function parseTime(str) {
            if (!str) return 0;
            const parts = str.trim().split(':').map(Number);
            if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
            if (parts.length === 2) return parts[0] * 60 + parts[1];
            return 0;
        }

        // 秒数格式化
        function formatTime(seconds) {
            const h = Math.floor(seconds / 3600);
            seconds %= 3600;
            const m = Math.floor(seconds / 60);
            const s = Math.floor(seconds % 60);
            let result = "";
            if (h > 0) result += h + "小时 ";
            if (m > 0) result += m + "分钟 ";
            result += s + "秒";
            return result;
        }

        // 获取当前播放列表数据
        function getCurrentListData() {
            // 定位当前高亮视频
            let activeItem = document.querySelector('.simple-base-item.page-item.active') ||
                             document.querySelector('.simple-base-item.video-pod__item.active') ||
                             document.querySelector('.video-pod__item.active') ||
                             document.querySelector('li.on');

            if (!activeItem) return null;

            // 锁定父级容器
            const container = activeItem.parentElement;
            if (!container) return null;

            // 获取容器内有效子项
            const allItems = Array.from(container.children).filter(el => {
                return el.classList.contains('simple-base-item') || el.querySelector('.stat-item.duration') || el.querySelector('.duration');
            });

            // 提取数据
            let currentIndex = 1;
            const timeList = [];

            for (let i = 0; i < allItems.length; i++) {
                const el = allItems[i];
                if (el === activeItem) {
                    currentIndex = i + 1;
                }
                const timeEl = el.querySelector('.stat-item.duration') || el.querySelector('.duration');
                if (timeEl) {
                    timeList.push(parseTime(timeEl.textContent));
                } else {
                    timeList.push(0);
                }
            }

            return {
                totalCount: timeList.length,
                current: currentIndex,
                times: timeList
            };
        }

        // 创建侧边栏
        var sidebar = document.createElement('div');
        Object.assign(sidebar.style, {
            position: 'fixed',
            bottom: '40%',
            right: '-20px', // 默认隐藏一半
            width: '40px',
            padding: '10px 5px',
            backgroundColor: '#00A1D6', // B站蓝
            color: 'white',
            borderRadius: '8px 0 0 8px',
            zIndex: '10000',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            userSelect: 'none',
            fontSize: '14px',
            lineHeight: '1.4',
            transition: 'right 0.3s ease' // 添加平滑过渡
        });
        sidebar.innerHTML = '时<br>长<br>统<br>计';
        sidebar.title = 'NightRaid';

        // 侧边栏悬停效果
        sidebar.addEventListener('mouseenter', () => {
            sidebar.style.right = '0px'; // 鼠标移入完全显示
        });
        sidebar.addEventListener('mouseleave', () => {
            // 如果面板没有打开，鼠标移出时恢复半隐藏
            if (form.style.display === 'none') {
                sidebar.style.right = '-20px';
            }
        });

        // 创建主面板
        var form = document.createElement('div');
        Object.assign(form.style, {
            display: 'none',
            position: 'fixed',
            bottom: '40%',
            right: '50px', // 在侧边栏左侧显示
            width: '260px',
            padding: '20px',
            backgroundColor: '#ffffff',
            border: '1px solid #e7e7e7',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            zIndex: '10000',
            fontFamily: '"Helvetica Neue", Helvetica, Arial, "Microsoft Yahei", sans-serif'
        });

        // 样式类
        const labelStyle = 'display:block; color:#666; font-size:13px; margin-bottom:5px; font-weight:500;';
        const inputStyle = 'width:100%; padding:8px; margin-bottom:15px; border:1px solid #ddd; border-radius:6px; box-sizing:border-box; outline:none; transition:0.2s;';
        const btnStyle = 'width:100%; padding:10px; background-color:#00A1D6; color:white; border:none; border-radius:6px; cursor:pointer; font-size:14px; font-weight:bold; transition:0.2s;';

        // 构建输入区域
        form.innerHTML = `
            <div style="margin-bottom:15px; text-align:center; color:#333; font-weight:bold; border-bottom:1px solid #eee; padding-bottom:10px;">
                分P时长统计
                <span style="font-size:10px; color:#999; display:block; font-weight:normal; margin-top:2px;">By NightRaid</span>
            </div>

            <label style="${labelStyle}">起始分P</label>
            <input type="number" id="nr_start" min="1" style="${inputStyle}" placeholder="1">

            <label style="${labelStyle}">结束分P</label>
            <input type="number" id="nr_end" min="1" style="${inputStyle}" placeholder="1">

            <label style="${labelStyle}">播放倍速</label>
            <input type="number" id="nr_speed" min="0.1" step="0.25" value="1.0" style="${inputStyle}">

            <button id="nr_calc_btn" style="${btnStyle}">开始计算</button>

            <div id="nr_result" style="margin-top:15px; padding:10px; background:#f6f7f8; border-radius:6px; font-size:13px; color:#333; line-height:1.6; display:none;"></div>
        `;

        document.body.appendChild(sidebar);
        document.body.appendChild(form);

        // 元素引用
        const startInput = document.getElementById('nr_start');
        const endInput = document.getElementById('nr_end');
        const speedInput = document.getElementById('nr_speed');
        const calcBtn = document.getElementById('nr_calc_btn');
        const resultDiv = document.getElementById('nr_result');

        // 输入框聚焦效果
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('focus', () => input.style.borderColor = '#00A1D6');
            input.addEventListener('blur', () => input.style.borderColor = '#ddd');
        });

        // 按钮悬停效果
        calcBtn.addEventListener('mouseenter', () => calcBtn.style.backgroundColor = '#00b5e5');
        calcBtn.addEventListener('mouseleave', () => calcBtn.style.backgroundColor = '#00A1D6');

        // 自动填充数据
        function autoFill() {
            const data = getCurrentListData();
            if (data) {
                startInput.value = data.current;
                endInput.value = data.totalCount;
                return true;
            }
            return false;
        }

        // 侧边栏点击事件
        sidebar.addEventListener('click', function(e) {
            e.stopPropagation();
            if (form.style.display === 'none') {
                form.style.display = 'block';
                sidebar.style.right = '0px'; // 打开面板时侧边栏保持展开
                if (!autoFill()) {
                    resultDiv.style.display = 'block';
                    resultDiv.style.color = 'red';
                    resultDiv.innerText = "未检测到播放列表，请尝试展开列表";
                } else {
                    resultDiv.style.display = 'none';
                    // 自动触发一次计算
                    calcBtn.click();
                }
            } else {
                form.style.display = 'none';
                sidebar.style.right = '-20px'; // 关闭时恢复半隐藏
            }
        });

        // 点击外部关闭
        document.addEventListener('click', function(e) {
            if (form.style.display === 'block' && !form.contains(e.target) && e.target !== sidebar) {
                form.style.display = 'none';
                sidebar.style.right = '-20px'; // 关闭时恢复半隐藏
            }
        });

        // 计算逻辑
        calcBtn.addEventListener('click', function() {
            const data = getCurrentListData();
            if (!data) {
                resultDiv.innerText = "获取列表失败，请确保列表已加载";
                resultDiv.style.color = 'red';
                resultDiv.style.display = 'block';
                return;
            }

            let start = parseInt(startInput.value);
            let end = parseInt(endInput.value);
            let speed = parseFloat(speedInput.value) || 1;

            // --- 数据智能纠错 ---
            // 1. 如果输入无效（NaN）或小于1或大于总数，重置为合理默认值
            if (isNaN(start) || start < 1 || start > data.totalCount) {
                start = data.current; // 重置为当前集
                startInput.value = start;
            }
            if (isNaN(end) || end < 1 || end > data.totalCount) {
                end = data.totalCount; // 重置为最后一集
                endInput.value = end;
            }

            // 2. 如果起始大于结束，自动交换
            if (start > end) {
                const temp = start; start = end; end = temp;
                startInput.value = start;
                endInput.value = end;
            }

            let totalSec = 0;
            // 数组索引从0开始，集数从1开始
            for (let i = start - 1; i < end; i++) {
                totalSec += data.times[i];
            }

            const speedSec = totalSec / speed;

            resultDiv.style.color = '#333';
            resultDiv.innerHTML =
                `<strong>区间：</strong> 第 ${start} - ${end} 集<br>` +
                `<strong>总计：</strong> ${end - start + 1} 集<br>` +
                `<strong>原速：</strong> ${formatTime(totalSec)}<br>` +
                `<strong>${speed}倍速：</strong> <span style="color:#00A1D6;font-weight:bold;">${formatTime(speedSec)}</span>`;
            resultDiv.style.display = 'block';
        });

    }, 1500);
})();