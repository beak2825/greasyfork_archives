// ==UserScript==
// @name         Temu核价

// @namespace    http://tampermonkey.net/
// @license MIT
// @version      2024-12-25
// @description  temu核价
// @author       lyw
// @match        https://seller.kuajingmaihuo.com/main/product/seller-select
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-end
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.14/vue.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/index.min.js
// @resource     element-ui-css https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/theme-chalk/index.min.css
// @downloadURL https://update.greasyfork.org/scripts/521582/Temu%E6%A0%B8%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/521582/Temu%E6%A0%B8%E4%BB%B7.meta.js
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
                <el-dialog title="输入报价" :visible.sync="dialogVisible" @close="handleClose">
                    <el-input v-model="inputValue" placeholder="请输入新报价" ref="inputField"></el-input>
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
                let processedValue = this.inputValue.replace(/^-+|-+$/g, '').replace(/\s+/g, '');
                this.newpice(processedValue)
                this.dialogVisible = false; // 关闭对话框
            },
            async reject() {
                const test = document.querySelectorAll('[data-testid="beast-core-modal-body"] tbody [data-testid="beast-core-select-htmlInput"]');
                for (const element of test) {
                    element.click();  // 点击元素
                    const select = document.querySelectorAll('[data-testid="beast-core-portal"] ul li')[2];
                    if (select) {
                        select.click();  // 点击选择项
                    }

                    // 等待 600 毫秒
                    await new Promise(resolve => setTimeout(resolve, 300));
                }
            },
            async newpice(processedValue) {
                const test = document.querySelectorAll('[data-testid="beast-core-modal-body"] tbody [data-testid="beast-core-select-htmlInput"]');
                for (const element of test) {
                    console.log(element);
                    element.click();  // 点击元素
                    const select = document.querySelectorAll('[data-testid="beast-core-portal"] ul li')[1];
                    if (select) {
                        select.click();  // 点击选择项
                    }
                    // 等待 600 毫秒
                    await new Promise(resolve => setTimeout(resolve, 300));
                }
                //改价
                const inp = document.querySelectorAll('[data-testid="beast-core-modal-body"] tbody [data-testid="beast-core-inputNumber-htmlInput"]');
                for (const element of inp) {
                    element.focus();
                    document.execCommand('selectAll', false, null);
                    document.execCommand('insertText', false, processedValue);
                }
                // 移除焦点，避免焦点仍在最后一个输入框
                document.activeElement.blur();
            }
        },
        mounted() {
            // 监听 F2 键触发事件
            window.addEventListener('keydown', (event) => {
                if (event.key === 'F2') {
                    this.dialogVisible = true; // 按下 F2 键时显示对话框
                }

                if (event.key === 'Delete') {
                    this.reject();
                }
                // 监听 Enter 键触发确认操作
                if (this.dialogVisible && (event.key === 'Enter' || event.key === 'NumpadEnter')) {
                    this.confirm(); // 按下 Enter 键时执行 confirm 操作
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
