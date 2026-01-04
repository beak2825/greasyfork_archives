// ==UserScript==
// @name         希音女装核价确认
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      2025-6-26
// @description  F8启动 ESC停止
// @author       lyw
// @match        https://sso.geiwohuo.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-end
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.14/vue.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/index.min.js
// @resource     element-ui-css https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/theme-chalk/index.min.css
// @downloadURL https://update.greasyfork.org/scripts/540811/%E5%B8%8C%E9%9F%B3%E5%A5%B3%E8%A3%85%E6%A0%B8%E4%BB%B7%E7%A1%AE%E8%AE%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/540811/%E5%B8%8C%E9%9F%B3%E5%A5%B3%E8%A3%85%E6%A0%B8%E4%BB%B7%E7%A1%AE%E8%AE%A4.meta.js
// ==/UserScript==



(function () {
    'use strict';
    GM_addStyle('@import url("https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/theme-chalk/index.min.css");');

    const app = document.createElement('div');
    document.body.appendChild(app);

    let intervalId = null; // 存储interval ID

    new Vue({
        el: app,
        data: {
            dialogVisible: false,
            inputValue: '',
            textarea2: '',
            shirt_sort: '',
            Colorobj: {},
            img_skc: [],
        },
        template: ``,
        methods: {
            showToast(message) {
                this.$message({
                    message: message,
                    type: 'success',
                    duration: 2000
                });
            },
        },
        async mounted() {
            console.log('程序已启动');
            window.addEventListener('keydown', async (event) => {
                if (event.key === 'F4') {
                    if (!intervalId) {
                        intervalId = setInterval(async () => {
                            await document.querySelector('.so-button.so-button-primary.so-button-small')?.click();
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            await document.querySelector('.so-button.so-button-danger.so-button-small')?.click();
                        }, 5000);
                        this.showToast('自动点击已启动');
                    }
                } else if (event.key === 'Escape') {
                    if (intervalId) {
                        clearInterval(intervalId);
                        intervalId = null;
                        this.showToast('自动点击已停止');
                    }
                }
            });
        }
    });
})();