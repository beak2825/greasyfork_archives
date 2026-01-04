// ==UserScript==
// @name        Pop-up window
// @namespace   Open current page or links to a standalone window without UI elements
// @match       *://*/*
// @grant       none
// @version     Alpha-v1
// @description Open current page or links to a standalone window without UI elements
// @author      JesusisLord
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/484690/Pop-up%20window.user.js
// @updateURL https://update.greasyfork.org/scripts/484690/Pop-up%20window.meta.js
// ==/UserScript==
(function() {
  "use strict";

  function createStandaloneWindow(url, targetWindow = window) {
    const win = targetWindow.open(url, "_blank", "width=800,height=600,toolbar=no,location=no,menubar=no,scrollbars=no");
    win.focus();
    return win;
  }

  const openLinkHandler = (event) => {
    // Prevent default link behavior (needed):
    event.preventDefault();
    const url = event.target.href || event.target.parentNode.href;
    createStandaloneWindow(url);
  };

  const movePageHandler = () => {
    createStandaloneWindow(window.location.href);
  };

  document.addEventListener("click", (event) => {
    if (event.ctrlKey) {
      if (event.target.nodeName === "A") {
        openLinkHandler(event);
      } else if (!event.target.isContentEditable && !event.target.matches('input, textarea, button, select')) {
        event.preventDefault(); // Optional: Prevent default actions on empty space
        movePageHandler();
      }
    }
  });
})();