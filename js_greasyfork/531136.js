// ==UserScript==
// @name         上开刷课
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description 支持进度跳转和自动跳过失效视频
// @author       juejue
// @match        *://*.shou.org.cn/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_notification
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531136/%E4%B8%8A%E5%BC%80%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/531136/%E4%B8%8A%E5%BC%80%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

const STATE = {
    KEY: 'VIDEO_CONTROL_STATE_v2',
    config: {
        currentIndex: GM_getValue('currentIndex', 0),
        totalLinks: 0,
        isAuto: false,
        playDuration: 10, // 默认播放时长(秒)
        failedVideos: GM_getValue('failedVideos', []) // 记录失效视频
    }
};

class StateManager {
    static update(config) {
        GM_setValue(STATE.KEY, config);
        STATE.config = config;
    }

    static sync() {
        const saved = GM_getValue(STATE.KEY, null);
        if (saved) STATE.config = saved;
        return STATE.config;
    }
}

function createControlPanel() {
    const panelHTML = `
    <div id="vc-panel" style="
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 99999;
        background: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.15);
        font-family: Arial;
        min-width: 250px;
    ">
        <div style="display:flex; justify-content:space-between; align-items:center">
            <h3 style="margin:0; color:#333;">视频控制中心</h3>
            <span id="vc-close" style="cursor:pointer; font-size:18px">×</span>
        </div>

        <div style="margin:10px 0; display:flex; gap:5px">
            <input type="number" id="vc-jump-input" min="1"
                   value="${STATE.config.currentIndex + 1}"
                   style="width:60px; padding:4px">
            <button id="vc-jump-btn" style="flex:1">跳转</button>
        </div>

        <div style="margin-bottom:10px">
            <div style="display:flex; justify-content:space-between">
                <span>进度: <span id="vc-progress">${STATE.config.currentIndex + 1}/${STATE.config.totalLinks}</span></span>
                <span>失败: <span id="vc-failed">${STATE.config.failedVideos.length}</span></span>
            </div>
            <progress value="${STATE.config.currentIndex}"
                     max="${STATE.config.totalLinks}"
                     style="width:100%; height:6px"></progress>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:5px">
            <button id="vc-play" class="vc-btn" style="background:#4CAF50">播放</button>
            <button id="vc-next" class="vc-btn" style="background:#2196F3">下一个</button>
            <button id="vc-auto" class="vc-btn" style="background:${STATE.config.isAuto ? '#f44336' : '#9E9E9E'}">
                ${STATE.config.isAuto ? '■ 停止' : '▶ 自动'}
            </button>
            <button id="vc-copy" class="vc-btn" style="background:#607D8B">复制进度</button>
        </div>

        <div style="margin-top:10px; font-size:12px;">
            <div>播放时长:
                <select id="vc-duration" style="padding:2px">
                    <option value="5" ${STATE.config.playDuration === 5 ? 'selected' : ''}>5秒</option>
                    <option value="10" ${STATE.config.playDuration === 10 ? 'selected' : ''}>10秒</option>
                    <option value="30" ${STATE.config.playDuration === 30 ? 'selected' : ''}>30秒</option>
                    <option value="60" ${STATE.config.playDuration === 60 ? 'selected' : ''}>60秒</option>
                </select>
            </div>
            <div id="vc-status" style="color:#666; margin-top:5px; word-break:break-all">等待操作...</div>
        </div>
    </div>
    `;

    document.querySelector('#vc-panel')?.remove();
    document.body.insertAdjacentHTML('beforeend', panelHTML);

    // 事件绑定
    document.getElementById('vc-play').addEventListener('click', playCurrentVideo);
    document.getElementById('vc-next').addEventListener('click', goToNextVideo);
    document.getElementById('vc-auto').addEventListener('click', toggleAutoMode);
    document.getElementById('vc-jump-btn').addEventListener('click', jumpToVideo);
    document.getElementById('vc-copy').addEventListener('click', copyProgress);
    document.getElementById('vc-close').addEventListener('click', () => {
        document.getElementById('vc-panel').style.display = 'none';
    });
    document.getElementById('vc-duration').addEventListener('change', (e) => {
        STATE.config.playDuration = parseInt(e.target.value);
        StateManager.update(STATE.config);
    });
}

function refreshVideoLinks() {
    const links = [...document.querySelectorAll('li.cell_info1[data-type="RESOURCE"] > a[href]')];
    STATE.config.totalLinks = links.length;
    StateManager.update(STATE.config);
    return links;
}

