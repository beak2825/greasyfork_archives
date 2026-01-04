// ==UserScript==
// @name         页面小飞机
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在需要开启的界面中开启就会出现小飞机,按  ←↑→ 可以操作飞机,按下空格 轰炸
// @author       毅
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/480861/%E9%A1%B5%E9%9D%A2%E5%B0%8F%E9%A3%9E%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/480861/%E9%A1%B5%E9%9D%A2%E5%B0%8F%E9%A3%9E%E6%9C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var KICKASSVERSION='2.0';
    var s = document.createElement('script');
    s.type='text/javascript';
    document.body.appendChild(s);
    s.src='//hi.kickassapp.com/kickass.js';
    void(0);
})();