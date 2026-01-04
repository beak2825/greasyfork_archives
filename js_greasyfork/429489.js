// ==UserScript==
// @name         Staging Environments Header Color Change
// @description  Changes the menubar header for Bytecurve 360 staging environments to distinguish from production.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       Michael Peters <mike.peters@bytecurve.com>
// @match        https://staging.bytecurve360.com/*
// @match        https://stg-nec.bytecurve360.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429489/Staging%20Environments%20Header%20Color%20Change.user.js
// @updateURL https://update.greasyfork.org/scripts/429489/Staging%20Environments%20Header%20Color%20Change.meta.js
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

addGlobalStyle('.navbar-collapse.collapse { background-color: #BA386E; }');