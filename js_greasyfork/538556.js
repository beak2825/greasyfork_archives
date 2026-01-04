// ==UserScript==
// @name         生产计划
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      2025-8-18
// @description  批量点击
// @author       lyw
// @match        https://crossdiy.haoyipod.com/hyadmin.php*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-end
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.14/vue.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/index.min.js
// @resource     element-ui-css https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/theme-chalk/index.min.css
// @downloadURL https://update.greasyfork.org/scripts/538556/%E7%94%9F%E4%BA%A7%E8%AE%A1%E5%88%92.user.js
// @updateURL https://update.greasyfork.org/scripts/538556/%E7%94%9F%E4%BA%A7%E8%AE%A1%E5%88%92.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 全局标志变量，用于控制程序是否继续执行
    let shouldContinue = true;

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
                <el-dialog title="注意" :visible.sync="dialogVisible" @close="handleClose">
                    <h1>检查是否筛选好仓库，按下就不能回头了</h1>
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
                const test = document.querySelectorAll('.func.download-func');  // 继续下载按钮
                for (const item of test) {
                    if (!shouldContinue) {
                        console.log('程序已终止');
                        this.$message({
                            message: '程序已终止',
                            type: 'success',
                            duration: 2000
                        });
                        break; // 终止循环
                    }
                    if (item.innerHTML === '继续下载') {
                        item.click();
                    }
                    this.dialogVisible = false;
                }
            }
        },
        mounted() {
            // 监听键盘事件
            window.addEventListener('keydown', (event) => {
                if (event.key === 'F2') {
                    shouldContinue = true; // 重置标志
                    this.dialogVisible = true; // 按下 F2 键时显示对话框
                }

                // 监听 Del 键触发删除操作
                if (event.key === 'Delete') {
                }

                if (event.key === 'Insert') { // 检测 'Insert' 键
                    this.fill();
                }

                if (event.key === 'Escape') { // 检测 'ESC' 键
                    shouldContinue = false; // 设置标志为 false
                    console.log('ESC 键按下，程序将终止');
                }
            });
        }
    });
})();
