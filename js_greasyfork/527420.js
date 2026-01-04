// ==UserScript==
// @name         飞书文档批量替换
// @namespace    https://www.gd520.cc
// @version      2025-02-19
// @description  飞书在线文档World，Excel批量替换
// @author       Guodong
// @license      GPL
// @match        https://weboffice.feishu-3rd-party-services.com/office/s/*
// @match        https://weboffice.feishu-3rd-party-services.com/office/w/*
// @icon         https://www.feishu.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527420/%E9%A3%9E%E4%B9%A6%E6%96%87%E6%A1%A3%E6%89%B9%E9%87%8F%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/527420/%E9%A3%9E%E4%B9%A6%E6%96%87%E6%A1%A3%E6%89%B9%E9%87%8F%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 如果 URL 中包含 require_mode=1，则退出脚本
    if (window.location.href.includes('require_mode=1')) {
        console.log('已检测到 require_mode=1，脚本不执行');
        return;
    }

    const excelDoc = window.location.href.includes('/office/s/');

    function setInputValue(input, value) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeInputValueSetter.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    let debounceTimeout;
    function debounceSave(fn, delay) {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(fn, delay);
    }

    function createReplacePanel() {
        const panel = document.createElement('div');
        Object.assign(panel.style, {
            position: 'fixed',
            bottom: '65px',
            right: '30px',
            width: '515px',
            maxHeight: '360px',
            overflowY: 'auto',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 10000,
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            color: '#333'
        });

        const showIconButton = document.createElement('button');
        showIconButton.innerHTML = '☰ 飞书文档助手'; 
        Object.assign(showIconButton.style, {
            position: 'fixed',
            bottom: '65px',
            right: '30px',
            display: 'none',
            cursor: 'pointer',
            zIndex: 10001
        });
        styleButton(showIconButton, '#795548');
        showIconButton.addEventListener('click', () => {
            panel.style.display = 'block';
            showIconButton.style.display = 'none';
        });
        document.body.appendChild(showIconButton);

        const headerDiv = document.createElement('div');
        Object.assign(headerDiv.style, {
            position: 'sticky',
            top: '0',
            backgroundColor: '#fff',
            padding: '15px 15px 0 15px'
        });
        panel.appendChild(headerDiv);

        const title = document.createElement('h2');
        title.textContent = '飞书文档批量替换 - Guodong';
        title.style.display = 'inline-block';
        title.style.marginBottom = '10px';
        headerDiv.appendChild(title);

        const hideButton = document.createElement('button');
        hideButton.textContent = '隐藏';
        styleButton(hideButton, '#E91E63');
        hideButton.style.float = 'right';
        hideButton.addEventListener('click', () => {
            panel.style.display = 'none';
            showIconButton.style.display = 'block';
        });
        headerDiv.appendChild(hideButton);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '10px';
        headerDiv.appendChild(buttonContainer);

        const executeButton = document.createElement('button');
        executeButton.textContent = '执行';
        styleButton(executeButton, '#2196F3');
        buttonContainer.appendChild(executeButton);

        const addButton = document.createElement('button');
        addButton.textContent = '添加';
        styleButton(addButton, '#4CAF50');
        buttonContainer.appendChild(addButton);

        const exportButton = document.createElement('button');
        exportButton.textContent = '导出';
        styleButton(exportButton, '#FF9800');
        buttonContainer.appendChild(exportButton);

        const importButton = document.createElement('button');
        importButton.textContent = '导入';
        styleButton(importButton, '#9C27B0');
        buttonContainer.appendChild(importButton);

        const docType = document.createElement('h4');
        docType.textContent = excelDoc ? 'Excel' : 'Word';
        Object.assign(docType.style, {
            marginLeft: '10px',
            display: 'inline-block',
            marginBottom: '5px'
        });
        buttonContainer.appendChild(docType);

        const replaceListContainer = document.createElement('div');
        replaceListContainer.style.marginLeft = '10px';
        replaceListContainer.style.marginTop = '5px';
        panel.appendChild(replaceListContainer);

        let replacePairs = [];
        try {
            replacePairs = JSON.parse(localStorage.getItem('replacePairs')) || [];
        } catch (error) {
            console.log('读取规则失败，可能数据格式错误', error);
        }
        console.log('油猴：Loaded replace pairs from localStorage:', replacePairs);

        function updateReplaceList() {
            replaceListContainer.innerHTML = '';
            replacePairs.forEach((pair, index) => {
                const pairDiv = document.createElement('div');
                pairDiv.style.display = 'flex';
                pairDiv.style.alignItems = 'center';
                pairDiv.style.margin = '5px';

                const findInput = document.createElement('input');
                findInput.type = 'text';
                findInput.placeholder = '查找';
                findInput.value = pair.findText;
                styleInput(findInput);
                findInput.addEventListener('input', () => {
                    pair.findText = findInput.value;
                    debounceSave(saveReplacePairs, 300);
                });

                const replaceInput = document.createElement('input');
                replaceInput.type = 'text';
                replaceInput.placeholder = '替换';
                replaceInput.value = pair.replaceText;
                styleInput(replaceInput);
                replaceInput.addEventListener('input', () => {
                    pair.replaceText = replaceInput.value;
                    debounceSave(saveReplacePairs, 300);
                });

                const upButton = document.createElement('button');
                upButton.textContent = '↑';
                styleButton(upButton, '#795548');
                upButton.style.marginRight = '4px';
                upButton.addEventListener('click', () => {
                    if (index > 0) {
                        [replacePairs[index - 1], replacePairs[index]] = [replacePairs[index], replacePairs[index - 1]];
                        saveReplacePairs();
                        updateReplaceList();
                    }
                });

                const downButton = document.createElement('button');
                downButton.textContent = '↓';
                styleButton(downButton, '#795548');
                downButton.style.marginRight = '4px';
                downButton.addEventListener('click', () => {
                    if (index < replacePairs.length - 1) {
                        [replacePairs[index + 1], replacePairs[index]] = [replacePairs[index], replacePairs[index + 1]];
                        saveReplacePairs();
                        updateReplaceList();
                    }
                });

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'X';
                styleButton(deleteButton, '#f44336');
                deleteButton.addEventListener('click', () => {
                    replacePairs.splice(index, 1);
                    saveReplacePairs();
                    updateReplaceList();
                });

                pairDiv.appendChild(findInput);
                pairDiv.appendChild(replaceInput);
                pairDiv.appendChild(upButton);
                pairDiv.appendChild(downButton);
                pairDiv.appendChild(deleteButton);
                replaceListContainer.appendChild(pairDiv);
            });
        }

        function saveReplacePairs() {
            localStorage.setItem('replacePairs', JSON.stringify(replacePairs));
        }

        addButton.addEventListener('click', () => {
            replacePairs.push({ findText: '', replaceText: '' });
            updateReplaceList();
            saveReplacePairs();
        });

        executeButton.addEventListener('click', async () => {
            await performMultipleReplaces(replacePairs);
        });

        exportButton.addEventListener('click', () => {
            const now = new Date();
            const fileName = formatTime(now) + 'FeishuRule.txt';
            const blob = new Blob([JSON.stringify(replacePairs, null, 2)], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.click();
            URL.revokeObjectURL(url);
        });

        importButton.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.txt';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        const data = JSON.parse(reader.result);
                        if (Array.isArray(data)) {
                            replacePairs = data;
                            saveReplacePairs();
                            updateReplaceList();
                        }
                    } catch (err) {
                        console.log('导入规则时发生错误:', err);
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        });

        document.body.appendChild(panel);
        updateReplaceList();
    }

    function styleButton(btn, bgColor) {
        btn.style.padding = '5px 10px';
        btn.style.marginRight = '10px';
        btn.style.backgroundColor = bgColor;
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.cursor = 'pointer';
        btn.style.borderRadius = '4px';
    }

    function styleInput(inp) {
        inp.style.flex = '1';
        inp.style.padding = '4px';
        inp.style.marginRight = '5px';
    }

    function formatTime(d) {
        const y = d.getFullYear();
        const M = String(d.getMonth() + 1).padStart(2, '0');
        const _d = String(d.getDate()).padStart(2, '0');
        const h = String(d.getHours()).padStart(2, '0');
        const m = String(d.getMinutes()).padStart(2, '0');
        const s = String(d.getSeconds()).padStart(2, '0');
        return `${y}${M}${_d}_${h}${m}${s}_`;
    }

    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver((mutations, obs) => {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                    obs.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(`油猴：等待元素 ${selector} 超时`);
            }, timeout);
        });
    }

    function waitForReplaceCompletion(successSelector, failSelector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const checkCompletion = () => {
                const successMessage = document.querySelector(successSelector);
                const failMessage = document.querySelector(failSelector);

                if (successMessage) {
                    console.log('油猴：替换操作成功');
                    resolve('success');
                } else if (failMessage) {
                    console.log('油猴：替换操作失败');
                    resolve('fail');
                } else if (Date.now() - startTime > timeout) {
                    console.log('油猴：替换操作等待超时');
                    reject('timeout');
                } else {
                    requestAnimationFrame(checkCompletion);
                }
            };
            checkCompletion();
        });
    }

    function simulateCtrlH() {
        const event = new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            key: 'h',
            code: 'KeyH',
            keyCode: 72,
            charCode: 72,
            ctrlKey: true
        });
        document.dispatchEvent(event);
    }

    async function performReplace(findText, replaceText) {
        try {
            simulateCtrlH();

            if (excelDoc) {
                const excelFindSelector = '.row:not(.replace) .kd-input-inner';
                const excelReplaceSelector = '.row.replace .kd-input-inner';
                const findInput = await waitForElement(excelFindSelector);
                if (findInput) {
                    setInputValue(findInput, findText);
                    console.log(`油猴：查找框已设置为: ${findText}`);
                }
                const replaceInput = await waitForElement(excelReplaceSelector);
                if (replaceInput) {
                    setInputValue(replaceInput, replaceText);
                    console.log(`油猴：替换框已设置为: ${replaceText}`);
                }
                document.querySelectorAll('.kd-radio-input')[1]?.click();
                const replaceAllButton = document.querySelector('.et-cmd-bar-find-panel .wo-button.narrow.replace-all .kd-button.kd-button-secondary.kd-button-lg');
                if (replaceAllButton) {
                    replaceAllButton.click();
                }

                await new Promise(resolve => setTimeout(resolve, 200));

                await waitForReplaceCompletion('.kd-button.kd-button-primary.kd-button-lg.confirm-btn', '.cell_shower .error')
                    .then(async (result) => {
                        if (result === 'success') {
                            document.querySelector('.kd-button.kd-button-primary.kd-button-lg.confirm-btn')?.click();
                            console.log('油猴：替换操作成功');
                        } else if (result === 'fail') {
                            console.log('油猴：无需替换');
                        }
                        await new Promise(resolve => setTimeout(resolve, 200));
                    });
            } else {
                const wordFindSelector = '.component-find-input';
                const wordReplaceSelector = '.component-replace-input';
                const findInput = await waitForElement(wordFindSelector);
                if (findInput) {
                    setInputValue(findInput, findText);
                    console.log(`油猴：查找框已设置为: ${findText}`);
                }
                const replaceInput = await waitForElement(wordReplaceSelector);
                if (replaceInput) {
                    setInputValue(replaceInput, replaceText);
                    console.log(`油猴：替换框已设置为: ${replaceText}`);
                }
                const replaceButton = await waitForElement('.kd-button.kd-button-primary.kd-button-lg');
                if (replaceButton && !replaceButton.disabled) {
                    replaceButton.click();
                    console.log('油猴：已点击全部替换按钮');
                } else {
                    console.log('油猴：全部替换按钮不可点击或未找到');
                    return;
                }

                await new Promise(resolve => setTimeout(resolve, 200));

                await waitForReplaceCompletion('.kd-message-text', '.find-result.empty-result');
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        } catch (error) {
            console.log(`油猴：执行替换操作时出现错误: ${error}`);
        }
    }

    async function performMultipleReplaces(replacePairs) {
        for (const pair of replacePairs) {
            if (pair.findText) {
                await performReplace(pair.findText, pair.replaceText);
            }
        }
    }

    createReplacePanel();

})();