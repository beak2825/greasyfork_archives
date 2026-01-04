// ==UserScript==
// @name         freemining.co
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  make money online
// @description  freemining.co links : https://freemining.co/948268
// @author       AhrimanSefid
// @match        https://freemining.co/948268
// @match        https://freemining.co/*
// @include         *://freemining.co/*
// @icon         https://www.google.com/s2/favicons?domain=freemining.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432721/freeminingco.user.js
// @updateURL https://update.greasyfork.org/scripts/432721/freeminingco.meta.js
// ==/UserScript==

(function() {
    'use strict';
setInterval(function () { document.getElementById("go_enter").click();}, 60);
setTimeout(function () { window.location.replace(window.location.href); }, 70000);
})();