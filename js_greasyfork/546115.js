// ==UserScript==
// @name         Bilibili分享优化
// @description  劫持Bilibili分享按钮，直接提取分享文本，让分享更加清爽
// @version      0.6
// @author       DoubleCat
// @copyright    2025, DoubleCat (https://github.com/doublebobcat)
// @match        https://www.bilibili.com/video/*
// @license      GPL_V3
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://raw.githubusercontent.com/doublebobcat/Bilibili-Share-Optimization/master/images/logo-small.png
// @icon64       https://raw.githubusercontent.com/doublebobcat/Bilibili-Share-Optimization/master/images/logo.png
// @namespace https://greasyfork.org/users/1505795
// @downloadURL https://update.greasyfork.org/scripts/546115/Bilibili%E5%88%86%E4%BA%AB%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/546115/Bilibili%E5%88%86%E4%BA%AB%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const defaultStyles = {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        backgroundColor: 'rgba(255, 255, 255, 1)',
        color: '#000',
        padding: '12px 18px',
        borderRadius: '6px',
        zIndex: 9999,
        fontSize: '16px',
        transition: 'opacity 0.5s ease',
        opacity: '1'
    };

    const maxChars = 70;
    const maxLines = 4;

    let styles = defaultStyles;

    // 从存储加载配置
    function loadConfig() {
        try {
            const config = GM_getValue('messageStyles');
            return config ? JSON.parse(config) : defaultStyles;
        } catch (err) {
            return defaultStyles;
        }
    }

    // 保存配置
    function saveConfig(config) {
        GM_setValue('messageStyles', JSON.stringify(config));
    }

    function extractWithXPath(xpathExpression) {
        const result = document.evaluate(xpathExpression, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        return result.singleNodeValue ? result.singleNodeValue.textContent : '未找到';
    }

    async function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch (err) {
                console.warn('[Bilibili-Share-Optimization] Clipboard API 失败，回退到 execCommand');
            }
        }
        // fallback
        const tempInput = document.createElement('textarea');
        tempInput.style.position = 'absolute';
        tempInput.style.left = '-9999px';
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        return true;
    }

    function copyInfo() {
        const pageURL = window.location.href;
        const title = extractWithXPath('/html/body/div[2]/div[2]/div[1]/div[1]/div[1]/div/h1').trim();
        let nickname = extractWithXPath('/html/body/div[2]/div[2]/div[2]/div/div[1]/div[1]/div[2]/div[1]/div/div[1]/a[1]').trim();
        if (nickname === '直播中') {
            nickname = extractWithXPath('/html/body/div[2]/div[2]/div[2]/div/div[1]/div[1]/div[2]/div[1]/div/div[1]/a[2]').trim();
        }
        let description = extractWithXPath('/html/body/div[2]/div[2]/div[1]/div[4]/div/span').trim();

        let lines = description.split(/\r?\n/);

        if (description.length > maxChars || lines.length > maxLines) {
            // 先按字符限制截断
            let truncated = description.substring(0, maxChars);

            // 确保不会超过4行
            let truncatedLines = truncated.split(/\r?\n/).slice(0, maxLines);
            description = truncatedLines.join("\n") + "......";
        }

        const combinedInfo = `URL: ${pageURL}\nUP主: ${nickname}\n标题: ${title}\n简介: ${description}`;

        copyToClipboard(combinedInfo);

        const copiedMessage = document.createElement('div');
        copiedMessage.textContent = '已复制';

        for (const [property, value] of Object.entries(styles)) {
            copiedMessage.style[property] = value;
        }

        document.body.appendChild(copiedMessage);

        setTimeout(() => {
            if (copiedMessage.parentNode) {
                copiedMessage.parentNode.removeChild(copiedMessage);
            }
        }, 3000);
    }

    // 页面加载完毕->劫持分享按钮
    const observer = new MutationObserver(() => {
        const shareBtn = document.querySelector('#share-btn-outer');
        if (shareBtn) {
            try {
                styles = loadConfig();
            } catch (err) {
                styles = defaultStyles;
            }

            // 移除原有点击事件
            shareBtn.replaceWith(shareBtn.cloneNode(true));
            const newShareBtn = document.querySelector('#share-btn-outer');

            // 添加自有点击事件
            newShareBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                e.preventDefault();
                copyInfo();
            });

            console.log('[Bilibili-Share-Optimization] 已劫持B站分享按钮');
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 添加菜单项：打开设置界面
    GM_registerMenuCommand("设置分享窗口样式", openSettingsWindow);

    function openSettingsWindow() {
        const settingsWindow = document.createElement('div');
        settingsWindow.style.position = 'fixed';
        settingsWindow.style.top = '10%';
        settingsWindow.style.left = '50%';
        settingsWindow.style.transform = 'translateX(-50%)';
        settingsWindow.style.backgroundColor = '#000000ff';
        settingsWindow.style.color = '#fff';
        settingsWindow.style.padding = '20px';
        settingsWindow.style.borderRadius = '10px';
        settingsWindow.style.border = '0'
        settingsWindow.style.zIndex = 9999;
        settingsWindow.style.width = '300px';

        settingsWindow.innerHTML = `
            <h3>设置分享窗口样式</h3>
            <label for="backgroundColor">背景颜色:</label>
            <input type="color" id="backgroundColor" value="${styles.backgroundColor}"><br><br>
            <label for="color">字体颜色:</label>
            <input type="color" id="color" value="${styles.color}"><br><br>
            <label for="fontSize">字体大小:</label>
            <input type="number" id="fontSize" value="${parseInt(styles.fontSize)}" min="10" max="30"><br><br>
            <button id="saveButton">保存设置</button>
            <button id="cancelButton">取消</button>
        `;

        document.body.appendChild(settingsWindow);

        document.getElementById('saveButton').addEventListener('click', () => {
            styles.backgroundColor = document.getElementById('backgroundColor').value;
            styles.color = document.getElementById('color').value;
            styles.fontSize = document.getElementById('fontSize').value + 'px';
            saveConfig(styles);
            document.body.removeChild(settingsWindow);
        });

        document.getElementById('cancelButton').addEventListener('click', () => {
            document.body.removeChild(settingsWindow);
        });
    }
})();
