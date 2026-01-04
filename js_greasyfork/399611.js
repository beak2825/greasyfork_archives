// ==UserScript==
// @name         Fenced code in old reddit
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Turns fenced code into code blocks in old reddit.
// @author       roblabla
// @match        https://*.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399611/Fenced%20code%20in%20old%20reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/399611/Fenced%20code%20in%20old%20reddit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    for (var md of document.getElementsByClassName("md")) {
        var i = 0;
        // Clone the array so it doesn't change when we modify the element;
        var children = Array(...md.children)
        while (i < children.length) {
            // Look for a block
            while (i < children.length) {
                if (children[i].textContent.trim().startsWith("```")) {
                    // found start of block;
                    break;
                }
                i += 1;
            }
            var startIdx = i;
            var lines = [];

            // Look for the end of the block.
            while (i < children.length) {
                lines.push(...children[i].textContent.split("\n"));
                if (children[i].textContent.trim().endsWith("```")) {
                    break;
                }
                i += 1;
            }
            var endIdx = i;

            // Remove the fences
            if (lines.length == 0) {
                continue;
            }
            lines[0] = lines[0].slice(3);
            lines[lines.length - 1] = lines[lines.length - 1].slice(0, -3);

            // Insert the fenced text as a code element in the comment
            var pre = document.createElement("pre");
            var code = document.createElement("code");
            pre.appendChild(code);
            code.innerText = lines.join("\n");
            md.insertBefore(pre, children[startIdx]);

            // Remove the old fenced nodes.
            for (let i = startIdx; i <= endIdx; i++) {
                if (children[i] != null) {
                    md.removeChild(children[i]);
                }
            }
        }
    }
})();