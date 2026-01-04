// ==UserScript==
// @name         HTML Markup in junon.io | EN
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Allows to paste HTML+CSS elements into chat
// @author       Belogvardeec
// @license      MIT
// @match        *://junon.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526455/HTML%20Markup%20in%20junonio%20%7C%20EN.user.js
// @updateURL https://update.greasyfork.org/scripts/526455/HTML%20Markup%20in%20junonio%20%7C%20EN.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function convertContentToHTMLCSS(element) {
        if (element.id === 'chat_input') return; // ignoring chat input for better experience

        let content = element.value || element.textContent;
        const regex = /#(.*?)#/g;

        if (!regex.test(content)) return; // if no #...# found, then do nothing

        // deleting previous custom element for not copying
        element.querySelectorAll('.custom-content').forEach(el => el.remove());

        // adding one style for one time
        if (!document.querySelector('.custom-style')) {
            const style = document.createElement('style');
            style.className = 'custom-style';
            style.innerHTML = `
                .custom-content {
                    color: white;
                    font-size: 16px;
                }
            `;
            document.head.appendChild(style);
        }

        // replace #...# on HTML+CSS content
        const newContent = content.replace(regex, (_, p1) => {
            return `<span class="custom-content">${p1}</span>`;
        });

        // inputs except chat_input are enabled too, for preview
        if (element.tagName.toLowerCase() === 'input') {
            let output = element.parentNode.querySelector('.custom-content-container');
            if (!output) {
                output = document.createElement('div');
                output.className = 'custom-content-container';
                element.insertAdjacentElement('afterend', output);
            }
            output.innerHTML = newContent;
        } else {
            element.innerHTML = newContent;
        }

        // set element as converted
        element.dataset.converted = "true";
    }

    function processElements() {
        document.querySelectorAll('input, .chat_content').forEach(element => {
            convertContentToHTMLCSS(element);
        });
    }

    setInterval(processElements, 450);

})();
