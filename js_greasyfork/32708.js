// ==UserScript==
// @name         Just JD
// @namespace    http://silverchard.me/
// @version      0.3
// @description  只显示京东自营的物品（注意是自营不是配送）
// @author       Silver Chard
// @match        *://search.jd.com/*
// @match        *://list.jd.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32708/Just%20JD.user.js
// @updateURL https://update.greasyfork.org/scripts/32708/Just%20JD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    for( var i =document.getElementsByClassName("gl-warp clearfix")[0].children.length-1; i>=0 ; i--){
        
        if (document.getElementsByClassName("gl-warp clearfix")[0].children[i].firstElementChild.getAttribute("data-sku") && document.getElementsByClassName("gl-warp clearfix")[0].children[i].firstElementChild.getAttribute("data-sku").length>8){
            document.getElementsByClassName("gl-warp clearfix")[0].removeChild(document.getElementsByClassName("gl-warp clearfix")[0].children[i]);
        }}
})();