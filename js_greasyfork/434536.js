// ==UserScript==
// @name         "当前网页非官方页面":自动跳转被QQ劫持后的地址到原地址
// @namespace    none
// @version      1.02
// @description  自动跳转"非官方页面，请勿输入QQ账号和密码，如需访问，请复制后使用浏览器访问"的网址
// @author       DuckBurnIncense
// @match        *://c.pc.qq.com/middlem.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434536/%22%E5%BD%93%E5%89%8D%E7%BD%91%E9%A1%B5%E9%9D%9E%E5%AE%98%E6%96%B9%E9%A1%B5%E9%9D%A2%22%3A%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E8%A2%ABQQ%E5%8A%AB%E6%8C%81%E5%90%8E%E7%9A%84%E5%9C%B0%E5%9D%80%E5%88%B0%E5%8E%9F%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/434536/%22%E5%BD%93%E5%89%8D%E7%BD%91%E9%A1%B5%E9%9D%9E%E5%AE%98%E6%96%B9%E9%A1%B5%E9%9D%A2%22%3A%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E8%A2%ABQQ%E5%8A%AB%E6%8C%81%E5%90%8E%E7%9A%84%E5%9C%B0%E5%9D%80%E5%88%B0%E5%8E%9F%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==


(function() {
    'use strict';
    let url = '//' + window.url.replace('http://', '').replace('https://', '');
    document.body.innerHTML="<h1>正在自动跳转到" + url + "</h1>";
    window.location.href = url;
})();