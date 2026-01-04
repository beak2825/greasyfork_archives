// ==UserScript==
// @name         HY POD快速关联
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      2024-1-24
// @description  POD快速关联  F2
// @author       lyw
// @match        https://www.haoyipod.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-end
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.14/vue.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/index.min.js
// @resource     element-ui-css https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/theme-chalk/index.min.css
// @downloadURL https://update.greasyfork.org/scripts/523762/HY%20POD%E5%BF%AB%E9%80%9F%E5%85%B3%E8%81%94.user.js
// @updateURL https://update.greasyfork.org/scripts/523762/HY%20POD%E5%BF%AB%E9%80%9F%E5%85%B3%E8%81%94.meta.js
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
            async confirm() {
                let processedValue = this.inputValue.split(" ");
                console.log(processedValue);
                console.log();
                const inp = document.querySelectorAll('.el-form.finished-edit .finished-form .el-form-item__content .el-col.el-col-5');
                inp.forEach(async (item,index) => {
                    await item.click()
                    const nextElementSibling = item.parentNode.nextElementSibling;
                    if (nextElementSibling) {
                        const btn = nextElementSibling.querySelector('button');
                        if (btn) {
                            // 执行按钮的点击操作或其他逻辑
                            await btn.click();
                            const nextElementSibling = item.parentNode.nextElementSibling;
                            if (nextElementSibling) {
                                const inputElements = nextElementSibling.querySelector('input[placeholder="第三方SKU"]')
                                inputElements.focus();
                                console.log(processedValue[index]);
                                document.execCommand('selectAll', false, null);
                                document.execCommand('insertText', false, processedValue[index]);
                            }
                        }
                    } else {
                        console.log('没有找到下个兄弟元素');
                    }

                    // 移除焦点，避免焦点仍在最后一个输入框
                    document.activeElement.blur();

                    this.dialogVisible = false; // 关闭对话框
                })
                // 移除焦点，避免焦点仍在最后一个输入框
                document.activeElement.blur();

                this.dialogVisible = false; // 关闭对话框
            },
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
