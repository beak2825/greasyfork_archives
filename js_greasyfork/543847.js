// ==UserScript==
// @name         北森iTalent全能学习助手 - 加速 & 自动点击
// @namespace    https://greasyfork.org/users/123456
// @version      2.2
// @description  SB人事强制要求看视频，自动设置视频2倍速、后台播放、防止暂停、自动点击“继续学习”、“确定”等弹窗，彻底解放双手！
// @author       SB人事
// @match        https://cloud.italent.cn/*
// @match        http://cloud.italent.cn/*
// @icon         https://cloud.italent.cn/favicon.ico
// @license      MIT
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/543847/%E5%8C%97%E6%A3%AEiTalent%E5%85%A8%E8%83%BD%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%20-%20%E5%8A%A0%E9%80%9F%20%20%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/543847/%E5%8C%97%E6%A3%AEiTalent%E5%85%A8%E8%83%BD%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%20-%20%E5%8A%A0%E9%80%9F%20%20%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG = {
        VIDEO_SPEED: 2,
        AUTO_CLICK_DELAY: 500,
        DEBUG: false,
        TARGET_TEXTS: [
            '继续学习', '进入考试', '开始学习', '确定', '确认', '知道了', '我知道了', '好的', '是的'
        ],
        MODAL_BTN_SELECTOR: '.phoenix-modal--show .modal-btn'
    };

    let currentSpeed = CONFIG.VIDEO_SPEED;

    function setVideoSpeed(speed) {
        const finalSpeed = Math.min(Math.max(speed, 0.5), 2);
        if (finalSpeed !== speed && CONFIG.DEBUG) {
            console.warn(`⚠️ 视频倍速超出范围（${speed}x），已调整为 ${finalSpeed}x`);
        }

        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            if (!video._gig_speed_set) {
                const applySpeed = () => {
                    video.playbackRate = finalSpeed;
                    video._gig_speed_set = true;
                    if (CONFIG.DEBUG) console.log(`🎬 视频倍速已设为 ${finalSpeed}x`);
                };
                if (video.readyState > 0) {
                    applySpeed();
                } else {
                    video.addEventListener('loadedmetadata', applySpeed, { once: true });
                }
            }
        });
    }

    function clickContinueLearningModal() {
        const modalBtn = document.querySelector(CONFIG.MODAL_BTN_SELECTOR);
        if (modalBtn) {
            const modal = modalBtn.closest('.phoenix-modal--show');
            if (modal && modal.offsetParent !== null) {
                modalBtn.click();
                console.log('✅ 点击了“继续学习”弹窗按钮');
                return true;
            }
        }
        return false;
    }

    function clickGenericButtons() {
        const elements = document.querySelectorAll(`
            button,
            .phoenix-button__content,
            .opt,
            [class*="button"],
            [class*="btn"],
            .phoenix-modal__content span
        `);

        for (const el of elements) {
            const text = el.textContent.trim();
            if (CONFIG.TARGET_TEXTS.some(t => text.includes(t) || text === t)) {
                const clickable = el.closest('button, .phoenix-button, .opt, .modal-btn, [onclick], [role="button"], .phoenix-modal__content');
                if (clickable && clickable.offsetParent !== null && !clickable.disabled) {
                    clickable.click();
                    console.log(`✅ 点击了按钮: "${text}"`);
                    return true;
                }
            }
        }
        return false;
    }

    function autoClick() {
        if (clickContinueLearningModal()) return;
        clickGenericButtons();
    }

    function createControlPanel() {
        const panel = document.createElement('div');
        panel.innerHTML = `
            <div id="talent-helper-panel" style="
                position: fixed; top: 10px; right: 10px; z-index: 999999;
                background: #fff; border: 1px solid #ddd; border-radius: 8px;
                padding: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                font-family: sans-serif; font-size: 14px; min-width: 220px;
            ">
                <h4 style="margin: 0 0 10px; font-size: 16px; color: #333;">学习助手 v2.2</h4>
                <div style="margin-bottom: 10px;">
                    <label style="display:inline-block;width:70px;">视频倍速:</label>
                    <input type="number" id="speed-input" value="${CONFIG.VIDEO_SPEED}" 
                           min="0.5" max="2" step="0.5" style="width:60px;">
                </div>
                <button id="manual-click" style="
                    width:100%; background:#007bff; color:white; border:none;
                    padding:8px 0; border-radius:4px; cursor:pointer; margin-top:5px;
                ">手动点击弹窗</button>
            </div>
        `;
        document.body.appendChild(panel);

        document.getElementById('speed-input').addEventListener('change', (e) => {
            const speed = parseFloat(e.target.value);
            if (speed > 0) {
                currentSpeed = speed;
                setVideoSpeed(speed);
            }
        });

        document.getElementById('manual-click').addEventListener('click', autoClick);
    }

    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'visibilitychange' || type === 'webkitvisibilitychange') {
            if (CONFIG.DEBUG) console.log(`🚫 阻止 visibilitychange 事件`);
            return;
        }
        return originalAddEventListener.call(this, type, listener, options);
    };

    function init() {
        console.log('🚀 北森全能学习助手 v2.2 已启动');

        if (CONFIG.DEBUG === false && !localStorage.getItem('gig_speed_warning_shown_v22')) {
            alert('⚠️ 注意：北森系统仅支持最高 2 倍速播放！本脚本已限制在安全范围，勿超过以免出错。');
            localStorage.setItem('gig_speed_warning_shown_v22', 'true');
        }

        setVideoSpeed(currentSpeed);
        createControlPanel();

        const observer = new MutationObserver(() => {
            setTimeout(autoClick, CONFIG.AUTO_CLICK_DELAY);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setInterval(autoClick, 2000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
