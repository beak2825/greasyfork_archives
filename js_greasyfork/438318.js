// ==UserScript==
// @name         Odoo 14 remove Block UI for Enterprise
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Basically allows expired database to continue to be used. Simply alter the match property o your domain
// @author       You
// @match        http://*.ds9:8013/web*
// @icon         https://www.google.com/s2/favicons?domain=mul14.ds9
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438318/Odoo%2014%20remove%20Block%20UI%20for%20Enterprise.user.js
// @updateURL https://update.greasyfork.org/scripts/438318/Odoo%2014%20remove%20Block%20UI%20for%20Enterprise.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('p { font-size: large ! important; }');

(function() {
    'use strict';
    var css= "";
    css = '.blockUI{display:none!important;}';
    addGlobalStyle(css);
    setInterval(function(){
        var paras = document.getElementsByClassName('blockUI');

        while(paras[0]) {
            paras[0].parentNode.removeChild(paras[0]);
        }
    }, 1500);
    // Your code here...
})();