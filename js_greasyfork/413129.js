// ==UserScript==
// @name         Bilibili(B站)跳过视频任意时长
// @namespace    https://github.com/Milled/dullOP/
// @version      0.2.3
// @description  使用J与K键分别跳过任意时长的B站番剧/视频
// @author       Milled
// @match        *://www.bilibili.com/bangumi/play/*
// @match        *://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @require      https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.js
// @resource     swalStyle https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.css
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_getResourceText
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/413129/Bilibili%28B%E7%AB%99%29%E8%B7%B3%E8%BF%87%E8%A7%86%E9%A2%91%E4%BB%BB%E6%84%8F%E6%97%B6%E9%95%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/413129/Bilibili%28B%E7%AB%99%29%E8%B7%B3%E8%BF%87%E8%A7%86%E9%A2%91%E4%BB%BB%E6%84%8F%E6%97%B6%E9%95%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let util = {
        getValue(name) {
            return GM_getValue(name);
        },

        setValue(name, value) {
            GM_setValue(name, value);
        },

        addStyle(id, tag, css) {
            tag = tag || 'style';
            let doc = document, styleDom = doc.getElementById(id);
            if (styleDom) return;
            let style = doc.createElement(tag);
            style.rel = 'stylesheet';
            style.id = id;
            tag === 'style' ? style.innerHTML = css : style.href = css;
            doc.head.appendChild(style);
        },
    }

    let main = {
        initValue() {
            let value = [{
                name: "J",
                value: 90
            }, {
                name: "K",
                value: 60
            }];
        },

        registerMenuCommand() {
            GM_registerMenuCommand('⚙️ 设置', () => {
                let dom = `<div style="font-size: 1em;">
                                <label class="setting-label">J键跳过的时间（秒）:<input type="number" min="1" id="key-J" value="${util.getValue('J')}"
                                class="setting-input"></label>
                                <label class="setting-label">K键跳过的时间（秒）:<input type="number" min="1" id="key-K" value="${util.getValue('K')}"
                                class="setting-input"></label>
                            </div>`;
                Swal.fire({
                    title: '配置',
                    html: dom,
                    showCloseButton: true,
                    confirmButtonText: '保存',
                    footer: '<div style="text-align: center;font-size: 1em;">点击查看 <a href="https://github.com/Milled/dullOP" target="_blank">使用说明</a>，Powered by <a href="https://github.com/Milled/">Milled</a></div>',
                }).then((res) => {
                    if (res.isConfirmed) {
                        history.go(0);
                    }
                });

                document.getElementById('key-J').addEventListener('change', (e) => {
                    util.setValue('J', e.currentTarget.value);
                });
                document.getElementById('key-K').addEventListener('change', (e) => {
                    util.setValue('K', e.currentTarget.value);
                });
            });
        },

        addPluginStyle() {
            let style = `
                .setting-label { display: flex;align-items: center;justify-content: space-between;padding-top: 15px; }
                .setting-input { border: 1px solid #bbb; box-sizing: border-box; padding: 5px 10px; border-radius: 5px; width: 100px}
            `;

            if (document.head) {
                util.addStyle('swal-style', 'style', GM_getResourceText('swalStyle'));
                util.addStyle('style', 'style', style);
            }

            const headObserver = new MutationObserver(() => {
                util.addStyle('swal-style', 'style', GM_getResourceText('swalStyle'));
                util.addStyle('style', 'style', style);
            });
            headObserver.observe(document.head, {childList: true, subtree: true});
        },

        init() {
            this.initValue();
            this.addPluginStyle();
            this.registerMenuCommand();
        }
    };

    document.onkeyup = skip;
    function skip(event) {
        var e = event || window.event;
        var video = document.querySelector("video") || document.querySelector("bwp-video");
        switch(event.keyCode) {
            case 74 :
                video.currentTime += Number(util.getValue('J'));
                break;
            case 75 :
                video.currentTime += Number(util.getValue('K'));
        }
    }
    main.init();
})();