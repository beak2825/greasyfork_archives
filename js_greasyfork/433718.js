// ==UserScript==
// @name         LoL Pickems Style Script
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  LoL Pickems Better Style Script
// @author       Arwinus
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @include     *pickem.lolesports.com/pickem/worlds*
// @downloadURL https://update.greasyfork.org/scripts/433718/LoL%20Pickems%20Style%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/433718/LoL%20Pickems%20Style%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle('._3bd38 > div:not(._76f07) { width:25%; float:left; }');
    addGlobalStyle('.ed0da {span 1 !important;}');
    addGlobalStyle('._608dd {margin-left:16px !important;margin-right:16px !important;}');
    addGlobalStyle('._34e74 {span 15 !important;}');
    addGlobalStyle('.d7f9e {margin-left:16px !important;}');
    addGlobalStyle('.d7f9e ._54dbc {width:200px !important;}');
    addGlobalStyle('.d7f9e .ee016 .fe4a8 {margin:0 16px;}');
    addGlobalStyle('.d2e66 {display:none !important;}');

})();