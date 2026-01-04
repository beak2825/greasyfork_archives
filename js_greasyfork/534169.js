// ==UserScript==
// @name         Temmu广告
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      2025-4-27
// @description  批量
// @author       lyw
// @match        https://us.ads.temu.com/ad-list.html*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-end
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.14/vue.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/index.min.js
// @resource     element-ui-css https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/theme-chalk/index.min.css
// @downloadURL https://update.greasyfork.org/scripts/534169/Temmu%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/534169/Temmu%E5%B9%BF%E5%91%8A.meta.js
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
            },
            async confirm() {
                let processedValue = this.inputValue
                this.dialogVisible = false; // 关闭对话框
                const svgs = document.querySelectorAll('._25P2foBU.g-operation');

                // 创建一个点击事件参数
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                });

                for (const svg of svgs) {
                    svg.dispatchEvent(clickEvent);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    const ele = document.querySelector('[data-testid="beast-core-inputNumber-htmlInput"]');
                    await ele.focus();
                    document.execCommand('selectAll', false, null);
                    document.execCommand('insertText', false, processedValue);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    const Cor_btn = document.querySelector('.uUhVngcT._1liyGrvJ._239qT6wh._337mCM9t._2GZFLUb_');
                    Cor_btn.click();
                }

                const disabledElement = document.querySelector('[data-testid="beast-core-pagination-next"].PGT_disabled_123')
                if (disabledElement) {
                    return
                }
                this.next()
            },
            async next(){
                const next = document.querySelector('[data-testid="beast-core-pagination-next"]')
                next.click()
                await new Promise(resolve => setTimeout(this.confirm, 6000));
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