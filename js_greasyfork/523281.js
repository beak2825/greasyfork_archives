// ==UserScript==
// @name         IMABI hide example sentence translations
// @namespace    imabihidetranslations
// @version      2025-01-13
// @description  Tries to blur example sentence translations to aid in reading practice. Tap/hover to reveal. Auto-detects with regex, so it might fail if there’s any irregular formatting, but it seems to be pretty consistent.
// @author       chrrsy
// @match        https://imabi.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523281/IMABI%20hide%20example%20sentence%20translations.user.js
// @updateURL https://update.greasyfork.org/scripts/523281/IMABI%20hide%20example%20sentence%20translations.meta.js
// ==/UserScript==

(function() {
    addCss();

    const entryContent = document.getElementsByClassName("entry-content")[0];
    var regex = new RegExp(/((<br><br> *|<p> *)\d+\. *(&nbsp;)*.*?[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf].+?)(<br><\/em>|<br>)(.*?)(<br> *<br>|<\/p>)/g);
    let match;
    let newEntryContent = entryContent.innerHTML;

    while ((match = regex.exec(newEntryContent)) !== null){
      var indexStart = match.index;
      for (var i = 1; i < 5; i++) { // Translation is group 5
        if (match[i] !== undefined && i != 2 && i != 3) { // groups 2 and 3 somehow end up being zero-width?
          indexStart += match[i].length;
        }
      }
      var indexEnd = indexStart + match[5].length;
      newEntryContent = newEntryContent.slice(0, indexEnd) + "</span>" + newEntryContent.slice(indexEnd);
      newEntryContent = newEntryContent.slice(0, indexStart) + "<span class='example-sentence-translation'>" + newEntryContent.slice(indexStart);
    }
    entryContent.innerHTML = newEntryContent;
    var exampleSentenceTranslations = document.getElementsByClassName("example-sentence-translation");

    function addCss() {
    let style = document.createElement('style');
    style.textContent = `
      .example-sentence-translation {
	      filter: blur(4px);
      }
      .example-sentence-translation:hover, .example-sentence-translation:active {
	      filter: blur(0);
      }
    `;
    document.head.appendChild(style);
  }
})();