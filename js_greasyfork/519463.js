// ==UserScript==
// @name         HY核价
// @namespace    http://tampermonkey.net/
// @version      2024/12/4
// @description  更新F3启动弹出框，输入驳回价格和原因，点击确认或取消
// @author       LYW
// @match        https://sso.geiwohuo.com/*
// @run-at       document-end
// @grant        GM_addStyle
// @license MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.14/vue.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/index.min.js
// @resource     element-ui-css https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/theme-chalk/index.min.css
// @downloadURL https://update.greasyfork.org/scripts/519463/HY%E6%A0%B8%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/519463/HY%E6%A0%B8%E4%BB%B7.meta.js
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
            running: false,       // 控制循环是否继续
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

                // 设置 running 为 true，启动循环
                this.running = true;
                // 调用 loop 方法并传入价格和原因
                this.loop(this.rejectPrice, this.rejectReason);

                // 关闭对话框
                this.dialogVisible = false;
            },
            loop(rejectprice, rejectreason) {
                // 如果正在运行，则继续循环
                if (!this.running) return;

                // 获取页面中第一个目标元素
                const targetElement = document.querySelector('td.so-table-fixed-right')?.children[0]?.children[2]?.children[0];

                // 如果元素存在则点击该元素
                if (targetElement) {
                    targetElement.click();
                } else {
                    // 如果元素不存在，则退出循环
                    console.log('目标元素不存在，退出循环');
                    this.stopLoop();
                    return;
                }

                // 填写表单
                let divs1 = document.querySelector('.so-card-body .so-input-inline .so-input-number-ltr');
                let divs2 = document.querySelector('.so-card-body .so-button-primary');
                let divs3 = document.querySelector('.so-card-body .so-input-inline textarea');

                divs1.focus();
                document.execCommand('selectAll', false, null);
                document.execCommand('insertText', false, rejectprice);
                divs2.click();
                divs3.focus();
                document.execCommand('selectAll', false, null);
                document.execCommand('insertText', false, rejectreason);

                // 监听 .so-modal-mask 是否存在
                const checkModalMask = setInterval(() => {
                    const modalMask = document.querySelector('.so-modal-mask');
                    if (!modalMask) {
                        // 如果 .so-modal-mask 不存在，调用 loop
                        this.loop(rejectprice, rejectreason);
                        clearInterval(checkModalMask); // 清除定时器
                    }
                }, 1000); // 每秒检查一次 .so-modal-mask 是否存在
            },
            stopLoop() {
                // 设置 running 为 false，停止循环
                this.running = false;

                // 显示提示消息（toast）
                this.showToast('核价脚本已停止运行');
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
            // 监听 F3 键触发事件
            window.addEventListener('keydown', (event) => {
                if (event.key === 'F3') {
                    this.dialogVisible = true; // 按下 F3 键时显示对话框
                }
            });

            // 监听 Esc 键按下事件，停止循环
            window.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    console.log('Esc 被按下，停止循环');
                    this.stopLoop(); // 按下 Esc 键时停止循环
                }
            });

            // 监听 button2 点击事件，停止循环
            const button2 = document.querySelector('.so-card .so-card-footer .so-button-default');
            if (button2) {
                button2.addEventListener('click', () => {
                    console.log('button2 被点击，停止循环');
                    this.stopLoop(); // 点击 button2 时停止循环
                });
            }
        }
    });
})();
