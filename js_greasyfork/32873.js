// ==UserScript==
// @name         AminedFLV select option by name
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://animeflv.net/ver/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32873/AminedFLV%20select%20option%20by%20name.user.js
// @updateURL https://update.greasyfork.org/scripts/32873/AminedFLV%20select%20option%20by%20name.meta.js
// ==/UserScript==


// Config
var options = ["Club", "Izanagi", "Hyperion", "YourUpload",];
var option = options[1];

(function() {
    'use strict';

    // Script
    var button = document.querySelectorAll('[title="' + option + '"]')[0];
    if (!button){
        button = document.querySelectorAll('[data-original-title="' + option + '"]')[0];
    }
    button.click();
    
})();