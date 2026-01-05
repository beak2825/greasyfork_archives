// ==UserScript==
// @name         IServ focusable links
// @namespace    https://www.mzimmer.net/
// @version      1.0.0
// @description  Restore dotted line focus indicator
// @author       Michel Zimmer <mzimmer@uni-bremen.de> (Michel Zimmer)
// @match        https://maxe-del.de/idesk/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27092/IServ%20focusable%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/27092/IServ%20focusable%20links.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var node = document.createElement('style');
    node.innerHTML = ':focus { outline: thin dotted !important; }';
    document.body.appendChild(node);
})();
