// ==UserScript==
// @name         helper HEISE
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Accpept accept-banner
// @author       LYNX
// @match        https://www.heise.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407818/helper%20HEISE.user.js
// @updateURL https://update.greasyfork.org/scripts/407818/helper%20HEISE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function(){
        var banner = document.getElementById("uc-btn-accept-banner");
        if( banner ) banner.click();
    },1000);

})();