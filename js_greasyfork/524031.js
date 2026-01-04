// ==UserScript==
// @name         文档复制助手Plus复制后有标题时间（支持生财有术、小报童、飞书文档）
// @namespace    http://tampermonkey.net/
// @version      3.17
// @description  让飞书文档更好用：添加标题和时间、解除复制限制、支持右键菜单、解除图片复制限制、去除水印、全选时图文一键复制、全选右键菜单复制
// @author       微信11208596
// @match        *://*.feishu.cn/*
// @match        *://*.larkoffice.com/*
// @match        *://scys.com/*
// @match        *://xiaobot.net/*
// @grant        none
// @run-at       document-start
// @license      UNLICENSED
// @downloadURL https://update.greasyfork.org/scripts/524031/%E6%96%87%E6%A1%A3%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8BPlus%E5%A4%8D%E5%88%B6%E5%90%8E%E6%9C%89%E6%A0%87%E9%A2%98%E6%97%B6%E9%97%B4%EF%BC%88%E6%94%AF%E6%8C%81%E7%94%9F%E8%B4%A2%E6%9C%89%E6%9C%AF%E3%80%81%E5%B0%8F%E6%8A%A5%E7%AB%A5%E3%80%81%E9%A3%9E%E4%B9%A6%E6%96%87%E6%A1%A3%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/524031/%E6%96%87%E6%A1%A3%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8BPlus%E5%A4%8D%E5%88%B6%E5%90%8E%E6%9C%89%E6%A0%87%E9%A2%98%E6%97%B6%E9%97%B4%EF%BC%88%E6%94%AF%E6%8C%81%E7%94%9F%E8%B4%A2%E6%9C%89%E6%9C%AF%E3%80%81%E5%B0%8F%E6%8A%A5%E7%AB%A5%E3%80%81%E9%A3%9E%E4%B9%A6%E6%96%87%E6%A1%A3%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 覆盖事件监听器以处理复制和右键菜单事件
    const overrideEventListeners = () => {
        const rawAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function (type, listener, options) {
            if (type === 'copy') {
                rawAddEventListener.call(this, type, event => {
                    event.stopImmediatePropagation();
                    return null;
                }, options);
                return;
            }
            // 对于contextmenu事件，允许原始右键菜单显示
            if (type === 'contextmenu') {
                if (document.getSelection().toString().trim() !== '') {
                    // 如果有选中内容，阻止网站的contextmenu事件处理
                    rawAddEventListener.call(this, type, event => {
                        event.stopImmediatePropagation();
                        return true;
                    }, { capture: true, once: true });
                    return;
                }
            }
            rawAddEventListener.call(this, type, listener, options);
        };
    };

    // 覆盖XMLHttpRequest以修改权限响应
    const overrideXHR = () => {
        const rawOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url, ...rest) {
            this.addEventListener('readystatechange', function () {
                if (this.readyState === 4 && url.includes('space/api/suite/permission/document/actions/state/')) {
                    let response = this.responseText;
                    try {
                        response = JSON.parse(response);
                        if (response.data && response.data.actions) {
                            // 解除复制限制
                            if (response.data.actions.copy !== 1) {
                                response.data.actions.copy = 1;
                            }
                            // 解除图片复制限制
                            if (response.data.actions.export_img !== 1) {
                                response.data.actions.export_img = 1;
                            }
                            Object.defineProperty(this, 'responseText', { value: JSON.stringify(response) });
                            Object.defineProperty(this, 'response', { value: response });
                        }
                    } catch (e) {
                        console.log('修改响应失败:', e);
                    }
                }
            }, false);
            rawOpen.call(this, method, url, ...rest);
        };
    };

    // 获取格式化的当前时间
    function getFormattedTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    // 处理链接
    function processLink(link) {
        return link.split('?')[0];
    }

    // 格式化文本
    function formatText(title, link) {
        return `📄 文件「${title}」\n🔗 链接：\n${processLink(link)}\n🕐 时间「${getFormattedTime()}」\n💡 文件已分享，欢迎查阅，有任何问题都可以随时交流~`;
    }

    // 实现全选时图文一键复制功能
    const enableSelectAllCopy = () => {
        // 监听按键事件，检测Ctrl+A全选操作
        document.addEventListener('keydown', function(e) {
            // 检测是否为Ctrl+A(Windows)或Command+A(Mac)
            if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                // 标记全选状态，稍后在复制事件中使用
                window.isSelectAll = true;
                setTimeout(() => { window.isSelectAll = false; }, 1000); // 1秒后重置
            }
        });

        // 获取选区中的所有图片
        const getImagesInSelection = () => {
            const selection = document.getSelection();
            const range = selection.getRangeAt(0);
            const fragment = range.cloneContents();
            return Array.from(fragment.querySelectorAll('img'));
        };

        // 创建包含文本和图片的HTML内容
        const createHTMLWithImages = (text, images) => {
            if (!images || images.length === 0) return text;

            let html = '<div>' + text.replace(/\n/g, '<br>') + '<br><br>';

            // 添加图片到HTML
            images.forEach(img => {
                const src = img.src;
                if (src) {
                    html += `<img src="${src}" style="max-width: 100%; margin: 10px 0;"><br>`;
                }
            });

            html += '</div>';
            return html;
        };

        // 修改复制事件处理
        document.addEventListener('copy', function(e) {
            try {
                const selection = document.getSelection();
                const text = selection.toString();

                // 如果是飞书链接的特殊处理，保持原有功能
                if (text && text.includes('feishu.cn/')) {
                    const title = document.title.split(' - ')[0].trim();
                    if (!title || text.includes(title)) return;

                    e.preventDefault();
                    e.clipboardData.setData('text/plain', formatText(title, text));
                    return;
                }

                // 处理全选复制
                if (window.isSelectAll && text) {
                    e.preventDefault();
                    const images = getImagesInSelection();

                    // 设置纯文本内容
                    e.clipboardData.setData('text/plain', text);

                    // 如果有图片，同时设置HTML内容
                    if (images && images.length > 0) {
                        const html = createHTMLWithImages(text, images);
                        e.clipboardData.setData('text/html', html);
                        console.log(`成功复制文本和${images.length}张图片`);
                    }
                }
            } catch (err) {
                console.log('复制处理出错:', err);
            }
        });
    };

    // 解除文本复制粘贴限制和图片复制限制，并去除水印
    const enableCopyFunctionality = () => {
        // 隐藏 .toast-wrap 元素和水印
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            .toast-wrap {
                display: none !important;
            }
            /* 隐藏飞书文档水印 */
            .lark-watermark-wrapper,
            .watermark-wrapper,
            div[class*="watermark"],
            div[class*="Watermark"],
            .lark-water-mark-wrapper,
            div[data-testid*="watermark"],
            .feishu-watermark,
            .larkwatermarkwrapper,
            .docx-watermark,
            .water-mark-container,
            div[class*="water-mark"],
            div[class*="WaterMark"],
            div[style*="watermark"],
            div[style*="background-repeat"],
            canvas.watermark-canvas,
            .watermark-content,
            .base-watermark,
            .watermark-dom,
            .mask-watermark,
            div[role="watermark"] {
                display: none !important;
                opacity: 0 !important;
                visibility: hidden !important;
                background: none !important;
                background-image: none !important;
                pointer-events: none !important;
                z-index: -9999 !important;
            }
            /* 解除图片保存限制 */
            img {
                pointer-events: auto !important;
                -webkit-user-select: auto !important;
                user-select: auto !important;
            }
            /* 允许图片拖拽 */
            img, svg {
                -webkit-user-drag: auto !important;
            }
        `;
        document.head.appendChild(style);

        // 仅阻止网站阻止复制的功能，但不阻止原始右键菜单
        document.addEventListener('copy', function(e) {
            e.stopPropagation();
        }, true);

        // 启用图片右键菜单
        document.addEventListener('contextmenu', function(e) {
            if (e.target.tagName.toLowerCase() === 'img') {
                e.stopPropagation();
            }
        }, true);
    };

    // 启用全选后的右键菜单复制功能
    const enableRightClickCopy = () => {
        // 确保在有选中内容时能够使用右键菜单
        document.addEventListener('contextmenu', function(e) {
            const selection = document.getSelection();
            const hasSelection = selection && selection.toString().trim() !== '';

            // 如果有选中内容，允许原生右键菜单显示
            if (hasSelection) {
                e.stopPropagation();
                return true; // 允许浏览器默认菜单显示
            }
        }, true);

        // 阻止网站干扰右键菜单的事件
        function preventMenuBlockers() {
            // 查找并禁用可能阻止右键菜单的元素
            const menuBlockers = document.querySelectorAll('[oncontextmenu]');
            menuBlockers.forEach(el => {
                el.oncontextmenu = null;
                el.removeAttribute('oncontextmenu');
            });

            // 寻找并移除可能阻止右键菜单的事件监听器
            const originalRemoveEventListener = EventTarget.prototype.removeEventListener;
            EventTarget.prototype.removeEventListener = function(type, listener, options) {
                if (type === 'contextmenu') {
                    // 跳过移除contextmenu事件监听器的操作
                    return;
                }
                originalRemoveEventListener.call(this, type, listener, options);
            };
        }

        // 定期运行防止右键菜单被阻止的功能
        preventMenuBlockers();
        setInterval(preventMenuBlockers, 2000);

        // 为右键菜单的"复制"选项添加功能增强
        document.addEventListener('copy', function(e) {
            const selection = document.getSelection();
            if (!selection || selection.toString().trim() === '') return;

            // 检查是否触发自右键菜单
            if (window.rightClickMenuTriggered) {
                e.preventDefault();

                const text = selection.toString();
                const images = getImagesInSelection();

                // 设置纯文本内容
                e.clipboardData.setData('text/plain', text);

                // 如果有图片，同时设置HTML内容
                if (images && images.length > 0) {
                    const html = createHTMLWithImages(text, images);
                    e.clipboardData.setData('text/html', html);
                    console.log(`右键菜单成功复制文本和${images.length}张图片`);
                }

                window.rightClickMenuTriggered = false;
            }

            // 获取选区中的所有图片
            function getImagesInSelection() {
                try {
                    const selection = document.getSelection();
                    if (!selection.rangeCount) return [];

                    const range = selection.getRangeAt(0);
                    const fragment = range.cloneContents();
                    return Array.from(fragment.querySelectorAll('img'));
                } catch (err) {
                    console.log('获取选中图片出错:', err);
                    return [];
                }
            }

            // 创建包含文本和图片的HTML内容
            function createHTMLWithImages(text, images) {
                if (!images || images.length === 0) return text;

                let html = '<div>' + text.replace(/\n/g, '<br>') + '<br><br>';

                // 添加图片到HTML
                images.forEach(img => {
                    const src = img.src;
                    if (src) {
                        html += `<img src="${src}" style="max-width: 100%; margin: 10px 0;"><br>`;
                    }
                });

                html += '</div>';
                return html;
            }
        });

        // 捕获右键菜单复制命令
        document.addEventListener('keydown', function(e) {
            // 检测在右键菜单出现后的复制操作 (C键)
            if (e.key === 'c' && !e.ctrlKey && !e.metaKey) {
                const selection = document.getSelection();
                if (selection && selection.toString().trim() !== '') {
                    window.rightClickMenuTriggered = true;
                    setTimeout(() => { window.rightClickMenuTriggered = false; }, 500);
                }
            }
        });
    };

    // 解除图片复制限制
    const enableImageCopy = () => {
        // 监听并处理图片点击事件
        document.addEventListener('click', function(e) {
            if (e.target.tagName.toLowerCase() === 'img') {
                // 阻止默认的点击行为，防止触发飞书自带的预览
                e.stopPropagation();
            }
        }, true);

        // 定期检查并移除图片上的禁止保存属性
        setInterval(() => {
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                img.style.pointerEvents = 'auto';
                img.style.userSelect = 'auto';
                img.style.webkitUserDrag = 'auto';
                img.setAttribute('draggable', 'true');
                // 移除可能阻止保存的事件监听器
                img.oncontextmenu = null;
                img.ondragstart = null;
            });
        }, 1000);
    };

    // 清除动态添加的水印
    const removeWatermarks = () => {
        setInterval(() => {
            // 查找并移除所有可能的水印元素
            const possibleWatermarks = [
                ...document.querySelectorAll('div[class*="watermark"], div[class*="Watermark"]'),
                ...document.querySelectorAll('div[data-testid*="watermark"]'),
                ...document.querySelectorAll('canvas.watermark-canvas'),
                ...document.querySelectorAll('.watermark-content, .base-watermark, .watermark-dom, .mask-watermark'),
                ...document.querySelectorAll('div[role="watermark"]'),
                ...document.querySelectorAll('div[style*="background-repeat"]'),
                ...document.querySelectorAll('div[style*="watermark"]')
            ];

            possibleWatermarks.forEach(element => {
                if (element) {
                    element.style.display = 'none';
                    element.style.opacity = '0';
                    element.style.visibility = 'hidden';
                    element.style.background = 'none';
                    element.style.backgroundImage = 'none';
                    element.style.pointerEvents = 'none';
                    element.style.zIndex = '-9999';
                }
            });
        }, 1000); // 每秒检查一次
    };

    // 在文档加载完成后添加复制助手功能
    document.addEventListener('DOMContentLoaded', () => {
        // 启用全选图文一键复制功能
        enableSelectAllCopy();

        // 启用全选后右键菜单复制功能
        enableRightClickCopy();

        // 监听点击事件
        document.addEventListener('click', function(e) {
            const target = e.target;
            if (!target) return;

            if (target.textContent?.includes('复制链接') ||
                target.closest('.lark-link-entry-v2__copylink') ||
                target.closest('[data-test-id="copy-share-link"]')) {

                setTimeout(function() {
                    try {
                        const title = document.title.split(' - ')[0].trim();
                        if (!title) return;

                        navigator.clipboard.readText().then(function(text) {
                            if (!text || !text.includes('feishu.cn/') || text.includes(title)) return;

                            navigator.clipboard.writeText(formatText(title, text)).catch(function(err) {
                                console.log('写入剪贴板失败:', err);
                            });
                        }).catch(function(err) {
                            console.log('读取剪贴板失败:', err);
                        });
                    } catch (err) {
                        console.log('处理复制按钮点击失败:', err);
                    }
                }, 100);
            }
        });

        // 启用复制功能和去除水印
        enableCopyFunctionality();
        // 启用图片复制功能
        enableImageCopy();
        // 清除动态添加的水印
        removeWatermarks();
    });

    // 立即运行覆盖函数
    overrideEventListeners();
    overrideXHR();

    console.log('飞书文档标题复制助手Plus已加载，版本3.17，已添加全选右键菜单复制、全选图文一键复制、图片复制和强化去除水印功能');
})();