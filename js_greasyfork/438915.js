// ==UserScript==
// @name         知乎、CSDN标签名消息提醒去除
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  去除CSDN、知乎标签页名的消息前缀，以免遮挡重要信息
// @author       lin折
// @license      MIT
// @match        https://www.zhihu.com/question/*
// @match        https://www.csdn.net/tags/*
// @match        https://blog.csdn.net/*
// @match        https://www.zhihu.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAfBJREFUWEft1j/ITmEYBvDfNzJYlMVuEMmgb5DFv2IwKBYZlEEx+BeDwZ9BIaRIBnzpU59SBoP8TQaDQSkGZaAMymAwKAO66zl1vtM55z3n7ZzzLp7p7ZznXNf1XPd93c87ZTLrKC5gdmoC/LtxB9+xZWgBm/E4HfoEzg4pYBWeYAleYRN+h4C/HZWh7jBB+gwrE9d2PIjfQwl4io2J/Ab2ZYceQsAsdiXCz8n6T0MJuIRDuRIfxJV8ycsc6Koxj+FcjuwRthb7rS8BWdYzvj/J+hdDCIh4RdzyK0pxpCxtXTuwAi+xOEf2AevwY1wBcZo41W2cxpeKuRGkMWCWF97vwUzVrGniwFJ8TQARn1O4WwL4HOsLz+9jR92gayIgvr+Iwzmg6ylOH9OzfNazbT+T9e+6EBAYxZH9HpeT5WUNdhJn6sirRnHVHIha3hoFmN6/wXSTvU1LkGFFRxebrIxnGx72IWBDutXqsG9ibxPytiXIMO9hZwXBN6zJpWakjrYlCMBlyLq/SHAA1woPi807r8fGERD4ccnEZZNfcefHX67i6kXAAoTdi3Jsa/F6KAHBsx9XE+F5HK8oeC8OZFxvsRCr8WsSAiLvIWCupt17dWBkzEpGeCcpaEKc7WntQBvwcfaOdGAc0Dbf/Bcwz4F/djpn980krggAAAAASUVORK5CYII=
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438915/%E7%9F%A5%E4%B9%8E%E3%80%81CSDN%E6%A0%87%E7%AD%BE%E5%90%8D%E6%B6%88%E6%81%AF%E6%8F%90%E9%86%92%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/438915/%E7%9F%A5%E4%B9%8E%E3%80%81CSDN%E6%A0%87%E7%AD%BE%E5%90%8D%E6%B6%88%E6%81%AF%E6%8F%90%E9%86%92%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==
 
 
let tmp = document.querySelector("head > title");
let str=tmp.text.replace(/^\(.*?\)/g, "");
var isrun = setInterval(function(){ timer(); }, 2000);
function timer(){
    'use strict';
    if (document.querySelector("head > title").text == str) {
        clearInterval(isrun);
    } else {
        tmp.textContent=str;
    }
};