// ==UserScript==
// @name         DSZH - DDMD
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  DSZH - DDMD - 为网页添加实用功能按钮和增强特性
// @author       Trae AI
// @match        *://dszh.xyz/show.php*
// @match        *://dszh.xyz/post.php*
// @match        *://www.dszh.xyz/show.php*
// @match        *://www.dszh.xyz/post.php*
// @match        *://142.54.178.10/show.php*
// @match        *://142.54.178.10/post.php*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527809/DSZH%20-%20DDMD.user.js
// @updateURL https://update.greasyfork.org/scripts/527809/DSZH%20-%20DDMD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 验证URL是否符合要求的格式
    function isValidUrl() {
        const url = new URL(window.location.href);
        console.log('当前URL:', window.location.href);
        console.log('pathname:', url.pathname);
        
        // 验证路径
        const validPaths = ['/show.php', '/post.php'];
        const isValidPath = validPaths.includes(url.pathname);
        console.log('路径是否有效:', isValidPath);
        if (!isValidPath) return false;
        
        // 验证f参数
        const params = url.searchParams;
        const fParam = params.get('f');
        console.log('f参数值:', fParam);
        const isValidF = fParam === '1';
        console.log('f参数是否有效:', isValidF);
        if (!isValidF) return false;
        
        // 根据页面类型执行不同的验证
        if (url.pathname === '/show.php') {
            console.log('页面类型: 回帖页面');
            // 回帖页面需要验证t和m参数
            const t = params.get('t');
            const m = params.get('m');
            console.log('t参数值:', t);
            console.log('m参数值:', m);
            
            const validNumberRegex = /^[12]\d{6,7}$/;
            const isValidT = validNumberRegex.test(t);
            const isValidM = validNumberRegex.test(m);
            console.log('t参数是否有效:', isValidT);
            console.log('m参数是否有效:', isValidM);
            
            return isValidT && isValidM;
        } else if (url.pathname === '/post.php') {
            console.log('页面类型: 发帖页面');
            // 发帖页面只需要验证基本路径和f参数
            return true;
        }
        
        return false;
    }

    // 只在URL符合要求时执行脚本
    if (!isValidUrl()) return;

    // 添加自定义样式
    GM_addStyle(`
        .custom-button {
            position: fixed;
            right: 20px;
            bottom: 20px;
            width: 50px;
            height: 50px;
            padding: 0;
            background-color: #d4b784;
            color: #333;
            border: none;
            border-radius: 15px;
            cursor: pointer;
            z-index: 9999;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            font-size: 24px;
            font-weight: 500;
        }
        .custom-button:hover {
            background-color: #c1a676;
            transform: scale(1.1) translateY(-2px);
            box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
        }
        .menu-container {
            position: fixed;
            right: 20px;
            bottom: 20px;
            z-index: 9998;
            display: none;
        }
        .menu-container.active {
            display: block;
        }
        .menu-item {
            position: absolute;
            right: 0;
            bottom: 0;
            width: 130px;
            height: 45px;
            background: linear-gradient(135deg, #d4b784 0%, #c1a676 100%);
            color: #333;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            font-weight: 500;
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            letter-spacing: 0.5px;
            opacity: 0;
            transform: translate(0, 0) scale(0.8);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .menu-container.active .menu-item {
            opacity: 1;
            transform: scale(1);
        }
        .menu-container.active .menu-item:hover {
            transform: scale(1.05) translateX(-5px);
            box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
            background: linear-gradient(135deg, #c1a676 0%, #b39565 100%);
        }
        .menu-container.active .menu-item:nth-child(1) {
            transform: translate(0, -180px);
            transition-delay: 0.1s;
        }
        .menu-container.active .menu-item:nth-child(2) {
            transform: translate(0, -120px);
            transition-delay: 0.05s;
        }
        .menu-container.active .menu-item:nth-child(3) {
            transform: translate(0, -60px);
            transition-delay: 0s;
        }
        font-weight: bold;
            text-align: center;
            opacity: 0;
            transform: translate(0, 0) scale(0.5);
        }
        .menu-container.active .menu-item {
            opacity: 1;
            transform: scale(1);
        }
        .menu-container.active .menu-item:nth-child(1) {
            transform: translate(0, -180px);
        }
        .menu-container.active .menu-item:nth-child(2) {
            transform: translate(0, -120px);
        }
        .menu-container.active .menu-item:nth-child(3) {
            transform: translate(0, -60px);
        }
        .confetti {
            position: fixed;
            pointer-events: none;
            z-index: 9999;
        }
        .ddmd-text {
            position: fixed;
            color: #4CAF50;
            font-size: 24px;
            font-weight: bold;
            pointer-events: none;
            z-index: 10000;
            opacity: 0;
            transition: opacity 1s ease;
        }
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 10000;
        }
        .modal-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            width: 80%;
            max-width: 500px;
        }
        .modal-content h2 {
            margin-top: 0;
            color: #333;
        }
        .modal-content input[type="text"] {
            width: 100%;
            padding: 8px;
            margin: 10px 0;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        .iframe-dimensions {
            display: flex;
            gap: 10px;
            margin: 10px 0;
        }
        .dimension-input {
            display: flex;
            align-items: center;
            gap: 5px;
            width: 100%;
        }
        .dimension-input input {
            flex: 1;
            padding: 8px;
            margin: 10px 0;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        .dimension-input select {
            width: 60px;
            padding: 8px;
            margin: 10px 0;
            border: 1px solid #ddd;
            border-radius: 4px;
            background-color: white;
        }
        .modal-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 15px;
        }
        .modal-button {
            padding: 8px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .confirm-button {
            background-color: #4CAF50;
            color: white;
        }
        .cancel-button {
            background-color: #f44336;
            color: white;
        }
    `);

    // 创建功能按钮
    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = 'custom-button';
        button.addEventListener('click', onClick);
        return button;
    }

    // 创建模态对话框
    function createModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>输入要嵌入的URL</h2>
                <p style="color: #ff6b6b; font-style: italic; margin: 10px 0;">强烈建议贴入B站链接后调整尺寸，受不了nami视频啦！</p>
                <input type="text" id="iframe-url" placeholder="请输入URL">
                <div class="iframe-dimensions">
                    <div class="dimension-input">
                        <input type="number" id="iframe-width" placeholder="宽度（默认100）">
                        <select id="iframe-width-unit">
                            <option value="%">%</option>
                            <option value="px">px</option>
                        </select>
                    </div>
                    <div class="dimension-input">
                        <input type="number" id="iframe-height" placeholder="高度（默认600）">
                        <select id="iframe-height-unit">
                            <option value="px">px</option>
                            <option value="%">%</option>
                        </select>
                    </div>
                </div>
                <div class="modal-buttons">
                    <button class="modal-button confirm-button">确认</button>
                    <button class="modal-button cancel-button">取消</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const confirmButton = modal.querySelector('.confirm-button');
        const cancelButton = modal.querySelector('.cancel-button');
        const input = modal.querySelector('#iframe-url');

        confirmButton.addEventListener('click', () => {
            const url = input.value.trim();
            const widthValue = document.querySelector('#iframe-width').value.trim() || '100';
            const heightValue = document.querySelector('#iframe-height').value.trim() || '600';
            const widthUnit = document.querySelector('#iframe-width-unit').value;
            const heightUnit = document.querySelector('#iframe-height-unit').value;
            if (url) {
                const iframeTag = `<iframe src="${url}" width="${widthValue}${widthUnit}" height="${heightValue}${heightUnit}" frameborder="0"></iframe>`;
                const container = document.querySelector('#iframe-container');
                if (container) {
                    container.innerHTML = iframeTag;
                }
                // 找到body下的form中的textarea并追加iframe标签
                const textarea = document.querySelector('body form textarea');
                if (textarea) {
                    const currentContent = textarea.value;
                    textarea.value = currentContent + '\n' + iframeTag;
                }
                console.log('生成的iframe标签：', iframeTag);
            }
            modal.style.display = 'none';
            input.value = '';
            document.querySelector('#iframe-width').value = '';
            document.querySelector('#iframe-height').value = '';
        });

        cancelButton.addEventListener('click', () => {
            modal.style.display = 'none';
            input.value = '';
        });

        return modal;
    }

    // 显示iframe输入对话框
    function showIframeDialog() {
        const modal = document.querySelector('.modal') || createModal();
        modal.style.display = 'block';
    }

    // 创建菜单容器和菜单项
    function createMenu() {
        const menuContainer = document.createElement('div');
        menuContainer.className = 'menu-container';

        const ddmdMenuItem = document.createElement('button');
        ddmdMenuItem.className = 'menu-item';
        ddmdMenuItem.textContent = 'DDMD';
        ddmdMenuItem.addEventListener('click', showDDMDEffect);

        const iframeMenuItem = document.createElement('button');
        iframeMenuItem.className = 'menu-item';
        iframeMenuItem.textContent = '嵌入<iframe>';
        iframeMenuItem.addEventListener('click', showIframeDialog);

        menuContainer.appendChild(ddmdMenuItem);
        menuContainer.appendChild(iframeMenuItem);
        document.body.appendChild(menuContainer);

        return menuContainer;
    }

    // 检查favicon是否存在
    async function checkFaviconExists() {
        try {
            const faviconUrl = new URL('/favicon.ico', window.location.origin).href;
            const response = await fetch(faviconUrl, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            console.error('检查favicon失败:', error);
            return false;
        }
    }

    // 创建主按钮
    async function createMainButton() {
        const button = document.createElement('button');
        button.className = 'custom-button';
        
        // 检查favicon是否存在
        const hasFavicon = await checkFaviconExists();
        
        if (hasFavicon) {
            // 使用favicon作为背景
            const faviconUrl = new URL('/favicon.ico', window.location.origin).href;
            button.style.backgroundImage = `url('${faviconUrl}')`;
            button.style.backgroundSize = '60%';
            button.style.backgroundPosition = 'center';
            button.style.backgroundRepeat = 'no-repeat';
            button.textContent = '';
        } else {
            // 显示"+"符号
            button.textContent = '+';
        }

        // 创建菜单并添加点击事件
        const menu = createMenu();
        let isMenuOpen = false;
        
        button.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            menu.classList.toggle('active', isMenuOpen);
        });
        
        return button;
    }

    // 创建礼花效果
    function createConfetti(x, y) {
        const colors = ['#4CAF50', '#FFC107', '#2196F3', '#E91E63', '#9C27B0'];
        const confettiCount = 50;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = x + 'px';
            confetti.style.top = y + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = '8px';
            confetti.style.height = '8px';
            confetti.style.position = 'fixed';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

            const angle = Math.random() * Math.PI * 2;
            const velocity = 3 + Math.random() * 3;
            const tx = Math.cos(angle) * 100;
            const ty = Math.sin(angle) * 100;

            confetti.animate([
                { transform: 'translate(0, 0) rotate(0deg)' },
                { transform: `translate(${tx}px, ${ty}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
            ], {
                duration: 1000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });

            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 1000);
        }
    }

    // 创建DDMD文字效果
    function createDDMDText(x, y) {
        const text = document.createElement('div');
        text.className = 'ddmd-text';
        text.textContent = 'DDMD';
        text.style.left = x + 'px';
        text.style.top = y + 'px';
        text.style.transform = 'translate(-50%, -50%)';
        document.body.appendChild(text);

        requestAnimationFrame(() => {
            text.style.opacity = '1';
            setTimeout(() => {
                text.style.opacity = '0';
                setTimeout(() => text.remove(), 1000);
            }, 1000);
        });
    }


    // 显示DDMD特效
    function showDDMDEffect() {
        let count = 0;
        const maxCount = 5;
        const interval = setInterval(() => {
            if (count >= maxCount) {
                clearInterval(interval);
                return;
            }
            const x = Math.random() * (window.innerWidth - 100) + 50;
            const y = Math.random() * (window.innerHeight - 100) + 50;
            createConfetti(x, y);
            createDDMDText(x, y);
            count++;
        }, 500);
    }

    // 添加主按钮
    (async () => {
        const mainButton = await createMainButton();
        document.body.appendChild(mainButton);
    })();
})();