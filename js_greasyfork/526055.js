// ==UserScript==
// @name         百度搜索排除CSDN
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在百度搜索框后添加“-site:csdn.net”
// @match        *://www.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526055/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E6%8E%92%E9%99%A4CSDN.user.js
// @updateURL https://update.greasyfork.org/scripts/526055/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E6%8E%92%E9%99%A4CSDN.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addExcludeButton() {
        let searchBox = document.querySelector('#kw');
        if (!searchBox) return;

        let button = document.createElement('button');
        button.innerText = '排除CSDN';
        button.style.marginLeft = '10px';
        button.style.padding = '5px 10px';
        button.style.cursor = 'pointer';
        button.onclick = function() {
            if (!searchBox.value.includes('-site:csdn.net')) {
                searchBox.value += ' -site:csdn.net';
            }
        };

        let form = searchBox.closest('form');
        if (form) {
            form.appendChild(button);
        } else {
            searchBox.parentNode.appendChild(button);
        }
    }

    window.onload = addExcludeButton;
})();
