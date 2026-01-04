// ==UserScript==
// @name         Ch*ss Censor
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Ensure No One Has To See That Disgusting Word
// @author       Scott "Scotty770" Ryan
// @include      /^https://lichess\.org\//
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407781/Ch%2Ass%20Censor.user.js
// @updateURL https://update.greasyfork.org/scripts/407781/Ch%2Ass%20Censor.meta.js
// ==/UserScript==

(function() {
    'use strict';

   var elements = document.getElementsByTagName('*');

    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];

        for (var j = 0; j < element.childNodes.length; j++) {
            var node = element.childNodes[j];

            if (node.nodeType === 3) {
                var text = node.nodeValue;
                var replacedText = text.replace(/hess/gi, 'h*ss');

                if (replacedText !== text) {
                    element.replaceChild(document.createTextNode(replacedText), node);
            }
        }
    }
}
})();