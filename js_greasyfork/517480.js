// ==UserScript==
// @name         Design Tokens
// @namespace    http://tampermonkey.net/
// @description  从 Figma 设计稿提取所用到的库颜色
// @version      2024-11-15
// @author       You
// @match        https://*.figma.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=figma.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517480/Design%20Tokens.user.js
// @updateURL https://update.greasyfork.org/scripts/517480/Design%20Tokens.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 将 Figma 的颜色格式转换为 RGBA 格式
    function colorToRGBA(color, opacity) {
        const r = Math.round(color.r * 255);
        const g = Math.round(color.g * 255);
        const b = Math.round(color.b * 255);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`; // 使用 paint.opacity 作为 alpha 值
    }

    // 迭代函数用于遍历节点并提取具有 fillStyleId 的填充样式
    function extractPaintStyles(rootNode) {
        const styles = [];
        const uniqueStyles = {}; // 用于去重的对象
        const stack = [rootNode]; // 使用栈来存储待处理的节点

        function processNodes() {
            let count = 0; // 计数处理的节点数量

            while (stack.length > 0 && count < 10) {
                const node = stack.pop(); // 从栈中取出一个节点

                // 仅处理具有填充样式的节点
                if ("fills" in node && node.fills.length > 0) {
                    // 检查节点是否有 fillStyleId
                    if (node.fillStyleId) {
                        const style = figma.getStyleById(node.fillStyleId);
                        if (style) {
                            // 检查样式类型是否为 PAINT
                            if (style.type === 'PAINT') {
                                // 提取颜色信息
                                const paint = style.paints[0]; // 假设样式只包含一个填充
                                if (paint && paint.type === 'SOLID') {
                                    const rgbaColor = colorToRGBA(paint.color, paint.opacity); // 使用 paint.opacity
                                    const styleKey = style.name; // 使用样式名称作为唯一标识

                                    // 去重逻辑
                                    if (!uniqueStyles[styleKey]) {
                                        uniqueStyles[styleKey] = {
                                            name: style.name,
                                            description: style.description || 'No description',
                                            rgba: rgbaColor
                                        };
                                    }
                                }
                            } else {
                                console.error(`Node has a fillStyleId that is not a paint style: ${style.type}`);
                            }
                        }
                    }
                }

                // 如果节点有子节点，则将子节点添加到栈中
                if ("children" in node) {
                    for (const child of node.children) {
                        stack.push(child); // 将子节点推入栈中
                    }
                }

                count++; // 增加计数
            }

            // 如果还有节点未处理，设置延迟后继续处理
            if (stack.length > 0) {
                setTimeout(processNodes, 1); // 每 1 毫秒继续处理
            } else {
                // 所有节点处理完成，输出结果
                const result = Object.values(uniqueStyles); // 将对象转换为数组
                result.sort((a, b) => a.name.localeCompare(b.name)); // 按名称排序
                console.log('Extracted Paint Styles:', result);
                alert('提取完成，请查看控制台输出');
            }
        }

        // 启动节点处理
        processNodes();
    }

    // 添加一个按钮到页面
    const button = document.createElement('button');
    button.innerText = '提取填充样式';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = 1000;
    button.style.padding = '10px';
    button.style.backgroundColor = '#007bff';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    // 点击按钮时提取样式
    button.onclick = () => {
        const rootNode = figma.currentPage; // 使用 Figma 的 API 获取当前页面

        try {
            extractPaintStyles(rootNode);
        } catch (error) {
            console.error(error.message);
            alert('提取过程中发生错误，请查看控制台');
        }
    };

    // 将按钮添加到页面
    document.body.appendChild(button);
})();
