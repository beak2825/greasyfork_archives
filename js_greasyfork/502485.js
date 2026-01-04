// ==UserScript==
// @name         素材快速去水印-搞定设计去水印 V1.0
// @namespace    https://greasyfork.org/zh-CN/users/1343580-zhilan2024
// @version      2024-08-03
// @description  快速去除素材网的水印：支持创客贴、稿定设计、比格设计。仅供个人学习研究不得他用。
// @author       zhilan2024
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @match        https://www.gaoding.com/editor/design?*
// @match        https://www.focodesign.com/editor/design?*
// @match        https://www.focodesign.com/editor/odyssey?template_id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gaoding.com
// @grant        none
// @license      Creative Commons (CC)
// @downloadURL https://update.greasyfork.org/scripts/502485/%E7%B4%A0%E6%9D%90%E5%BF%AB%E9%80%9F%E5%8E%BB%E6%B0%B4%E5%8D%B0-%E6%90%9E%E5%AE%9A%E8%AE%BE%E8%AE%A1%E5%8E%BB%E6%B0%B4%E5%8D%B0%20V10.user.js
// @updateURL https://update.greasyfork.org/scripts/502485/%E7%B4%A0%E6%9D%90%E5%BF%AB%E9%80%9F%E5%8E%BB%E6%B0%B4%E5%8D%B0-%E6%90%9E%E5%AE%9A%E8%AE%BE%E8%AE%A1%E5%8E%BB%E6%B0%B4%E5%8D%B0%20V10.meta.js
// ==/UserScript==

(function() {
    'use strict';
	
    const correctPassword = "woshizhilan";


    function checkblob() {
        const originalCreateObjectURL = URL.createObjectURL;
        URL.createObjectURL = function() {
            console.error('zhilan');
            return null;
        };
        const originalBlob = Blob;
        window.Blob = function(...args) {
            console.error('zhilan');
            return new originalBlob(...args);
        };
    }

    const userInput = prompt('请输入口令以去除水印：（关注公众号：woshizhilan，发送"口令"获取');
    if (userInput === correctPassword) {
        alert('正确，去水印成功。');
        checkblob(); 
    } else {
        alert('口令错误，关注公众号：woshizhilan，发送"口令"获取。');
    }
});