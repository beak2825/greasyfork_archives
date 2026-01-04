// ==UserScript==
// @name        Make yahoo! notepad a little less bad
// @namespace   Violentmonkey Scripts
// @match       https://calendar.yahoo.com/
// @grant       none
// @version     1.0
// @author      -
// @description 3/17/2021, 2:13:08 AM
// @downloadURL https://update.greasyfork.org/scripts/423390/Make%20yahoo%21%20notepad%20a%20little%20less%20bad.user.js
// @updateURL https://update.greasyfork.org/scripts/423390/Make%20yahoo%21%20notepad%20a%20little%20less%20bad.meta.js
// ==/UserScript==

setInterval(()=> {
  const editor = document.body.querySelector("div[role=textbox][contenteditable=true]");
  if (editor) {
    editor.style.whiteSpace='pre';
  }
}, 500);