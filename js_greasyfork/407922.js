// ==UserScript==
// @name         简化监督员热点图页面
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  简化监督员热点图页面,以便截图
// @author       You
// @match        http://tampermonkey.net/index.php?version=4.4&ext=dhdg&updated=true
// @grant        none
// @include      http://10.1.235.36:6888/*
// @downloadURL https://update.greasyfork.org/scripts/407922/%E7%AE%80%E5%8C%96%E7%9B%91%E7%9D%A3%E5%91%98%E7%83%AD%E7%82%B9%E5%9B%BE%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/407922/%E7%AE%80%E5%8C%96%E7%9B%91%E7%9D%A3%E5%91%98%E7%83%AD%E7%82%B9%E5%9B%BE%E9%A1%B5%E9%9D%A2.meta.js
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

    cssText += '.app-screen-home-left-page {display:none!important;}';
    cssText += '.app-screen-home-right-page {display:none!important;}';
    cssText += '#map_zoom_slider {display:none!important;}';

    var someReg = new RegExp('t_6','g');
    var cssText2 = cssText.replace(someReg,'t_19');

    addGlobalStyle(cssText);

})();