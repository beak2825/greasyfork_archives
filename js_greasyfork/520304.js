// ==UserScript==
// @name         HY-Shein复制skc催审
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      2024-2-7
// @description  获取页面中的skc并显示在弹出框中的输入框里
// @author       lyw
// @match        https://sso.geiwohuo.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-end
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.14/vue.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/index.min.js
// @resource     element-ui-css https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/theme-chalk/index.min.css
// @downloadURL https://update.greasyfork.org/scripts/520304/HY-Shein%E5%A4%8D%E5%88%B6skc%E5%82%AC%E5%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/520304/HY-Shein%E5%A4%8D%E5%88%B6skc%E5%82%AC%E5%AE%A1.meta.js
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
            inputContent: ''
        },
        template: `
            <div>
                <el-dialog title="当前页面SKC" :visible.sync="dialogVisible" @close="handleClose">
                    <el-input type="textarea" v-model="inputContent" placeholder="这里显示页面的skc内容" rows="10"></el-input>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">关闭</el-button>
                    </span>
                </el-dialog>
            </div>
        `,
        methods: {
            handleClose() {
                this.inputContent = ''; // 清空输入框内容
            },
            getPageContent() {
                const rows = document.querySelectorAll('#per .so-table-table-bordered tbody tr');
                let content = '';

                rows.forEach(row => {
                    const td = row.querySelectorAll('td')[4];
                    if (td) {
                        const span = td.querySelector('.shein-components_ellipsis-mini_singleRowDiv span');
                        if (span) {
                            content += span.innerHTML + '\n'; // 每个值一行
                        }
                    }
                });

                this.inputContent = content; // 设置输入框内容
            }
        },
        mounted() {
            // 监听 F4 键触发事件
            window.addEventListener('keydown', (event) => {
                if (event.key === 'F4') {
                    this.getPageContent(); // 按下 F4 键时获取页面内容
                    this.dialogVisible = true; // 显示对话框
                }
            });
        }
    });
})();
