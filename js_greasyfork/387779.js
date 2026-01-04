// ==UserScript==
// @name         中国南方电网95598电费账单打印
// @namespace    3156289387@qq.com
// @version      1.0
// @description  为中国南方电网帐号账单页面提供清爽的打印页面支持。（2019-7-22）
// @author       zenwuyi
// @match        http://95598.gx.csg.cn/df/zdcxmx.do
// @match        http://95598.gx.csg.cn/df/zdckxxxx.do
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387779/%E4%B8%AD%E5%9B%BD%E5%8D%97%E6%96%B9%E7%94%B5%E7%BD%9195598%E7%94%B5%E8%B4%B9%E8%B4%A6%E5%8D%95%E6%89%93%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/387779/%E4%B8%AD%E5%9B%BD%E5%8D%97%E6%96%B9%E7%94%B5%E7%BD%9195598%E7%94%B5%E8%B4%B9%E8%B4%A6%E5%8D%95%E6%89%93%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var appStyle = '<style type="text/css">@media print{.noPrint {display:none;border:none}.print {display:block;}#htmldiv{line-height:100%;}body{background-color:#fff;background-image:none;}#body{width:910px}}</style>';
    $('body').append(appStyle);
    $('#header,#path_bar,#body_left,#footer,#body_kfImg').addClass('noPrint');
    $('#body_right > div,div > br').addClass('noPrint');
    $('table:contains("温馨提示"):last').parentsUntil('table').addClass('noPrint');
    $('#htmldiv').addClass('print');
    $("#path_container").append('&nbsp;|&nbsp;&nbsp;<a href="javascript:window.print();">打印插件已加载（点击这里打印）</a>');
    console.log('--==打印插件运行完成==--');
})();