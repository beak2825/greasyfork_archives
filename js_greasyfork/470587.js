// ==UserScript==
// @name         多语言翻译插件
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  提供一个选择框，支持多语言!
// @license      MIT
// @match        *://*/*
// @author       https://github.com/ronn97
// @match        https://www.tampermonkey.net/index.php?locale=zh_CN
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470587/%E5%A4%9A%E8%AF%AD%E8%A8%80%E7%BF%BB%E8%AF%91%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/470587/%E5%A4%9A%E8%AF%AD%E8%A8%80%E7%BF%BB%E8%AF%91%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function (window, document, undefined) {
    'use strict';

    // Your code here...
    var bodyDom = document.getElementsByTagName('body')[0];
    var script= document.createElement('script');
    script.type= 'text/javascript';
    script.src= 'https://res.zvo.cn/translate/translate.js';
    document.body.appendChild(script);

    function loadJsCode(code){
        var script = document.createElement('script');
        script.type = 'text/javascript';
        //for Chrome Firefox Opera Safari
        script.appendChild(document.createTextNode(code));
        //for IE
        //script.text = code;
        document.body.appendChild(script);
    }

    window.onload = (event) => {
        console.log('page is fully loaded');
        loadJsCode("translate.setUseVersion2();translate.language.setLocal('chinese_simplified');translate.execute();");

        var translateDom = document.getElementById('translate');
        translateDom.style.cssText = "position:fixed; top: 10px; left: 10px; z-index: 100000000;"
    };
})(window, document);