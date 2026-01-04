// ==UserScript==
// @name         监督员车辆轨迹简化
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  简化轨迹显示，去除无效信息。扣咪日眼的。
// @author       You
// @match        http://tampermonkey.net/index.php?version=4.4&ext=dhdg&updated=true
// @grant        none
// @include      http://223.223.180.206:6399/*
// @downloadURL https://update.greasyfork.org/scripts/406578/%E7%9B%91%E7%9D%A3%E5%91%98%E8%BD%A6%E8%BE%86%E8%BD%A8%E8%BF%B9%E7%AE%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/406578/%E7%9B%91%E7%9D%A3%E5%91%98%E8%BD%A6%E8%BE%86%E8%BD%A8%E8%BF%B9%E7%AE%80%E5%8C%96.meta.js
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
    cssText += '.amap-icon img {display:none!important;}';
    cssText += '.amap-layer {opacity:0!important;}';
    cssText += '#alarmWindow {display:none!important;}';

    var someReg = new RegExp('t_6','g');
    var cssText2 = cssText.replace(someReg,'t_19');

    addGlobalStyle(cssText);

})();