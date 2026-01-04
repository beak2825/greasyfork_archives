// ==UserScript==
// @name         Github format time
// @name:en      Github format time (24-hour system)
// @name:zh      Github 格式化时间(24小时制)
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description:zh  在 Github 的原始时间后添加一个格式化后的时间(24小时制)
// @description:en  Add a formatted time (24-hour system) after the original time of Github
// @author       Waset
// @homepage     https://greasyfork.org/zh-CN/scripts/466416-github-format-time
// @icon         https://github.com/fluidicon.png
// @match        https://www.tampermonkey.net/scripts.php
// @match        https://github.com/*
// @license MIT
// @grant        none
// @description 在 Github 的原始时间后添加一个格式化后的时间(24小时制)
// @downloadURL https://update.greasyfork.org/scripts/466416/Github%20format%20time.user.js
// @updateURL https://update.greasyfork.org/scripts/466416/Github%20format%20time.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function convertDateFormat(dateString) {
        // 创建一个新的 Date 对象
        const date = new Date(dateString);

        // 获取年份、月份和日期
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);

        // 获取小时和分钟
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const seconds = ('0' + date.getSeconds()).slice(-2);

        // 拼接成新的格式
        const newDateFormat = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        return newDateFormat;
    }
    document.querySelectorAll('relative-time').forEach((item) => {
        var time = item.datetime;

        var node = document.createElement('span');
        node.className = 'commit-ref';
        var str = convertDateFormat(time);
        var textnode = document.createTextNode(`${str}`);
        node.appendChild(textnode);

        // 在 relative-time 元素之后插入新元素
        item.insertAdjacentElement('afterend', node);
    });
})();
