// ==UserScript==
// @name         速刷助手
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  助力业务审核
// @author       熊喵呜哇
// @match        https://tonghang.woa.com/v2q/qq_channel_live/audit/100000
// @match        https://tonghang.woa.com/v2q/qq_channel_screen_share/audit/100000
// @icon         https://qq-web.cdn-go.cn//im.qq.com_new/7bce6d6d/asset/favicon.ico
// @license      GPL-3.0 License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479246/%E9%80%9F%E5%88%B7%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/479246/%E9%80%9F%E5%88%B7%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let f = false;
    let t = null;
    let startT = Date.now();
    let endT;

    const info = {
        timeGap: 5000, // 刷新超过多少秒就弹出通知
        refreshRate: 500 // 刷新频率，单位ms
    }

    function getDisTime(startT, endT, timeGap) {
        let disT = endT - startT;
        return disT >= timeGap;
    }

    // 刷新
    function refresh() {
        if (f) {
            return;
        }
        f = true;
        t = setInterval(() => {
            let len = document.getElementsByTagName('form').length;
            if (len) {
                //自动点击免审
                document.querySelector(".ant-select-selection__rendered").click()
                document.querySelectorAll(".ant-select-dropdown-menu-item")[0].click()
                //免审模块结束
                f = false;
                clearInterval(t);
                return;
            }
            document.querySelector('.ant-menu-item.ant-menu-item-selected').children[0].click()
        }, info.refreshRate)
    }

    // 提交当前case逻辑
    function submit(e) {
        if (e.button === 1) {
            const btn = document.querySelector('.ant-btn.antd-pro-pages-audit2-index2-submitButton.ant-btn-primary');
            if (btn) {
                btn.click();
            }
        }
    }

    // 代码入口
    function start(e) {
        if (e.button === 1) {
            e.preventDefault();
            submit(e);
            refresh();
        }
    }

    function enterClick(e) {
        if (e.keyCode === 13) {
            refresh();
        }
    }

    document.addEventListener('mousedown', start);
    document.addEventListener('keydown', enterClick);

    document.addEventListener("mousedown", function (e) {
        if (e.button === 2 || e.keyCode === 32) {
            clearInterval(t);
            f = false;

        }
    });

})();
