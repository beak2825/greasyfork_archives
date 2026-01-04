// ==UserScript==
// @name         BigRadioButton by Jean J. Pirela
// @namespace    http://facebook.com/jeanpirelag
// @version      1
// @description  BigRadioButton Appen
// @author       @jeanpirelag
// @match        https://view.appen.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=appen.io
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/446687/BigRadioButton%20by%20Jean%20J%20Pirela.user.js
// @updateURL https://update.greasyfork.org/scripts/446687/BigRadioButton%20by%20Jean%20J%20Pirela.meta.js
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

addGlobalStyle('.cml_field.ratings td input {height:35px; width:35px');
