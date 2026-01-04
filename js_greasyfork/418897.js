// ==UserScript==
// @name         global ad remover using referrerpolicy
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  removes ads routed over the current domain (identified using referrerpolicy=unsafe-url)
// @author       cabtv
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418897/global%20ad%20remover%20using%20referrerpolicy.user.js
// @updateURL https://update.greasyfork.org/scripts/418897/global%20ad%20remover%20using%20referrerpolicy.meta.js
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

    addGlobalStyle('[referrerpolicy="unsafe-url"] { display: none !important; }');
})();