// ==UserScript==
// @name         极简隐私保护
// @namespace    http://tampermonkey.net/
// @version      4.5
// @description 无背景文字按钮+英文提示
// @author       Alkam
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/528428/%E6%9E%81%E7%AE%80%E9%9A%90%E7%A7%81%E4%BF%9D%E6%8A%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/528428/%E6%9E%81%E7%AE%80%E9%9A%90%E7%A7%81%E4%BF%9D%E6%8A%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const config = {
        blurStrength: 20,     // 模糊强度
        btnSize: '2rem',   // 按钮字号
        btnColorActive: '#FF3B3B' // 激活颜色
    };

    // 添加全局样式
    GM_addStyle(`
        .privacy-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            backdrop-filter: blur(${config.blurStrength}px);
            -webkit-backdrop-filter: blur(${config.blurStrength}px);
            z-index: 2147483647;
            display: none;
            justify-content: center;
            align-items: center;
        }

        .warning-text {
            font: 900 4rem 'Arial Black', sans-serif;
            color: ${config.btnColorActive};
            text-shadow: 0 0 20px rgba(255,59,59,0.3);
            letter-spacing: 2px;
            animation: glitch 1s infinite;
        }

        #privacySwitch {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            font-family: 'Arial';
            font-size: ${config.btnSize};
            font-weight: 900;
            color: #666;
            cursor: pointer;
            z-index: 2147483647;
            transition: all 0.3s;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            background: none !important;
            border: none !important;
        }

        #privacySwitch:hover {
            color: #333;
            transform: scale(1.1);
        }

        #privacySwitch.active {
            color: ${config.btnColorActive};
            animation: pulse 1s infinite;
        }

        @keyframes glitch {
            0% { text-shadow: 2px 0 0 #FF0000, -2px 0 0 #00FF00; }
            25% { transform: translate(2px); }
            50% { transform: translate(-2px); }
            75% { transform: translate(1px); }
            100% { transform: translate(0); }
        }

        @keyframes pulse {
            0% { opacity: 0.8; }
            50% { opacity: 1; }
            100% { opacity: 0.8; }
        }
    `);

    // 创建元素
    const overlay = document.createElement('div');
    overlay.className = 'privacy-overlay';
    overlay.innerHTML = '<div class="warning-text">LOOK-WHAT-LOOK</div>';

    const btn = document.createElement('div');
    btn.id = 'privacySwitch';
    btn.textContent = 'OFF';

    // 状态管理
    let isActive = false;

    // 切换功能
    const toggleProtection = () => {
        isActive = !isActive;

        if (isActive) {
            overlay.style.display = 'flex';
            btn.textContent = 'ON';
            btn.classList.add('active');
            document.documentElement.style.overflow = 'hidden';
        } else {
            overlay.style.display = 'none';
            btn.textContent = 'OFF';
            btn.classList.remove('active');
            document.documentElement.style.overflow = '';
        }
    };

    // 初始化
    window.addEventListener('load', () => {
        document.body.appendChild(overlay);
        document.body.appendChild(btn);
        btn.addEventListener('click', toggleProtection);
    });
})();