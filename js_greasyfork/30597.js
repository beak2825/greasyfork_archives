// ==UserScript==
// @name         Google calendar event hider
// @namespace    https://zachsaucier.com/
// @version      0.1
// @description  Hide calendar events specified
// @author       Zach Saucier
// @match        https://calendar.google.com/calendar/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30597/Google%20calendar%20event%20hider.user.js
// @updateURL https://update.greasyfork.org/scripts/30597/Google%20calendar%20event%20hider.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    var eventList = [
        "Event name"
    ];

    // The actual functionality to remove the events
    function hideEventsInList() {
        var spans = document.querySelectorAll(".cpchip span, .chip-caption span");
        
        for(var i = 0; i < spans.length; i++) {
            var span = spans[i];
            for(var j = 0; j < eventList.length; j++) {
                 if(span.innerText.indexOf(eventList[j]) > -1) {
                     var parent = span.parentNode.parentNode.parentNode.parentNode;
                     parent.parentNode.removeChild(parent);
                 }
            }
        }
    }
    hideEventsInList();

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
    observeDOM(document.body.querySelector("#mainbody"), function() { 
        hideEventsInList();
    });
})();