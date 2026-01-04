// ==UserScript==
// @name         b站一起看播放器贴片
// @namespace    http://tampermonkey.net/
// @version      2025-07-08
// @description  自用，直播的时候可以贴到直播画面上，和主播一起看视频
// @author       You
// @match        https://live.bilibili.com/blanc/25206807?liteVersion=true&live_from=62001&plat=eva&visit_id=2f9909117k2s
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      private
// @downloadURL https://update.greasyfork.org/scripts/543953/b%E7%AB%99%E4%B8%80%E8%B5%B7%E7%9C%8B%E6%92%AD%E6%94%BE%E5%99%A8%E8%B4%B4%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/543953/b%E7%AB%99%E4%B8%80%E8%B5%B7%E7%9C%8B%E6%92%AD%E6%94%BE%E5%99%A8%E8%B4%B4%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

let episodeCache = null;
async function fetchEpisodeData(epId) {
    if (episodeCache) {
        return episodeCache;
    }

    try {
        const response = await fetch(`https://api.bilibili.com/pgc/view/web/ep/list?ep_id=${epId}`);
        const data = await response.json();

        if (data.code === 0 && data.result && data.result.episodes) {
            episodeCache = data.result.episodes;
            return episodeCache;
        } else {
            throw new Error('Invalid API response');
        }
    } catch (error) {
        console.error('Error fetching episode data:', error);
        return [];
    }
}

async function getEpisodeInfo(epId, num) {
    const episodes = await fetchEpisodeData(epId);

    if (!episodes || !episodes.length) {
        return null;
    }

    // badge_type 区分预告还是正片
    const episode = episodes.find(ep => ep.title === num.toString() && ep.badge_type == 0);

    if (!episode) {
        return null;
    }

    return {
        title: episode.show_title || `第${episode.title}话`,
        url: `https://www.bilibili.com/bangumi/play/ep${episode.ep_id}`,
        bvid: episode.bvid || '',
        aid: episode.aid || '',
        opend: episode.skip?.op?.end || 0,
    };
}

