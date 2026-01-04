// ==UserScript==
// @name         UnblockNTCE
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove IE restriction on NTCE website.
// @author       Shuhao
// @license      MIT
// @match        http*://*.neea.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/450806/UnblockNTCE.user.js
// @updateURL https://update.greasyfork.org/scripts/450806/UnblockNTCE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var code = "window.ActiveXObject = true;";
    var script = document.createElement('script');
    script.appendChild(document.createTextNode(code));
    (document.head||document.documentElement).appendChild(script);
    script.parentNode.removeChild(script);

    const table = document.getElementsByTagName("table");
    window.onload = function(){
        table[0].style.width = "1000px";
        table[0].style.margin = "0 auto";
        table[0].style.textAlign = "left";
        table[0].style.left = "50%";
    };
})();