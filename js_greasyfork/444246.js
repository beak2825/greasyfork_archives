// ==UserScript==
// @name         PDF Link Extractor
// @namespace    https://nbolton.com
// @version      0.2
// @description  Provides a link at the top of the page to the original PDF, e.g. a datasheet (useful on annoying websites that make you view PDFs through a frame surrounded by ads).
// @author       Nick Bolton
// @match        *://*/*
// @exclude      *google.*
// @exclude      *greasyfork.*
// @icon         https://cdn3.iconfinder.com/data/icons/document-icons-2/30/647710-pdf-512.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444246/PDF%20Link%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/444246/PDF%20Link%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let match = document.body.innerHTML.match(/["']([^"']*?\.pdf[^"']*?)['"]/i);
    console.log('match', match);

    if (match) {

        const a = document.createElement('a');
        a.textContent = 'Go to PDF';
        a.style.fontSize = '15px';
        a.href = match[1];

        const img = document.createElement('img');
        img.width = 16;
        img.height = 16;
        img.style.marginRight = '10px';
        img.style.marginBottom = '-3px';
        img.src = 'https://cdn3.iconfinder.com/data/icons/document-icons-2/30/647710-pdf-512.png';

        const p = document.createElement('p');
        p.style.margin = '0px';
        p.style.padding = '0px';
        p.style.height = '20px';
        p.appendChild(img);
        p.appendChild(a);

        const div = document.createElement('div');
        div.style.backgroundColor = 'white';
        div.style.color = 'black';
        div.style.padding = '10px';
        div.style.borderBottom = '2px dashed grey';
        div.appendChild(p);

        document.body.insertBefore(div, document.body.firstChild);
    }
    else {
        console.log("No PDF found");
    }
})();