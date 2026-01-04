// ==UserScript==
// @name         background-color
// @namespace    http://tampermonkey.net/
// @version      0.9.4
// @description  Change the white elements to your wanted color!
// @author       developerdong
// @match        http*://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373187/background-color.user.js
// @updateURL https://update.greasyfork.org/scripts/373187/background-color.meta.js
// ==/UserScript==
(function () {
    "use strict";

    function toHex(N) {
        if (N == null) return "00";
        N = parseInt(N);
        if (N === 0 || isNaN(N)) return "00";
        N = Math.max(0, N);
        N = Math.min(N, 255);
        N = Math.round(N);
        // return "0123456789abcdef".charAt((N - N % 16) / 16) + "0123456789abcdef".charAt(N % 16); // Lower case
        return "0123456789ABCDEF".charAt((N - N % 16) / 16) + "0123456789ABCDEF".charAt(N % 16); // Upper case
    }

    /**
     * Transform RGB or RGBA color to HEX color
     * @return {string}
     */
    function RGBAtoHEX(str) {
        const leftParenthesisIndex = str.indexOf('(');
        const rightParenthesisIndex = str.indexOf(')');
        const colorFormat = str.substring(0, leftParenthesisIndex);
        const colorValueArray = str.substring(leftParenthesisIndex + 1, rightParenthesisIndex).split(',');
        if (colorFormat === "rgba" && parseFloat(colorValueArray[3]) !== 1) {
            return "TRANSPARENT";
        } else if (colorFormat === "rgba" || colorFormat === "rgb") {
            const r = colorValueArray[0].trim(), g = colorValueArray[1].trim(), b = colorValueArray[2].trim();
            const hex = [toHex(r), toHex(g), toHex(b)];
            return '#' + hex.join('');
        } else {
            return str;
        }
    }

    /**
     * Change the background color of all sub elements by level order
     */
    function changeBackgroundColor(node) {
        const WANTED_COLOR = "#DCE2F1";
        const WHITE = "#FFFFFF";
        const queue = [];
        while (node) {
            // nodeType === 1 means the node is an element
            if (node.nodeType === 1) {
                if (RGBAtoHEX(node.style.getPropertyValue("background-color")) === WANTED_COLOR) {
                    node.style.removeProperty("background-color");
                }
                const nodeStyle = window.getComputedStyle(node);
                const hexColor = RGBAtoHEX(nodeStyle.backgroundColor);
                // nodeStyle.cursor !== "pointer" means the node is non-clickable
                if ((node === document.body && hexColor === "TRANSPARENT") || (hexColor === WHITE && nodeStyle.cursor !== "pointer")) {
                    if (nodeStyle.transitionProperty.includes("background-color")) {
                        node.style.setProperty("transition-property", nodeStyle.transitionProperty.replace("background-color", "null"), "important");
                    }
                    node.style.setProperty("background-color", WANTED_COLOR, "important");
                } else {
                    node.style.removeProperty("transition-property");
                }
                Array.from(node.children).forEach(function (child) {
                    queue.push(child);
                });
            }
            node = queue.shift();
        }
    }

    // Change the background color of newly added elements
    const observer = new MutationObserver(function (records) {
        records.map(function (record) {
            if (record.type === "childList") {
                record.addedNodes.forEach(changeBackgroundColor);
            } else if (record.type === "attributes") {
                changeBackgroundColor(record.target);
            }
        });
    });
    const option = {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class"]
    };
    observer.observe(document.body.parentNode, option);

    // Change the background color of initially loaded elements
    changeBackgroundColor(document.body.parentNode);

})();
