// ==UserScript==
// @name New Script
// @css https://static.ifeo.cn/static/css/baidufanyi.css
// @namespace Violentmonkey Scripts
// @match             *://fanyi.baidu.com/*
// @description 百度翻译 页面 美化
// @version 0.0.1.20190815035155
// @downloadURL https://update.greasyfork.org/scripts/388611/New%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/388611/New%20Script.meta.js
// ==/UserScript==
var background = 'http://pic1.win4000.com/wallpaper/0/59c9c1cd0ed04.jpg'; //背景图
//$('.trans-other-wrap').hide(); //隐藏历史
$('.simultaneous-interpretation').hide();
$('.trans-machine').hide();
$('.download-guide').hide();
$('.manual-trans-info').hide();
$('.manual-trans-btn').hide();
$('body').css('background-image','url(' + background + ')');
$('body').css({"background-repeat":"no-repeat", "background-size": "cover"})
$('.container').css('background','#f9f9f900');
$('.header').css('background', '#ffffff00');
$('.divide-wrap').hide(); //隐藏横线

        