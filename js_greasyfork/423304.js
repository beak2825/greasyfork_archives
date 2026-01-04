// ==UserScript==
// @name         Leetcode solution screenshot helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Heyi
// @match        https://leetcode.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423304/Leetcode%20solution%20screenshot%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/423304/Leetcode%20solution%20screenshot%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function removeElementsByClass(className){
        var elements = document.getElementsByClassName(className);
        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
        }
    }

    var sDown = false;
    var hDown = false;
    document.addEventListener('keydown', function(event) {
        switch (event.keyCode) {
            case 83:
                sDown = true;
                break;
            case 72:
                hDown = true;
                break;
            case 89:
                if (sDown && hDown) {
                    removeElementsByClass("header__3STC");
                    removeElementsByClass("css-5wdlwo-TabViewHeader");
                    removeElementsByClass("nav__1n5p");
                }
        }
    });
    document.addEventListener('keyup', function(event) {
        switch (event.keyCode) {
            case 83:
                sDown = false;
                break;
            case 72:
                hDown = false;
                break;
        }
    });

})();