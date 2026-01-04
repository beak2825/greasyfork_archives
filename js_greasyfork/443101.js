// ==UserScript==
// @name         Tollytranslate
// @namespace    https://withtolerance.horse/
// @version      0.1
// @description  Translate Tolly's hex to ascii automatically
// @author       Wolvan
// @match        https://withtolerance.horse/friendshipthroughtheages/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443101/Tollytranslate.user.js
// @updateURL https://update.greasyfork.org/scripts/443101/Tollytranslate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hex2ascii(hexData) {
        var hex = hexData.toString();
        var str = '';
        for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
    }

    var nodes = document.querySelectorAll(".ama-author-name, .ama-answer-content");
    Array.from(nodes).forEach(function (node) {
        try {
            node.textContent = hex2ascii((node.textContent || "").trim());
        } catch (err) {
            console.warn(err);
        }
    });
})();