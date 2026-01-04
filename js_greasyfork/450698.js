// ==UserScript==
// @name         JDY_Print_Label
// @namespace    http://www.liftnova-cranes.com/
// @version      0.1
// @description  使标签打印字体变大
// @author       Bruce
// @match        https://u4c0fh51hz.jiandaoyun.com/f/627c5fb11456a200086b1d0a
// @icon         https://www.google.com/s2/favicons?domain=jiandaoyun.com
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/450698/JDY_Print_Label.user.js
// @updateURL https://update.greasyfork.org/scripts/450698/JDY_Print_Label.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var delay_time = 5000; //单位毫秒，根据原本页面载入用时判断
setTimeout(function(){
//css start
    let css = `
.fx-external-form .form-content {
width: 1120px;/*页面宽度*/
}
body {
font-size: 20px;/*表头文字大小*/
}
.entry-name {
text-align:center;/*仪表盘标题居中*/
}
.fx-external-form .external-qr {
display:none;/*QR图标去除*/
}
.x-tag .tag-wrapper {
font-size: 20px;/*彩色文字*/
line-height: 24px;
}
.x-input .input-inner {
font-size:20px;/*文本输入框文字大小*/
}
.fx-form-number .fx-format-number-input .normal-input {
font-size:20px;/*数字输入框文字大小*/
}
.fx-form-content-disabled {
font-size: 20px;/*表格文字大小*/
line-height: 24px;
}
    `
    GM_addStyle(css);
    var div=document.getElementsByClassName("head-title")[0];//这个class和仪表盘样式相关
    div.style.cssText = "text-align: center; font-size: 30px; font-style: normal; font-weight: bold; color: rgb(89, 124, 184);";
//css end

} , delay_time)
    // Your code here...
})();