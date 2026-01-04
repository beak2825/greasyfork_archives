// ==UserScript==
// @name         即创音频捕捉下载
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  填入语音脚本后点击试听即可下载
// @author       bor1s
// @match        https://aic.oceanengine.com/tools/smart_clip/digital_human*
// @run-at       document-end
// @grant        GM_download
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/529967/%E5%8D%B3%E5%88%9B%E9%9F%B3%E9%A2%91%E6%8D%95%E6%8D%89%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/529967/%E5%8D%B3%E5%88%9B%E9%9F%B3%E9%A2%91%E6%8D%95%E6%8D%89%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置区
    const DEBUG = true;
    const TARGET_REGEX = /https:\/\/(lf\d+|16)-creative-sign\.bytetos\.com\/lab-vsumm-tob\/audio-normalize\//i;
    let lastAudioUrl = null;

    //====================== 样式注入 ======================
    GM_addStyle(`
        #jc-audio-download-btn {
            position: fixed;
            right: 20px;
            top: 16%;
            transform: translateY(-50%);
            z-index: 9999;
            padding: 5px 8px;
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-family: "Microsoft Yahei", sans-serif;
            box-shadow: 0 3px 8px rgba(0,0,0,0.2);
            transition: all 0.2s;
            opacity: 0.9;
        }

        #jc-audio-download-btn:hover {
            opacity: 1;
            transform: translateY(-50%) scale(1.08);
        }

        #jc-audio-download-btn:active {
            transform: translateY(-50%) scale(0.95);
        }

        #jc-audio-download-btn.disabled {
            background: #9E9E9E !important;
            cursor: not-allowed;
        }
    `);

    //====================== 下载逻辑 ======================
    const downloadAudio = () => {
        if (!lastAudioUrl) {
            showToast('⚠️ 请先点击试听生成音频', 'warning');
            return;
        }

        // 生成带时间戳的文件名
        const filename = `audio_${Date.now()}.mp3`;

        GM_download({
            url: lastAudioUrl,
            name: filename,
            headers: {
                Referer: location.href,
                Origin: new URL(lastAudioUrl).origin
            },
            onerror: (e) => {
                DEBUG && console.error('下载失败:', e);
                showToast('❌ 下载失败，请打开控制台查看详情', 'error');
            },
            onload: () => {
                showToast('✅ 下载成功', 'success');
                lastAudioUrl = null
            }
        });
    };

    //====================== 界面组件 ======================
    // 创建下载按钮
    const createDownloadButton = () => {
        const btn = document.createElement('button');
        btn.id = 'jc-audio-download-btn';
        btn.innerHTML = '下载配音';
        btn.onclick = downloadAudio;
        document.body.appendChild(btn);
    };

    // 轻量级提示组件
    const showToast = (text, type = 'info') => {
        const toast = document.createElement('div');
        toast.style = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'error' ? '#ff4444' :
                        type === 'success' ? '#00C851' :
                        '#ffbb33'};
            color: white;
            border-radius: 4px;
            box-shadow: 0 3px 6px rgba(0,0,0,0.16);
            animation: slideIn 0.3s ease-out;
            z-index: 10000;
        `;
        toast.textContent = text;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    //====================== 音频捕获 ======================
    const hijackAudioSource = () => {
        const nativeSet = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'src').set;

        Object.defineProperty(HTMLMediaElement.prototype, 'src', {
            set: function(value) {
                if (TARGET_REGEX.test(value)) {
                    DEBUG && console.log('捕获到音频地址:', value);
                    lastAudioUrl = value; // 保留原始URL
                    updateButtonState(true);
                }
                return nativeSet.call(this, value);
            }
        });
    };

    // 更新按钮状态
    const updateButtonState = (active = false) => {
        const btn = document.getElementById('jc-audio-download-btn');
        if (!btn) return;

        btn.classList.toggle('disabled', !active);
        btn.title = active ? '点击下载最新生成的音频' : '请先生成试听音频';
    };

    //====================== 初始化 ======================
    window.addEventListener('DOMContentLoaded', () => {
        hijackAudioSource();
        createDownloadButton();
        updateButtonState(); // 初始禁用状态
        DEBUG && console.log('[即创音频助手] 已激活');
    });
})();