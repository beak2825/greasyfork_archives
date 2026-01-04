// ==UserScript==
// @name         Production warning
// @namespace    https://greasyfork.org/production-warning
// @version      0.2
// @description  Warns you when you are in production
// @author       Jason Barnabe
// @grant        none
// @include      https://yourproductionserver.example/*
// @downloadURL https://update.greasyfork.org/scripts/38925/Production%20warning.user.js
// @updateURL https://update.greasyfork.org/scripts/38925/Production%20warning.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var div = document.createElement("div");
    div.innerHTML = "PRODUCTION";
    div.style = "position: fixed; right: 0; bottom: 0; font-size: 80px; pointer-events: none; color: red; opacity: 0.3; padding: 1em; z-index: 1000000";
    document.body.appendChild(div);
})();