// ==UserScript==
// @name         Stackoverflow Copier
// @namespace    https://letga.me
// @version      0.2
// @description  Adds buttons to copy stackoverflow's codeblock content.
// @author       LetGame
// @license      MIT
// @match        https://stackoverflow.com/questions/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443587/Stackoverflow%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/443587/Stackoverflow%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function() {
        var codeblocks = document.querySelectorAll('pre.s-code-block');
        for (var i = 0; i < codeblocks.length; i++) {
            try {
                var copybutton = document.createElement('input');

                // Adding most important attributes
                copybutton.type = 'button';
                copybutton.value = 'Copy!';
                copybutton.setAttribute('onclick', 'navigator.clipboard.writeText(this.parentElement.innerText); setTimeout(() => {alert("Copied!")}, 100)');

                // Styling the button
                var s = copybutton.style; // Shortcut to not write copybutton.style over and over again
                codeblocks[i].setAttribute('style', 'position: relative;');

                s.position = 'absolute';
                s.top = '0.5em';
                s.right = '0.5em';
                s.margin = '0';
                s.cursor = 'pointer';
                copybutton.classList.add('post-tag');

                // Appending the button to codeblock
                codeblocks[i].appendChild(copybutton);
                console.log('Successfully added a copy function to codeblock ' + i + '.');
            } catch(e) {console.error('Adding a copy function to codeblock ' + i + ' failed. (' + e + ')');}
        }
    }, false);
})();