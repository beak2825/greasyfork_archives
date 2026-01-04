// ==UserScript==
// @name         监督员轨迹简化
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  简化轨迹显示
// @author       You
// @match        http://tampermonkey.net/index.php?version=4.4&ext=dhdg&updated=true
// @grant        none
// @include      http://10.1.235.36:6888/*
// @downloadURL https://update.greasyfork.org/scripts/407090/%E7%9B%91%E7%9D%A3%E5%91%98%E8%BD%A8%E8%BF%B9%E7%AE%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/407090/%E7%9B%91%E7%9D%A3%E5%91%98%E8%BD%A8%E8%BF%B9%E7%AE%80%E5%8C%96.meta.js
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
    // 上报标记
    cssText += '#multiPostionGraphicSimple_layer {display:none!important;}';
    // 顶部中间人员数字
    cssText += '.app-screen-home-topNum {display:none!important;}';
    // 底部图例
    cssText += '#app-screen-recLegend {display:none!important;}';

    addGlobalStyle(cssText);

})();