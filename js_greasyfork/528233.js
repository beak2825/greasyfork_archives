// ==UserScript==
// @name         HY希音批量SPU
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      2024-2-27
// @description  获取页面中的Spu并显示在弹出框中的输入框里
// @author       lyw
// @match        https://sso.geiwohuo.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-end
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.14/vue.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/index.min.js
// @resource     element-ui-css https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/theme-chalk/index.min.css
// @downloadURL https://update.greasyfork.org/scripts/528233/HY%E5%B8%8C%E9%9F%B3%E6%89%B9%E9%87%8FSPU.user.js
// @updateURL https://update.greasyfork.org/scripts/528233/HY%E5%B8%8C%E9%9F%B3%E6%89%B9%E9%87%8FSPU.meta.js
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
                const rows = document.querySelectorAll('.so-table.so-table-default.so-table-hover.so-table-bordered.so-table-fixed.so-table-vertical-middle.so-table-sticky .ml-2.flex-1.leading-relaxed span');
                let content = '';

                rows.forEach(row => {
    if (row) {
        const text = row.textContent; // 获取纯文本
        // 移除 "SPU：" 的不同情况（全角冒号、半角冒号、前后空格等）
        const processedString = text.replace(/^(SPU:?|SPU：?)\s*/, "");
        content += processedString + '\n'; // 每个值一行
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
