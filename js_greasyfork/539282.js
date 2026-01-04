// ==UserScript==
// @name         YouTube 自定义范围自动播放生成器（稳定版）
// @namespace    https://chat.openai.com/
// @version      2.1
// @description  在频道视频页生成自定义范围自动播放链接，解决按钮不出现的问题
// @author       ChatGPT
// @match        https://www.youtube.com/@*/videos
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/539282/YouTube%20%E8%87%AA%E5%AE%9A%E4%B9%89%E8%8C%83%E5%9B%B4%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E7%94%9F%E6%88%90%E5%99%A8%EF%BC%88%E7%A8%B3%E5%AE%9A%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/539282/YouTube%20%E8%87%AA%E5%AE%9A%E4%B9%89%E8%8C%83%E5%9B%B4%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E7%94%9F%E6%88%90%E5%99%A8%EF%BC%88%E7%A8%B3%E5%AE%9A%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let injected = false;

    // 等待特定元素出现
    function waitForElement(selector, callback, interval = 500, timeout = 10000) {
        const startTime = Date.now();
        const timer = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(timer);
                callback(el);
            } else if (Date.now() - startTime > timeout) {
                clearInterval(timer);
            }
        }, interval);
    }

    // 插入按钮
    function injectButton() {
        if (injected || !location.pathname.endsWith("/videos")) return;
        injected = true;

        const btn = document.createElement("button");
        btn.textContent = "🎬 生成播放列表（自定义范围）";
        Object.assign(btn.style, {
            position: "fixed",
            top: "80px",
            right: "20px",
            zIndex: 9999,
            padding: "10px",
            background: "#cc0000",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.3)"
        });

        btn.onclick = handleClick;
        document.body.appendChild(btn);
    }

    // 处理点击事件
    function handleClick() {
        const sortButton = document.querySelector('#sort-menu button');
        if (sortButton) {
            sortButton.click();
            setTimeout(() => {
                const menuItems = document.querySelectorAll('tp-yt-paper-item');
                for (const item of menuItems) {
                    if (item.textContent.includes('最旧') || item.textContent.includes('Oldest')) {
                        item.click();
                        break;
                    }
                }
                setTimeout(() => extractVideoIds(), 2000);
            }, 500);
        } else {
            extractVideoIds();
        }
    }

    // 抓取视频ID并生成播放链接
    function extractVideoIds() {
        const links = [...document.querySelectorAll('a.yt-simple-endpoint')];
        const ids = [];

        for (const a of links) {
            const href = a.getAttribute('href');
            if (!href || !href.includes('/watch')) continue;

            const urlParams = new URLSearchParams(href.split('?')[1]);
            const videoId = urlParams.get('v');

            if (videoId && !ids.includes(videoId)) {
                ids.push(videoId);
            }
        }

        if (ids.length === 0) {
            alert("未找到视频ID，请确保页面已加载视频");
            return;
        }

        const start = parseInt(prompt(`共找到 ${ids.length} 个视频，请输入开始索引（如50表示第51个视频）：`, "50"), 10);
        if (isNaN(start) || start < 0 || start >= ids.length) {
            alert("开始索引无效");
            return;
        }

        const subIds = ids.slice(start, start + 50);
        if (subIds.length === 0) {
            alert("该索引范围内无视频");
            return;
        }

        const startOffset = parseInt(prompt(`在选择的视频范围内（${subIds.length}个），请输入播放开始位置（0-${subIds.length - 1}）：`, "0"), 10);
        if (isNaN(startOffset) || startOffset < 0 || startOffset >= subIds.length) {
            alert("播放起始位置无效");
            return;
        }

        const startVideoId = subIds[startOffset];
        const link = `https://www.youtube.com/watch_videos?video_ids=${subIds.join(",")}&index=${startOffset}&v=${startVideoId}`;
        GM_openInTab(link, { active: true });
    }

    // 初次执行时注入按钮
    waitForElement("ytd-app", injectButton);

    // 监听 URL 变化（适应 YouTube SPA 结构）
    let lastUrl = location.href;
    setInterval(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            injected = false;
            if (currentUrl.includes("/videos")) {
                waitForElement("ytd-app", injectButton);
            }
        }
    }, 1000);
})();
