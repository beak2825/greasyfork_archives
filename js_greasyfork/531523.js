// ==UserScript==
// @name         聚水潭商品打印+
// @namespace    http://tampermonkey.net/
// @version      4.5
// @description  ☑️辅助码；☑️扫码直接打印；☑️查看库存及订单信息；🖱设置焦点到输入框
// @author       ShiShiBits
// @match        https://www.erp321.com/app/wms/print/V2/SkuPrintNV.aspx
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/531523/%E8%81%9A%E6%B0%B4%E6%BD%AD%E5%95%86%E5%93%81%E6%89%93%E5%8D%B0%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/531523/%E8%81%9A%E6%B0%B4%E6%BD%AD%E5%95%86%E5%93%81%E6%89%93%E5%8D%B0%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 专业配置 =================
    const CONFIG = {
        // 复选框配置
        checkboxes: [
            { selector: '#skuInputPrint',  expected: true },
            { selector: '#printMode',      expected: true },
            { selector: '#sku_id',         expected: false },
            { selector: '#multi_other_code', expected: true }
        ],

        // 输入框配置
        inputs: [
            { selector: '#multiSearchCode', needFocus: true }
        ],

        // 系统参数
        maxRetry: 30,         // 最大重试次数
        checkInterval: 400,   // 检查间隔(ms)
        delay: 150            // 操作延迟(ms)
    };

    // ================= 状态管理器 =================
    let retryCount = 0;
    const successMap = new Map();
    const focusMap = new Map();

    // ================= 核心控制引擎 =================
    const FormController = {
        init() {
            this.setupObserver();
            this.initialCheck();
            this.startRetryMechanism();
        },

        setupObserver() {
            new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList') {
                        this.handleNewNodes(mutation.addedNodes);
                    }
                });
            }).observe(document, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['id', 'checked', 'class']
            });
        },

        initialCheck() {
            setTimeout(() => {
                this.batchCheck();
                this.processInputs();
            }, CONFIG.delay * 2);
        },

        batchCheck() {
            CONFIG.checkboxes.forEach(config => {
                if (!successMap.get(config.selector)) {
                    this.processCheckbox(config);
                }
            });
        },

        processInputs() {
            CONFIG.inputs.forEach(inputConfig => {
                if (!focusMap.get(inputConfig.selector)) {
                    this.focusInput(inputConfig);
                }
            });
        },

        handleNewNodes(nodes) {
            nodes.forEach(node => {
                if (node.nodeType === 1) {
                    // 处理复选框
                    CONFIG.checkboxes.forEach(config => {
                        if (node.matches(config.selector)) {
                            this.processCheckbox(config);
                        }
                    });

                    // 处理输入框
                    CONFIG.inputs.forEach(inputConfig => {
                        if (node.matches(inputConfig.selector)) {
                            this.focusInput(inputConfig);
                        }
                    });
                }
            });
        },

        // ======== 修复的复选框处理逻辑 ========
        processCheckbox(config) {
            try {
                const { selector, expected } = config;
                const checkbox = document.querySelector(selector);

                // 元素存在性验证
                if (!checkbox) {
                    successMap.set(selector, false);
                    return;
                }

                // 状态验证
                if (checkbox.checked === expected) {
                    if (!successMap.get(selector)) {
                        console.log(`[CHECKBOX] ${selector} 状态已正确`);
                        successMap.set(selector, true);
                    }
                    return;
                }

                // 执行操作流程
                this.triggerNativeAction(checkbox, expected);
                this.scheduleStateUpdate(checkbox, expected);
                this.finalVerification(checkbox, config);

            } catch (error) {
                console.error(`[ERROR] 处理 ${config.selector} 时发生异常:`, error);
                successMap.set(config.selector, false);
            }
        },

        triggerNativeAction(checkbox, expected) {
            // 确保状态变化
            if (checkbox.checked !== expected) {
                checkbox.click();
            }

            // 触发必要事件
            ['click', 'change', 'input'].forEach(type => {
                checkbox.dispatchEvent(new Event(type, { bubbles: true }));
            });
        },

        scheduleStateUpdate(checkbox, expected) {
            setTimeout(() => {
                if (checkbox.checked !== expected) {
                    checkbox.checked = expected;
                    this.triggerFrameworkEvents(checkbox);
                }
            }, CONFIG.delay);
        },

        triggerFrameworkEvents(checkbox) {
            // React支持
            const reactProps = Object.keys(checkbox).find(k => k.startsWith('__reactProps'));
            if (reactProps?.onChange) {
                const event = new Event('change', { bubbles: true });
                Object.defineProperty(event, 'target', { value: checkbox });
                reactProps.onChange(event);
            }

            // Vue支持
            const vueProps = Object.keys(checkbox).find(k => k.startsWith('__vue__'));
            if (vueProps?.$emit) {
                vueProps.$emit('input', checkbox.checked);
                vueProps.$emit('change', checkbox.checked);
            }
        },

        finalVerification(checkbox, config) {
            setTimeout(() => {
                const success = checkbox.checked === config.expected;
                successMap.set(config.selector, success);
                console.log(`[CHECKBOX] ${config.selector}: ${success ? '成功 ✔️' : '失败 ✖️'}`);

                // 失败时自动重试
                if (!success && retryCount < CONFIG.maxRetry) {
                    this.processCheckbox(config);
                }
            }, CONFIG.delay * 2);
        },

        // 输入框聚焦方法
        focusInput(inputConfig) {
            try {
                const { selector, needFocus } = inputConfig;
                if (!needFocus) return;

                const input = document.querySelector("#skustock");
                if (!input) return;

                input.focus({ preventScroll: true });
                this.triggerFrameworkEvents(input);
                focusMap.set(selector, true);
                console.log(`[FOCUS] ${selector} 聚焦成功`);

                // 修复方法调用方式
                this.addFocusProtection(input);
            } catch (error) {
                console.error(`[FOCUS-ERROR] ${inputConfig.selector} 处理异常:`, error);
            }
        },

        // 新增焦点保护方法 (修复位置)
        addFocusProtection(input) {
            // 保存原始方法引用
            const originalBlur = input.blur.bind(input);

            // 重写blur方法
            input.blur = (...args) => {
                console.log('[FOCUS-PROTECT] 检测到失焦操作');
                // 取消默认行为
                // return false;
                return originalBlur(...args);
            };

            // 使用箭头函数保持this指向
            const checkFocus = () => {
                if (document.activeElement !== input) {
                    console.log('[FOCUS-CHECK] 重新聚焦输入框');
                    input.focus({ preventScroll: true });
                }
            };

            // 添加自动重聚焦定时器
            let checkCount = 0;
            const timer = setInterval(() => {
                if (checkCount++ < 5) {
                    checkFocus();
                } else {
                    clearInterval(timer);
                    console.log('[FOCUS-PROTECT] 结束自动聚焦保护');
                    input.blur = originalBlur; // 恢复原始方法
                }
            }, 2000);
        },

        startRetryMechanism() {
            const timer = setInterval(() => {
                if (retryCount++ < CONFIG.maxRetry) {
                    this.batchCheck();
                    this.processInputs();
                } else {
                    clearInterval(timer);
                    console.log('[SYSTEM] 终止重试，最终状态:', {
                        checkboxes: Array.from(successMap),
                        inputs: Array.from(focusMap)
                    });
                }
            }, CONFIG.checkInterval);
        }
    };

     // 获取元素并设置宽度和高度为500px
      var spModeSkupicElement = document.getElementById("sp_mode_skupic");
      if (spModeSkupicElement) {
          spModeSkupicElement.style.width = "500px";
          spModeSkupicElement.style.height = "500px";
      }

    // ================= 启动系统 =================
    FormController.init();

})();