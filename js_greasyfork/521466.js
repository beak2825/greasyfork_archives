// ==UserScript==
// @name         希音核价2.0
// @namespace    http://tampermonkey.net/
// @version      2024/12/23
// @description  希音核价
// @author       LYW
// @match        https://sso.geiwohuo.com/*
// @run-at       document-end
// @grant        GM_addStyle
// @license MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.14/vue.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/index.min.js
// @resource     element-ui-css https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/theme-chalk/index.min.css
// @downloadURL https://update.greasyfork.org/scripts/521466/%E5%B8%8C%E9%9F%B3%E6%A0%B8%E4%BB%B720.user.js
// @updateURL https://update.greasyfork.org/scripts/521466/%E5%B8%8C%E9%9F%B3%E6%A0%B8%E4%BB%B720.meta.js
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
            dialogVisible: false, // 控制弹出框显示与否
            rejectPrice: '',      // 驳回价格输入框的值
            rejectReason: '',     // 驳回原因输入框的值
            observer: '',
        },
        template: `
            <div style="position: absolute; bottom: 16px; right: 16px; z-index: 9999;">
                <el-dialog title="请输入核价信息" :visible.sync="dialogVisible" @close="handleClose">
                    <!-- 驳回价格输入框 -->
                    <el-input v-model="rejectPrice" placeholder="请输入统一的驳回价格" type="text"></el-input>
                    <!-- 驳回原因输入框 -->
                    <el-input v-model="rejectReason" placeholder="请输入驳回原因" type="textarea" rows="4"></el-input>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="confirm">确认</el-button>
                        <el-button @click="dialogVisible = false">取消</el-button>
                    </span>
                </el-dialog>
            </div>
        `,
        methods: {
            handleClose() {
                // 关闭对话框时清空输入框内容
                this.rejectPrice = '';
                this.rejectReason = '';
            },
            confirm() {
                // 在确认按钮点击时，获取驳回价格和驳回原因的输入值
                console.log('驳回价格:', this.rejectPrice);
                console.log('驳回原因:', this.rejectReason);
                this.edit(this.rejectPrice, this.rejectReason)
                this.observeDOMChanges(this.rejectPrice, this.rejectReason);
                this.showToast('脚本已开始运行');
                // 关闭对话框
                this.dialogVisible = false;
            },
            edit(rejectPrice, rejectReason) {
                const inputval = document.querySelectorAll('.so-modal-mask tbody input[type="text"]')
                const textval = document.querySelectorAll('.so-modal-mask tbody textarea')

                inputval.forEach((element) => {
                    if (element.value === '') {
                        element.focus();
                        document.execCommand('selectAll', false, null);
                        document.execCommand('insertText', false, rejectPrice);
                    }
                })

                textval.forEach((element) => {
                    if (element.value === '') {
                        element.focus();
                        document.execCommand('selectAll', false, null);
                        document.execCommand('insertText', false, rejectReason);
                    }
                })
            },
            observeDOMChanges(rejectPrice, rejectReason) {
                const mask = document.querySelector('.so-modal-mask .so-scroll-handle');

                // 创建 MutationObserver 实例
                this.observer = new MutationObserver((mutationsList, observer) => {
                    this.edit(rejectPrice, rejectReason)
                });

                // 观察目标区域的子元素变化
                this.observer.observe(mask, { childList: true, subtree: true, attributes: true });
            },
            showToast(message) {
                this.$message({
                    message: message,
                    type: 'info', // 'success', 'warning', 'info', 'error'
                    duration: 3000, // 提示框显示时间
                });
            }
        },
        mounted() {
            // 监听 F2 键触发事件
            window.addEventListener('keydown', (event) => {
                if (event.key === 'F2') {
                    this.dialogVisible = true; // 按下 F2 键时显示对话框
                }
                if (event.key === 'Delete') {
                    // 移除焦点，避免焦点仍在最后一个输入框
                    document.activeElement.blur();
                    this.observer.disconnect();
                    this.showToast('脚本已停止运行');
                }
            });

        }
    });
})();
