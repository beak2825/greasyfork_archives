// ==UserScript==
// @name        Netflix intro skip
// @description This script skips intro on netflix by using MutationObserver. jQuery free !
// @include  https://www.netflix.com/*
// @version  1
// @grant    none
// @namespace https://greasyfork.org/users/741166
// @downloadURL https://update.greasyfork.org/scripts/422294/Netflix%20intro%20skip.user.js
// @updateURL https://update.greasyfork.org/scripts/422294/Netflix%20intro%20skip.meta.js
// ==/UserScript==
 
var click = new MouseEvent('click', {
      'view': window,
      'bubbles': true,
      'cancelable': true
});

var observer = new MutationObserver(function(mutations) {
  for (var mutation of mutations) {
    mutation.addedNodes?.[0].querySelector(".skip-credits > a")?.dispatchEvent(click);
  }
});
 
observer.observe(unsafeWindow.document.querySelector('body'), { childList: true, subtree: true });