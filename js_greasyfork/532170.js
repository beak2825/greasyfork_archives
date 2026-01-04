// ==UserScript==
// @name         银河奶牛放置-辅助增强
// @namespace    https://github.com/HereIsYui
// @version      0.0.2
// @description  让你在使用插件的时候更方便?(what?)
// @author       Yui
// @match        https://www.milkywayidle.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532170/%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%E6%94%BE%E7%BD%AE-%E8%BE%85%E5%8A%A9%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/532170/%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%E6%94%BE%E7%BD%AE-%E8%BE%85%E5%8A%A9%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var isInitFinished = false;
    var needItemEle;
    var buildNum = 0;
    /**
     * 监听带有模糊匹配class的元素出现
     * @param {string|RegExp} classPattern - 要匹配的class模式（字符串或正则表达式）
     * @param {Function} callback - 匹配到元素时的回调函数
     * @param {Object} [options] - 配置选项
     * @param {boolean} [options.checkExisting=true] - 是否检查已存在的元素
     * @param {boolean} [options.stopAfterFirstMatch=true] - 是否在第一次匹配后停止观察
     * @param {string} [options.matchMode='includes'] - 匹配模式: 'startsWith'|'includes'|'endsWith'|'regex'|'exact'
     * @param {boolean} [options.multiple=false] - 是否匹配多个元素
     * @returns {MutationObserver} 返回观察器实例以便手动控制
     */
    function observeElementByFuzzyClass(classPattern, callback, options = {}) {
        // 合并默认选项
        const {
            checkExisting = true,
            stopAfterFirstMatch = true,
            matchMode = 'includes',
            multiple = false,
            attributeFilter = ['class'],
            attributeOldValue = false,
            attributes = true,
            childList = true,
            subtree = true
        } = options;

        // 已匹配元素的集合（用于避免重复回调）
        const matchedElements = new Set();

        // 检查元素是否匹配条件的函数
        function isElementMatched(element) {
            if (!element.classList || element.classList.length === 0) return false;

            // 检查所有class是否符合条件
            for (const cls of element.classList) {
                if (matchClass(cls, classPattern, matchMode)) {
                    return true;
                }
            }
            return false;
        }

        // class匹配逻辑
        function matchClass(className, pattern, mode) {
            switch (mode) {
                case 'startsWith':
                    return className.startsWith(pattern);
                case 'includes':
                    return className.includes(pattern);
                case 'endsWith':
                    return className.endsWith(pattern);
                case 'regex':
                    return pattern.test(className);
                case 'exact':
                    return className === pattern;
                default:
                    return className.includes(pattern);
            }
        }

        // 处理匹配到的元素
        function handleMatchedElement(element) {
            if (matchedElements.has(element)) return false;

            matchedElements.add(element);
            callback(element);
            return true;
        }

        // 检查现有元素
        function checkExistingElements() {
            const allElements = document.querySelectorAll('*');
            let found = false;

            for (const element of allElements) {
                if (isElementMatched(element)) {
                    const handled = handleMatchedElement(element);
                    if (handled && stopAfterFirstMatch && !multiple) {
                        found = true;
                        break;
                    }
                }
            }

            return found;
        }

        // 首先检查现有元素
        if (checkExisting) {
            const foundExisting = checkExistingElements();
            if (foundExisting && stopAfterFirstMatch && !multiple) {
                return null;
            }
        }

        // 创建观察器实例
        const observer = new MutationObserver(function (mutations) {
            for (const mutation of mutations) {
                // 处理新增节点
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) { // 元素节点
                        // 检查节点本身
                        if (isElementMatched(node)) {
                            handleMatchedElement(node);
                            if (stopAfterFirstMatch && !multiple) {
                                observer.disconnect();
                                return;
                            }
                        }

                        // 检查子节点
                        if (node.querySelectorAll) {
                            const children = node.querySelectorAll('*');
                            for (const child of children) {
                                if (isElementMatched(child)) {
                                    handleMatchedElement(child);
                                    if (stopAfterFirstMatch && !multiple) {
                                        observer.disconnect();
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }

                // 处理class属性变化
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (isElementMatched(mutation.target)) {
                        handleMatchedElement(mutation.target);
                        if (stopAfterFirstMatch && !multiple) {
                            observer.disconnect();
                            return;
                        }
                    }
                }
            }

            // 补充全文档检查（防止遗漏）
            if (!stopAfterFirstMatch || multiple) {
                checkExistingElements();
            }
        });

        // 开始观察文档
        observer.observe(document.body, {
            childList,
            subtree,
            attributes,
            attributeFilter,
            attributeOldValue
        });

        return observer;
    }
    function observeElementByPartialId(partialId, callback, options = {}) {
        // 配置选项
        const {
            attributeFilter = ['id'],  // 只观察id属性变化
            attributeOldValue = false,
            attributes = true,         // 观察属性变化
            childList = true,          // 观察子节点变化
            subtree = true,            // 观察所有后代节点
            checkExisting = true,      // 是否检查已存在的元素
            matchMode = 'startsWith'   // 匹配模式：'startsWith'|'includes'|'endsWith'|'regex'
        } = options;

        // 检查元素是否已存在的函数
        function checkElement() {
            const elements = document.querySelectorAll('[id]');
            for (const element of elements) {
                if (matchesId(element.id, partialId, matchMode)) {
                    return element;
                }
            }
            return null;
        }

        // ID匹配函数
        function matchesId(id, partialId, mode) {
            switch (mode) {
                case 'startsWith':
                    return id.startsWith(partialId);
                case 'includes':
                    return id.includes(partialId);
                case 'endsWith':
                    return id.endsWith(partialId);
                case 'regex':
                    return new RegExp(partialId).test(id);
                default:
                    return id.startsWith(partialId);
            }
        }

        // 首先检查元素是否已经存在
        if (checkExisting) {
            const existingElement = checkElement();
            if (existingElement) {
                callback(existingElement);
                return null; // 返回null表示不需要观察
            }
        }

        // 创建观察器实例
        const observer = new MutationObserver(function (mutations) {
            // 检查每次DOM变化
            for (const mutation of mutations) {
                // 检查新增的节点
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) { // 元素节点
                        // 检查节点本身的ID
                        if (node.id && matchesId(node.id, partialId, matchMode)) {
                            observer.disconnect();
                            callback(node);
                            return;
                        }
                        // 检查节点的子节点
                        const matchedElement = node.querySelector(`[id]`);
                        if (matchedElement) {
                            const elements = node.querySelectorAll('[id]');
                            for (const element of elements) {
                                if (element.id && matchesId(element.id, partialId, matchMode)) {
                                    observer.disconnect();
                                    callback(element);
                                    return;
                                }
                            }
                        }
                    }
                }
                // 检查属性变化（如id被添加或修改）
                if (mutation.type === 'attributes' && mutation.attributeName === 'id') {
                    const element = mutation.target;
                    if (element.id && matchesId(element.id, partialId, matchMode)) {
                        observer.disconnect();
                        callback(element);
                        return;
                    }
                }
            }

            // 额外检查整个文档以防遗漏
            const matchedElement = checkElement();
            if (matchedElement) {
                observer.disconnect();
                callback(matchedElement);
            }
        });

        // 开始观察文档
        observer.observe(document.body, {
            childList,
            subtree,
            attributes,
            attributeFilter,
            attributeOldValue
        });

        return observer; // 返回观察器以便后续控制
    }

    // 监听数量变化
    document.getElementById('root').addEventListener('input', function (e) {
        if (e.target.matches('[class^="Input_input"] input')) {
            onInputValueChange(e.target.value);
            buildNum = e.target.value;
        }
    });

    // 监听面板弹出
    const modalObserver = observeElementByFuzzyClass('Modal_modalContainer', (el) => {
        // 数量input
        const inputItem = document.querySelector('[class^="Input_input"] input');

        // 监听插件数量显示
        const tillLevelNumberObserver = observeElementByPartialId('tillLevelNumber', (ele) => {
            ele.style.cursor = "pointer";
            ele.addEventListener('click', function () {
                const value = ele.innerText.split(" ")[0];
                reactInputTriggerHack(inputItem, value);
            });
        }, { stopAfterFirstMatch: false, multiple: true });

        const skillActionDetailObserver = observeElementByFuzzyClass('SkillActionDetail_itemRequirements', (ele) => {
            needItemEle = ele;
            ele.style.gridTemplateColumns = "auto min-content auto auto";
            onInputValueChange(0);
        }, { stopAfterFirstMatch: false, multiple: true });



    }, { stopAfterFirstMatch: false, multiple: true });
    function reactInputTriggerHack(inputElem, value) {
        let lastValue = inputElem.value;
        inputElem.value = value;
        let event = new Event("input", {
            bubbles: true
        });
        event.simulated = true;
        let tracker = inputElem._valueTracker;
        if (tracker) {
            tracker.setValue(lastValue);
        }
        inputElem.dispatchEvent(event);
    }


    function onInputValueChange(value) {
        console.log('动态input值变化:', value);
        let itemInfoArr = [];
        let needItemObj = needItemEle.children;
        if (needItemObj.length > 3 && needItemObj.length % 4 == 0 && needItemObj[3].innerText.startsWith('需要:')) {
            for (let i = 0; i < needItemObj.length; i++) {
                if (i % 4 == 0) {
                    itemInfoArr.push([needItemObj[i]]);
                } else {
                    itemInfoArr[itemInfoArr.length - 1].push(needItemObj[i]);
                }
            }
            itemInfoArr.forEach(element => {
                let num = parseFloat(element[1].innerText.replace(/[^0-9.]/g, ''));
                if (isNaN(num)) {
                    num = 1;
                }
                console.log(num);
                const result = num * value;
                element[3].innerHTML = `需要:${result.toFixed(1)}个`;
            });
        } else {
            for (let i = 0; i < needItemObj.length; i++) {
                if (i % 3 == 0) {
                    itemInfoArr.push([needItemObj[i]]);
                } else {
                    itemInfoArr[itemInfoArr.length - 1].push(needItemObj[i]);
                }
            }
            itemInfoArr.forEach(element => {
                let additem = document.createElement('span');
                let num = parseFloat(element[1].innerText.replace(/[^0-9.]/g, ''));
                if (isNaN(num)) {
                    num = 1;
                }
                console.log(num);
                const result = num * value;
                additem.innerHTML = `<span class="SkillActionDetail_itemRequirementCell__1F9JM SkillActionDetail_inventoryCount__tHmPD">需要:${result.toFixed(1)}个</span>`;
                needItemEle.insertBefore(additem, element[2].nextSibling);
            });
        }

    }
})();