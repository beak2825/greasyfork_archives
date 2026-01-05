// ==UserScript==
// @name        YoutubeControlsFix
// @namespace   moooka
// @author      moooka
// @description Przywraca znikające przyciski playera youtube
// @include     *.wykop.pl/*
// @version     1.0
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/17074/YoutubeControlsFix.user.js
// @updateURL https://update.greasyfork.org/scripts/17074/YoutubeControlsFix.meta.js
// ==/UserScript==

var MutationObserve = window.MutationObserver,
    
    mutationHandler = function (mutationRecords) {

        mutationRecords.forEach ( function (mutation) {

            if( mutation.type == "childList" 
                && typeof mutation.addedNodes  == "object" 
                &&  mutation.addedNodes.length ) {

                for (var i = 0, l = mutation.addedNodes.length; i < l; ++i) {
                    if (mutation.addedNodes[i].nodeType === 1 
                        && new RegExp (Array.from (mutation.addedNodes[i].classList).join ('|')).test (classNameList)) {

                        var playerNode = mutation.addedNodes[i].querySelector ('.youtube-player');

                        if (playerNode !== null) {
                          FixNode (playerNode);
                        }
                    }
                }
            }

        });
    },
    
    observer        = new MutationObserver (mutationHandler),

    classNameList   = "block | media-contentvideo | screen",

    obsConfig       = {
        childList: true, attributes: true,
        subtree: true,   attributeFilter: ['class']
    },

    FixNode         = function (node) { 
        var https = node.getAttribute ('src').replace ('http:','https:');

        node.setAttribute('src',https);
    };

    
observer.observe (document, obsConfig);    

var playerNode = document.querySelector ('.youtube-player');

if (playerNode !== null) {
   FixNode (playerNode);
}
