// ==UserScript==
// @name        Default To Shrunken Left Bar Menu
// @namespace   Eliot Cole Scripts
// @match       https://make.powerautomate.com/*
// @grant       none
// @license MIT
// @version     1.0
// @author      Eliot Cole
// @description 29/02/2024, 14:30:28
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @require     https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/488625/Default%20To%20Shrunken%20Left%20Bar%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/488625/Default%20To%20Shrunken%20Left%20Bar%20Menu.meta.js
// ==/UserScript==

VM.observe(document.body, () => {
  const $node = $('button[title="Left navigation panel"]');

  if ($node.length) {

    $node.each(function(){
      $(this).click();
    });

    // disconnect observer - This is disabled as if you disconnect you cannot enter more comments
    return true;
  }
});