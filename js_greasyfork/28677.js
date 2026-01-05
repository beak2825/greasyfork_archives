// ==UserScript==
// @name         斗鱼TV自动领鱼丸
// @namespace    https://greasyfork.org/
// @version      0.1
// @description  实现斗鱼TV自动领鱼丸（需要输入验证码）
// @author       Dash Chen
// @match        https://www.douyu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28677/%E6%96%97%E9%B1%BCTV%E8%87%AA%E5%8A%A8%E9%A2%86%E9%B1%BC%E4%B8%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/28677/%E6%96%97%E9%B1%BCTV%E8%87%AA%E5%8A%A8%E9%A2%86%E9%B1%BC%E4%B8%B8.meta.js
// ==/UserScript==

window.setInterval(function() {
    var time = document.getElementsByClassName('g-time')[0].textContent;
    var node = document.getElementsByClassName('vcode9')[0];
    if (time === '领取' && node === undefined) {
        document.getElementsByClassName('may-btn')[0].click();
    }
}, 1000);
