// ==UserScript==
// @name         补充产地
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      2024-1-27
// @description  Temu 补充产地
// @author       lyw
// @match        https://seller.kuajingmaihuo.com/goods/product/list*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-end
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.14/vue.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/index.min.js
// @resource     element-ui-css https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/theme-chalk/index.min.css
// @downloadURL https://update.greasyfork.org/scripts/525865/%E8%A1%A5%E5%85%85%E4%BA%A7%E5%9C%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/525865/%E8%A1%A5%E5%85%85%E4%BA%A7%E5%9C%B0.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // 注入 Element UI 的 CSS 样式
    GM_addStyle('@import url("https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/theme-chalk/index.min.css");');

    // 创建 Vue 应用挂载点
    const app = document.createElement('div');
    document.body.appendChild(app);

    // Vue 实例
    new Vue({
        el: app,
        data: {
            stopScript: false // 停止脚本的标志
        },
        methods: {
            async Select_Check() {
                // 每次递归检查是否需要停止脚本
                if (this.stopScript) {
                    console.log('脚本已停止');
                    return;
                }

                console.log('脚本运行中...');
                const checkbox = document.querySelector('.index-module__flex-1-1___1sS5J thead th input[mode="checkbox"].CBX_input_5-113-0');
                if (checkbox) {
                    checkbox.click();

                    const button = document.querySelector('.index-module__flex-0-0___I-d-v .index-module__divider-wrapper___YbEak [data-tracking-id="lQGvqq1gJL07f-mJ"]');
                    if (button) {
                        console.log('找到按钮，点击...');
                        button.click();

                        const select = document.querySelector('#provinceCode > div > div > div > div > div > div > div > div > div > div > div.IPT_suffixCell_5-113-0.IPT_prefixSuffixCell_5-113-0.IPT_pointerCell_5-113-0');
                        if (select) {
                            console.log('找到下拉选择框，点击...');
                            select.click();

                            // 延时等待下拉选项加载
                            setTimeout(async () => {
                                const guangdong = document.querySelector(
                                    'body > div.PT_outerWrapper_5-113-0.PP_outerWrapper_5-113-0.ST_dropdown_5-113-0.ST_mediumDropdown_5-113-0.PT_dropdown_5-113-0.PT_portalBottomLeft_5-113-0.PT_inCustom_5-113-0.PP_dropdown_5-113-0 > div > div > div > div > ul > li:nth-child(5)'
                                );
                                if (guangdong) {
                                    console.log('找到广东选项，点击...');
                                    guangdong.click();

                                    const confirm = document.querySelector(
                                        'body > div.MDL_outerWrapper_5-113-0.MDL_alert_5-113-0.MDL_showCloseIcon_5-113-0.undefined > div > div > div.MDL_inner_5-113-0 > div.MDL_bottom_5-113-0 > div.MDL_footer_5-113-0 > button.BTN_outerWrapper_5-113-0.MDL_okBtn_5-113-0.BTN_primary_5-113-0.BTN_medium_5-113-0.BTN_outerWrapperBtn_5-113-0'
                                    );
                                    if (confirm) {
                                        console.log('找到确认按钮，点击...');
                                        confirm.click();
                                        setTimeout(() => {
                                            // 继续递归
                                            this.Select_Check();
                                        }, 3000);
                                    }
                                } else {
                                    console.log('未找到广东选项，重试...');
                                    this.Select_Check()
                                }
                            }, 800);
                        } else {
                            console.log('未找到下拉选择框，重试...');
                        }
                    } else {
                        console.log('未找到按钮，重试...');
                    }
                } else {
                    console.log('未找到 checkbox，重试...');
                }
            },
            startScript() {
                console.log('启动脚本...');
                this.stopScript = false; // 重置停止标志
                this.Select_Check(); // 启动递归
            },
            stopScriptFunction() {
                console.log('停止脚本...');
                this.stopScript = true; // 设置停止标志
            }
        },
        mounted() {
            console.log('脚本加载成功，按 F2 启动，按 ESC 停止');
            window.addEventListener('keydown', (event) => {
                if (event.key === 'F2') {
                    this.startScript();
                } else if (event.key === 'Escape') {
                    this.stopScriptFunction();
                }
            });
        }
    });
})();

