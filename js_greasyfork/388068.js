// ==UserScript==
// @name     MSDN FIX LANG SWITCH
// @version  3
// @namespace https://greasyfork.org/seiya-guan
// @author   SEIYA GUAN
// @match    http://msdn.microsoft.com/en-us/*
// @match    https://msdn.microsoft.com/zh-cn/*
// @match    http://docs.microsoft.com/en-us/*
// @match    https://docs.microsoft.com/zh-cn/*
// @grant    none
// @description 固定语言切换 Fix language switch
// @downloadURL https://update.greasyfork.org/scripts/388068/MSDN%20FIX%20LANG%20SWITCH.user.js
// @updateURL https://update.greasyfork.org/scripts/388068/MSDN%20FIX%20LANG%20SWITCH.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var elements = document.getElementsByClassName("header-holder");
    if(elements && elements.length > 0){
         var style = {
            position:"sticky",
            top:"0px",
            zIndex:9999,
            backgroundColor: getComputedStyle(document.body,null).getPropertyValue("background-color"),
            boxShadow: "2px 2px 2px 0px #000000ad"
        };
        Object.assign(elements[0].style, style);
    }
})();