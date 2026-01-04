// ==UserScript==
// @name         INFOC Message Additions
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds quality of life features to INFOC messaging
// @author       You
// @match        https://infoc.eet.bme.hu/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436214/INFOC%20Message%20Additions.user.js
// @updateURL https://update.greasyfork.org/scripts/436214/INFOC%20Message%20Additions.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let mutationObserver = new MutationObserver(observerListener);
    window.addEventListener("DOMContentLoaded", () => {
        mutationObserver.observe(document.body, {childList: true, subTree: true});
    });
})();


function observerListener(mutationList, observer) {
    for (let mutation of mutationList) {
        for (let added of mutation.addedNodes) {
            const textAreas = [...added.querySelectorAll("textarea")];
            textAreas.forEach(textArea => textArea.addEventListener("keydown", textAreaKeyListener));
        }
    }
}

function textAreaKeyListener(event) {
    if (event.key === "Tab") {
        event.preventDefault();

        let text = event.target.value;
        let selectionStart = event.target.selectionStart;
        let selectionEnd = event.target.selectionEnd;
        while (selectionStart > 0 && text[selectionStart - 1] !== "\n") {
            selectionStart--;
        }
        if (text[selectionEnd] != "\n") {
            while (selectionEnd < text.length - 1 && text[selectionEnd + 1] !== "\n") {
                selectionEnd++;
            }
        }

        let lines = text.slice(selectionStart, selectionEnd).split("\n");
        let minIndent = Math.max(...lines.map(line => line.search(/\S/)));

        let change = 0;
        if (event.shiftKey) {
            if (minIndent === 0) {
                return;
            }
            let removingIndent = Math.min(minIndent, 4);
            lines = lines.map(line => line.slice(removingIndent));
            change = -removingIndent;
        } else {
            lines = lines.map(line => "    " + line);
            change = 4;
        }
        let newSelected = lines.join("\n");
        let originalSelectionStart = event.target.selectionStart;
        let originalSelectionEnd = event.target.selectionEnd;
        event.target.value = text.slice(0, selectionStart) + newSelected + text.slice(selectionEnd);
        event.target.selectionStart = originalSelectionStart + change;
        event.target.selectionEnd = originalSelectionEnd + change * lines.length;
    }
}