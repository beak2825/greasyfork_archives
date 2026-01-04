// ==UserScript==
// @name         GoogleCleaner
// @namespace    org.free.world
// @version      0.1.2
// @description  try to save the world and remove google's privacy reminder
// @author       You
// @include      /^https://w*\.?google\..*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383965/GoogleCleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/383965/GoogleCleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function () {


        var foundNode = contains('div', 'Hinweise zum Datenschutz');
        if(foundNode.length > 7)
        {
            console.log(foundNode);
            foundNode[7].parentNode.remove(foundNode[7]);
        }

        var foundNodeEn = contains('div', 'privacy reminder');
        if(foundNodeEn.length > 7)
        {
            console.log(foundNodeEn);
            foundNodeEn[7].parentNode.remove(foundNodeEn[7]);
        }

    }
    function contains(selector, text) {
        var elements = document.querySelectorAll(selector);
        return Array.prototype.filter.call(elements, function(element){
            return RegExp(text).test(element.innerText);
        });
    }
})();