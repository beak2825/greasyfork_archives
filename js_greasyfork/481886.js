// ==UserScript==
// @name         Remove MyAdCenter Popup (Youtube AdBlock)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove specific element from page
// @author       zvddfdzfd fsdfs
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481886/Remove%20MyAdCenter%20Popup%20%28Youtube%20AdBlock%29.user.js
// @updateURL https://update.greasyfork.org/scripts/481886/Remove%20MyAdCenter%20Popup%20%28Youtube%20AdBlock%29.meta.js
// ==/UserScript==

(function() {

  var targetClass = 'ytd-popup-container';

  function removeElement() {
    var elem = document.getElementsByClassName(targetClass);
    if (elem.length > 0) {
      elem[0].remove();
      console.log("Remove My Ad Center Popup : Removed ✅ ")
    }
  }

  setInterval(function() {
    removeElement();
  }, 1000); // check every 3 seconds

  removeElement();

  var observer = new MutationObserver(function() {
    removeElement();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();