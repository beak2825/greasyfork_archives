// ==UserScript==
// @name         Note useless paragraph Remover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove blank paragraphs
// @author       eggplants
// @homepage     https://github.com/eggplants
// @match        https://note.com/*/n/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/428476/Note%20useless%20paragraph%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/428476/Note%20useless%20paragraph%20Remover.meta.js
// ==/UserScript==

(function() {
    "use strict";

    Array.prototype.filter.call(
        document.getElementsByTagName('p'),
        function(n) {
            return n.childNodes.length===1 && n.childNodes[0].tagName==="BR";
        }
    ).map(n=>n.remove());
}());