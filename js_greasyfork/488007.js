// ==UserScript==
// @name        Remove New Comment Dropdown Menu Item
// @namespace   Eliot Cole Scripts
// @match       https://make.powerautomate.com/*
// @grant       none
// @license MIT
// @version     1.2
// @author      Eliot Cole
// @description 22/02/2024, 10:05:11
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @require     https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/488007/Remove%20New%20Comment%20Dropdown%20Menu%20Item.user.js
// @updateURL https://update.greasyfork.org/scripts/488007/Remove%20New%20Comment%20Dropdown%20Menu%20Item.meta.js
// ==/UserScript==


// This is here as I might make the 'li' selector more precise in the future
// #ms-ContextualMenu-item[role="presentation"]

VM.observe(document.body, () => {
  const $node = $('li:has( > button[name="New Comment"]');

  if ($node.length) {

    $node.each(function(){
      $(this).css('display', 'none');
    });

    // // disconnect observer - This is disabled as if you disconnect you cannot enter more comments
    // return true;
  }
});