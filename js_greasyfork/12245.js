// ==UserScript==
// @name        Monkkee Word Count
// @namespace   https://my.monkkee.com
// @description Adds word count to monkkee.com
// @include     https://my.monkkee.com/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12245/Monkkee%20Word%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/12245/Monkkee%20Word%20Count.meta.js
// ==/UserScript==

// Pull in jQuery
if(typeof $ == 'undefined'){ var $ = unsafeWindow.jQuery; }

var editableLength = 0;
function updateCounter() {
  var newEditableLength = $('#editable').html().length;
  if (editableLength !== newEditableLength) {
    editableLength = newEditableLength;
    var words = $('#editable').html().replace(/<.*?>/g, ' ');
    if (words.match(/\S+/g) !== null) {
      $('#wordcounter').html('Words: ' + words.match(/\S+/g).length);
    }
  }
}

// fixme: Use of Mutation Events is deprecated. Use MutationObserver instead.
document.addEventListener('DOMNodeInserted', function () {
  if($('#wordcounter').length === 0) {
    $('#search').append('<div id="wordcounter" style="position: fixed;bottom: 0;width: 100%;background-color:white"></div>');
  }
  updateCounter();
});
