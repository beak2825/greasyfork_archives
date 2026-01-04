// ==UserScript==
// @name         test
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  这是一个自用的脚本，后面慢慢拓展
// @author       mottzz87
// @license      AGPL-3.0-or-later
// @match        *://www.alipan.com/s/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490432/test.user.js
// @updateURL https://update.greasyfork.org/scripts/490432/test.meta.js
// ==/UserScript==

(function() {
    'use strict';// 向页面添加 "Hello, world!" 文本

    function addHelloWorld() {
        var helloWorldText = document.createTextNode("Hello-world!");
        var helloWorldElement = document.createElement("p");
        helloWorldElement.appendChild(helloWorldText);
        document.body.appendChild(helloWorldElement);
    }
    console.log(11111111111111,)

    // 在页面加载完毕后调用函数
    window.addEventListener('load', addHelloWorld, false);

})();