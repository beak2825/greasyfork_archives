// ==UserScript==
// @name         Fix date formats
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Replace month-day-year dates with day-month-year dates.
// @match        *://*/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453190/Fix%20date%20formats.user.js
// @updateURL https://update.greasyfork.org/scripts/453190/Fix%20date%20formats.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Get all text nodes in a given container
    //Source: http://stackoverflow.com/a/4399718/560114
    function getTextNodesIn(node, includeWhitespaceNodes) {
        var textNodes = [], nonWhitespaceMatcher = /\S/;

        function getTextNodes(node) {
            if (node.nodeType == 3) {
                if (includeWhitespaceNodes || nonWhitespaceMatcher.test(node.nodeValue)) {
                    textNodes.push(node);
                }
            } else {
                for (var i = 0, len = node.childNodes.length; i < len; ++i) {
                    getTextNodes(node.childNodes[i]);
                }
            }
        }

        getTextNodes(node);
        return textNodes;
    }

    var j = jQuery.noConflict();
    var textNodes = getTextNodesIn( j("body")[0], false );
    var i = textNodes.length;
    var node;
    while (i--) {
        node = textNodes[i];
        node.textContent = node.textContent.replace(/([A-Z][a-z]{2,8}|[A-Z][a-z]{2}\.) (\d{1,2}), (\d{4})/g, '$2 $1 $3');
    }
})();