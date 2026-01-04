// ==UserScript==
// @name         imagetwist.com Bypass
// @namespace    https://imagetwist.com/
// @version      0.1
// @description  imagetwist.com Bypass!
// @author       You
// @match       https://imagetwist.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407389/imagetwistcom%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/407389/imagetwistcom%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var theDiv = document.getElementById("rang2");
    theDiv.getElementsByTagName("a").click();


})();