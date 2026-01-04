// ==UserScript==
// @name        SharePoint - Enable List and Library Comments For Firefox
// @namespace   Eliot Cole Scripts
// @match       https://*.sharepoint.com/*
// @grant       none
// @license     MIT
// @version     1.2
// @author      Eliot Cole
// @description 18/01/2024, 09:54:30
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @require     https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/485147/SharePoint%20-%20Enable%20List%20and%20Library%20Comments%20For%20Firefox.user.js
// @updateURL https://update.greasyfork.org/scripts/485147/SharePoint%20-%20Enable%20List%20and%20Library%20Comments%20For%20Firefox.meta.js
// ==/UserScript==

VM.observe(document.body, () => {
  // Find the target node
  const $node = $('.od-addNewCommentTextField-mentionableTextBox');

  if ($node.length) {
    $node.attr('contenteditable', 'true');

    // disconnect observer - This is disabled as if you disconnect you cannot enter more comments
    // return true;
  }
});