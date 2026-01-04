// ==UserScript==
// @name         Title notification remover
// @namespace    https://zachsaucier.com/
// @version      0.1
// @description  Removes the notification count from the title of all webpages
// @author       Zach Saucier
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30416/Title%20notification%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/30416/Title%20notification%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // The actual functionality to remove the notification in the page title
    var notificationCountRegex = new RegExp('^\\(\\d+\\)+');
    function removeTitleNotification() {
        if(notificationCountRegex.test(document.head.querySelector("title").innerText))
            document.head.querySelector("title").innerText = document.head.querySelector("title").innerText.split(')')[1];
    }
    removeTitleNotification();

    var observeDOM = (function() {
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
            eventListenerSupported = window.addEventListener;

        return function(obj, callback) {
            if(MutationObserver) {
                // Define a new observer
                var obs = new MutationObserver(function(mutations, observer){
                    if(mutations[0].addedNodes.length || mutations[0].removedNodes.length )
                        callback();
                });
                // Have the observer observe foo for changes in children
                obs.observe(obj, {childList: true, subtree: true});
            }
            else if(eventListenerSupported ) {
                obj.addEventListener('DOMNodeInserted', callback, false);
                obj.addEventListener('DOMNodeRemoved', callback, false);
            }
        };
    })();

    // Observe a specific DOM element:
    observeDOM(document.head.querySelector("title"), function() { 
        removeTitleNotification();
    });
})();