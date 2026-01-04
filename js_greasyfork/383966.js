// ==UserScript==
// @name         YouTubeCleaner
// @namespace    org.free.world
// @version      0.1.1
// @description  try to save the world and remove google's privacy reminder
// @author       You
// @include      /^https://w*\.?youtube\..*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383966/YouTubeCleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/383966/YouTubeCleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function () {

        console.log("YouTubeCleaner");

        var targetNode = document.getElementsByTagName("body")[0];
        var targetNode2 = document.getElementsByTagName("html")[0];
        var config = { attributes: true, childList: true, subtree: true };

        var callback = function(mutationsList, observer) {
            for(var mutation of mutationsList) {
                if (mutation.type == 'childList') {
                    removeCrap();
                }
            }
        };

        var observer = new MutationObserver(callback);
        observer.observe(targetNode, config);

    }
    function removeCrap()
    {
        var foundNode = contains('yt-formatted-string', 'REMIND ME LATER');
        if(foundNode.length > 0)
        {
            foundNode[0].parentNode.parentNode.parentNode.click();
        }

        var foundNodeDE = contains('yt-formatted-string', 'SPÄTER');
        if(foundNodeDE.length > 0)
        {
            foundNodeDE[0].parentNode.parentNode.parentNode.click();
        }
    }
    function contains(selector, text) {
        var elements = document.querySelectorAll(selector);
        return Array.prototype.filter.call(elements, function(element){
            return RegExp(text).test(element.innerText);
        });
    }
})();