function playCurrentVideo() {
    const playBtn = document.querySelector('.dplayer-icon.dplayer-play-icon');
    if (playBtn) {
        playBtn.click();
        updateStatus(`正在播放 #${STATE.config.currentIndex + 1}`);
        return true;
    } else {
        handleFailedVideo();
        return false;
    }
}

function handleFailedVideo() {
    const currentUrl = window.location.href;
    if (!STATE.config.failedVideos.includes(currentUrl)) {
        STATE.config.failedVideos.push(currentUrl);
        StateManager.update(STATE.config);
        document.getElementById('vc-failed').textContent = STATE.config.failedVideos.length;
    }
    updateStatus(`视频 #${STATE.config.currentIndex + 1} 无法播放，已记录`, true);
}

function goToNextVideo() {
    const links = refreshVideoLinks();

    if (STATE.config.currentIndex >= links.length - 1) {
        updateStatus('已完成所有视频！');
        GM_notification({
            title: '视频跳转完成',
            text: `已完成 ${links.length} 个视频，其中 ${STATE.config.failedVideos.length} 个失败`,
            timeout: 5000
        });
        return;
    }

    STATE.config.currentIndex++;
    StateManager.update(STATE.config);
    updateProgress();

    const nextLink = links[STATE.config.currentIndex];
    updateStatus(`跳转到: ${nextLink.textContent.trim()}`);

    setTimeout(() => {
        window.location.href = nextLink.href;
    }, 500);
}

function jumpToVideo() {
    const input = document.getElementById('vc-jump-input');
    const targetIndex = parseInt(input.value) - 1;
    const links = refreshVideoLinks();

    if (isNaN(targetIndex) || targetIndex < 0 || targetIndex >= links.length) {
        updateStatus(`无效的序号: ${input.value}`, true);
        return;
    }

    STATE.config.currentIndex = targetIndex;
    StateManager.update(STATE.config);
    updateProgress();

    const targetLink = links[targetIndex];
    updateStatus(`跳转到: ${targetLink.textContent.trim()}`);

    setTimeout(() => {
        window.location.href = targetLink.href;
    }, 500);
}

function toggleAutoMode() {
    STATE.config.isAuto = !STATE.config.isAuto;
    StateManager.update(STATE.config);
    createControlPanel();

    if (STATE.config.isAuto) {
        startAutoPlay();
    } else {
        updateStatus('已停止自动模式');
    }
}

function startAutoPlay() {
    if (!STATE.config.isAuto) return;

    // 尝试播放当前视频
    const isPlaying = playCurrentVideo();

    // 无论是否播放成功都继续流程
    setTimeout(() => {
        if (STATE.config.isAuto) {
            goToNextVideo();
        }
    }, (isPlaying ? STATE.config.playDuration : 3) * 1000);
}

function copyProgress() {
    const progress = `${STATE.config.currentIndex + 1}/${STATE.config.totalLinks}`;
    GM_setClipboard(progress);
    updateStatus(`已复制进度: ${progress}`);
}

function updateProgress() {
    document.getElementById('vc-progress').textContent =
        `${STATE.config.currentIndex + 1}/${STATE.config.totalLinks}`;
    document.getElementById('vc-jump-input').value = STATE.config.currentIndex + 1;
    document.querySelector('#vc-panel progress').value = STATE.config.currentIndex;
}

function updateStatus(message, isError = false) {
    const statusEl = document.getElementById('vc-status');
    if (statusEl) {
        statusEl.textContent = message;
        statusEl.style.color = isError ? 'red' : '#666';
    }
}

function init() {
    StateManager.sync();
    refreshVideoLinks();
    createControlPanel();

    // 自动模式恢复
    if (STATE.config.isAuto) {
        setTimeout(startAutoPlay, 1500);
    }

    // 右键菜单
    GM_registerMenuCommand("重置进度", () => {
        STATE.config.currentIndex = 0;
        StateManager.update(STATE.config);
        updateProgress();
        updateStatus('进度已重置');
    });

    GM_registerMenuCommand("清空失败记录", () => {
        STATE.config.failedVideos = [];
        StateManager.update(STATE.config);
        document.getElementById('vc-failed').textContent = '0';
        updateStatus('已清空失败记录');
    });
}

// 启动脚本
if (document.readyState === 'complete') {
    init();
} else {
    window.addEventListener('load', init);
}

// 跨页面状态同步
GM_addValueChangeListener(STATE.KEY, (name, oldVal, newVal) => {
    if (newVal) {
        STATE.config = newVal;
        updateProgress();
    }
});
