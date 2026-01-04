// ==UserScript==
// @name         CryptoWatch Hide Logo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide the logo on CryptoWatch site for bigger view
// @author       Nobakab
// @match        https://cryptowatch.net/?chart*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389746/CryptoWatch%20Hide%20Logo.user.js
// @updateURL https://update.greasyfork.org/scripts/389746/CryptoWatch%20Hide%20Logo.meta.js
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
    function addExternalScript(js) {
        var head, script;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        script = document.createElement('script');
        script.type = 'text/javascript';
        script.innerHTML = js;
        head.appendChild(script);
    }

    addGlobalStyle('div#logo {display: none}');
})();