// ==UserScript==
// @name         Reason AnyClip Die
// @namespace    ReasonAnyClipDie
// @version      0.1
// @description  Removes annoying AnyClip Video on Reason.com.
// @author       shellster
// @match        https://reason.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388054/Reason%20AnyClip%20Die.user.js
// @updateURL https://update.greasyfork.org/scripts/388054/Reason%20AnyClip%20Die.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var MutationObserver = window.MutationObserver;
    var myObserver = new MutationObserver (mutationHandler);
    var obsConfig = {
        childList: true, attributes: true,
        subtree: true, attributeFilter: ['class']
    };

    myObserver.observe (document, obsConfig);

    function mutationHandler (mutationRecords) {
        mutationRecords.forEach ( function (mutation) {

            if (mutation.type == "childList"
                && typeof mutation.addedNodes == "object"
                && mutation.addedNodes.length
               )
            {
                for (var J = 0, L = mutation.addedNodes.length; J < L; ++J) {
                    checkForAD(mutation.addedNodes[J]);
                }
            }
            else if (mutation.type == "attributes") {
                checkForAD(mutation.target);
            }
        } );
    }

    function checkForAD(node) {
        //-- Only process element nodes
        if (node.nodeType === 1) {
            if(node.className .toLowerCase().indexOf('anyclip-') != -1)
            {
                try
                {
                    node.parentNode.removeChild(node);
                }
                catch(ex){}
            }
        }
    }

    function walkTheDOM(node, func) {
        func(node);
        node = node.firstChild;
        while (node) {
            walkTheDOM(node, func);
            node = node.nextSibling;
        }
    }

    walkTheDOM(document.body, checkForAD);
})();