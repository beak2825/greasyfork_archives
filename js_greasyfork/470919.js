// ==UserScript==
// @name         Google Height Changer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Changes the height to 50px in the category .form-cont on the node <div class="noticebar"><div class="nbpr"></div></div>
// @author       You
// @match        https://vanced-youtube.neocities.org/2013/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470919/Google%20Height%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/470919/Google%20Height%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Function to set the desired height of the target element
    function setElementHeight() {
        const targetNode = document.querySelector('div.noticebar > div.nbpr.form-cont');
        if (targetNode) {
            targetNode.style.height = '50px';
        }
    }
    
    // Call the function to set the height when the DOM is ready
    document.addEventListener('DOMContentLoaded', setElementHeight);
})();