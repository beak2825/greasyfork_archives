// ==UserScript==
// @name         70-Seas.ndaniel Patch
// @namespace    https://revelromp.com
// @version      0.1
// @description  Automatically replace links to 70-seas.com with 70-seas.ndaniel.com as a workaround for the new domain name.
// @author       Retl
// @match        *://70-seas.ndaniel.com/*
// @match        *://www.70-seas.ndaniel.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393448/70-Seasndaniel%20Patch.user.js
// @updateURL https://update.greasyfork.org/scripts/393448/70-Seasndaniel%20Patch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var update70SeasLinks = function () {document.querySelector("head").innerHTML = document.querySelector("head").innerHTML.replace(/70\-seas\.com/g, "70-seas.ndaniel.com");
    document.querySelector("body").innerHTML = document.querySelector("body").innerHTML.replace(/70\-seas\.com/g, "70-seas.ndaniel.com");}
    update70SeasLinks();
})();