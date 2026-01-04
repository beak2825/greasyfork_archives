// ==UserScript==
// @name         v2ex 增强
// @namespace    http://tampermonkey.net/
// @version      0.2.5
// @description  v2ex 增强1
// @author       h2ero
// @match        https://www.v2ex.com/*
// @icon         https://www.google.com/s2/favicons?domain=v2ex.com
// @grant        none
// @require     https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/432385/v2ex%20%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/432385/v2ex%20%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==
var m = function (f) {
    return f.toString().split('\n').slice(1, - 1).join('\n');
}
loadCss = function () {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = m(function () { /*
         .avatar{display:none;}
#Wrapper,#Logo{background:none !important;}
h1{    font-size: 14px !important;}
          */
    });
    var head = document.querySelector('head')
    head.appendChild(style);
};
loadCss();
document.title = "error 10010101";

(function() {
    'use strict';
$(function(){
})
    // Your code here...
})();