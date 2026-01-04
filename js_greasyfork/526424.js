// ==UserScript==
// @name         Edit Shein Mi
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      2024-2-10
// @description  删除店小秘希音第一张图
// @author       XXX
// @match        https://www.dianxiaomi.com/sheinProduct/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-end
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.14/vue.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/index.min.js
// @resource     element-ui-css https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/theme-chalk/index.min.css
// @downloadURL https://update.greasyfork.org/scripts/526424/Edit%20Shein%20Mi.user.js
// @updateURL https://update.greasyfork.org/scripts/526424/Edit%20Shein%20Mi.meta.js
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
                let processedValue = this.inputValue.replace(/^-+|-+$/g, '').replace(/\s+/g, '');
                const inputElements = document.querySelectorAll('.skuInfoList .attrTd .form-component');

                inputElements.forEach(element => {
                    const currentValue = element.value;

                    // 如果内容中不包含至少一个 -，则不做修改
                    if ((currentValue.split('-').length - 1) < 1) {
                        return; // 不修改该元素
                    }

                    // 拆分当前值并找到第一个和最后一个 -，然后将它们与新内容组合
                    const parts = currentValue.split('-');
                    const newValue = `${parts[0]}-${parts[1]}-${parts[2]}-${processedValue}`;

                    // 使用 execCommand 插入新值 (模拟用户输入)
                    element.focus();
                    document.execCommand('selectAll', false, null);
                    document.execCommand('insertText', false, newValue);

                    // 强制同步 value 和源码
                    element.setAttribute('value', newValue); // 修改 DOM 中的 value
                    element.value = newValue; // 修改显示的 value

                    // 手动触发 input 和 change 事件，确保其他脚本能够感知到变化
                    setTimeout(() => {
                        element.dispatchEvent(new Event('input', { bubbles: true }));
                        element.dispatchEvent(new Event('change', { bubbles: true }));
                    }, 0);
                    console.log(element.value)
                });

                // 移除焦点，避免焦点仍在最后一个输入框
                document.activeElement.blur();

                this.dialogVisible = false; // 关闭对话框
            },
        },
        mounted() {
            // 监听 F2 键触发事件
            window.addEventListener('keydown', (event) => {
                // 监听 Del 键触发删除操作
                if (event.key === 'Delete') {
                    const inputElements = document.querySelectorAll('[uid="skuImgList"]');
                    const inputElements2 = document.querySelectorAll('[uid="particularImgList"]');
                    inputElements.forEach((item)=>{
                        const test = item.querySelector('[onclick="SHEIN_PRODUCT_IMAGE_UP.imageFn.skuDetailImgDel(this);"]');
                        test.click()
                    })
                    inputElements2.forEach((item)=>{
                        const test = item.querySelector('[onclick="SHEIN_PRODUCT_IMAGE_UP.particularImgFn.particularDetailImgDel(this);"]')
                        test.click()
                    })
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
