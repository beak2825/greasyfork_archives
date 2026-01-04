// ==UserScript==
// @name           最美字迹放大镜
// @version         1.0
// @description  在鼠标划过文本时显示悬浮放大的效果，带有亚克力模糊背景。提供更多个性化设置选项。
// @author         hiisme
// @match          *://*/*
// @grant           GM_registerMenuCommand
// @grant           GM_setValue
// @grant           GM_getValue
// @namespace https://greasyfork.org/users/217852
// @downloadURL https://update.greasyfork.org/scripts/506617/%E6%9C%80%E7%BE%8E%E5%AD%97%E8%BF%B9%E6%94%BE%E5%A4%A7%E9%95%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/506617/%E6%9C%80%E7%BE%8E%E5%AD%97%E8%BF%B9%E6%94%BE%E5%A4%A7%E9%95%9C.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    // 默认设置
    const defaultSettings = {
        fontSize: GM_getValue('fontSize', '24px'),
        textColor: GM_getValue('textColor', '#000000'),
        borderColor: GM_getValue('borderColor', '#ccc'),
        transitionDuration: GM_getValue('transitionDuration', '0.3s'),
        acrylicBlur: GM_getValue('acrylicBlur', true),
        noBorder: GM_getValue('noBorder', false),
        textOpacity: GM_getValue('textOpacity', 1),
        backgroundOpacity: GM_getValue('backgroundOpacity', 0.2),
        acrylicStrength: GM_getValue('acrylicStrength', 10),
        fontWeight: GM_getValue('fontWeight', 'normal')
    };
    let settings = { ...defaultSettings };

    // 创建悬浮放大的文本容器
    const zoomBox = document.createElement('div');
    Object.assign(zoomBox.style, {
        position: 'absolute',
        padding: '5px',
        color: settings.textColor,
        border: settings.noBorder ? 'none' : `1px solid ${settings.borderColor}`,
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
        pointerEvents: 'none',
        zIndex: '10000',
        display: 'none',
        fontSize: settings.fontSize,
        fontWeight: settings.fontWeight,
        transition: `transform ${settings.transitionDuration} ease-out, opacity ${settings.transitionDuration} ease-out`,
        transform: 'scale(0.9)',
        opacity: settings.textOpacity,
        backgroundColor: `rgba(255, 255, 255, ${settings.backgroundOpacity})`,
        backdropFilter: settings.acrylicBlur ? `blur(${settings.acrylicStrength}px)` : 'none',
        webkitBackdropFilter: settings.acrylicBlur ? `blur(${settings.acrylicStrength}px)` : 'none'
    });
    document.body.appendChild(zoomBox);

    let currentElement = null; // 当前的元素引用
    let currentLineIndex = -1; // 当前显示的行索引

    // 获取元素的每一行文本内容
    const getTextLinesFromElement = (element) => {
        return Array.from(element.childNodes)
            .filter(node => node.nodeType === Node.TEXT_NODE || (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'br'))
            .reduce((acc, node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    acc.push(node.textContent.trim());
                } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'br') {
                    acc.push('\n');
                }
                return acc;
            }, [])
            .filter(line => line.trim().length > 0);
    };

    // 显示放大的文本
    const showZoomBox = (lines, index, x, y) => {
        if (index < 0 || index >= lines.length) return;
        zoomBox.textContent = lines[index];
        zoomBox.style.left = `${x + 10}px`;
        zoomBox.style.top = `${y + 10}px`;
        zoomBox.style.display = 'block';
        requestAnimationFrame(() => {
            zoomBox.style.transform = 'scale(1)';
            zoomBox.style.opacity = settings.textOpacity;
        });
    };

    // 隐藏放大的文本
    const hideZoomBox = () => {
        zoomBox.style.transform = 'scale(0.9)';
        zoomBox.style.opacity = '0';
        zoomBox.addEventListener('transitionend', () => {
            if (currentElement === null) {
                zoomBox.style.display = 'none';
            }
        }, { once: true });
    };

    // 事件处理：被动事件监听器
    document.body.addEventListener('mouseover', (e) => {
        const lines = getTextLinesFromElement(e.target);
        if (lines.length > 0 && e.target !== currentElement) {
            currentElement = e.target;
            currentLineIndex = 0;
            showZoomBox(lines, currentLineIndex, e.pageX, e.pageY);
        }
    }, { passive: true });

    document.body.addEventListener('mousemove', (e) => {
        if (currentElement) {
            zoomBox.style.left = `${e.pageX + 10}px`;
            zoomBox.style.top = `${e.pageY + 10}px`;
            const lines = getTextLinesFromElement(currentElement);
            const index = Math.floor((e.clientY - currentElement.getBoundingClientRect().top) / 20); // 根据行高计算行索引
            if (index >= 0 && index < lines.length && index !== currentLineIndex) {
                currentLineIndex = index;
                showZoomBox(lines, currentLineIndex, e.pageX, e.pageY);
            }
        }
    }, { passive: true });

    document.body.addEventListener('mouseout', (e) => {
        if (e.target === currentElement) {
            currentElement = null;
            currentLineIndex = -1;
            hideZoomBox();
        }
    }, { passive: true });

    // 注册菜单命令，用于调整设置
    const registerMenuCommands = () => {
        GM_registerMenuCommand('设置字体大小', async () => {
            const fontSize = prompt('请输入字体大小 (例如: 24px):', settings.fontSize);
            if (fontSize) {
                settings.fontSize = fontSize;
                GM_setValue('fontSize', fontSize);
                zoomBox.style.fontSize = fontSize;
            }
        });

        GM_registerMenuCommand('设置文字颜色', async () => {
            const textColor = prompt('请输入文字颜色 (例如: #000000):', settings.textColor);
            if (textColor) {
                settings.textColor = textColor;
                GM_setValue('textColor', textColor);
                zoomBox.style.color = textColor;
            }
        });

        GM_registerMenuCommand('设置边框颜色', async () => {
            const borderColor = prompt('请输入边框颜色 (例如: #ccc):', settings.borderColor);
            if (borderColor) {
                settings.borderColor = borderColor;
                GM_setValue('borderColor', borderColor);
                zoomBox.style.border = settings.noBorder ? 'none' : `1px solid ${borderColor}`;
            }
        });

        GM_registerMenuCommand('切换边框', async () => {
            settings.noBorder = !settings.noBorder;
            GM_setValue('noBorder', settings.noBorder);
            zoomBox.style.border = settings.noBorder ? 'none' : `1px solid ${settings.borderColor}`;
            alert(`边框已${settings.noBorder ? '隐藏' : '显示'}`);
        });

        GM_registerMenuCommand('设置文本不透明度', async () => {
            const textOpacity = parseFloat(prompt('请输入文本不透明度 (0 到 1):', settings.textOpacity));
            if (textOpacity >= 0 && textOpacity <= 1) {
                settings.textOpacity = textOpacity;
                GM_setValue('textOpacity', textOpacity);
                zoomBox.style.opacity = textOpacity;
            }
        });

        GM_registerMenuCommand('设置背景不透明度', async () => {
            const backgroundOpacity = parseFloat(prompt('请输入背景不透明度 (0 到 1):', settings.backgroundOpacity));
            if (backgroundOpacity >= 0 && backgroundOpacity <= 1) {
                settings.backgroundOpacity = backgroundOpacity;
                GM_setValue('backgroundOpacity', backgroundOpacity);
                zoomBox.style.backgroundColor = `rgba(255, 255, 255, ${backgroundOpacity})`;
            }
        });

        GM_registerMenuCommand('设置亚克力模糊强度', async () => {
            const acrylicStrength = parseInt(prompt('请输入亚克力模糊强度 (像素):', settings.acrylicStrength), 10);
            if (acrylicStrength >= 0) {
                settings.acrylicStrength = acrylicStrength;
                GM_setValue('acrylicStrength', acrylicStrength);
                zoomBox.style.backdropFilter = settings.acrylicBlur ? `blur(${acrylicStrength}px)` : 'none';
                zoomBox.style.webkitBackdropFilter = settings.acrylicBlur ? `blur(${acrylicStrength}px)` : 'none';
            }
        });

        GM_registerMenuCommand('切换亚克力模糊', async () => {
            settings.acrylicBlur = !settings.acrylicBlur;
            GM_setValue('acrylicBlur', settings.acrylicBlur);
            zoomBox.style.backdropFilter = settings.acrylicBlur ? `blur(${settings.acrylicStrength}px)` : 'none';
            zoomBox.style.webkitBackdropFilter = settings.acrylicBlur ? `blur(${settings.acrylicStrength}px)` : 'none';
            alert(`亚克力模糊已${settings.acrylicBlur ? '启用' : '禁用'}`);
        });

        GM_registerMenuCommand('设置过渡时间', async () => {
            const transitionDuration = prompt('请输入过渡时间 (例如: 0.3s):', settings.transitionDuration);
            if (transitionDuration) {
                settings.transitionDuration = transitionDuration;
                GM_setValue('transitionDuration', transitionDuration);
                zoomBox.style.transition = `transform ${transitionDuration} ease-out, opacity ${transitionDuration} ease-out`;
            }
        });

        GM_registerMenuCommand('设置字体粗细', async () => {
            const fontWeight = prompt('请输入字体粗细 (例如: normal, bold):', settings.fontWeight);
            if (fontWeight) {
                settings.fontWeight = fontWeight;
                GM_setValue('fontWeight', fontWeight);
                zoomBox.style.fontWeight = fontWeight;
            }
        });
    };

    registerMenuCommands();
})();