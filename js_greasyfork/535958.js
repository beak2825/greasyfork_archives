// ==UserScript==
// @name         Temu广告批量关闭
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      2025-5-15
// @description  Temu广告批量关闭(Del启动,ESC关闭)
// @author       lyw
// @match        https://us.ads.temu.com/ad-list.html*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-end
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.14/vue.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/index.min.js
// @resource     element-ui-css https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/theme-chalk/index.min.css
// @downloadURL https://update.greasyfork.org/scripts/535958/Temu%E5%B9%BF%E5%91%8A%E6%89%B9%E9%87%8F%E5%85%B3%E9%97%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/535958/Temu%E5%B9%BF%E5%91%8A%E6%89%B9%E9%87%8F%E5%85%B3%E9%97%AD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Inject Element UI CSS
    GM_addStyle('@import url("https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/theme-chalk/index.min.css");');

    // 创建 Vue 实例
    const app = document.createElement('div');
    document.body.appendChild(app);

    new Vue({
        el: app,
        data: {
            dialogVisible: false,
            inputValue: '',
            isRunning: false, // 控制流程是否继续
        },
        methods: {
            // 关闭全部流程的封装方法
            stopAll() {
                this.isRunning = false;
            },

            async DelMethod() {
                this.isRunning = true; // 开始运行
                await new Promise(resolve => setTimeout(resolve, 500));
                let Btn1 = document.querySelectorAll('.SIH_outerWrapper_123.SIH_small_123.SIH_active_123');

                for (const item of Btn1) {
                    if (!this.isRunning) break; // 检查是否已停止
                    item.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    const Del_Btn = document.querySelector('.uUhVngcT._1liyGrvJ._239qT6wh.oJwPE6Ct.tlaTHHhe');
                    if (Del_Btn) {
                        Del_Btn.click();
                    }
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                if (this.isRunning) {
                    await this.next(); // 继续下一页
                }
            },

            async next() {
                const next = document.querySelector('[data-testid="beast-core-pagination-next"]');
                if (next && this.isRunning) {
                    next.click();
                    await new Promise(resolve => setTimeout(() => {
                        if (this.isRunning) this.DelMethod();
                        resolve();
                    }, 2000));
                }
            },
        },
        mounted() {
            // 监听键盘事件
            window.addEventListener('keydown', (event) => {
                if (event.key === 'Delete') {
                    this.DelMethod();
                } else if (event.key === 'Escape') {
                    // 按下 ESC 立即停止
                    this.stopAll();
                }
            });
        }
    });
})();