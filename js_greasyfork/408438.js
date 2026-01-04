// ==UserScript==
// @name         XDA width fix
// @namespace    https://space.bilibili.com/6727237
// @version      0.2
// @author       尺子上的彩虹
// @match        https://*.xda-developers.com/*
// @grant        none
// @description:zh-cn XDA header width fix
// @description XDA header width fix
// @downloadURL https://update.greasyfork.org/scripts/408438/XDA%20width%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/408438/XDA%20width%20fix.meta.js
// ==/UserScript==


setTimeout(
    function (){
        document.getElementsByTagName('header')[0].style.width='zpx';
    },
    10000);