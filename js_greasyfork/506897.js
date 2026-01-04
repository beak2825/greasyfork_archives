// ==UserScript==
// @name         轻推WEB背景替换
// @namespace    https://web.qingtui.com/
// @version      0.1
// @description  允许用户通过Tampermonkey菜单动态更换背景图片
// @author       CloudS3n
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/506897/%E8%BD%BB%E6%8E%A8WEB%E8%83%8C%E6%99%AF%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/506897/%E8%BD%BB%E6%8E%A8WEB%E8%83%8C%E6%99%AF%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 初始化或获取背景
    const defaultBg = 'https://web.qingtui.com/static/media/background.cfa71abf.jpg';
    let userBg = GM_getValue('userBg', defaultBg);

    // 应用背景图片
    function applyBackgroundImage(url) {
        GM_addStyle(`
            #web-client body {
                background-image: url('${url}') !important;
                background-repeat: no-repeat;
                background-position: 0 0;
                background-size: cover;
            }
        `);
    }

    // 注册菜单命令
    GM_registerMenuCommand("设置背景图片", function() {
        let newBg = prompt('请输入新的背景图片URL:', userBg);
        if (newBg && newBg !== userBg) {
            GM_setValue('userBg', newBg);
            applyBackgroundImage(newBg);
        }
    });

    // 应用初始或保存的背景
    applyBackgroundImage(userBg);
})();