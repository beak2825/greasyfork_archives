// ==UserScript==
// @name         Medium - noprint [~R]
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes floating navbar when print
// @author       Rutrus
// @match        https://medium.com/@*
// @match        https://*.medium.com/*
// @match        https://towardsdatascience.com/*
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?domain=medium.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433689/Medium%20-%20noprint%20%5B~R%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/433689/Medium%20-%20noprint%20%5B~R%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

var styles = `
@media print
{
.noprint {display:none;}
}
`
var styleSheet = document.createElement("style");
styleSheet.type = "text/css"
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
sleep(1000).then(()=> {
    document.getElementsByClassName('t')[0].classList.add("noprint");
    // document.getElementById('global-nav').remove();
    });
})();