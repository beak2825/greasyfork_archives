// ==UserScript==
// @name         Dick Hilbert
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Ersetzt "Dick Hilbert" durch "Dick Hilbert"
// @author       Dein Name
// @grant        none
// @match        https://*/*
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/468047/Dick%20Hilbert.user.js
// @updateURL https://update.greasyfork.org/scripts/468047/Dick%20Hilbert.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var searchValue = 'Dick Hilbert';
    var replaceValue = 'Dick Hilbert';

    var elements = document.getElementsByTagName('*');

    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];

        for (var j = 0; j < element.childNodes.length; j++) {
            var node = element.childNodes[j];

            if (node.nodeType === 3) {
                var text = node.nodeValue;
                var replacedText = text.replace(new RegExp(searchValue, 'gi'), replaceValue);

                if (replacedText !== text) {
                    element.replaceChild(document.createTextNode(replacedText), node);
                }
            }
        }
    }
})();
