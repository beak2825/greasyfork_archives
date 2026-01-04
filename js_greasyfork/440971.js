// ==UserScript==
// @name         百度主页渐变主题
// @icon         https://www.baidu.com/favicon.ico
// @version      1.2
// @description  替换主页背景
// @author       xiaofang
// @match        *://www.baidu.com/
// @grant        none
// @namespace    https://greasyfork.org/zh-CN/scripts/440971
// @downloadURL https://update.greasyfork.org/scripts/440971/%E7%99%BE%E5%BA%A6%E4%B8%BB%E9%A1%B5%E6%B8%90%E5%8F%98%E4%B8%BB%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/440971/%E7%99%BE%E5%BA%A6%E4%B8%BB%E9%A1%B5%E6%B8%90%E5%8F%98%E4%B8%BB%E9%A2%98.meta.js
// ==/UserScript==

$('#wrapper').prepend("<style>@-webkit-keyframes Gradient {0% {background-position: 0% 50%}50% { background-position: 100% 50%}100% {background-position: 0% 50%} } .s-skin-container { height: 100%;background: linear-gradient(-45deg, rgba(9, 69, 138, 0.2), rgba(68, 155, 255, 0.7), rgba(117, 113, 251, 0.7), rgba(68, 155, 255, 0.7), rgba(9, 69, 138, 0.2));    background-size: 400% 400%;-webkit-animation: Gradient 15s ease infinite;animation: Gradient 15s ease infinite;}</style>");
var abc = setInterval(function(){
    /*$(".s-isindex-wrap .sui-wraper").remove();*/
    $("#bottom_layer").remove();
    $(".s-isindex-wrap").removeAttr("style");
},1);
setTimeout(function(){clearInterval(abc);},2000);