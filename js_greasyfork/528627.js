// ==UserScript==
// @name         Bili 过短视频过滤
// @namespace    Bili-ShortVid-DEL
// @version      1.0
// @description  通过API精准过滤短内容，并支持点击后显示内容（不完全禁用交互）
// @author       Luke Zhang
// @license      GPL-3.0-or-later
// @homepage     https://github.com/win-lukezhang/Bili-ShortVid-DEL
// @match        https://*.bilibili.com/*
// @grant        GM_xmlhttpRequest
// @connect      bilibili.com
// @icon         https://www.bilibili.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/528627/Bili%20%E8%BF%87%E7%9F%AD%E8%A7%86%E9%A2%91%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/528627/Bili%20%E8%BF%87%E7%9F%AD%E8%A7%86%E9%A2%91%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数，自己改，我不会 GUI
    const config = {
        videoItemSelector: '.bili-video-card__wrap', // 视频卡片容器
        checkInterval: 1000,                         // 检查间隔(毫秒)
        requestDelay: 500,                           // 请求延迟防止封禁
        minDuration: 120                             // 最小允许时长(秒)
    };

    // 已处理的BV号缓存
    const processedBV = new Set();

    // 获取BV号的正则表达式
    function getBVID(element) {
        const link = element.querySelector('a[href*="/video/"]');
        return link ? link.href.match(/video\/(BV\w+)/)?.[1] : null;
    }

    // 通过API获取时长
    async function getDuration(bvid) {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`, // 截至 2025/03/03，这个 API 还不需要 WBI 鉴权
                timeout: 3000,
                onload: function(res) {
                    try {
                        const data = JSON.parse(res.responseText);
                        resolve(data.data?.duration || 0);
                    } catch {
                        resolve(0);
                    }
                },
                onerror: () => resolve(0)
            });
        });
    }

    // 处理单个视频项
    async function processItem(item) {
        const bvid = getBVID(item);
        if (!bvid || processedBV.has(bvid)) return;

        processedBV.add(bvid);
        await new Promise(r => setTimeout(r, config.requestDelay));

        const duration = await getDuration(bvid);
        if (duration < config.minDuration) {
            // 不禁用交互，仅添加模糊效果和提示文字

            // 创建一个包裹层用于模糊效果
            const blurWrapper = document.createElement('div');
            blurWrapper.style.position = 'absolute';
            blurWrapper.style.top = '0';
            blurWrapper.style.left = '0';
            blurWrapper.style.width = '100%';
            blurWrapper.style.height = '100%';
            blurWrapper.style.filter = 'blur(8px)';
            blurWrapper.style.zIndex = '1'; // 确保模糊层在提示文字下方

            // 将视频卡片的内容复制到模糊层中
            const contentToBlur = Array.from(item.children).filter(child => child.tagName !== 'DIV'); // 排除已有的提示文字
            contentToBlur.forEach(child => {
                blurWrapper.appendChild(child.cloneNode(true));
            });

            // 将模糊层插入到视频卡片中
            item.appendChild(blurWrapper);

            // 创建提示文字容器
            const overlay = document.createElement('div');
            overlay.style.position = 'absolute';
            overlay.style.top = '50%';
            overlay.style.left = '50%';
            overlay.style.transform = 'translate(-50%, -50%)';
            overlay.style.zIndex = '999'; // 确保提示文字在最上层
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
            overlay.style.color = '#ffffff';
            overlay.style.padding = '10px';
            overlay.style.borderRadius = '5px';
            overlay.style.fontSize = '16px';
            overlay.style.fontWeight = 'bold';
            overlay.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)'; // 增加阴影效果
            overlay.innerHTML = '<p>时长小于2min</p>';
            item.appendChild(overlay);

            // 添加点击事件监听器
            item.addEventListener('click', (event) => {
                event.stopPropagation(); // 防止事件冒泡
                event.preventDefault(); // 阻止默认行为

                // 移除模糊层
                if (blurWrapper.parentNode) {
                    blurWrapper.remove();
                }

                // 移除提示文字
                if (overlay.parentNode) {
                    overlay.remove();
                }

                // 移除点击事件监听器（避免重复触发）
                item.removeEventListener('click', arguments.callee);
            }, true); // 使用捕获阶段以确保事件生效
        }
    }

    // 批量处理视频
    async function batchProcessor() {
        const items = document.querySelectorAll(config.videoItemSelector);
        for (const item of items) {
            if (item.dataset.checked) continue;
            item.dataset.checked = true;
            await processItem(item);
        }
    }

    // 初始化监听
    const observer = new MutationObserver(batchProcessor);
    observer.observe(document.body, { childList: true, subtree: true });
    setInterval(batchProcessor, config.checkInterval);
})();