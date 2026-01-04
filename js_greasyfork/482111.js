// ==UserScript==
// @name         凌云网盘自动获取内部密码
// @namespace    http://jiangzhipeng.cn/
// @version      0.1.2
// @description  凌云百度网盘自动获取内部密码
// @author       Jiang
// @match        *://10010.linglong521.cn
// @match        *://10001.linglong521.cn
// @icon         https://foruda.gitee.com/avatar/1676959947996164615/1275123_jzp979654682_1578947912.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482111/%E5%87%8C%E4%BA%91%E7%BD%91%E7%9B%98%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96%E5%86%85%E9%83%A8%E5%AF%86%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/482111/%E5%87%8C%E4%BA%91%E7%BD%91%E7%9B%98%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96%E5%86%85%E9%83%A8%E5%AF%86%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let input = document.querySelector('input.form-control[name=page_pwd]');
    let btn = document.querySelector('button.btn.btn-success[type=submit]');
    let pwdUrl = '/1.txt';
    if (location.hostname.startsWith('10010')) {
        pwdUrl = '1314.txt';
    }
    fetch(pwdUrl).then(res => {
        res.text().then(pwd => {
            if (pwd && input && btn) {
                input.value = pwd;
                btn.click();
            }
        })
    });


})();