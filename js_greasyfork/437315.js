// ==UserScript==
// @name        去除恶心的代码里的字体样式
// @namespace   leedaisen
// @match       https://pinia.vuejs.org/*
// @grant       none
// @version     1.2.1
// @author      leedaisen
// @description 2022/11/17 上午10:15:52
// @downloadURL https://update.greasyfork.org/scripts/437315/%E5%8E%BB%E9%99%A4%E6%81%B6%E5%BF%83%E7%9A%84%E4%BB%A3%E7%A0%81%E9%87%8C%E7%9A%84%E5%AD%97%E4%BD%93%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/437315/%E5%8E%BB%E9%99%A4%E6%81%B6%E5%BF%83%E7%9A%84%E4%BB%A3%E7%A0%81%E9%87%8C%E7%9A%84%E5%AD%97%E4%BD%93%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==
function addNewStyle(newStyle) {
            var styleElement = document.getElementById('styles_js');

            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.type = 'text/css';
                styleElement.id = 'styles_js';
                document.getElementsByTagName('head')[0].appendChild(styleElement);
            }
            
            styleElement.appendChild(document.createTextNode(newStyle));
        }

 addNewStyle('code {font-family:"monospace" !important;}');