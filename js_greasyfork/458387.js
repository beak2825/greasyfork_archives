// ==UserScript==
// @name        Copy known words from kitsun.io
// @namespace   Violentmonkey Scripts
// @match       https://kitsun.io/*
// @grant       none
// @version     0.3
// @author      bspar
// @license     MIT; http://opensource.org/licenses/MIT
// @description Adds a button to copy known words to clipboard
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @downloadURL https://update.greasyfork.org/scripts/458387/Copy%20known%20words%20from%20kitsunio.user.js
// @updateURL https://update.greasyfork.org/scripts/458387/Copy%20known%20words%20from%20kitsunio.meta.js
// ==/UserScript==

var allKnown = '';
var allItems = [];

function clipList(wordListDiv) {
  allItems.forEach((item) => {
    allKnown += item + '\n';
  });
  // japanese parens
  allKnown = allKnown.replace(/[（）]/g, '');
  // console.log(allKnown);
  navigator.clipboard.writeText(allKnown);
}

// https://stackoverflow.com/a/29293383
(function(open) {
  XMLHttpRequest.prototype.open = function() {
    this.addEventListener('readystatechange', function() {
      if(this.readyState === 4) {
        if(this.responseURL.includes('https://api.kitsun.io/wordlists?category=')) {
          var obj = JSON.parse(this.responseText);
          allItems = obj.words;
        }
      }
    }, false);
    open.apply(this, arguments);
  };
})(XMLHttpRequest.prototype.open);

// wait for the document to load
const disconnect = VM.observe(document.body, () => {
  // Find the table
  const node = document.querySelector('.word-list');

  // find the header
  if(node) {
    const headerDiv = node.querySelector('.kitTableHeader');
    if(headerDiv) {
      const exportBtn = document.createElement('div');
      exportBtn.classList.add('th');
      exportBtn.textContent = 'Copy to clipboard';
      exportBtn.addEventListener('click', clipList);
      headerDiv.appendChild(exportBtn);
      return true;
    }
  }
});
