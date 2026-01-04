// ==UserScript==
// @include     https://www.youtube.com/*
// @name 個人測試Method Name
// @description 個人測試 description
// @version 0.0.1.20210313182056
// @namespace https://greasyfork.org/users/746862
// @downloadURL https://update.greasyfork.org/scripts/423173/%E5%80%8B%E4%BA%BA%E6%B8%AC%E8%A9%A6Method%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/423173/%E5%80%8B%E4%BA%BA%E6%B8%AC%E8%A9%A6Method%20Name.meta.js
// ==/UserScript==


(function () {
var css = `
.ytp-pause-overlay { 
   display: block !important; 
   overflow:  hidden !important; 
   width:0px !important; 
   height: 0px !important; 
   pointer-events: none !important; 
   opacity: 0 !important;
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