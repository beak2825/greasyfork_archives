// ==UserScript==
// @name         Glassdoor Review Popup Remover
// @version      0.1
// @description  Remove Popup "Add your review or salary to continue using Glassdoor"
// @author       Petros Dhespollari
// @match        *.glassdoor.*/*
// @license      Creative Commons Attribution-ShareAlike 4.0 International License
// @namespace https://greasyfork.org/users/1280675
// @downloadURL https://update.greasyfork.org/scripts/491099/Glassdoor%20Review%20Popup%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/491099/Glassdoor%20Review%20Popup%20Remover.meta.js
// ==/UserScript==

(function() {
  function fixScrolling() {
    var contentWallHardsell = document.getElementById("ContentWallHardsell");
    if (contentWallHardsell) {
      contentWallHardsell.remove();
    }
    window.onscroll = null;
    document.body.style.height = "unset";
    document.body.style.overflow = "unset";
  }

  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes) {
        Array.from(mutation.addedNodes).forEach(function(addedNode) {
          if (addedNode.nodeName === "DIV" && addedNode.id === "ContentWallHardsell") {
            fixScrolling();
          }
        });
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

})();