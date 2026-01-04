// ==UserScript==
// @name         Mycorrhiza Create Page Button
// @namespace    https://mycorrhiza.wiki
// @version      1.0
// @description  Adds a button create a page to your mycorrhiza header links
// @author       You
// @icon         https://em-content.zobj.net/source/microsoft/407/mushroom_1f344.png
//               NOTE: change this to your mycorrhiza instance.
// @match        https://mycorrhiza.wiki/*
// @grant        none
// @license       AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/529525/Mycorrhiza%20Create%20Page%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/529525/Mycorrhiza%20Create%20Page%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addToHeader() {
        const ul = document.querySelector('.top-bar__highlights');
        if (!ul) return;

        const li = document.createElement('li');
        li.className = 'top-bar__highlight';

        const a = document.createElement('a');
        a.href = '#';
        a.className = 'top-bar__highlight-link';
        a.textContent = 'New hypha';
        a.addEventListener('click', function(event) {
            event.preventDefault();
            // TODO: I want to make this part of the UI instead of a prompt
            const hyphaName = prompt("New hypha name:");
            if (hyphaName) {
                window.location.href = `/edit/${encodeHyphaName(hyphaName)}`;
            }
        });

        li.appendChild(a);
        // INFO: replace prepend with appendChild if you want the button at the end of the list
        ul.prepend(li);
    }

    function encodeHyphaName(hyphaName) {
      let encodedHyphaName = hyphaName.replace(' ', '_')
      return encodedHyphaName
    }

    addToHeader();
})();

