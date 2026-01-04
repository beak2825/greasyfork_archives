// ==UserScript==
// @name        Color Style - quotes
// @namespace   An CSS user script
// @match       http://127.0.0.1:8000/*
// @match       https://beta.character.ai/chat*
// @grant       none
// @license     MIT
// @version     1.1
// @author      chatgpt
// @description changes color of the text within quotes
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/461132/Color%20Style%20-%20quotes.user.js
// @updateURL https://update.greasyfork.org/scripts/461132/Color%20Style%20-%20quotes.meta.js
// ==/UserScript==
function changeColors() {
  const pTags = document.getElementsByTagName('p');
  let changed = false;
  for (let i = 0; i < pTags.length; i++) {
    const pTag = pTags[i];
    if (pTag.dataset.colorChanged === 'true') {
      continue;
    }
    let text = pTag.innerHTML;
    if (text.match(/(["“”«»].*?["“”«»])/)) {
      text = text.replace(/(["“”«»].*?["“”«»])/g, '<span style="color: #00FF00">$1</span>');
      pTag.innerHTML = text;
      pTag.dataset.colorChanged = 'true';
      changed = true;
    }
  }
  if (changed) {
    console.log('Changed quote colors!');
  }
}

setTimeout(function() {
  changeColors();
  setInterval(changeColors, 500); // check every 500 milliseconds
}, 2000); // 2 seconds delay