// 创建一个可拖动、可调整大小的iframe容器
function createBilibiliPlayerWidget() {
    const livePlayer = document.querySelector('#live-player');
    const rect = livePlayer.getBoundingClientRect();
    // 创建主容器
    const container = document.createElement('div');
    container.id = 'bilibili-player-widget';
    container.style.position = 'fixed';
    container.style.left = rect.left +'px';
    container.style.top = (rect.top) +'px';
    container.style.width = (rect.width * 0.75)+'px';
    container.style.height = (rect.height * 0.85)+'px';
    container.style.zIndex = '9';
    container.style.backgroundColor = 'rgba(0,0,0,0.5)';
    container.style.border = 'none';
    container.style.transition = 'background-color 0.3s ease';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';

    // 使用innerHTML设置HTML结构
    container.innerHTML = `
    <iframe id="player-iframe" style="flex: 1; border: none; width: 100%; height: 100%; background-color: #1a1a1a;"></iframe>
<div id="widget-header" style="padding: 8px 12px; background-color: rgba(45,45,45,0); border-bottom: 1px solid #444; cursor: move; user-select: none; display: flex; justify-content: space-between; align-items: center; gap: 8px; transition: all 0.3s ease;">
    <span style="white-space: nowrap; color: #e0e0e0;">B站播放器控制</span>
    <div style="display: flex; gap: 8px; align-items: center; flex: 1;">
        <input id="epid-input" type="text" placeholder="epid" style="width: 100px; background-color: rgba(61,61,61,0.7); color: #e0e0e0; border: 1px solid #555; padding: 4px 8px; border-radius: 4px;">
        <input id="epnum-input" type="number" placeholder="集数" style="width: 60px; background-color: rgba(61,61,61,0.7); color: #e0e0e0; border: 1px solid #555; padding: 4px 8px; border-radius: 4px;">
        <input id="time-input" type="text" placeholder="时间(00:00:00)" style="width: 100px; background-color: rgba(61,61,61,0.7); color: #e0e0e0; border: 1px solid #555; padding: 4px 8px; border-radius: 4px;">
    </div>
    <button id="jump-btn" style="padding: 5px 10px; background-color: #fb7299; color: white; border: none; border-radius: 4px; cursor: pointer; white-space: nowrap;">跳转播放</button>
    <button id="widget-close" style="background: none; border: none; font-size: 16px; cursor: pointer; color: #e0e0e0;">×</button>
</div>
<div id="control-panel" style="padding: 10px; display: flex; flex-direction: column; gap: 8px; background-color: rgba(37,37,37,0);"></div>

<div id="resize-handle" style="width: 10px; height: 10px; background-color: #fb7299; position: absolute; right: 0; bottom: 0; cursor: nwse-resize; opacity: 0; transition: opacity 0.3s ease;"></div>
    `;

    // 添加到live-player-mounter
    livePlayer.appendChild(container);

    // 获取DOM元素
    const header = container.querySelector('#widget-header');
    const closeBtn = container.querySelector('#widget-close');
    const jumpBtn = container.querySelector('#jump-btn');
    const epidInput = container.querySelector('#epid-input');
    const epNumInput = container.querySelector('#epnum-input');
    const timeInput = container.querySelector('#time-input');
    const iframe = container.querySelector('#player-iframe');
    const resizeHandle = container.querySelector('#resize-handle');

    // // 添加获得焦点事件监听
    // timeInput.addEventListener('focus', function() {
    //     iframe.style.opacity = '0';
    // });
    // // 添加失去焦点事件监听
    // timeInput.addEventListener('blur', function() {
    //     iframe.style.opacity = '1';
    // });

    // 自动隐藏控制栏的逻辑
    let hideTimeout;
    const showControls = () => {
        clearTimeout(hideTimeout);
        container.style.backgroundColor = 'rgba(0,0,0,0.5)';
        header.style.opacity = '1';
        header.style.pointerEvents = 'auto';
        resizeHandle.style.opacity = '1';

        hideTimeout = setTimeout(() => {
            container.style.backgroundColor = 'rgba(0,0,0,0.2)';
            header.style.opacity = '0.2';
            header.style.pointerEvents = 'none';
            resizeHandle.style.opacity = '0';
        }, 3000);
    };

    // 初始显示控制栏
    showControls();

    // 鼠标移动时显示控制栏
    container.addEventListener('mousemove', showControls);

    // 检查点击目标是否是可交互元素
    function isInteractiveElement(target) {
        return target.tagName === 'INPUT' ||
               target.tagName === 'BUTTON' ||
               target.tagName === 'SELECT' ||
               target.tagName === 'TEXTAREA' ||
               target.isContentEditable;
    }

    // 拖动功能
    let isDragging = false;
    let offsetX, offsetY;

    header.addEventListener('mousedown', (e) => {
        // 如果点击的是可交互元素，不触发拖拽
        if (isInteractiveElement(e.target)) {
            return;
        }

        isDragging = true;
        offsetX = e.clientX - container.getBoundingClientRect().left;
        offsetY = e.clientY - container.getBoundingClientRect().top;
        container.style.cursor = 'grabbing';
        e.preventDefault();
    });

    function handleDragMove(e) {
        if (!isDragging) return;

        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;

        container.style.left = `${x}px`;
        container.style.top = `${y}px`;
        container.style.right = 'auto';
        container.style.bottom = 'auto';
    }

    function handleDragEnd() {
        isDragging = false;
        container.style.cursor = 'default';
    }

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);

    // 调整大小功能
    let isResizing = false;
    let startWidth, startHeight, startX, startY;

    resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startWidth = parseInt(document.defaultView.getComputedStyle(container).width, 10);
        startHeight = parseInt(document.defaultView.getComputedStyle(container).height, 10);
        startX = e.clientX;
        startY = e.clientY;
        e.stopPropagation();
        e.preventDefault();
    });

    function handleResizeMove(e) {
        if (!isResizing) return;

        const newWidth = startWidth + (e.clientX - startX);
        const newHeight = startHeight + (e.clientY - startY);

        container.style.width = `${Math.max(300, newWidth)}px`;
        container.style.height = `${Math.max(200, newHeight)}px`;
    }

    function handleResizeEnd() {
        isResizing = false;
    }

    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);

    // 关闭功能
    closeBtn.addEventListener('click', () => container.remove());

    // 跳转功能
    jumpBtn.addEventListener('click', async () => {
        const epid = epidInput.value.trim();
        const epNum = epNumInput.value.trim();
        const timeStr = timeInput.value.trim();

        if (!epid) {
            alert('请输入EPID');
            return;
        }

        try {
            // 获取视频信息
            const episodeInfo = await getEpisodeInfo(epid, epNum);
            if (!episodeInfo) {
                alert('获取视频信息失败');
                return;
            }

            // 构建播放器URL - 使用网页全屏模式
            let playerUrl = `https://www.bilibili.com/blackboard/html5player.html?aid=${episodeInfo.aid}&bvid=${episodeInfo.bvid}&autoplay=true&high_quality=1&danmaku=0`;

            // 添加时间参数
            if (timeStr) {
                const timeInSeconds = convertTimeToSeconds(timeStr);
                if (timeInSeconds > 0) {
                    playerUrl += `&t=${timeInSeconds}`;
                }
            }else{
                if (episodeInfo.opend > 0) {
                    playerUrl += `&t=${episodeInfo.opend}`;
                }
            }

            // 更新iframe
            iframe.src = playerUrl;

            // 显示控制栏
            showControls();
        } catch (error) {
            console.error('跳转失败:', error);
            alert('跳转失败: ' + error.message);
        }
    });

    // 时间转换函数
    function convertTimeToSeconds(timeStr) {
        const parts = timeStr.split(':').map(part => parseInt(part) || 0);

        if (parts.length === 3) { // 时:分:秒
            return parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else if (parts.length === 2) { // 分:秒
            return parts[0] * 60 + parts[1];
        } else if (parts.length === 1) { // 秒
            return parts[0];
        }
        return 0;
    }
}
// 创建并显示播放器控件
createBilibiliPlayerWidget();
})();