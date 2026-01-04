// ==UserScript==
// @name         Wikipedia to Wikiwand
// @namespace    https://gist.github.com/Borys9975
// @version      1.1
// @description  Redirect automatically from Wikipedia to Wikiwand
// @author       Borys9975
// @match        https://wikipedia.com/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480144/Wikipedia%20to%20Wikiwand.user.js
// @updateURL https://update.greasyfork.org/scripts/480144/Wikipedia%20to%20Wikiwand.meta.js
// ==/UserScript==

(function() {
    if((location.host + location.pathname).indexOf("pl.wikipedia.org") == 0) {
        location.replace("https:////wikiwand.com/pl/" + location.pathname);
    }
})();