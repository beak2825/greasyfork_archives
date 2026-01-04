// ==UserScript==
// @include http://game.granbluefantasy.jp/*
// @name GBF畫面置中
// @description en GBF畫面置中
// @version 0.0.1.20210317111730
// @namespace https://greasyfork.org/users/746862
// @downloadURL https://update.greasyfork.org/scripts/423302/GBF%E7%95%AB%E9%9D%A2%E7%BD%AE%E4%B8%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/423302/GBF%E7%95%AB%E9%9D%A2%E7%BD%AE%E4%B8%AD.meta.js
// ==/UserScript==
 
 
(function () {
var css = `
body { 
   overflow: hidden!important;
}
`;
 
var style=document.createElement('style');
style.type='text/css';
if (style.styleSheet){
    style.styleSheet.cssText = css
} else {
    style.appendChild(document.createTextNode(css));
}
document.getElementsByTagName('head')[0].appendChild(style);
})();