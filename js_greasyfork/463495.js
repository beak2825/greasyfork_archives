// ==UserScript==
// @name        Replace CRT with Fun Police
// @namespace   Violentmonkey Scripts
// @match       https://forum.psnprofiles.com/*
// @grant       none
// @version     1.0
// @author      -
// @license     MIT
// @description 4/7/2023, 3:22:11 PM
// @downloadURL https://update.greasyfork.org/scripts/463495/Replace%20CRT%20with%20Fun%20Police.user.js
// @updateURL https://update.greasyfork.org/scripts/463495/Replace%20CRT%20with%20Fun%20Police.meta.js
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
                var replacedText = text.replace(/Cheater Removal Team/gi, 'Fun Police');
                if (replacedText !== text) {
                    element.replaceChild(document.createTextNode(replacedText), node);
                }
            }
        }
    }
})();