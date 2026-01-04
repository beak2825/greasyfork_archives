// ==UserScript==
// @name              变色
// @namespace         https://www.wangyongjie.top
// @version           0.0.2
// @description       变图片背景色
// @author            wangyongjie
// @license           MIT
// @supportURL        https://www.wangyongjie.top
// @match             file:///Users/wangyongjie/Desktop/E-image/*
// @match             *
// @require           https://cdn.bootcss.com/jquery/3.3.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/380902/%E5%8F%98%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/380902/%E5%8F%98%E8%89%B2.meta.js
// ==/UserScript==
function colorRandom() {
    var a, b, c;
    var a = parseInt(255 - Math.random() * 255).toString(16);
    var b = parseInt(255 - Math.random() * 255).toString(16);
    var c = parseInt(255 - Math.random() * 255).toString(16);
    colorStr = '#' + a + b + c;
} colorRandom();

$("body").css({
    background: colorStr
})

console.log("变色成功")
