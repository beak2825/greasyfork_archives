// ==UserScript==
// @name         Mediawiki <br> adder
// @version      0.1.0
// @description  Adds a button to add <br> in mediawiki form
// @author       kory33
// @match        *://*/*
// @namespace    https://github.com/kory33
// @downloadURL https://update.greasyfork.org/scripts/370735/Mediawiki%20%3Cbr%3E%20adder.user.js
// @updateURL https://update.greasyfork.org/scripts/370735/Mediawiki%20%3Cbr%3E%20adder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addButton(text, domManipulator) {
        const button = document.createElement('button');
        const textarea = document.getElementById("wpTextbox1");
        document.getElementById("mw-content-text").appendChild(button);
        button.innerHTML = text;
        button.onclick = () => domManipulator(textarea);
        return button;
    }

    function processText(text) {
        const lines = text.split("\n");
        const shouldAppendBr = line => !(line === "" || line.endsWith(">") || line.endsWith("=="));
        const mapper = line => shouldAppendBr(line) ? line + "<br>" : line;
        return lines.map(mapper).join("\n");
    }

    window.addEventListener('load', () => {
        addButton('Add &lt;br&gt;', (textarea) => {
            textarea.value = processText(textarea.value);
        });
    });

})();