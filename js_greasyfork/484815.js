// ==UserScript==
// @name         Obtain-Kanji-Info-from-jpdb.io-for-Mnemonic-generation
// @namespace    http://tampermonkey.net/
// @version      2024-01-14
// @description  Will insert into the clipboard the info already parsed so that you only need to paste in for generating mnemonics
// @author       Fernando
// @match        https://jpdb.io/review
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jpdb.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484815/Obtain-Kanji-Info-from-jpdbio-for-Mnemonic-generation.user.js
// @updateURL https://update.greasyfork.org/scripts/484815/Obtain-Kanji-Info-from-jpdbio-for-Mnemonic-generation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let copyToClipBKanjiInfo = () => {
        let radicalDivs = document.querySelectorAll('.subsection-composed-of-kanji div.subsection .description');
        let radicals = Array.from(radicalDivs).map(radicalDiv => radicalDiv.textContent.trim());

        let keyword = document.querySelector('.subsection-composed-of-kanji').nextElementSibling.querySelector('.subsection').textContent.trim();

        let finalText = `Radicals: ${radicals.join(', ')}\nKeyword: ${keyword}`;

        navigator.clipboard.writeText( finalText );
    }

    let insertButtonForKanjiInfoGen = () => {
        let box = document.querySelector('.review-reveal .result.kanji .vbox.gap');

        const button = document.createElement('button');
        button.textContent = 'Copy Kanji Info for Mnemonic generation';

        button.addEventListener('click', copyToClipBKanjiInfo);

        box.appendChild(button);
    }

    if ( document.querySelectorAll('.subsection-composed-of-kanji') ) insertButtonForKanjiInfoGen();

})();