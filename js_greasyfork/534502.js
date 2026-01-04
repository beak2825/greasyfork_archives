// ==UserScript==
// @name         9战
// @namespace    http://tampermonkey.net/
// @version      2025-03-30
// @description  9战1
// @author       You
// @match        https://www.milkywayidle.com/game*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534502/9%E6%88%98.user.js
// @updateURL https://update.greasyfork.org/scripts/534502/9%E6%88%98.meta.js
// ==/UserScript==

(function() {
    'use strict';



    class AutoFramework {
        static #isPaused = true;
    static #controlBar;
    static #func = null;

    // 设置自动化函数
    static setFunc(f) {
        this.#func = f;
    }

    // 初始化控制栏
    static initControlBar() {
        this.#controlBar = document.createElement('div');
        this.#controlBar.id = 'autoFrameworkControlBar';
        this.#controlBar.style = `
        position: fixed;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        padding: 10px 20px; /* 增加横向内边距 */
        background: rgba(0,0,0,0.7);
        color: white;
        border-radius: 8px; /* 添加圆角 */
        box-shadow: 0 2px 6px rgba(0,0,0,0.3); /* 添加阴影 */
        z-index: 99999;
    `;

        const input = document.createElement('input');
        input.id = 'input-9-name'
        input.value = '沼泽星球'

        const btn = document.createElement('button');
        btn.textContent = '开启9战';
        btn.style = `
                padding: 8px 16px;
                font-size: 16px;
                background: #f44336;
                color: white;
                border: none;
                cursor: pointer;
                border-radius: 4px;
            `;
        btn.addEventListener('click', () => this.togglePause());
        this.#controlBar.appendChild(input);
        this.#controlBar.appendChild(btn);
        document.body.appendChild(this.#controlBar);
    }

    static togglePause() {
        this.#isPaused = !this.#isPaused;
        const btn = this.#controlBar.querySelector('button');
        btn.textContent = this.#isPaused ? '开启' : '暂停';
        btn.style.backgroundColor = this.#isPaused ? '#f44336' : '#4CAF50';
    }

    static isPaused() {
        return this.#isPaused;
    }

    static async run() {
        while (true) {
            if (!this.#isPaused && this.#func) {
                try {
                    await this.#func();
                } catch (error) {
                    console.error('执行出错:', error);
                }
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    static findElementsByText(text, options = {}) {
        const {
            exact = false, // 是否精确匹配
            selector = '*', // 初始选择器（缩小搜索范围）
            visible = true // 是否仅可见元素
        } = options;

        const elements = document.querySelectorAll(selector);
        return Array.from(elements).filter(element => {
            if (visible && !this.isVisible(element)) return false;
            const content = element.textContent.trim();
            if (exact) return content === text;
            else return content.includes(text);
        });
    }

    static findElementByText(text, options) {
        const elements = this.findElementsByText(text, options);
        return elements.length > 0 ? elements[0] : null;
    }

    static clickElement(element) {
        if (element) {
            const event = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            element.dispatchEvent(event);
        }
    }

    static async waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(interval);
                    resolve(element);
                } else if (timeout <= 0) {
                    clearInterval(interval);
                    reject('元素未找到');
                }
                timeout -= 100;
            }, 100);
        });
    }

    static async waitForText(text, options = {}) {
        if (this.isPaused()) return Promise.reject('脚本已暂停');
        const { timeout = 5000, ...findOptions } = options;
        let timeout1 = timeout
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                const element = this.findElementByText(text, findOptions);
                if (element) {
                    clearInterval(interval);
                    resolve(element);
                } else if (timeout1 <= 0) {
                    clearInterval(interval);
                    reject(`文本 "${text}" 未找到`);
                }
                timeout1 -= 100;
            }, 100);
        });
    }

    static isVisible(element) {
        return element.offsetWidth > 0 && element.offsetHeight > 0;
    }

    static async clickByText(text, options = {}) {
        if (this.isPaused()) return;
        try {
            const element = await this.waitForText(text, options);
            this.clickElement(element);
        } catch (error) {
            console.error(`点击失败: ${error}`);
        }
    }

    static async getTextByText(text, options = {}) {
        try {
            const element = await this.waitForText(text, options);
            return element.textContent.trim();
        } catch (error) {
            console.error(`获取文本失败: ${error}`);
            return null;
        }
    }

    static findElementsByAttr(attrName, attrValue, options = {}) {
        const {
            exact = true, // 是否精确匹配（false为包含匹配）
            selector = '*', // 初始选择器
            visible = true // 是否仅可见元素
        } = options;
        const elements = document.querySelectorAll(selector);

        return Array.from(elements).filter(element => {
            if (visible && !this.isVisible(element)) return false;
            const attr = element.getAttribute(attrName);
            if (!attr) return false;

            if (exact) {
                return attr === attrValue;
            } else {
                return attr.includes(attrValue);
            }
        });
    }

    static findElementByAttr(attrName, attrValue, options) {
        const elements = this.findElementsByAttr(attrName, attrValue, options);
        return elements.length > 0 ? elements[0] : null;
    }

    static async waitForAttr(attrName, attrValue, options = {}) {
        if (this.isPaused()) return Promise.reject('脚本已暂停');
        const { timeout = 5000, ...findOptions } = options;
        let timeout1 = timeout
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                const element = this.findElementByAttr(attrName, attrValue, findOptions);
                if (element) {
                    clearInterval(interval);
                    resolve(element);
                } else if (timeout1 <= 0) {
                    clearInterval(interval);
                    reject(`属性匹配失败: ${attrName}=${attrValue}`);
                }
                timeout1 -= 100;
            }, 100);
        });
    }

    static async clickByAttr(attrName, attrValue, options = {}) {
        if (this.isPaused()) return;
        try {
            const element = await this.waitForAttr(attrName, attrValue, options);
            this.clickElement(element);
        } catch (error) {
            console.error(`属性点击失败: ${error}`);
        }
    }


    static reactInputTriggerHack(inputElem, value) {
        let lastValue = inputElem.value;
        inputElem.value = value;
        let event = new Event("input", { bubbles: true });
        event.simulated = true;
        let tracker = inputElem._valueTracker;
        if (tracker) {
            tracker.setValue(lastValue);
        }
        inputElem.dispatchEvent(event);
    }

    // 新增：根据class设置输入框值（支持React）
    static async setInputValueByClass(className, value, options = {}) {
        if (this.isPaused()) return;
        try {
            const element = await this.waitForAttr('class', className, {
                selector: 'input', // 仅限input元素
                exact: false,
                // 包含匹配
                ...options
            });
            if (!element) throw new Error(`未找到class为${className}的input元素`);

            this.reactInputTriggerHack(element, value);
            console.log(`设置输入值成功: ${className} -> ${value}`);
        } catch (error) {
            console.error('设置输入值失败:', error);
        }
    }
}

 async function actions() {
    const input = document.querySelector('#input-9-name').value
    if(!input){
        return
    }
    try {
        await AutoFramework.clickByText('战斗区域', {
            selector: 'button',
            timeout: 3000,
            exact: false //模糊  true 精确
        });

        await AutoFramework.clickByText(input, {
            selector: 'button',
            timeout: 3000,
            exact: false
        });

        await AutoFramework.clickByAttr('href', 'swamp_planet', {
            selector: 'use',
            exact: false,
            timeout: 3000,
            visible:false
        });

        await AutoFramework.setInputValueByClass('Input_input__2-t98', 9, {
            timeout: 3000
        });
        await AutoFramework.clickByText('添加到队列', {
            selector: 'button',
            timeout: 3000,
            exact: false
        });

    } catch (error) {
        console.error('自动化失败:', error);
    }
}

// 启动脚本
(async () => {
    AutoFramework.initControlBar();
    AutoFramework.setFunc(actions);
    AutoFramework.run();
})();
})();