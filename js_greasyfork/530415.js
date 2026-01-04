// ==UserScript==
// @name         国税开票助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  根据表单字段值自动勾选或取消勾选"是否展示"复选框
// @author       ChatGPT
// @match        https://dppt.anhui.chinatax.gov.cn:8443/blue-invoice-makeout/invoice-makeout*
// @match        https://dppt.anhui.chinatax.gov.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530415/%E5%9B%BD%E7%A8%8E%E5%BC%80%E7%A5%A8%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/530415/%E5%9B%BD%E7%A8%8E%E5%BC%80%E7%A5%A8%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置选择器
    const CONFIG = {
        // 购买方地址和电话
        group1: {
            fields: ['.t-form-item__dz input', '.t-form-item__lxdh input'],
            containers: ['.t-form-item__dz', '.t-form-item__lxdh'],
            checkboxSelector: '.t-checkbox__input'
        },
        // 购方开户银行和银行账号
        group2: {
            fields: ['.t-form-item__yhyywdmc input', '.t-form-item__yhzh input'],
            containers: ['.t-form-item__yhyywdmc', '.t-form-item__yhzh'],
            checkboxSelector: '.t-checkbox__input'
        }
    };

    // 工具函数：防抖
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // 查找字段关联的复选框
    function findRelatedCheckbox(container) {
        // 尝试在当前容器内查找
        let checkbox = container.querySelector('.t-checkbox__input');

        // 如果没找到，尝试查找相邻元素
        if (!checkbox) {
            // 查找父元素的下一个同级元素
            let nextSibling = container.nextElementSibling;
            while (nextSibling) {
                checkbox = nextSibling.querySelector('.t-checkbox__input');
                if (checkbox) break;
                nextSibling = nextSibling.nextElementSibling;
            }

            // 如果还没找到，尝试查找父元素
            if (!checkbox) {
                let parent = container.parentElement;
                checkbox = parent.querySelector('.t-checkbox__input');
            }
        }

        return checkbox;
    }

    // 模拟用户点击复选框
    function simulateUserClick(element) {
        if (!element) return;

        // 创建并分发鼠标事件
        const events = [
            new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }),
            new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }),
            new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
        ];

        // 依次触发事件
        events.forEach(event => element.dispatchEvent(event));
    }

    // 检查并更新复选框状态
    function updateCheckboxState(group) {
        // 获取所有输入字段
        const fields = [];
        group.fields.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => fields.push(el));
        });

        if (fields.length === 0) return; // 没有找到字段

        // 检查是否有值
        const hasValue = fields.some(field => field.value && field.value.trim() !== '');

        // 查找相关复选框
        let checkbox = null;
        let container = null;
        for (const containerSelector of group.containers) {
            container = document.querySelector(containerSelector);
            if (container) {
                checkbox = findRelatedCheckbox(container);
                if (checkbox) break;
            }
        }

        // 如果找不到复选框，尝试寻找包含"是否展示"文本的复选框
        if (!checkbox) {
            document.querySelectorAll('.t-checkbox').forEach(el => {
                if (el.textContent.includes('是否展示')) {
                    const inputEl = el.querySelector('.t-checkbox__input');
                    if (inputEl && !checkbox) {
                        checkbox = inputEl;
                    }
                }
            });
        }

        // 如果找不到复选框，可能需要查看页面结构
        if (!checkbox) {
            console.log('未找到关联的复选框');
            return;
        }

        // 获取复选框的包装元素
        const checkboxWrapper = checkbox.closest('.t-checkbox');
        if (!checkboxWrapper) {
            console.log('未找到复选框包装元素');
            return;
        }

        // 当前复选框状态与目标状态不一致时才更新
        const isCurrentlyChecked = checkboxWrapper.classList.contains('t-is-checked');
        if (isCurrentlyChecked !== hasValue) {
            console.log(`更新复选框状态: ${isCurrentlyChecked} -> ${hasValue}`);

            // 方法1: 模拟真实用户点击行为
            simulateUserClick(checkboxWrapper);

            // 方法2: 确保视觉状态与实际状态一致
            setTimeout(() => {
                // 再次检查状态，确保一致性
                const isNowChecked = checkboxWrapper.classList.contains('t-is-checked');
                if (isNowChecked !== hasValue) {
                    console.log('使用备用方法强制更新复选框状态');

                    // 直接触发原生的click处理函数
                    if (typeof checkboxWrapper.onclick === 'function') {
                        checkboxWrapper.onclick();
                    }

                    // 尝试访问Vue组件实例
                    tryUpdateVueComponent(checkboxWrapper, hasValue);
                }
            }, 50);
        }
    }

    // 尝试更新Vue组件状态
    function tryUpdateVueComponent(element, checked) {
        // 尝试查找Vue组件实例
        let vueInstance = null;

        // 查找元素上的__vue__属性 (Vue 2)
        if (element.__vue__) {
            vueInstance = element.__vue__;
        }

        // 如果找到Vue实例
        if (vueInstance) {
            // 尝试更新模型值
            if (vueInstance.model) {
                vueInstance.model.value = checked;
            }

            // 尝试调用组件方法
            if (typeof vueInstance.toggle === 'function') {
                vueInstance.toggle();
            }

            // 尝试直接更新数据属性
            if (vueInstance.isChecked !== undefined) {
                vueInstance.isChecked = checked;
            }

            // 强制Vue更新视图
            if (typeof vueInstance.$forceUpdate === 'function') {
                vueInstance.$forceUpdate();
            }
        }

        // 如果是TDesign组件，可能有特定的数据绑定方式
        const onChange = getEventHandlerFromAttribute(element, 'onChange');
        if (onChange) {
            try {
                onChange({ target: { checked: checked } });
            } catch (e) {
                console.error('调用onChange处理器失败', e);
            }
        }
    }

    // 从元素属性中提取事件处理函数
    function getEventHandlerFromAttribute(element, eventName) {
        // 查找特定属性
        for (const key in element) {
            if (key.startsWith('__reactEventHandlers') ||
                key.startsWith('__EMOTION_') ||
                key.startsWith('__vue')) {
                const obj = element[key];
                if (obj && typeof obj[eventName] === 'function') {
                    return obj[eventName];
                }
            }
        }
        return null;
    }

    // 监视DOM变化
    function setupMutationObserver() {
        const observer = new MutationObserver(debounce(() => {
            // 检查并更新两组复选框
            updateCheckboxState(CONFIG.group1);
            updateCheckboxState(CONFIG.group2);
        }, 200));

        // 观察整个文档的变化
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['value', 'class']
        });
    }

    // 监听输入事件
    function setupInputListeners() {
        document.addEventListener('input', debounce(event => {
            const target = event.target;
            if (target.tagName !== 'INPUT') return;

            // 检查目标是否属于第一组
            if (CONFIG.group1.fields.some(selector => target.matches(selector))) {
                updateCheckboxState(CONFIG.group1);
            }

            // 检查目标是否属于第二组
            if (CONFIG.group2.fields.some(selector => target.matches(selector))) {
                updateCheckboxState(CONFIG.group2);
            }
        }, 200));
    }

    // 监听值变化（处理JS赋值）
    function monitorValueChanges() {
        const inputProto = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
        const originalSetter = inputProto.set;

        // 重写setter以捕获编程方式的值更改
        Object.defineProperty(HTMLInputElement.prototype, 'value', {
            set: function(val) {
                const result = originalSetter.call(this, val);

                // 检查此输入字段是否是我们关注的字段
                const isGroup1Field = CONFIG.group1.fields.some(selector => this.matches(selector));
                const isGroup2Field = CONFIG.group2.fields.some(selector => this.matches(selector));

                if (isGroup1Field) {
                    updateCheckboxState(CONFIG.group1);
                }

                if (isGroup2Field) {
                    updateCheckboxState(CONFIG.group2);
                }

                return result;
            },
            get: inputProto.get
        });
    }

    // 添加覆盖原生函数的方法
    function overrideNativeFunctions() {
        // 保存原始的property setter
        const originalDefineProp = Object.defineProperty;

        // 重写defineProperty，拦截复选框相关的属性设置
        Object.defineProperty = function(obj, prop, descriptor) {
            // 先调用原始方法
            const result = originalDefineProp.call(this, obj, prop, descriptor);

            // 如果是设置checked属性，且对象是checkbox
            if (prop === 'checked' && obj instanceof HTMLInputElement && obj.type === 'checkbox') {
                // 设置checked属性后，检查是否需要同步状态
                setTimeout(() => {
                    // 查找所有复选框
                    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                        if (checkbox === obj) {
                            const checkboxWrapper = checkbox.closest('.t-checkbox');
                            if (checkboxWrapper) {
                                // 确保视觉状态与实际状态一致
                                if (checkbox.checked && !checkboxWrapper.classList.contains('t-is-checked')) {
                                    checkboxWrapper.classList.add('t-is-checked');
                                } else if (!checkbox.checked && checkboxWrapper.classList.contains('t-is-checked')) {
                                    checkboxWrapper.classList.remove('t-is-checked');
                                }
                            }
                        }
                    });
                }, 50);
            }

            return result;
        };
    }

    // 初始化脚本
    function init() {
        // 等待页面加载，检查字段是否已存在
        const checkFieldsExist = () => {
            const group1FieldExists = CONFIG.group1.fields.some(selector => document.querySelector(selector));
            const group2FieldExists = CONFIG.group2.fields.some(selector => document.querySelector(selector));

            if (group1FieldExists || group2FieldExists) {
                console.log('国税发票自动勾选脚本已初始化');

                // 设置各种监听器
                setupInputListeners();
                setupMutationObserver();
                monitorValueChanges();
                overrideNativeFunctions();

                // 页面加载后立即检查一次
                updateCheckboxState(CONFIG.group1);
                updateCheckboxState(CONFIG.group2);

                // 定期检查以防万一
                setInterval(() => {
                    updateCheckboxState(CONFIG.group1);
                    updateCheckboxState(CONFIG.group2);
                }, 2000);

                return true;
            }

            return false;
        };

        // 如果字段不存在，定期检查
        if (!checkFieldsExist()) {
            const interval = setInterval(() => {
                if (checkFieldsExist()) {
                    clearInterval(interval);
                }
            }, 500);
        }
    }

    // 运行初始化函数
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();