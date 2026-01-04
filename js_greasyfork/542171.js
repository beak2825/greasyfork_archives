// ==UserScript==
// @name         网站备注提示 (智能变色版)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  在网站右下角添加一个更小巧、能自动适应网站主题色的悬浮按钮，方便您添加和查看私人备注。
// @author       YourName
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542171/%E7%BD%91%E7%AB%99%E5%A4%87%E6%B3%A8%E6%8F%90%E7%A4%BA%20%28%E6%99%BA%E8%83%BD%E5%8F%98%E8%89%B2%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542171/%E7%BD%91%E7%AB%99%E5%A4%87%E6%B3%A8%E6%8F%90%E7%A4%BA%20%28%E6%99%BA%E8%83%BD%E5%8F%98%E8%89%B2%E7%89%88%29.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // 如果页面是框架页(iframe)，则不执行脚本，避免在广告或嵌入内容中出现按钮
    if (window.top !== window.self) {
        return;
    }

    // --- 1. 样式定义 ---
    GM_addStyle(`
        /* 悬浮按钮样式 (更小) */
        #site-note-fab {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px; /* 改小 */
            height: 50px; /* 改小 */
            background-color: #e0e0e0; /* 默认灰色 */
            color: #333;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 12px; /* 字体也改小一点 */
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            z-index: 2147483647;
            transition: all 0.2s ease-in-out;
            user-select: none;
        }

        /* 当有备注时，按钮的提示样式 (优先级最高) */
        #site-note-fab.has-note {
            background-color: #ffc107 !important; /* 使用 !important 确保覆盖主题色 */
            color: #333 !important;
        }

        /* 鼠标悬停效果 */
        #site-note-fab:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 12px rgba(0,0,0,0.3);
        }

        /* 模态框及其他样式 (与之前版本相同) */
        #site-note-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: none; justify-content: center; align-items: center; z-index: 2147483647; }
        #site-note-modal-content { background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); width: 90%; max-width: 500px; display: flex; flex-direction: column; gap: 15px; }
        #site-note-modal-content h2 { margin: 0; padding-bottom: 10px; border-bottom: 1px solid #eee; font-size: 18px; word-break: break-all; }
        #site-note-textarea { width: 100%; height: 200px; padding: 10px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; resize: vertical; }
        #site-note-buttons { display: flex; justify-content: flex-end; gap: 10px; }
        .site-note-btn { padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: bold; }
        #site-note-save-btn { background-color: #28a745; color: white; } #site-note-save-btn:hover { background-color: #218838; }
        #site-note-close-btn { background-color: #6c757d; color: white; } #site-note-close-btn:hover { background-color: #5a6268; }
    `);

    // --- 2. 颜色处理工具函数 ---

    /**
     * 解析颜色字符串 (如 "rgb(255, 255, 255)") 为 [r, g, b] 数组
     */
    const parseRgb = (rgbString) => {
        const match = rgbString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        return match ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])] : null;
    };

    /**
     * 检查颜色是否可用作按钮背景（非白、非黑、非透明）
     */
    const isColorUsable = (colorString) => {
        if (!colorString || colorString === 'transparent' || colorString.includes('rgba(0, 0, 0, 0)')) {
            return false;
        }
        const rgb = parseRgb(colorString);
        if (!rgb) return true; // 如果无法解析(如'red'), 姑且认为可用

        const [r, g, b] = rgb;
        // 过滤掉非常亮 (接近白色) 和非常暗 (接近黑色) 的颜色
        const brightness = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
        return brightness > 30 && brightness < 240;
    };

    /**
     * 根据背景色计算出对比度高的文字颜色（黑色或白色）
     */
    const getContrastingTextColor = (bgColor) => {
        if (!bgColor) return '#333333';
        const rgb = parseRgb(bgColor);
        if (!rgb) return '#333333'; // 无法解析则返回默认黑色

        // W3C亮度计算公式
        const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
        return luminance > 0.5 ? '#333333' : '#FFFFFF';
    };

    /**
     * 尝试获取网站的主题色
     */
    const getSiteThemeColor = () => {
        // 1. 优先使用 meta theme-color
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor && metaThemeColor.content) {
            return metaThemeColor.content;
        }

        // 2. 尝试获取 header 或 nav 的背景色
        const header = document.querySelector('header, nav, [role="banner"]');
        if (header) {
            const headerColor = window.getComputedStyle(header).backgroundColor;
            if (isColorUsable(headerColor)) {
                return headerColor;
            }
        }

        // 3. 尝试获取 body 的背景色
        const bodyColor = window.getComputedStyle(document.body).backgroundColor;
        if (isColorUsable(bodyColor)) {
            return bodyColor;
        }

        return null; // 找不到合适颜色
    };


    // --- 3. 创建UI和核心逻辑 ---
    const domain = window.location.hostname;
    const storageKey = `site_note_for_${domain}`;

    // 创建悬浮按钮
    const fab = document.createElement('div');
    fab.id = 'site-note-fab';
    fab.textContent = '备注';
    document.body.appendChild(fab);

    // 创建模态框 (HTML结构不变)
    const modalHTML = `
        <div id="site-note-modal-overlay">
            <div id="site-note-modal-content">
                <h2 id="site-note-title"></h2>
                <textarea id="site-note-textarea" placeholder="在此输入关于这个网站的备注..."></textarea>
                <div id="site-note-buttons">
                    <button id="site-note-close-btn" class="site-note-btn">关闭</button>
                    <button id="site-note-save-btn" class="site-note-btn">保存</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modalOverlay = document.getElementById('site-note-modal-overlay');
    const noteTextarea = document.getElementById('site-note-textarea');
    const saveButton = document.getElementById('site-note-save-btn');
    const closeButton = document.getElementById('site-note-close-btn');
    document.getElementById('site-note-title').textContent = `网站备注 (${domain})`;


    // 函数：打开/关闭/保存 (逻辑不变)
    const openModal = async () => {
        noteTextarea.value = await GM_getValue(storageKey, '');
        modalOverlay.style.display = 'flex';
        noteTextarea.focus();
    };
    const closeModal = () => modalOverlay.style.display = 'none';
    const saveNote = async () => {
        const noteText = noteTextarea.value.trim();
        await GM_setValue(storageKey, noteText);
        showToast('备注已保存！');
        closeModal();
        updateFabStatus(); // 更新按钮状态
    };

    // 函数：更新悬浮按钮的状态和颜色
    const updateFabStatus = async () => {
        const existingNote = await GM_getValue(storageKey, '');
        if (existingNote) {
            fab.classList.add('has-note');
        } else {
            fab.classList.remove('has-note');
            // 仅在没有备注时应用主题色
            const themeColor = getSiteThemeColor();
            if (themeColor) {
                fab.style.backgroundColor = themeColor;
                fab.style.color = getContrastingTextColor(themeColor);
            }
        }
    };

    // 函数：显示一个短暂的提示信息 (Toast)
    const showToast = (message) => {
        let toast = document.getElementById('site-note-toast');
        if (toast) toast.remove();

        toast = document.createElement('div');
        toast.id = 'site-note-toast';
        toast.textContent = message;
        GM_addStyle(`#site-note-toast { position: fixed; bottom: 80px; right: 20px; background-color: rgba(0,0,0,0.7); color: white; padding: 10px 20px; border-radius: 5px; z-index: 2147483647; opacity: 0; transition: opacity 0.5s; font-size: 14px; }`);
        document.body.appendChild(toast);

        setTimeout(() => { toast.style.opacity = '1'; }, 10);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => { toast.remove(); }, 500);
        }, 2000);
    };


    // --- 4. 绑定事件和初始化 ---
    fab.addEventListener('click', openModal);
    saveButton.addEventListener('click', saveNote);
    closeButton.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => e.target === modalOverlay && closeModal());
    document.addEventListener('keydown', (e) => e.key === 'Escape' && modalOverlay.style.display === 'flex' && closeModal());

    // 初始化：立即更新一次按钮状态和颜色
    updateFabStatus();

})();