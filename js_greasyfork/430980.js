// ==UserScript==
// @homepage    https://greasyfork.org/zh-CN/scripts/430980-%E8%87%AA%E7%94%A8-500px-com
// @icon        https://500px.com/favicon.ico
// @name        【自用】 - 500px.com
// @namespace   Violentmonkey Scripts
// @match       https://500px.com/*
// @grant       none
// @version     2021.08.15
// @author      -
// @description 8/15/2021, 1:34:46 PM
// @downloadURL https://update.greasyfork.org/scripts/430980/%E3%80%90%E8%87%AA%E7%94%A8%E3%80%91%20-%20500pxcom.user.js
// @updateURL https://update.greasyfork.org/scripts/430980/%E3%80%90%E8%87%AA%E7%94%A8%E3%80%91%20-%20500pxcom.meta.js
// ==/UserScript==


function addNewStyle(newStyle) {//增加新样式表
    var styleElement = document.getElementById('styles_js');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.id = 'styles_js';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
    }
    styleElement.appendChild(document.createTextNode(newStyle));
}

  addNewStyle('\
div[class*="Elements__PhotoUIWrapper"]{\
display:none;\
}\
');