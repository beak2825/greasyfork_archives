// ==UserScript==
// @name         Edit Shein

// @namespace    http://tampermonkey.net/
// @license MIT
// @version      2025-7-18
// @description  修改Shein数值
// @author       XX
// @match        https://sso.geiwohuo.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-end
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.14/vue.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/index.min.js
// @resource     element-ui-css https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/theme-chalk/index.min.css
// @downloadURL https://update.greasyfork.org/scripts/519776/Edit%20Shein.user.js
// @updateURL https://update.greasyfork.org/scripts/519776/Edit%20Shein.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Inject Element UI CSS
    GM_addStyle('@import url("https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/theme-chalk/index.min.css");');

    // Create a Vue instance for Element UI
    const app = document.createElement('div');
    document.body.appendChild(app);

    // Define Vue component with Element UI dialog
    new Vue({
        el: app,
        data: {
            dialogVisible: false,
            inputValue: ''
        },
        template: `
            <div style="position: absolute; bottom: 16px; right: 689px; z-index: 9999;">
                <el-dialog title="输入内容" :visible.sync="dialogVisible" @close="handleClose">
                    <el-input v-model="inputValue" placeholder="请输入内容" ref="inputField"></el-input>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="confirm">确认</el-button>
                        <el-button @click="dialogVisible = false">取消</el-button>
                    </span>
                </el-dialog>
            </div>
        `,
        methods: {
            handleClose() {
                this.inputValue = ''; // 清空输入框
            },
            confirm() {
                this.dialogVisible = false; // 关闭对话框
                // //货号
                // const Huohao = document.querySelector('input[name="supplier_code"]')
                // Huohao.focus()
                // document.execCommand('selectAll', false, null);
                // document.execCommand('insertText', false, Huohao.value.replace(/-(.*)$/, `-${this.inputValue}`));

                document.activeElement.blur();
                //批量Sku值修改
                this.scrollAndModify(this.inputValue.trim())
            },
            trulyUpdateInput(input, newValue) {
                const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;

                const oldValue = input.value || '';
                const parts = oldValue.split('-');
                if (parts.length > 1) {
                    parts[parts.length - 1] = newValue; // 替换最后一个部分
                } else {
                    // 如果原来就不是用 - 分隔的，直接替换
                    parts[0] = newValue;
                }

                const finalValue = parts.join('-');
                setter.call(input, finalValue);

                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            },

            modifyVisibleSupplierSKU(newValue) {
                const inputs = document.querySelectorAll('div[class*="supplier_skuClass_"] input');
                inputs.forEach(input => {
                    this.trulyUpdateInput(input, newValue);
                });
                console.log(`✅ 已替换 ${inputs.length} 个 supplier_skuClass_* 输入框的最后一段为 ${newValue}`);
            },

            async scrollAndModify(newValue) {
                const container = document.querySelector(
                    '#userguide_commodities_info_supply_weight_table [data-soui-role="scroll"]'
                );
                const maxScroll = container.scrollHeight - container.clientHeight;
                let scrollTop = 0;
                let page = 1;

                while (scrollTop <= maxScroll) {
                    container.scrollTop = scrollTop;

                    await new Promise(r => setTimeout(r, 300)); // 等待渲染

                    console.log(`正在处理第 ${page} 页`);
                    this.modifyVisibleSupplierSKU(newValue);

                    scrollTop += container.clientHeight;
                    page++;
                }

                console.log('🎉 全部完成');
            },
            async del() {
                //主图
                const list1 = document.querySelectorAll('#userguide_commodities_info_skc_title_table .cilnix.soui-table-row-hover')
                for (const item of list1) {
                    item.querySelector('.spmp_style__preUploadItem--t_1j48AG i').click()
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                //方形图
                const square_img = document.querySelectorAll('#userguide_commodities_info_skc_title_table .cilnix.soui-table-row-hover')
                for (const item of square_img) {
                    item.querySelectorAll('td')[4].querySelector('i[font-size="12"]').click()
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                //详情图
                const list2 = document.querySelectorAll('.so-form-item.product_detail_pic .cilnix.soui-table-row-hover')
                for (const item of list2) {
                    item.querySelector('.spmp_style__preUploadItem--t_1j48AG i').click()
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

            }
        },
        mounted() {
            // 监听 F2 键触发事件
            window.addEventListener('keydown', (event) => {
                if (event.key === 'F2') {
                    this.dialogVisible = true; // 按下 F2 键时显示对话框
                }

                // 监听 Enter 键触发确认操作
                if (this.dialogVisible && (event.key === 'Enter' || event.key === 'NumpadEnter')) {
                    this.confirm(); // 按下 Enter 键时执行 confirm 操作
                }
                // 监听 Del 键触发删除操作
                if (event.key === 'Delete') {
                    this.del()
                }
            });

            // 聚焦输入框
            this.$watch('dialogVisible', (newVal) => {
                if (newVal) {
                    this.$nextTick(() => {
                        // 确保 Vue 更新 DOM 后，聚焦输入框
                        this.$refs.inputField.$el.querySelector('input').focus();
                    });
                }
            });
        }
    });
})();







