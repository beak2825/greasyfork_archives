// ==UserScript==
// @name         Grok网站背景颜色自定义工具
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  此脚本允许用户在Grok.com网站上将所有黄色背景（如输入框和信息框）更改为自定义的浅灰色或其他指定颜色。通过悬浮按钮快速选择并应用新的背景颜色。
// @author       caojian
// @match        *://*.grok.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @tag          Grok
// @tag          Grok3
// @tag          背景颜色
// @tag          定制化
// @downloadURL https://update.greasyfork.org/scripts/527542/Grok%E7%BD%91%E7%AB%99%E8%83%8C%E6%99%AF%E9%A2%9C%E8%89%B2%E8%87%AA%E5%AE%9A%E4%B9%89%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/527542/Grok%E7%BD%91%E7%AB%99%E8%83%8C%E6%99%AF%E9%A2%9C%E8%89%B2%E8%87%AA%E5%AE%9A%E4%B9%89%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const colorGroups = [
        // 灰色系
        [
            { color: '#e0e0e0', name: '灰 1' },
            { color: '#e8e8e8', name: '灰 2' },
            { color: '#f0f0f0', name: '灰 3' }
        ],
        // 蓝色系
        [
            { color: '#d6e4ff', name: '蓝 1' },
            { color: '#e6f0fa', name: '蓝 2' },
            { color: '#f0f7ff', name: '蓝 3' }
        ],
        // 绿色系
        [
            { color: '#e6ffe6', name: '绿 1' },
            { color: '#f0fff0', name: '绿 2' },
            { color: '#f5fff5', name: '绿 3' }
        ]
    ];

    let selectedColor = GM_getValue('selectedColor') || '#e8e8e8';
    let previousColor = selectedColor;
    let panelElement;
    let buttonElement;

    function createColorPicker() {
        const button = document.createElement('div');
        button.textContent = '🎨';
        button.className = 'color-picker-button'; // 添加类名以应用样式
        button.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 40px;
            height: 40px;
            background: #fff;
            border-radius: 50%;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 10000;
            font-size: 20px;
            user-select: none; /* 禁用文本选择 */
        `;
        buttonElement = button;

        // 添加按钮样式，覆盖默认高亮
        const buttonStyle = document.createElement('style');
        buttonStyle.textContent = `
            .color-picker-button:active {
                background: #fff !important; /* 点击时强制白色背景 */
            }
            .color-picker-button::selection,
            .color-picker-button *::selection {
                background: transparent !important; /* 禁用emoji选择背景 */
            }
        `;
        document.head.appendChild(buttonStyle);

        const panel = document.createElement('div');
        panel.style.cssText = `
            position: absolute;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(5px);
            border-radius: 10px;
            padding: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            z-index: 10000;
            display: none;
            width: 240px;
        `;
        panel.className = 'color-picker-panel';
        panelElement = panel;
        button.appendChild(panel);

        const arrowStyle = document.createElement('style');
        arrowStyle.id = 'arrow-style';
        document.head.appendChild(arrowStyle);

        function updatePanelPosition() {
            const buttonRect = button.getBoundingClientRect();
            const panelRect = panel.getBoundingClientRect();
            const arrowSize = 8;
            let isAbove = false;

            if (buttonRect.bottom + panelRect.height + arrowSize > window.innerHeight) {
                panel.style.top = `-${panelRect.height + arrowSize}px`;
                panel.style.bottom = 'auto';
                isAbove = true;
            } else {
                panel.style.top = `${buttonRect.height + arrowSize}px`;
                panel.style.bottom = 'auto';
                isAbove = false;
            }

            panel.style.right = '0px';
            if (panelRect.right > window.innerWidth) {
                panel.style.right = `-${panelRect.width - buttonRect.width}px`;
            }

            const arrow = document.getElementById('arrow-style');
            arrow.textContent = `
                .color-picker-panel::before {
                    content: '';
                    position: absolute;
                    ${isAbove ? 'bottom: -8px;' : 'top: -8px;'}
                    right: 10px;
                    width: 0;
                    height: 0;
                    border-left: 8px solid transparent;
                    border-right: 8px solid transparent;
                    ${isAbove ? 'border-top: 8px solid rgba(255, 255, 255, 0.95);' : 'border-bottom: 8px solid rgba(255, 255, 255, 0.95);'}
                    z-index: 10001;
                }
            `;
        }

        colorGroups.forEach((group, index) => {
            const groupDiv = document.createElement('div');
            groupDiv.style.cssText = `
                display: flex;
                justify-content: space-between;
                margin-bottom: ${index < colorGroups.length - 1 ? '10px' : '0'};
            `;

            group.forEach(({ color, name }) => {
                const option = document.createElement('div');
                option.className = 'color-option';
                option.dataset.color = color;
                option.style.cssText = `
                    display: flex;
                    align-items: center;
                    padding: 5px;
                    border-radius: 5px;
                    cursor: pointer;
                    background: ${color === selectedColor ? 'rgba(0,123,255,0.2)' : 'transparent'};
                    flex: 1;
                    margin-right: 5px;
                `;
                option.onmouseover = () => {
                    if (option.dataset.color !== selectedColor) {
                        option.style.background = 'rgba(0,0,0,0.05)';
                    }
                };
                option.onmouseout = () => {
                    if (option.dataset.color !== selectedColor) {
                        option.style.background = 'transparent';
                    }
                };

                const colorBlock = document.createElement('div');
                colorBlock.style.cssText = `
                    width: 18px;
                    height: 18px;
                    background: ${color};
                    margin-right: 8px;
                    border: 1px solid #ccc;
                    border-radius: 3px;
                `;

                const text = document.createElement('span');
                text.textContent = name;
                text.style.cssText = `
                    font-size: 12px;
                    color: #333;
                `;

                option.appendChild(colorBlock);
                option.appendChild(text);
                option.onclick = (e) => {
                    e.stopPropagation();
                    previousColor = selectedColor;
                    selectedColor = color;
                    GM_setValue('selectedColor', color);
                    changeBackgroundColor();
                    updateSelection(panel, color);
                    panel.style.display = 'block';
                    updatePanelPosition();
                };
                groupDiv.appendChild(option);
            });

            panel.appendChild(groupDiv);
        });

        button.onclick = (e) => {
            e.stopPropagation();
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            if (panel.style.display === 'block') {
                updatePanelPosition();
                updateSelection(panel, selectedColor);
            }
        };

        let isDragging = false;
        let offsetX, offsetY;
        button.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            isDragging = true;
            offsetX = e.clientX - button.getBoundingClientRect().left;
            offsetY = e.clientY - button.getBoundingClientRect().top;
            button.style.cursor = 'grabbing';
            button.style.background = '#fff'; // 拖拽时强制白色背景
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const buttonWidth = button.offsetWidth;
                const buttonHeight = button.offsetHeight;
                const margin = 10;
                let x = e.clientX - offsetX;
                let y = e.clientY - offsetY;

                x = Math.max(margin, Math.min(x, window.innerWidth - buttonWidth - margin));
                y = Math.max(margin, Math.min(y, window.innerHeight - buttonHeight - margin));

                button.style.left = `${x}px`;
                button.style.top = `${y}px`;
                button.style.right = 'auto';
                if (panel.style.display === 'block') {
                    updatePanelPosition();
                }
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                button.style.cursor = 'pointer';
                button.style.background = '#fff'; // 恢复白色背景
            }
        });

        document.addEventListener('click', (e) => {
            if (panel.style.display === 'block' &&
                !panel.contains(e.target) &&
                !button.contains(e.target)) {
                panel.style.display = 'none';
            }
        });

        if (document.body) {
            document.body.appendChild(button);
            console.log('Button added to document body');
        } else {
            console.error('Document body not found');
        }
    }

    function updateSelection(panel, selected) {
        const options = panel.getElementsByClassName('color-option');
        for (let option of options) {
            const color = option.dataset.color;
            const isSelected = color.toLowerCase() === selected.toLowerCase();
            option.style.background = isSelected ? 'rgba(0,123,255,0.2)' : 'transparent';
        }
    }

    function rgbToHex(rgb) {
        const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (match) {
            return '#' + [match[1], match[2], match[3]].map(x => {
                const hex = parseInt(x).toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }).join('');
        }
        return rgb;
    }

    function parseRGBA(color) {
        const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (match) {
            return {
                r: parseInt(match[1]),
                g: parseInt(match[2]),
                b: parseInt(match[3]),
                a: match[4] ? parseFloat(match[4]) : 1
            };
        }
        return null;
    }

    function hexToRGB(hex) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function isYellowVariant(bgColor) {
        const color = parseRGBA(bgColor);
        if (color) {
            return color.r > 200 && color.g > 200 && color.b < 50;
        }
        const yellowVariants = ['#ffff00', '#ff0', 'yellow'];
        return yellowVariants.includes(bgColor.toLowerCase());
    }

    function isPreviousColor(bgColor) {
        const currentColor = parseRGBA(bgColor);
        const prevColor = hexToRGB(previousColor) || parseRGBA(previousColor);

        if (currentColor && prevColor) {
            return currentColor.r === prevColor.r &&
                   currentColor.g === prevColor.g &&
                   currentColor.b === prevColor.b;
        }
        return bgColor.toLowerCase() === previousColor.toLowerCase();
    }

    function changeBackgroundColor() {
        try {
            const elements = document.getElementsByTagName('*');
            for (let element of elements) {
                if (panelElement && panelElement.contains(element)) {
                    continue;
                }
                const style = window.getComputedStyle(element);
                const bgColor = style.backgroundColor;
                if (isYellowVariant(bgColor) || isPreviousColor(bgColor)) {
                    element.style.setProperty('background-color', selectedColor, 'important');
                }
            }
        } catch (error) {
            console.error('Error in changeBackgroundColor:', error);
        }
    }

    function init() {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            createColorPicker();
            changeBackgroundColor();
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                createColorPicker();
                changeBackgroundColor();
            });
        }
    }

    init();

    const observer = new MutationObserver(changeBackgroundColor);
    observer.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true
    });
})();