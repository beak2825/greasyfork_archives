// ==UserScript==
// @name         Emphasis Generalissimo
// @namespace    https://twitter.com/fiboooo_
// @version      1.0
// @description  장군님의 이름을 강조합니다.
// @author        Fibon
// @match         https://*/*
// @match         http://*/*
// @exclude       https://www.google.com/*
// @exclude       https://twitter.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483499/Emphasis%20Generalissimo.user.js
// @updateURL https://update.greasyfork.org/scripts/483499/Emphasis%20Generalissimo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var generalissimos = ["김일성","김정일","김정은","金日成","金正日","金正恩","Kim Il Sung","Kim Jong Il","Kim Jong Un"];

    function boldifyTextNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            var content = node.nodeValue;

            generalissimos.forEach(function(generalissimo) {
                var regex = new RegExp(generalissimo, 'gi');
                content = content.replace(regex, function(match) {
                    return '<strong>' + match + '</strong>';
                });
            });

            var span = document.createElement('span');
            span.innerHTML = content;
            node.parentNode.replaceChild(span, node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            for (var i = 0; i < node.childNodes.length; i++) {
                boldifyTextNodes(node.childNodes[i]);
            }
        }
    }

    boldifyTextNodes(document.body);

})();
