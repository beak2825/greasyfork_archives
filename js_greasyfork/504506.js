// ==UserScript==
// @name         Decode Hex strings on Voz
// @namespace    Decode Hex strings on Voz
// @version      4.1
// @icon         https://www.google.com/s2/favicons?sz=64&domain=voz.vn
// @author       kylyte
// @description  Decode Hex, Base64
// @match        https://voz.vn/t/*
// @run-at       document-idle
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/504506/Decode%20Hex%20strings%20on%20Voz.user.js
// @updateURL https://update.greasyfork.org/scripts/504506/Decode%20Hex%20strings%20on%20Voz.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function decodeHex(hexString) {
        hexString = hexString.replace(/\s+/g, '');
        if (!/^[0-9A-Fa-f]{2,}$/.test(hexString)) return hexString;
        let hexStr = '';
        try {
            for (let i = 0; i < hexString.length; i += 2) {
                hexStr += String.fromCharCode(parseInt(hexString.substr(i, 2), 16));
            }
            if (/^[\x20-\x7E]*$/.test(hexStr) && hexStr.length > 3) {
                return hexStr;
            } else {
                return hexString;
            }
        } catch {
            return hexString;
        }
    }

    function decodeBase64(base64String) {
        if (!/^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/.test(base64String)) return base64String;
        try {
            let binaryString = atob(base64String);
            if (/^[\x20-\x7E]*$/.test(binaryString) && binaryString.length > 3) {
                return binaryString;
            } else {
                return base64String;
            }
        } catch {
            return base64String;
        }
    }

    function decodeContent(elements, regex, decodeFunc) {
        elements.forEach(element => {
            const excludedSelectors = [
                '.fr-box.bbWrapper.fr-ltr.fr-basic.fr-top',
                '.tooltip.tooltip--basic',
                '.bbImage',
                '.bbMediaJustifier',
                '.link'
            ];
            if (excludedSelectors.some(selector => element.closest(selector))) return;
            let walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
            let textNode;
            while (textNode = walker.nextNode()) {
                let content = textNode.nodeValue;
                let matches = content.match(regex);
                if (matches) {
                    matches.forEach(match => {
                        content = content.replace(new RegExp(escapeRegExp(match), 'g'), decodeFunc(match));
                    });
                    textNode.nodeValue = content;
                }
            }
        });
    }

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function main() {
        let elements = document.querySelectorAll('.bbWrapper');
        decodeContent(elements, /\b([0-9A-Fa-f]{2}\s*){4,}\b/g, decodeHex);
        decodeContent(elements, /(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=|[A-Za-z0-9+\/]{4})/g, decodeBase64);
    }

    main();
})();