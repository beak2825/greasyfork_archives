// ==UserScript==
// @name         HY(Temu使用Skc自动下架)2
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      2025-4-28
// @description  尝试temu使用Skc自动下架
// @author       lyw
// @match        https://seller.kuajingmaihuo.com/goods/product/list*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-end
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.14/vue.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/index.min.js
// @resource     element-ui-css https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/theme-chalk/index.min.css
// @downloadURL https://update.greasyfork.org/scripts/538586/HY%28Temu%E4%BD%BF%E7%94%A8Skc%E8%87%AA%E5%8A%A8%E4%B8%8B%E6%9E%B6%292.user.js
// @updateURL https://update.greasyfork.org/scripts/538586/HY%28Temu%E4%BD%BF%E7%94%A8Skc%E8%87%AA%E5%8A%A8%E4%B8%8B%E6%9E%B6%292.meta.js
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
                this.remove()
                this.dialogVisible = false; // 关闭对话框
            },
            async remove(){
                const arr = this.inputValue.split(" ")
                for (const item of arr) {
                    const test = document.querySelector('[data-testid="beast-core-button-link"]');
                    test.click();

                    const Inp = document.querySelector('[data-testid="beast-core-input-htmlInput"]');
                    Inp.focus();
                    document.execCommand('selectAll', false, null);
                    document.execCommand('insertText', false, item);

                    const search = document.querySelector('[data-testid="beast-core-input-suffix"]');
                    search.click();

                    await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒

                    const AskBtn = document.querySelector('.index-module__card___1Kw0C [data-testid="beast-core-button"]');
                    AskBtn.click();

                    // 可选：等待一些时间以确保操作完成
                    await new Promise(resolve => setTimeout(resolve, 4000)); // 等待1秒
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
