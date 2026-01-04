// ==UserScript==
// @name         Show Code To Visual Studio
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show Github Project to Visual Studio Code!
// @author       Lan
// @match        *://*.github.com/*
// @icon         https://github.com/fluidicon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443396/Show%20Code%20To%20Visual%20Studio.user.js
// @updateURL https://update.greasyfork.org/scripts/443396/Show%20Code%20To%20Visual%20Studio.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementsByClassName('d-none d-md-flex ml-2')[0].innerHTML += '<a class="btn ml-2 d-none btn-primary d-md-block" target="blank" href="https://vscode.dev/github'+window.location.pathname+'"> Show Code </a>'

})();