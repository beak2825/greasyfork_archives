// ==UserScript==
// @name         ParaTranz Tools
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  为 ParaTranz 添加正则表达式管理和机器翻译功能。
// @author       HeliumOctahelide
// @license      WTFPL
// @match        https://paratranz.cn/projects/*/strings*
// @icon         https://paratranz.cn/favicon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503063/ParaTranz%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/503063/ParaTranz%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 基类定义
    class BaseComponent {
        constructor(selector) {
            this.selector = selector;
            this.init();
        }

        init() {
            this.checkExistence();
        }

        checkExistence() {
            const element = document.querySelector(this.selector);
            if (!element) {
                this.insert();
            }
            setTimeout(() => this.checkExistence(), 1000);
        }

        insert() {
            // 留空，子类实现具体插入逻辑
        }
    }

    // 按钮类定义，继承自BaseComponent
    class Button extends BaseComponent {
        constructor(selector, toolbarSelector, htmlContent, callback) {
            super(selector);
            this.toolbarSelector = toolbarSelector;
            this.htmlContent = htmlContent;
            this.callback = callback;
        }

        insert() {
            const toolbar = document.querySelector(this.toolbarSelector);
            if (!toolbar) {
                console.log(`Toolbar not found: ${this.toolbarSelector}`);
                return;
            }
            if (toolbar && !document.querySelector(this.selector)) {
                const button = document.createElement('button');
                button.className = this.selector.split('.').join(' ');
                button.innerHTML = this.htmlContent;
                button.type = 'button';
                button.addEventListener('click', this.callback);
                toolbar.insertAdjacentElement('afterbegin', button);
                console.log(`Button inserted: ${this.selector}`);
            }
        }
    }

    // 手风琴类定义，继承自BaseComponent
    class Accordion extends BaseComponent {
        constructor(selector, parentSelector) {
            super(selector);
            this.parentSelector = parentSelector;
        }

        insert() {
            const parentElement = document.querySelector(this.parentSelector);
            if (!parentElement) {
                console.log(`Parent element not found: ${this.parentSelector}`);
                return;
            }
            if (parentElement && !document.querySelector(this.selector)) {
                const accordionHTML = `
                    <div class="accordion" id="accordionExample"></div>
                    <hr>
                `;
                parentElement.insertAdjacentHTML('afterbegin', accordionHTML);
            }
        }

        addCard(card) {
            card.insert();
        }
    }

    // 卡片类定义，继承自BaseComponent
    class Card extends BaseComponent {
        constructor(selector, parentSelector, headingId, title, contentHTML) {
            super(selector);
            this.parentSelector = parentSelector;
            this.headingId = headingId;
            this.title = title;
            this.contentHTML = contentHTML;
        }

        insert() {
            const parentElement = document.querySelector(this.parentSelector);
            if (!parentElement) {
                console.log(`Parent element not found: ${this.parentSelector}`);
                return;
            }
            if (parentElement && !document.querySelector(this.selector)) {
                const cardHTML = `
                    <div class="card m-0">
                        <div class="card-header p-0" id="${this.headingId}">
                            <h2 class="mb-0">
                                <button class="btn btn-link" type="button" aria-expanded="false" aria-controls="${this.selector.substring(1)}">
                                    ${this.title}
                                </button>
                            </h2>
                        </div>
                        <div id="${this.selector.substring(1)}" class="collapse" aria-labelledby="${this.headingId}" data-parent="#accordionExample" style="max-height: 70vh; overflow-y: auto;">
                            <div class="card-body">
                                ${this.contentHTML}
                            </div>
                        </div>
                    </div>
                `;
                parentElement.insertAdjacentHTML('beforeend', cardHTML);

                const toggleButton = document.querySelector(`#${this.headingId} button`);
                const collapseDiv = document.querySelector(this.selector);
                toggleButton.addEventListener('click', function() {
                    if (collapseDiv.style.maxHeight === '0px' || !collapseDiv.style.maxHeight) {
                        collapseDiv.style.display = 'block';
                        requestAnimationFrame(() => {
                            collapseDiv.style.maxHeight = collapseDiv.scrollHeight + 'px';
                        });
                        toggleButton.setAttribute('aria-expanded', 'true');
                    } else {
                        collapseDiv.style.maxHeight = '0px';
                        toggleButton.setAttribute('aria-expanded', 'false');
                        collapseDiv.addEventListener('transitionend', () => {
                            if (collapseDiv.style.maxHeight === '0px') {
                                collapseDiv.style.display = 'none';
                            }
                        }, { once: true });
                    }
                });

                collapseDiv.style.maxHeight = '0px';
                collapseDiv.style.overflow = 'hidden';
                collapseDiv.style.transition = 'max-height 0.3s ease';
            }
        }
    }

    // 定义具体的正则管理卡片
    class RegexCard extends Card {
        constructor(parentSelector) {
            const headingId = 'headingOne';
            const contentHTML = `
                <div id="managePage">
                    <div id="regexList"></div>
                    <div class="regex-item mb-3 p-2" style="border: 1px solid #ccc; border-radius: 8px;">
                        <input type="text" placeholder="Pattern" id="newPattern" class="form-control mb-2"/>
                        <input type="text" placeholder="Replacement" id="newRepl" class="form-control mb-2"/>
                        <button class="btn btn-secondary" id="addRegexButton">
                            <i class="far fa-plus-circle"></i> 添加正则表达式
                        </button>
                    </div>
                    <div class="mt-3">
                        <button class="btn btn-primary" id="exportRegexButton">导出正则表达式</button>
                        <input type="file" id="importRegexInput" class="d-none"/>
                        <button class="btn btn-primary" id="importRegexButton">导入正则表达式</button>
                    </div>
                </div>
            `;
            super('#collapseOne', parentSelector, headingId, '正则管理', contentHTML);
        }

        insert() {
            super.insert();
            // 如果尚未插入则先略过
            if (!document.querySelector('#collapseOne')) {
                return;
            }
            document.getElementById('addRegexButton').addEventListener('click', this.addRegex);
            document.getElementById('exportRegexButton').addEventListener('click', this.exportRegex);
            document.getElementById('importRegexButton').addEventListener('click', () => {
                document.getElementById('importRegexInput').click();
            });
            document.getElementById('importRegexInput').addEventListener('change', this.importRegex);
            this.loadRegexList();
        }

        addRegex = () => {
            const pattern = document.getElementById('newPattern').value;
            const repl = document.getElementById('newRepl').value;

            if (pattern && repl) {
                // 获取当前存储的正则列表
                const regexList = JSON.parse(localStorage.getItem('regexList')) || [];

                // 添加新的正则表达式
                regexList.push({ pattern, repl });

                // 保存到 localStorage
                localStorage.setItem('regexList', JSON.stringify(regexList));

                // 立即调用 loadRegexList 刷新页面
                this.loadRegexList();

                // 清空输入框
                document.getElementById('newPattern').value = '';
                document.getElementById('newRepl').value = '';
            }
        };

        loadRegexList() {
            const regexList = JSON.parse(localStorage.getItem('regexList')) || [];
            const regexListDiv = document.getElementById('regexList');
            regexListDiv.innerHTML = '';
            regexList.forEach((regex, index) => {
                const regexDiv = document.createElement('div');
                regexDiv.className = 'regex-item mb-3 p-2';
                regexDiv.style.border = '1px solid #ccc';
                regexDiv.style.borderRadius = '8px';
                regexDiv.style.transition = 'transform 0.3s';
                regexDiv.style.backgroundColor = regex.disabled ? '#f2dede' : '#fff';
                regexDiv.innerHTML = `
                    <div class="mb-2">
                        <input type="text" class="form-control mb-1" value="${regex.pattern}" data-index="${index}" data-type="pattern"/>
                        <input type="text" class="form-control" value="${regex.repl}" data-index="${index}" data-type="repl"/>
                    </div>
                    <div class="d-flex justify-content-between">
                        <div role="group" class="btn-group">
                            <button class="btn btn-secondary moveUpButton" data-index="${index}" title="上移">
                                <i class="fas fa-arrow-up"></i>
                            </button>
                            <button class="btn btn-secondary moveDownButton" data-index="${index}" title="下移">
                                <i class="fas fa-arrow-down"></i>
                            </button>
                            <button class="btn btn-secondary toggleRegexButton" data-index="${index}" title="禁用/启用">
                                <i class="${regex.disabled ? 'fas fa-toggle-off' : 'fas fa-toggle-on'}"></i>
                            </button>
                            <button class="btn btn-secondary matchRegexButton" data-index="${index}" title="匹配">
                                <i class="fas fa-play"></i>
                            </button>
                        </div>
                        <div role="group" class="btn-group">
                            <button class="btn btn-success saveRegexButton" data-index="${index}" title="保存">
                                <i class="far fa-save"></i>
                            </button>
                            <button class="btn btn-danger deleteRegexButton" data-index="${index}" title="删除">
                                <i class="far fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                `;
                regexListDiv.appendChild(regexDiv);
            });

            // 强制触发容器的重绘
            regexListDiv.style.display = 'none';  // 设置为不可见状态
            regexListDiv.offsetHeight;            // 读取元素的高度，强制重绘
            regexListDiv.style.display = '';      // 重新设置为可见状态

            document.querySelectorAll('.saveRegexButton').forEach(button => {
                button.addEventListener('click', () => {
                    const index = button.getAttribute('data-index');
                    this.saveRegex(index);
                });
            });

            document.querySelectorAll('.deleteRegexButton').forEach(button => {
                button.addEventListener('click', () => {
                    const index = button.getAttribute('data-index');
                    this.deleteRegex(index);
                });
            });

            document.querySelectorAll('.toggleRegexButton').forEach(button => {
                button.addEventListener('click', () => {
                    const index = button.getAttribute('data-index');
                    this.toggleRegex(index);
                });
            });

            document.querySelectorAll('.matchRegexButton').forEach(button => {
                button.addEventListener('click', () => {
                    const index = button.getAttribute('data-index');
                    this.matchRegex(index);
                });
            });

            document.querySelectorAll('.moveUpButton').forEach(button => {
                button.addEventListener('click', () => {
                    const index = parseInt(button.getAttribute('data-index'));
                    this.moveRegex(index, -1);
                });
            });

            document.querySelectorAll('.moveDownButton').forEach(button => {
                button.addEventListener('click', () => {
                    const index = parseInt(button.getAttribute('data-index'));
                    this.moveRegex(index, 1);
                });
            });
        }

        saveRegex() {
            const regexItems = document.querySelectorAll('.regex-item');
            const updatedRegexList = [];

            regexItems.forEach(item => {
                const patternInput = item.querySelector('input[data-type="pattern"]');
                const replInput = item.querySelector('input[data-type="repl"]');
                const disabled = item.style.backgroundColor === '#f2dede';

                if (patternInput && replInput) {
                    updatedRegexList.push({
                        pattern: patternInput.value,
                        repl: replInput.value,
                        disabled: disabled
                    });
                }
            });

            localStorage.setItem('regexList', JSON.stringify(updatedRegexList));
            this.loadRegexList();
        }

        deleteRegex(index) {
            const regexList = JSON.parse(localStorage.getItem('regexList')) || [];
            regexList.splice(index, 1);
            localStorage.setItem('regexList', JSON.stringify(regexList));
            this.loadRegexList();
        }

        toggleRegex(index) {
            const regexList = JSON.parse(localStorage.getItem('regexList')) || [];
            regexList[index].disabled = !regexList[index].disabled;
            localStorage.setItem('regexList', JSON.stringify(regexList));
            this.loadRegexList();
        }

        matchRegex(index) {
            const regexList = JSON.parse(localStorage.getItem('regexList')) || [];
            const regex = regexList[index];
            const textareas = document.querySelectorAll('textarea.translation.form-control');

            textareas.forEach(textarea => {
                let text = textarea.value;
                const pattern = new RegExp(regex.pattern, 'g');
                text = text.replace(pattern, regex.repl);
                this.simulateInputChange(textarea, text);
            });
        }

        moveRegex(index, direction) {
            const regexList = JSON.parse(localStorage.getItem('regexList')) || [];
            const newIndex = index + direction;
            if (newIndex >= 0 && newIndex < regexList.length) {
                const [movedItem] = regexList.splice(index, 1);
                regexList.splice(newIndex, 0, movedItem);
                localStorage.setItem('regexList', JSON.stringify(regexList));
                this.loadRegexListWithAnimation(index, newIndex);
            }
        }

        loadRegexListWithAnimation(oldIndex, newIndex) {
            const regexListDiv = document.getElementById('regexList');
            const items = regexListDiv.querySelectorAll('.regex-item');
            const oldItem = items[oldIndex];
            const newItem = items[newIndex];

            oldItem.style.transform = `translateY(${(newIndex - oldIndex) * 100}%)`;
            newItem.style.transform = `translateY(${(oldIndex - newIndex) * 100}%)`;

            setTimeout(() => {
                this.loadRegexList();
            }, 300);
        }

        simulateInputChange(element, newValue) {
            const inputEvent = new Event('input', { bubbles: true });
            const originalValue = element.value;
            element.value = newValue;

            const tracker = element._valueTracker;
            if (tracker) {
                tracker.setValue(originalValue);
            }

            element.dispatchEvent(inputEvent);
        }

        exportRegex() {
            const regexList = JSON.parse(localStorage.getItem('regexList')) || [];
            const json = JSON.stringify(regexList, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'regexList.json';
            a.click();
            URL.revokeObjectURL(url);
        }

        importRegex(event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = event => {
                const content = event.target.result;
                const regexList = JSON.parse(content);
                localStorage.setItem('regexList', JSON.stringify(regexList));
                this.loadRegexList();
            };
            reader.readAsText(file);
        }
    }

    // 定义具体的机器翻译卡片
    class MachineTranslationCard extends Card {
        constructor(parentSelector) {
            const headingId = 'headingTwo';
            const contentHTML = `
                <button class="btn btn-primary" id="openTranslationConfigButton">配置翻译</button>
                <div class="mt-3">
                    <div class="d-flex">
                        <textarea id="originalText" class="form-control" style="width: 100%; height: 25vh;"></textarea>
                        <div class="d-flex flex-column ml-2">
                            <button class="btn btn-secondary mb-2" id="copyOriginalButton">
                                <i class="fas fa-copy"></i>
                            </button>
                            <button class="btn btn-secondary" id="translateButton">
                                <i class="fas fa-globe"></i>
                            </button>
                        </div>
                    </div>
                    <div class="d-flex mt-2">
                        <textarea id="translatedText" class="form-control" style="width: 100%; height: 25vh;"></textarea>
                        <div class="d-flex flex-column ml-2">
                            <button class="btn btn-secondary mb-2" id="pasteTranslationButton">
                                <i class="fas fa-arrow-alt-left"></i>
                            </button>
                            <button class="btn btn-secondary" id="copyTranslationButton">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Translation Configuration Modal -->
                <div class="modal" id="translationConfigModal" tabindex="-1" role="dialog" style="display: none;">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">翻译配置</h5>
                                <button type="button" class="close" id="closeTranslationConfigModal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <form id="translationConfigForm">
                                    <div class="form-group">
                                        <label for="baseUrl">Base URL</label>
                                        <input type="text" class="form-control" id="baseUrl" placeholder="Enter base URL">
                                    </div>
                                    <div class="form-group">
                                        <label for="apiKey">API Key</label>
                                        <input type="text" class="form-control" id="apiKey" placeholder="Enter API key">
                                    </div>
                                    <div class="form-group">
                                        <label for="model">Model</label>
                                        <input type="text" class="form-control" id="model" placeholder="Enter model">
                                    </div>
                                    <div class="form-group">
                                        <label for="temperature">Prompt</label>
                                        <input type="text" class="form-control" id="prompt" placeholder="Enter prompt or use default prompt">
                                    </div>
                                    <div class="form-group">
                                        <label for="temperature">Temperature</label>
                                        <input type="number" step="0.1" class="form-control" id="temperature" placeholder="Enter temperature">
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" id="closeTranslationConfigModalButton">关闭</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            super('#collapseTwo', parentSelector, headingId, '机器翻译', contentHTML);
        }

        insert() {
            super.insert();
            if (!document.querySelector('#collapseTwo')) {
                return;
            }
            const translationConfigModal = document.getElementById('translationConfigModal');
            document.getElementById('openTranslationConfigButton').addEventListener('click', function() {
                translationConfigModal.style.display = 'block';
            });

            function closeModal() {
                translationConfigModal.style.display = 'none';
            }

            document.getElementById('closeTranslationConfigModal').addEventListener('click', closeModal);
            document.getElementById('closeTranslationConfigModalButton').addEventListener('click', closeModal);

            const baseUrlInput = document.getElementById('baseUrl');
            const apiKeyInput = document.getElementById('apiKey');
            const modelSelect = document.getElementById('model');
            const promptInput = document.getElementById('prompt');
            const temperatureInput = document.getElementById('temperature');

            baseUrlInput.value = localStorage.getItem('baseUrl') || '';
            apiKeyInput.value = localStorage.getItem('apiKey') || '';
            modelSelect.value = localStorage.getItem('model') || 'gpt-4o-mini';
            promptInput.value = localStorage.getItem('prompt') || '';
            temperatureInput.value = localStorage.getItem('temperature') || '';

            baseUrlInput.addEventListener('input', function() {
                localStorage.setItem('baseUrl', baseUrlInput.value);
            });

            apiKeyInput.addEventListener('input', function() {
                localStorage.setItem('apiKey', apiKeyInput.value);
            });

            modelSelect.addEventListener('input', function() {
                localStorage.setItem('model', modelSelect.value);
            });

            promptInput.addEventListener('input', function() {
                localStorage.setItem('prompt', promptInput.value);
            });

            temperatureInput.addEventListener('input', function() {
                localStorage.setItem('temperature', temperatureInput.value);
            });

            this.setupTranslation();
        }

        setupTranslation() {
            // 更新Original Text
            function updateOriginalText() {
                const originalDiv = document.querySelector('.original.well');
                if (originalDiv) {
                    const originalText = originalDiv.innerText;
                    document.getElementById('originalText').value = originalText;
                }
            }

            // 监控Original Text变化
            const observer = new MutationObserver(updateOriginalText);
            const config = { childList: true, subtree: true };
            const originalDiv = document.querySelector('.original.well');
            if (originalDiv) {
                observer.observe(originalDiv, config);
            }

            document.getElementById('copyOriginalButton').addEventListener('click', updateOriginalText);

            // 翻译功能
            document.getElementById('translateButton').addEventListener('click', async function() {
                const originalText = document.getElementById('originalText').value;
                console.log('Translating:', originalText);

                const model = localStorage.getItem('model') || 'gpt-4o-mini';
                const prompt = localStorage.getItem('prompt') || 'You are a professional translator focusing on translating Magic: The Gathering cards from English to Chinese. You are given a card\'s original text in English. Translate it into Chinese.';
                const temperature = parseFloat(localStorage.getItem('temperature')) || 0;

                document.getElementById('translatedText').value = '翻译中...';
                let translatedText = await translateText(originalText, model, prompt, temperature);
                // 正则替换
                const regexList = JSON.parse(localStorage.getItem('regexList')) || [];
                regexList.forEach(regex => {
                    if (!regex.disabled) {
                        const pattern = new RegExp(regex.pattern, 'g');
                        translatedText = translatedText.replace(pattern, regex.repl);
                    }
                });
                document.getElementById('translatedText').value = translatedText;
            });

            // 复制译文到剪切板
            document.getElementById('copyTranslationButton').addEventListener('click', function() {
                const translatedText = document.getElementById('translatedText').value;
                navigator.clipboard.writeText(translatedText).then(() => {
                    console.log('Translated text copied to clipboard');
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                });
            });

            // 粘贴译文
            document.getElementById('pasteTranslationButton').addEventListener('click', function() {
                const translatedText = document.getElementById('translatedText').value;
                simulateInputChange(document.querySelector('textarea.translation.form-control'), translatedText);
            });
        }
    }

    // 翻译函数定义
    async function translateText(query, model, prompt, temperature) {
        const API_SECRET_KEY = localStorage.getItem('apiKey');
        const BASE_URL = localStorage.getItem('baseUrl');
        if (!prompt) {
            prompt = "You are a professional translator focusing on translating Magic: The Gathering cards from English to Chinese. You are given a card's original text in English. Translate it into Chinese.";
        }

        const requestBody = {
            model: model,
            temperature: temperature,
            messages: [
                { role: "system", content: prompt },
                { role: "user", content: query }
            ]
        };

        try {
            const response = await fetch(`${BASE_URL}chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_SECRET_KEY}`
                },
                body: JSON.stringify(requestBody)
            });
            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Error:', error);
            return "翻译失败，请检查配置和网络连接。";
        }
    }

    function simulateInputChange(element, newValue) {
        const inputEvent = new Event('input', { bubbles: true });
        const originalValue = element.value;
        element.value = newValue;

        const tracker = element._valueTracker;
        if (tracker) {
            tracker.setValue(originalValue);
        }

        element.dispatchEvent(inputEvent);
    }

    // 初始化组件
    const accordion = new Accordion('#accordionExample', '.sidebar-right');
    const regexCard = new RegexCard('#accordionExample');
    const machineTranslationCard = new MachineTranslationCard('#accordionExample');

    accordion.addCard(regexCard);
    accordion.addCard(machineTranslationCard);

    const runButton = new Button('.btn.btn-secondary.match-button', '.toolbar .right .btn-group', '<i class="fas fa-play"></i> 匹配', function() {
        const regexList = JSON.parse(localStorage.getItem('regexList')) || [];
        const textareas = document.querySelectorAll('textarea.translation.form-control');

        textareas.forEach(textarea => {
            let text = textarea.value;
            regexList.forEach(regex => {
                if (!regex.disabled) {
                    const pattern = new RegExp(regex.pattern, 'g');
                    text = text.replace(pattern, regex.repl);
                }
            });
            simulateInputChange(textarea, text);
        });
    });
})();
