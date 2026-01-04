// ==UserScript==
// @name         Jenkins Pipeline Failed Steps Only
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show only failed steps in Jenkins.
// @author       You
// @match        */job/*/flowGraphTable/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398131/Jenkins%20Pipeline%20Failed%20Steps%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/398131/Jenkins%20Pipeline%20Failed%20Steps%20Only.meta.js
// ==/UserScript==


(function() {
    'use strict';
    if (!document.getElementById('jenkins')) return;
    document.querySelectorAll('img[alt="Success"]').forEach( node => node.parentNode.parentNode.style.display = "none")
    var button = document.createElement("input");
    button.type = "button";
    button.value = "Show All Steps";
    button.onclick = () => document.querySelectorAll('img[alt="Success"]').forEach( node => node.parentNode.parentNode.style.display = "");
    document.getElementById('nodeGraph').appendChild(button);
})();