// ==UserScript==
// @name         The trush about Elon Musk
// @version      0.1
// @description  The truth about Elon Musk
// @author       SiameseDream
// @include     *
// @grant        none
// @namespace thebiggesttwatontheplanet
// @downloadURL https://update.greasyfork.org/scripts/444162/The%20trush%20about%20Elon%20Musk.user.js
// @updateURL https://update.greasyfork.org/scripts/444162/The%20trush%20about%20Elon%20Musk.meta.js
// ==/UserScript==

(function() {
    'use strict';

var replaceArry = [
    [/Elon Musk/gi,'The biggest twat on the planet'],
    // etc.
];
var numTerms    = replaceArry.length;
var txtWalker   = document.createTreeWalker (
    document.body,
    NodeFilter.SHOW_TEXT,
    {   acceptNode: function (node) {
            //-- Skip whitespace-only nodes
            if (node.nodeValue.trim() )
                return NodeFilter.FILTER_ACCEPT;

            return NodeFilter.FILTER_SKIP;
        }
    },
    false
);
var txtNode     = null;

while (txtNode  = txtWalker.nextNode () ) {
    var oldTxt  = txtNode.nodeValue;

    for (var J  = 0;  J < numTerms;  J++) {
        oldTxt  = oldTxt.replace (replaceArry[J][0], replaceArry[J][1]);
    }
    txtNode.nodeValue = oldTxt;
}
})();