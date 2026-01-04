// ==UserScript==
// @name         Hide Garbage Genres on FreeWebNovel/LibRead
// @namespace    https://freewebnovel.com/*
// @version      1.02
// @author       Unbroken
// @description  Hide garbage genres on FWN and LR
// @match        https://freewebnovel.com/*
// @match        https://libread.com/*
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/495763/Hide%20Garbage%20Genres%20on%20FreeWebNovelLibRead.user.js
// @updateURL https://update.greasyfork.org/scripts/495763/Hide%20Garbage%20Genres%20on%20FreeWebNovelLibRead.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Select all div elements with class "li-row"
  var divs = document.querySelectorAll('.li-row');

  // Loop through each div element
  for (var i = 0; i < divs.length; i++) {
    var div = divs[i];

    // Select all anchor elements within the div
    var anchors = div.querySelectorAll('a');

    // Check if any anchor element contains the specified words in its href attribute
    if (Array.from(anchors).some(anchor => ['Yaoi', 'Josei', 'Shoujo', 'Ai', 'Romanc', 'Adult'].some(word => anchor.href.includes(word)))) {
      // Hide the div element
      div.style.display = 'none';
    }
  }
})();