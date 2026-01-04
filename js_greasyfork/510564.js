// ==UserScript==
// @name         阿里云盘分享链接批量打开
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  从粘贴的文本中提取阿里云盘分享链接和提取码，并提供批量打开及自动输入提取码功能。
// @author       Gogo & Claude 3.5 Sonnet
// @match        https://www.aliyundrive.com/*
// @match        https://www.alipan.com/*
// @grant        GM_setClipboard
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510564/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E6%89%B9%E9%87%8F%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/510564/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E6%89%B9%E9%87%8F%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

/*
 * 阿里云盘分享链接批量打开脚本
 * 版本: 1.0
 * 作者: Gogo & Claude 3.5 Sonnet
 * 创建日期: 2024-09-28
 * 最后修改: 2024-09-28
 *
 * 功能:
 * - 从粘贴的文本中提取阿里云盘分享链接和提取码
 * - 批量打开链接并自动填充提取码
 * - 显示分享链接打开状态（成功/失败）
 *
 * 更新日志:
 * 1.0 (2024-09-28) - 初始版本
 *   - 实现基本的链接提取和批量打开功能
 *   - 添加自动填充提取码功能
 *   - 添加链接状态显示功能
 */
(function() {
    'use strict';

    let textarea, resultDiv;

    // 创建触发按钮
    function createTriggerButton() {
        const button = document.createElement('button');
        button.textContent = '批量打开';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '10000';
        button.style.padding = '10px 15px';
        button.style.backgroundColor = '#2196F3';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.fontWeight = 'bold';
        button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        button.style.transition = 'background-color 0.3s';
        button.addEventListener('mouseover', () => button.style.backgroundColor = '#1976D2');
        button.addEventListener('mouseout', () => button.style.backgroundColor = '#2196F3');
        document.body.appendChild(button);
        return button;
    }

    // 创建UI元素
    function createUI() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '80px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        container.style.backgroundColor = '#FFFFFF';
        container.style.padding = '20px';
        container.style.borderRadius = '8px';
        container.style.width = '650px';
        container.style.maxHeight = '80vh';
        container.style.overflowY = 'auto';
        container.style.display = 'none';
        container.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        container.style.fontFamily = 'Arial, sans-serif';

        textarea = document.createElement('textarea');
        textarea.style.width = '100%';
        textarea.style.height = '200px';
        textarea.style.marginBottom = '15px';
        textarea.style.padding = '10px';
        textarea.style.border = '1px solid #E0E0E0';
        textarea.style.borderRadius = '4px';
        textarea.style.resize = 'vertical';
        textarea.placeholder = '粘贴包含阿里云盘链接的文本';

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.marginBottom = '15px';

        const leftButtonGroup = document.createElement('div');
        leftButtonGroup.style.display = 'flex';

        const rightButtonGroup = document.createElement('div');

        const createButton = (text, color) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.style.padding = '8px 12px';
            button.style.backgroundColor = color;
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.borderRadius = '4px';
            button.style.cursor = 'pointer';
            button.style.fontSize = '14px';
            button.style.fontWeight = 'bold';
            button.style.transition = 'background-color 0.3s';
            return button;
        };

        const extractButton = createButton('提取链接', '#4CAF50');
        const openAllButton = createButton('打开全部', '#2196F3');
        const resetButton = createButton('重置', '#F44336');

        extractButton.style.marginRight = '10px';

        [extractButton, openAllButton, resetButton].forEach(button => {
            button.addEventListener('mouseover', () => button.style.opacity = '0.8');
            button.addEventListener('mouseout', () => button.style.opacity = '1');
        });

        leftButtonGroup.appendChild(extractButton);
        leftButtonGroup.appendChild(openAllButton);
        rightButtonGroup.appendChild(resetButton);

        buttonContainer.appendChild(leftButtonGroup);
        buttonContainer.appendChild(rightButtonGroup);

        resultDiv = document.createElement('div');
        resultDiv.style.marginTop = '15px';

        container.appendChild(textarea);
        container.appendChild(buttonContainer);
        container.appendChild(resultDiv);

        document.body.appendChild(container);

        return { container, textarea, extractButton, resetButton, openAllButton, resultDiv };
    }

    // 提取链接和提取码
    function extractLinks(text) {
        const lines = text.split('\n');
        const linkLines = lines.filter(line =>
                                       line.includes('aliyundrive.com/s/') ||
                                       line.includes('alipan.com/s/')
                                      );

        const links = linkLines.map(line => {
            const match = line.match(/(https?:\/\/[^\s]+)/);
            return match ? match[1] : null;
        }).filter(link => link !== null);

        const results = links.map(link => {
            const linkIndex = text.indexOf(link);
            const afterLink = text.slice(linkIndex + link.length);
            const codeMatch = afterLink.match(/提取码:?\s*([a-zA-Z0-9]{4})/i);

            return {
                link: link,
                code: codeMatch ? codeMatch[1] : '无'
            };
        });

        return results;
    }

    // 打开链接
    function openLink(link, code, index) {
        GM_setValue('lastOpenedLink', link);
        GM_setValue('lastOpenedCode', code);
        GM_setValue('lastOpenedIndex', index);
        GM_setValue('linkStatus', '');  // 重置状态
        return new Promise((resolve) => {
            GM_openInTab(link, { active: true, insert: true, setParent: true });
            // 给足够的时间让新标签页加载并自动填充提取码
            setTimeout(resolve, 5000);
        });
    }

    // 保存数据到localStorage
    function saveData(text, links) {
        GM_setValue('extractorText', text);
        GM_setValue('extractorLinks', JSON.stringify(links));
    }

    // 从localStorage加载数据
    function loadData() {
        const text = GM_getValue('extractorText', '');
        const links = JSON.parse(GM_getValue('extractorLinks', '[]'));
        return { text, links };
    }

    // 新增：保存链接状态的函数
    function saveLinkStatus(index, status) {
        let linkStatuses = JSON.parse(GM_getValue('linkStatuses', '{}'));
        linkStatuses[index] = status;
        GM_setValue('linkStatuses', JSON.stringify(linkStatuses));
    }

    // 新增：获取链接状态的函数
    function getLinkStatus(index) {
        let linkStatuses = JSON.parse(GM_getValue('linkStatuses', '{}'));
        return linkStatuses[index];
    }

    // 更新UI
    function updateUI(textarea, resultDiv, text, links) {
        textarea.value = text;
        let resultHTML = '<ul style="list-style-type: none; padding: 0; margin: 0;">';
        links.forEach((item, index) => {
            const status = getLinkStatus(index);
            let backgroundColor = '#F5F5F5'; // 默认灰色
            if (status === 'success') {
                backgroundColor = '#C8E6C9'; // 浅绿色
            } else if (status === 'failed') {
                backgroundColor = '#FFCDD2'; // 浅红色
            }
            resultHTML += `
            <li id="link-item-${index}" style="margin-bottom: 10px; padding: 10px; background-color: ${backgroundColor}; border-radius: 4px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="flex-grow: 1; display: flex; justify-content: space-between; align-items: center;">
                        <span>
                            <span style="font-weight: bold;">链接 ${index + 1}:</span>
                            <span style="word-break: break-all; margin-left: 5px;">${item.link}</span>
                        </span>
                        <span style="margin-left: 10px;">提取码: ${item.code}</span>
                    </div>
                    <button class="open-copy-btn" data-index="${index}" style="background-color: #2196F3; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; white-space: nowrap; margin-left: 10px;">一键打开</button>
                </div>
            </li>`;
        });
        resultHTML += '</ul>';
        resultDiv.innerHTML = resultHTML;

        // 为每个"一键打开"按钮添加事件监听器
        document.querySelectorAll('.open-copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                const item = links[index];
                openLink(item.link, item.code, index);
            });
            btn.addEventListener('mouseover', () => btn.style.opacity = '0.8');
            btn.addEventListener('mouseout', () => btn.style.opacity = '1');
        });
    }

    // 模拟用户输入
    function simulateUserInput(input, text) {
        return new Promise((resolve) => {
            input.focus();
            input.click();

            let i = 0;
            function typeChar() {
                if (i < text.length) {
                    const char = text[i];

                    input.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true }));
                    input.dispatchEvent(new KeyboardEvent('keypress', { key: char, bubbles: true }));

                    const propDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
                    propDescriptor.set.call(input, input.value + char);

                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new KeyboardEvent('keyup', { key: char, bubbles: true }));

                    i++;
                    setTimeout(typeChar, 50 + Math.random() * 50);
                } else {
                    setTimeout(() => {
                        input.dispatchEvent(new Event('blur', { bubbles: true }));
                        input.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                        input.focus();
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        resolve();
                    }, 100);
                }
            }
            setTimeout(typeChar, 500);
        });
    }

    // 自动填充提取码
    function autoFillCode() {
        const lastOpenedLink = GM_getValue('lastOpenedLink', '');
        const lastOpenedCode = GM_getValue('lastOpenedCode', '');

        if (window.location.href.startsWith(lastOpenedLink) && lastOpenedCode !== '') {
            const fillCode = async () => {
                // 检查是否已经在分享页面
                if (document.querySelector('button.button--WC7or.primary--NVxfK.medium--Pt0UL.btn-save--SqM8z')) {
                    GM_setValue('linkStatus', 'success');
                    return;
                }

                // 检查分享是否已失效
                if (document.querySelector('div.share-error-tips--2G2l6')) {
                    GM_setValue('linkStatus', 'failed');
                    return;
                }

                const codeInputs = document.querySelectorAll('input[placeholder="请输入提取码"], input.ant-input[placeholder="请输入提取码"]');
                if (codeInputs.length > 0) {
                    for (const input of codeInputs) {
                        await simulateUserInput(input, lastOpenedCode);
                        await waitForButtonEnabled();
                        const submitButton = document.querySelector('button.button--2ImPj[type="submit"]');
                        if (submitButton && submitButton.getAttribute('data-is-disabled') !== 'true') {
                            submitButton.click();
                            // 等待页面加载
                            setTimeout(() => {
                                if (document.querySelector('button.button--WC7or.primary--NVxfK.medium--Pt0UL.btn-save--SqM8z')) {
                                    GM_setValue('linkStatus', 'success');
                                } else {
                                    GM_setValue('linkStatus', 'failed');
                                }
                            }, 2000);
                        }
                    }
                } else {
                    setTimeout(fillCode, 1000);
                }
            };

            setTimeout(fillCode, 1000);
        }

        // 添加这一段来更新 UI
        setTimeout(() => {
            const links = JSON.parse(GM_getValue('extractorLinks', '[]'));
            updateUI(textarea, resultDiv, textarea.value, links);
        }, 3000);  // 给予足够的时间让状态更新
    }

    // 等待按钮变为可点击状态
    function waitForButtonEnabled() {
        return new Promise((resolve) => {
            const checkButton = () => {
                const submitButton = document.querySelector('button.button--2ImPj[type="submit"]');
                if (submitButton && submitButton.getAttribute('data-is-disabled') !== 'true') {
                    resolve();
                } else {
                    setTimeout(checkButton, 100);
                }
            };
            checkButton();
        });
    }

    // 更新链接状态
    function updateLinkStatus(index, status) {
        const linkItem = document.getElementById(`link-item-${index}`);
        if (linkItem) {
            if (status === 'success') {
                linkItem.style.backgroundColor = '#C8E6C9';  // 浅绿色
            } else if (status === 'failed') {
                linkItem.style.backgroundColor = '#FFCDD2';  // 浅红色
            }
            saveLinkStatus(index, status);
        } else {
        }
    }

    // 打开所有链接
    async function openAllLinks(links) {
        for (let i = 0; i < links.length; i++) {
            const item = links[i];
            await openLink(item.link, item.code, i);
        }
    }

    // 主函数
    function main() {
        const triggerButton = createTriggerButton();
        const { container, extractButton, resetButton, openAllButton } = createUI();

        // 加载保存的数据
        const { text, links } = loadData();
        updateUI(textarea, resultDiv, text, links);

        // 检查是否需要自动打开UI
        const lastOpenedLink = GM_getValue('lastOpenedLink', '');
        if (window.location.href === lastOpenedLink) {
            container.style.display = 'block';
        }

        triggerButton.addEventListener('click', () => {
            container.style.display = container.style.display === 'none' ? 'block' : 'none';
        });

        extractButton.addEventListener('click', () => {
            const text = textarea.value;
            try {
                const extractedLinks = extractLinks(text);
                updateUI(textarea, resultDiv, text, extractedLinks);
                saveData(text, extractedLinks);
            } catch (error) {
                console.error('Error during link extraction:', error);
                alert('提取链接时发生错误，请查看控制台以获取更多信息。');
            }
        });

        resetButton.addEventListener('click', () => {
            textarea.value = '';
            resultDiv.innerHTML = '';
            saveData('', []);
            GM_setValue('linkStatuses', '{}'); // 清除所有保存的链接状态
            GM_setValue('lastOpenedLink', ''); // 清除最后打开的链接
            GM_setValue('lastOpenedCode', ''); // 清除最后使用的提取码
            GM_setValue('lastOpenedIndex', ''); // 清除最后打开的链接索引
            GM_setValue('linkStatus', ''); // 清除链接状态
        });

        openAllButton.addEventListener('click', async () => {
            const links = JSON.parse(GM_getValue('extractorLinks', '[]'));
            await openAllLinks(links);
            // 所有链接打开后，更新 UI
            updateUI(textarea, resultDiv, textarea.value, links);
        });

        // 自动填充提取码
        autoFillCode();

        // 监听 URL 变化
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                autoFillCode();
            }
        }).observe(document, { subtree: true, childList: true });

        // 添加定时器来检查链接状态
        setInterval(() => {
            const linkStatus = GM_getValue('linkStatus', '');
            const lastOpenedIndex = GM_getValue('lastOpenedIndex', '');
            if (linkStatus && lastOpenedIndex !== '') {
                updateLinkStatus(lastOpenedIndex, linkStatus);
                // 重置状态
                GM_setValue('linkStatus', '');
                GM_setValue('lastOpenedIndex', '');
            }
        }, 1000);
    }

    // 运行脚本
    main();
})();