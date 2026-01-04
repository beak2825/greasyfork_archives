// ==UserScript==
// @name        MaruMori vocab copier
// @namespace   bspar
// @match       https://marumori.io/*
// @grant       GM.xmlHttpRequest
// @version     0.1
// @author      bspar
// @license     MIT; http://opensource.org/licenses/MIT
// @description Adds a button to copy upcoming lesson words to clipboard. Useful for moving words in a Kitsun deck to the front of the lesson queue.
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @downloadURL https://update.greasyfork.org/scripts/458747/MaruMori%20vocab%20copier.user.js
// @updateURL https://update.greasyfork.org/scripts/458747/MaruMori%20vocab%20copier.meta.js
// ==/UserScript==


function clipData(response) {
  console.log('found lessons?');
  var items = JSON.parse(response.responseText)['items'];
  var wordlist = '';

  items.forEach((item) => {
    if(item['suspended'] !== true) wordlist += item['item'] + '\n';
  });
  navigator.clipboard.writeText(wordlist);
}


// wait for the document to load
const disconnect = VM.observe(document.body, () => {
  // Find the table
  const node = document.querySelector('.lessons-reviews-card');

  // find the header
  if(node) {
    // go to lessons to get vocab
    const exportBtn = document.createElement('a');
    exportBtn.href = '#';
    node.appendChild(exportBtn);

    // Find the lessons button to copy class (for formatting)
    const lessonsTempl = document.querySelector('.lessons-reviews-card div');
    const exportDiv = document.createElement('div');
    console.log('list: ' + lessonsTempl.classList);
    exportDiv.classList.add('item');
    exportDiv.classList.add('card-wrapper');
    exportDiv.classList.add(lessonsTempl.classList[3]);
    // inner span to format text
    const spanTempl = document.querySelector('.lessons-reviews-card div span');
    const exportSpan = document.createElement('span');
    exportSpan.classList.add('subtitle');
    exportSpan.classList.add(spanTempl.classList[1]);
    exportSpan.textContent = 'Copy non-suspended main course vocab to clipboard';

    exportDiv.appendChild(exportSpan);
    exportDiv.addEventListener('click', () => {
      GM.xmlHttpRequest({
        method: "GET",
        url: "https://api.marumori.io/studylists/items/36021030",
        onload: clipData
      });
    });
    exportBtn.appendChild(exportDiv);
    return true;
  }
});

