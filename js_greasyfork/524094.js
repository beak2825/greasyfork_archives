// ==UserScript==
// @name        gz-component
// @namespace   http://tampermonkey.net/
// @license     Apache-2.0
// @version     1.0.1
// @author      byhgz
// @description 一个常用的组件库
// @noframes    
// ==/UserScript==
"use strict";
(function () {
    'use strict';
    class SheetDialog {
        #div;
        #shadowRoot;
        #config;
        #isInsertIntoBody;
        #optionEvent;
        constructor(config) {
            this.#config = config;
            const div = document.createElement('div');
            div.attachShadow({mode: 'open'});
            div.shadowRoot.innerHTML = `
            <style>
                .sheet-dialog-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                .sheet-dialog-content {
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    padding: 20px;
                    max-height: 90vh;
                    overflow-y: auto;
                    width: 300px;
                    z-index: 1001;
                }
                .sheet-dialog-header {
                    font-size: 18px;
                    margin-bottom: 10px;
                }
                .sheet-dialog-options button {
                    display: block;
                    width: 100%;
                    padding: 10px;
                    margin-bottom: 5px;
                    text-align: left;
                    cursor: pointer;
                    border: none;
                    background: none;
                    outline: none;
                    transition: background-color 0.3s;
                }
                .sheet-dialog-options button:hover {
                    background-color: #f0f0f0;
                }
            </style>
            <!-- 对话框整体结构 -->
            <div class="sheet-dialog-overlay">
                <div class="sheet-dialog-content">
                    <div class="sheet-dialog-header"></div>
                    <div class="sheet-dialog-options"></div>
                </div>
            </div>
        `;
            this.#div = div;
            this.#shadowRoot = div.shadowRoot;
            this.#init();
        }
        #init() {
            const config = this.#config;
            config.title = config.title || '';
            config.options = config.options || [];
            config.closeOnOverlayClick = config.closeOnOverlayClick !== false;
            this.#render();
            if (config.closeOnOverlayClick) {
                this.#shadowRoot.querySelector('.sheet-dialog-overlay').addEventListener('click', () => this.destroy());
            }
            this.#shadowRoot.querySelector('.sheet-dialog-content').addEventListener('click', event => event.stopPropagation());
            const tempIs = config['isInsertIntoBody'];
            if (tempIs || tempIs === undefined) {
                this.addBody();
                this.#isInsertIntoBody = true;
            }
            const optionEvent = config['optionEvent'];
            if (optionEvent) {
                this.setOptionEvent(optionEvent);
            } else {
                this.setOptionEvent((event) => {
                    console.log('默认事件', event);
                });
            }
        }
        #render() {
            this.#shadowRoot.querySelector('.sheet-dialog-header').textContent = this.#config.title;
            const optionsContainer = this.#shadowRoot.querySelector('.sheet-dialog-options');
            for (const option of this.#config.options) {
                const button = document.createElement('button');
                if (typeof option === 'string') {
                    button.textContent = option;
                } else {
                    for (let key in option) {
                        if (key === 'label') continue
                        if (key === 'event' && typeof option['event'] === 'function') {
                            continue
                        }
                        button.setAttribute(key, option[key]);
                    }
                    if (option['event']) {
                        button.addEventListener('click', (event) => {
                            const target = event.target;
                            if (target.tagName !== 'BUTTON') {
                                event.stopPropagation();
                                event.preventDefault();
                                return
                            }
                            if (option['event'](event, this.#getOptionAttrs(target), this) === true) {
                                event.stopPropagation();
                                event.preventDefault();
                            }
                        });
                    }
                    button.textContent = option.label || '默认label';
                }
                optionsContainer.appendChild(button);
            }
            optionsContainer.addEventListener('click', (event) => {
                const target = event.target;
                if (target.tagName !== 'BUTTON') {
                    event.stopPropagation();
                    event.preventDefault();
                    return
                }
                if (this.#optionEvent(event, this.#getOptionAttrs(target), this)) {
                    this.destroy();
                }
            });
        }
        #getOptionAttrs(target) {
            const attrNames = target.getAttributeNames();
            const attrs = [];
            for (let attrName of attrNames) {
                const val = target.getAttribute(attrName).trim();
                attrs.push({name: attrName, value: val});
            }
            return attrs
        }
        getAllOptionAttrs() {
            const optionsContainer = this.#shadowRoot.querySelector('.sheet-dialog-options');
            const buttons = optionsContainer.querySelectorAll('button');
            const attrs = [];
            for (let button of buttons) {
                const optionAttrs = this.#getOptionAttrs(button);
                attrs.push(...optionAttrs);
            }
            return attrs
        }
        setOptionEvent(callback) {
            this.#optionEvent = callback;
        }
        destroy() {
            this.#div.remove();
        }
        addBody() {
            if (this.#isInsertIntoBody) {
                return
            }
            this.#isInsertIntoBody = true;
            document.body.appendChild(this.#div);
        }
    }
    const gz = {
        version: '1.0.0',
        SheetDialog
    };
    window.gz = gz;
})();
