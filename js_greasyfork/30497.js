// ==UserScript==
// @name        GitterArchiveLinks
// @namespace   https://gitter.im/
// @description Gitter archive pages: show only messages containing 'http' links
// @include     https://gitter.im/*/live/archives/*/*/*
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/30497/GitterArchiveLinks.user.js
// @updateURL https://update.greasyfork.org/scripts/30497/GitterArchiveLinks.meta.js
// ==/UserScript==

// Based on LongMsgBuster
// https://greasyfork.org/en/scripts/26053-longmsgbuster

document.addEventListener('keydown', function(e) {
  // Key Binding | Defaults:
  // CTRL~CMD + ALT + F -> Filter blocks
  var filter = e.keyCode === 70; // F
  var middle = e.altKey;
  var first = e.metaKey || e.ctrlKey;

  if (first && middle && filter) {
    applyToDomElements(
      document.querySelectorAll('.chat-item'),
      hideChatBlock);
  }
});

function applyToDomElements(elements, action) {
  which_things = [];
  for (var i = 0, l = elements.length; i < l; i++) {
    chat_text = elements[i].getElementsByClassName('chat-item__text js-chat-item-text')[0].innerText;
    if(!chat_text.includes('http')) {
      which_things.push(i);
    }
  }

  for(i=0; i<which_things.length; i++) {
    hideChatBlock(elements[which_things[i]]);
  }
}

function hideChatBlock(block) {
  // Straight up delete the node from the tree
  block.parentNode.removeChild(block);
}