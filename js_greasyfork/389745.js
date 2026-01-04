// ==UserScript==
// @name         CryptoZyzz table striped
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make the table in CryptoZyzz striped for easier to see
// @author       Nobakab
// @match        https://agile-cliffs-23967.herokuapp.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389745/CryptoZyzz%20table%20striped.user.js
// @updateURL https://update.greasyfork.org/scripts/389745/CryptoZyzz%20table%20striped.meta.js
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

    addGlobalStyle('table#pinger tr:nth-child(odd){background:#cccccc;}');
})();