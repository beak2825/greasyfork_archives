// ==UserScript==
// @name         Protect Eye
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Set Background Color to protect eys.
// @author       You
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27613/Protect%20Eye.user.js
// @updateURL https://update.greasyfork.org/scripts/27613/Protect%20Eye.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function() {
        var elements = document.querySelectorAll('*');
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.setProperty('background-color', '#C7EDCC', 'important');
            elements[i].style.setProperty('color', 'black', 'important');
        }    
    };
})();