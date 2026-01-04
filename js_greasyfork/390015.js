// ==UserScript==
// @name         Add-js/css
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  给浏览器添加手动引入外部js及css的两个方法，方便临时引入外部文件调试页面
// @author       Sean
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390015/Add-jscss.user.js
// @updateURL https://update.greasyfork.org/scripts/390015/Add-jscss.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 加载js
    function addjs(src) {
        var head = document.querySelector('head');
        var script = document.createElement('script');
        script.src = src+'';
        script.type = 'text/javascript';
        head.appendChild(script);
        return '外部js注入成功' + script.src;
    }
    // 加载css
    function addcss(href) {
        var head = document.querySelector('head');
        var link = document.createElement('link');
        link.href = href+'';
        link.rel = 'stylesheet';
        link.type = 'text/css';
        head.appendChild(link)
        return '外部css注入成功' + link.href;
    }
    // 注入浏览器window对象
    window.addjs = addjs;
    window.addcss = addcss;
})();