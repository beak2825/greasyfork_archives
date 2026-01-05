// ==UserScript==
// @name         百度网盘不弹出手机验证
// @namespace    undefined
// @version      0.0.1
// @description  一行代码，解决百度网盘弹出手机验证问题
// @author       wangvic21
// @match        http://pan.baidu.com/*
// @match        https://pan.baidu.com/*
// @require      http://code.jquery.com/jquery-3.2.1.min.js 
// @downloadURL https://update.greasyfork.org/scripts/30189/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E4%B8%8D%E5%BC%B9%E5%87%BA%E6%89%8B%E6%9C%BA%E9%AA%8C%E8%AF%81.user.js
// @updateURL https://update.greasyfork.org/scripts/30189/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E4%B8%8D%E5%BC%B9%E5%87%BA%E6%89%8B%E6%9C%BA%E9%AA%8C%E8%AF%81.meta.js
// ==/UserScript==
// ==UserScript==
// @name         百度网盘不弹出手机验证
// @namespace    undefined
// @version      0.0.1
// @description  一行代码，解决百度网盘弹出手机验证问题
// @author       wangvic21
// @include      http://pan.baidu.com/*
// @include      https://pan.baidu.com/*
// ==/UserScript==
/* pan.baidu */

$(function(){ 
    $('#TANGRAM__PSP_3__').remove();
    $('#TANGRAM__PSP_4__').remove();
    $('#TANGRAM__PSP_2__foreground').remove();
}); 






