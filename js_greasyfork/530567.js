// ==UserScript==
// @name        Massif Example Sentence Button
// @namespace   Violentmonkey Scripts
// @match       https://jpdb.io/vocabulary/*
// @grant       none
// @version     0.2
// @author      Alex Chapman 2025
// @license     MIT
// @description Generates a button linking to Massif, which shows more example sentences of the word.
// @downloadURL https://update.greasyfork.org/scripts/530567/Massif%20Example%20Sentence%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/530567/Massif%20Example%20Sentence%20Button.meta.js
// ==/UserScript==

const documentQuery = document.querySelector('.hbox');
if (documentQuery) {
    // Grab current word
    let url = window.location.pathname;
    let word = url.split('/')[3];
    let decodedWord = decodeURIComponent(word);

    // Insert button with link to Massif
    documentQuery.insertAdjacentHTML('afterend', `
    <div class="massif-button" style="font-size: 200%; text-align: left;">
      <a href="https://massif.la/ja/search?q=${word}">
        <button>Massif Examples for ${decodedWord}</button>
      </a>
    </div>
    `);
}
