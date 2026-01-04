// ==UserScript==
// @name         联想知识库不登入
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  联想知识库不登入，我就是看看教程为啥要注册
// @license MIT
// @author       隐者浮云
// @match        https://iknow.lenovo.com.cn/*
// @icon         https://www.lenovo.com.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460102/%E8%81%94%E6%83%B3%E7%9F%A5%E8%AF%86%E5%BA%93%E4%B8%8D%E7%99%BB%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/460102/%E8%81%94%E6%83%B3%E7%9F%A5%E8%AF%86%E5%BA%93%E4%B8%8D%E7%99%BB%E5%85%A5.meta.js
// ==/UserScript==

(function() {
    $(".QRCodePic2").show(function() {
        $(".coverQRCode").hide(500)
        $(document).unbind("scroll.unable");
    })
})();