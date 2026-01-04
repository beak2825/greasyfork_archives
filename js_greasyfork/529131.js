// ==UserScript==
// @name        Asura Scans Comments Remover
// @namespace   Violentmonkey Scripts
// @match       https://asuracomic.net/*
// @grant       none
// @version     1.0
// @author      Jacob68
// @description Removes Asura Scans comments
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/529131/Asura%20Scans%20Comments%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/529131/Asura%20Scans%20Comments%20Remover.meta.js
// ==/UserScript==

(function() {
  
  function removeThread() {
    const element = document.querySelector('.p-4.space-y-4');
    if (element) {
      element.remove();
      console.log("Thread Removed");
      return true;
  }
    return false;
  }

  removeThread();

const observer = new MutationObserver(() => {
    if (removeThread()) {
      observer.disconnect(); 
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });


  setTimeout(() => observer.disconnect(), 5000);
  
})();