// ==UserScript==
// @name         Gizmodo - Remove Recent Video
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Remove the Recent Video block from the page.
// @author       ericjuden
// @match        https://*.gizmodo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36848/Gizmodo%20-%20Remove%20Recent%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/36848/Gizmodo%20-%20Remove%20Recent%20Video.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var elements = document.getElementsByClassName("instream-native-video");
    var i = elements.length;

    while(i--){
        elements[i].parentNode.removeChild(elements[i]);
    }
})();