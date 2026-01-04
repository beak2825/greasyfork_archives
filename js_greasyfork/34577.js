// ==UserScript==
// @name         智慧城管详细信息排版
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  将问题描述显示为一行，加大字体
// @author       You
// @match        http://tampermonkey.net/index.php?version=4.4&ext=dhdg&updated=true
// @grant        none
// @include      http://125.70.9.213:8001/*
// @downloadURL https://update.greasyfork.org/scripts/34577/%E6%99%BA%E6%85%A7%E5%9F%8E%E7%AE%A1%E8%AF%A6%E7%BB%86%E4%BF%A1%E6%81%AF%E6%8E%92%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/34577/%E6%99%BA%E6%85%A7%E5%9F%8E%E7%AE%A1%E8%AF%A6%E7%BB%86%E4%BF%A1%E6%81%AF%E6%8E%92%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    var cssText = '';
    // 不显示的标签: 任务号(1行1列) 问题来源(1行3列) 问题类型(2行1列) 案卷类型(2行3列) 案卷类型内容(2行4列) 采集员(6行3列) 所属区域(7行1列) 所属区域内容(7行2列)
    cssText += '#eGovaComponent_6_1, #eGovaComponent_6_18, #eGovaComponent_6_3, #eGovaComponent_6_20, #eGovaComponent_6_21, #eGovaComponent_6_12, #eGovaComponent_6_24, #eGovaComponent_6_25 {visibility:hidden!important;}';

    // 移动位置: 问题来源内容(1行4列)
    cssText += '#eGovaComponent_6_19 {left:269px!important; width:152px!important;}';
    // 移动位置: 问题类型内容(2行2列)
    cssText += '#eGovaComponent_6_4 {left:27px!important; width:78px!important;}';
    // 移动位置: 采集员内容(6行4列)
    cssText += '#eGovaComponent_6_16 {left:427px!important;}';
    // 调整位置: 任务号内容(1行2列)
    cssText += '#eGovaComponent_6_7 {width:152px!important;}';
    // 统一顶部对齐, 字体大小1.5em
    cssText += '#eGovaComponent_6_4, #eGovaComponent_6_7, #eGovaComponent_6_19, #eGovaComponent_6_16 {top:2px!important; font-size:1.4em!important; border-bottom:1px solid #220!important;}';

    // 移动位置: 大类 小类 细类 立案条件 问题描述
    cssText += '#eGovaComponent_6_5, #eGovaComponent_6_6, #eGovaComponent_6_22, #eGovaComponent_6_23 {top:35px!important;}';
    cssText += '#eGovaComponent_6_41, #eGovaComponent_6_42 {top:65px!important;}';
    cssText += '#eGovaComponent_6_35, #eGovaComponent_6_40 {top:95px!important; height:49px!important;}';
    cssText += '#eGovaComponent_6_8, #eGovaComponent_6_9 {top:140px!important;}';

    // 加长宽度: 小类名称内容 细类名称内容 立案条件内容
    cssText += '#eGovaComponent_6_23 {width:400px!important;max-width:400px!important;}';
    cssText += '#eGovaComponent_6_42, #eGovaComponent_6_40 {width:500px!important;max-width:500px!important;}';
    // 换行：立案条件内容
    cssText += '#eGovaComponent_6_40 {white-space:normal!important; overflow:visible!important;}';

    // 加大字体: 大类名称内容 小类名称内容 细类名称内容 立案条件内容
    cssText += '#eGovaComponent_6_6, #eGovaComponent_6_23, #eGovaComponent_6_42 {font-size:1.4em!important; line-height:100%!important;}';
    cssText += '#eGovaComponent_6_40 {font-size:1.35em!important; line-height:100%!important;}';

    // 移动位置: 所属社区(7行3列) 所属社区内容(7行4列) 所属街道(8行1列) 所属街道内容(8行2列)
    cssText += '#eGovaComponent_6_26, #eGovaComponent_6_27, #eGovaComponent_6_10, #eGovaComponent_6_11 {top:279px!important;}';
    // 移动地址描述使其在在所属街道和所属社区下方
    cssText += '#eGovaComponent_6_33, #eGovaComponent_6_39 {top:307px!important; width:500px!important; max-width:500px!important;}';

    // 问题描述
    var someCSSMiaoshu = '#eGovaComponent_6_9 {';
    someCSSMiaoshu += 'height:120px!important; width:500px!important; max-width:500px!important;';
    someCSSMiaoshu += 'white-space:normal!important; overflow:visible!important;';
    someCSSMiaoshu += 'font-size:2em!important; line-height:130%;letter-spacing:2px!important;}';

    var someCSS = cssText + someCSSMiaoshu;

    var someReg = new RegExp('t_6','g');
    var another = someCSS.replace(someReg,'t_19');

    addGlobalStyle(someCSS + another);

})();