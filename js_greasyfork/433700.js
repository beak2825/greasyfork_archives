// ==UserScript==
// @name         MSDN切换中英文按钮
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在MSDN文档的左上角加一个快速切换中英文的按钮
// @author       You
// @match        https://docs.microsoft.com/*
// @icon         https://www.google.com/s2/favicons?domain=microsoft.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433700/MSDN%E5%88%87%E6%8D%A2%E4%B8%AD%E8%8B%B1%E6%96%87%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/433700/MSDN%E5%88%87%E6%8D%A2%E4%B8%AD%E8%8B%B1%E6%96%87%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var href = window.location.href;
    var div = document.createElement('div');
    var button = document.createElement('button');


    if(href.includes('/en-us/')){
        button.innerText = '中文';
        button.onclick = () => {
            var url = window.location.href;
            var zh = url.replace("/en-us/", "/zh-cn/");
            window.location.href = zh;
        };
    }
    else{
        button.onclick = () => {
            var url = window.location.href;
            var zh = url.replace(/.com\/[\w\-]+\//, ".com/en-us/");
            window.location.href = zh;
        };
        button.innerText = '英文';
    }


    div.style.position = 'fixed';
    div.style.top = '0';
    div.style.left = '0';

    div.appendChild(button);
    document.body.appendChild(div);
    // Your code here...
})();