// ==UserScript==
// @name        Kanji prompt jpdb.io
// @namespace   Violentmonkey Scripts
// @match       https://jpdb.io/review*
// @grant       none
// @version     1.0
// @author      -
// @license     MIT
// @description Press C on back of a review card to open a prompt with kanji that's currently being reviewed.
// @downloadURL https://update.greasyfork.org/scripts/497752/Kanji%20prompt%20jpdbio.user.js
// @updateURL https://update.greasyfork.org/scripts/497752/Kanji%20prompt%20jpdbio.meta.js
// ==/UserScript==

function copyToClipboard(text) {
    window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
}

function myKeyListener(e) {
  if (e.key !== 'c') {
    return;
  }

  const urlPrefix = "https://jpdb.io/review?c=kb%2C";
  const currentUrl = decodeURI(location.href);
  if (!currentUrl.startsWith(urlPrefix)) {
    return;
  }


  copyToClipboard(currentUrl.charAt(urlPrefix.length));
}

document.addEventListener("keyup", myKeyListener, false)