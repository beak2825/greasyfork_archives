// ==UserScript==
// @name         智慧城管导航栏一直显示
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  点开其它面板时，保持导航栏的 display 属性为 block
// @author       You
// @match        http://tampermonkey.net/index.php?version=4.4&ext=dhdg&updated=true
// @grant        none
// @include      http://125.70.9.213:8001/*
// @downloadURL https://update.greasyfork.org/scripts/378342/%E6%99%BA%E6%85%A7%E5%9F%8E%E7%AE%A1%E5%AF%BC%E8%88%AA%E6%A0%8F%E4%B8%80%E7%9B%B4%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/378342/%E6%99%BA%E6%85%A7%E5%9F%8E%E7%AE%A1%E5%AF%BC%E8%88%AA%E6%A0%8F%E4%B8%80%E7%9B%B4%E6%98%BE%E7%A4%BA.meta.js
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

    // 当导航栏DIV生成以后，锁定 display 属性
    var CSS201920 = '.new-app-panal {display:block!important;}';
    
    addGlobalStyle(CSS201920);
    
})();