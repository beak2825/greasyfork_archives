// ==UserScript==
// @name         snahp.it - Add Decode Button
// @namespace    forum.snahp.it
// @version      0.5.4
// @description  Adds a 'decode' button to code elements. Can be clicked repeatedly.
// @author       Genome
// @license      MIT
// @homepage     https://fora.snahp.eu/viewtopic.php?p=1161800
// @match        https://fora.snahp.eu/viewtopic.php*
// @match        https://forum.snahp.it/viewtopic.php*
// @icon         https://fora.snahp.eu/favicon.ico
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429871/snahpit%20-%20Add%20Decode%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/429871/snahpit%20-%20Add%20Decode%20Button.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

(function() {
    'use strict';

    const isChromium = navigator.userAgent.toLowerCase().includes('chrome');
    const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');

    let base64Rx = /([a-z0-9+\/]{20,}[=]*)/i;

    let undoBuffer = []; // 0.5.0: Add undo buffer to let you roll back your decodes in reverse order.

    // Encodes or decodes any (likely) base64 strings line by line surgically.
    function base64CodeByLine(targetText, decode = true) {
        let textLines = targetText.split("\n");
        let completeLines = [];
        for(let textLine of textLines) {
            let hasText = textLine.trim().length > 0;
            if(!hasText) {
                completeLines.push(textLine);
                continue;
            }
            if(decode && base64Rx.test(textLine)) {
                let findResult = base64Rx.exec(textLine);
                let b64Text = findResult[1];
                let targetIx = findResult.index;
                let completeLine = textLine.substring(0, targetIx) + atob(b64Text) + textLine.substring(targetIx + b64Text.length);
                completeLines.push(completeLine);
            } else {
                completeLines.push(textLine);
            }
        }
        return completeLines.join("\n");
    }

    const oldLinkRx = /links\.snahp\.it/gi;

    // Encodes or Decodes the innerText of a passed in DOM element.
    function base64CodeContents(el, decode = true) {
        debugger;
        if(el && el.innerText.trim() !== "") {
            undoBuffer.push({ "element": el, "previousText": el.innerText });
            el.innerText = base64CodeByLine(el.innerText, decode);
            // 0.5.1: Re-fix links going to links.snahp.it to the new domain.
            if(oldLinkRx.test(el.innerText)) {
                el.innerText = el.innerText.replaceAll(oldLinkRx, "lnk.snahp.eu");
            }
        }
    }

    function undoLast() {
        if(undoBuffer.length > 0) {
            let lastOp = undoBuffer.pop();
            lastOp.element.innerText = lastOp.previousText;
        }
    }

    // Copies the innerText of a given html element.
    function copyContents(el) {
        navigator.clipboard.writeText(el.innerText.trim());
    }

    // Finds hideboxes with no internal <codebox> element (aka they are bare text).
    function findBareUnhideBoxes() {
        let finalElems = []
        for (const el of document.querySelectorAll("dl.hidebox.unhide")) {
            if(el.querySelector('div.codebox') == null) {
                finalElems.push(el);
            }
        }
        return finalElems;
    }

    // Create an <a> element and quickly assign some properties (text, any classes, hardcoded style, and a 'click' action)
    function createButton(buttonText, classList, hardStyle, onClickCallback) {
        let newButton = document.createElement('a');
        newButton.innerText = buttonText;
        if(classList) classList.forEach(cl => newButton.classList.add(cl))
        if(hardStyle) newButton.style = hardStyle;
        if(onClickCallback) newButton.addEventListener("click", onClickCallback);
        return newButton;
    }

    const bareBoxButtonStyle = "margin: 0 8px 0 8px; font-weight: bold;";
    const bareBoxWrapperStyle = "float: right; text-align: right; border: 1px inset white;";

    // Adds a controls div with buttons to hideboxes WITH NO Codebox inside. Aka BareBox. (so they are bare text)
    function addBareBoxButtons() {
        // Find 'dl.hidebox.unhide' boxes with no internal codebox.
        let boxElems = findBareUnhideBoxes();
        for (let boxElem of boxElems) {
            // Add <br/> tag inside to hidebox to buffer the contents from selecting anything after.
            // v0.5.4: Only for Chromium based browsers, ignore Firefox (no selection issue)
            if(!isFirefox && isChromium) {
              let newBr = document.createElement('br');
              newBr.style.content = "\"\""; // Style fix 0.5.3 Workaround for allowing <br/> to still split text, but not show.
              boxElem.appendChild(newBr);
            }

            // Create a decode and copy button and make their click actions refer to this specific box.
            let decode = createButton("Decode", ["pointer", "noselect"], bareBoxButtonStyle, () => base64CodeContents(boxElem));
            // 0.5.0 Add ability to right click to re-encode just in case it's needed.
            decode.addEventListener("contextmenu", (ev) => {
                ev.preventDefault(); // Don't pop up the right click menu but ONLY on this button.
                ev.stopPropagation();
                undoLast();
            });
            let copy = createButton("Copy", ["pointer", "noselect"], bareBoxButtonStyle, () => copyContents(boxElem));

            // Create a wrapper div to hold both and position it next to the BareBox.
            let newControlsWrapper = document.createElement('div');
            newControlsWrapper.append(decode, copy);
            newControlsWrapper.style = bareBoxWrapperStyle;
            boxElem.insertAdjacentElement("afterend", newControlsWrapper);
        }
    }

    // Creates 'Decode' button for Codebox elements.
    function addCodeboxButtons() {
        // Find all the 'copy' buttons attached to code-boxes on the page.
        let codeboxCopyButtons = document.querySelectorAll(".codebox p a:last-child");

        // For each of the code boxes.
        for(let copyButtonEl of codeboxCopyButtons) {
            // Find the related codebox (it's a cousin element).
            let codeboxElement = copyButtonEl.parentNode.parentNode.querySelector('pre code');

            // Create a new button and bind click event to decode.
            let newButton = createButton(
                "Decode", ["pointer", "noselect"], "float: right; margin-right: 8px; margin-left: 8px;",
                () => base64CodeContents(codeboxElement)
            );
            // 0.5.0 Add ability to right click to re-encode just in case it's needed.
            newButton.addEventListener("contextmenu", (ev) => {
                ev.preventDefault(); // Don't pop up the right click menu but ONLY on this button.
                ev.stopPropagation();
                undoLast();
            });

            copyButtonEl.parentNode.appendChild(newButton);
        }
    }

    addCodeboxButtons();
    addBareBoxButtons();

})();
