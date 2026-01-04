// ==UserScript==
// @name         RA sort by "Won By" descending
// @namespace    https://greasyfork.org/de/users/580795
// @version      0.3
// @description  Adds a parameter to the current URL
// @author       b1100101
// @match        *://retroachievements.org/game/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/459650/RA%20sort%20by%20%22Won%20By%22%20descending.user.js
// @updateURL https://update.greasyfork.org/scripts/459650/RA%20sort%20by%20%22Won%20By%22%20descending.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var parameterName = "s";
    var valueName     = "12";

    // Check if the parameter already exists in the URL
    if (!new RegExp("[?&]" + parameterName + "*").test(window.location.search)) {
        if(window.location.search == ""){
            window.location.search += "?" + parameterName + "=" + valueName;
        }else{
            window.location.search += "&" + parameterName + "=" + valueName;
        }
    }
})();