// ==UserScript==
// @name         咸鱼看图助手
// @namespace    https://greasyfork.org/zh-CN/scripts/28896-%E5%92%B8%E9%B1%BC%E7%9C%8B%E5%9B%BE%E5%8A%A9%E6%89%8B
// @version      0.1.3
// @description  清除第一个图片被app推广挡住的问题，拯救强迫症!
// @author       peasshoter
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.1.1/jquery.min.js
// @include      https://2.taobao.com/*
// @include      https://s.2.taobao.com/*
// @downloadURL https://update.greasyfork.org/scripts/28896/%E5%92%B8%E9%B1%BC%E7%9C%8B%E5%9B%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/28896/%E5%92%B8%E9%B1%BC%E7%9C%8B%E5%9B%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

$('.mau-guide').remove();
$('.download-layer').remove();
document.onreadystatechange = removeAD;//当页面加载状态改变的时候执行这个方法.
function removeAD() {
    if(document.readyState=="complete"){
        $('.mau-guide').remove();
        $('.download-layer').remove();
    }
}