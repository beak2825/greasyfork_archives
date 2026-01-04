// ==UserScript==
// @name         No mobile Wikipedia
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Sends you from the mobile Wikipedia page to the Desktop one
// @author       You
// @include      http*://*.m.wikipedia.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371947/No%20mobile%20Wikipedia.user.js
// @updateURL https://update.greasyfork.org/scripts/371947/No%20mobile%20Wikipedia.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.location = document.URL.replace(".m","")
})();