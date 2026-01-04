// ==UserScript==
// @name         Linkedin - noprint [~R]
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Print job offers
// @author       Rutrus
// @match        https://www.linkedin.com/jobs/view/*
// @icon         https://www.google.com/s2/favicons?domain=linkedin.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433688/Linkedin%20-%20noprint%20%5B~R%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/433688/Linkedin%20-%20noprint%20%5B~R%5D.meta.js
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
    document.getElementById('ember9').classList.add("noprint");
    document.getElementById('ember58').classList.add("noprint");
    document.getElementById('global-nav').classList.add("noprint");
    // document.getElementById('global-nav').remove();
    Array.from(document.getElementsByTagName('aside')).forEach((element) => {element.remove()});
    });

})();