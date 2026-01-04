// ==UserScript==
// @name         tagblattCleaner
// @namespace    org.free.world
// @version      0.0.3
// @description  try to take over the world!
// @author       You
// @match        https://www.tagblatt.ch/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/383970/tagblattCleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/383970/tagblattCleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function () {

        var targetNode = document.getElementsByTagName("body")[0];
        var targetNode2 = document.getElementsByTagName("html")[0];
        var config = { attributes: true, childList: true, subtree: true };

        var callback = function(mutationsList, observer) {
            for(var mutation of mutationsList) {
                if (mutation.type == 'childList') {
                    console.log('A child node has been added or removed.');
                    //removeCrap(targetNode, targetNode2);
                }
                else if (mutation.type == 'attributes') {
                    console.log('The ' + mutation.attributeName + ' attribute was modified.');
                    removeCrap(targetNode, targetNode2);
                }
            }
        };

        var observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    };

    function removeCrap(targetNode, targetNode2 )
    {
        targetNode.style.height = "";
        targetNode.style.overflowY = "scroll";
        targetNode2.style = "";

        // maybe they change their prefix "sp_" then you have to change it below

        var iframes = document.querySelectorAll('iframe');
        for (var i = 0; i < iframes.length; i++) {
            iframes[i].parentNode.removeChild(iframes[i]);
        }

    }

})();