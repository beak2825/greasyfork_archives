// ==UserScript==
// @name        Hide Amazon Cart
// @namespace   https://github.com/spapadim
// @match       https://www.amazon.com/*
// @run-at      document-start
// @grant       none
// @version     1.0
// @author      spapadim@gmail.com
// @description Auto-hide annoying cart sidebar
// @downloadURL https://update.greasyfork.org/scripts/419596/Hide%20Amazon%20Cart.user.js
// @updateURL https://update.greasyfork.org/scripts/419596/Hide%20Amazon%20Cart.meta.js
// ==/UserScript==

(function () {
  // Perform the actual DOM modification, assuming sidebar is loaded
  function hideSidebar() {
    var sidebar = document.querySelector("div#nav-flyout-ewc");

    if (!sidebar) {
      console.warn("No cart sidebar element found... skipping.");
      return
    }
    
    const ensureHidden = () => {
      if (sidebar.style.display != "none") {  // Avoid mutation infinite loop...
        console.info("Hiding Amazon cart sidebar")
        // Hide sidebar itself
        sidebar.style.display = "none";
        // Hide "arrow" (margin notch), if present/loaded
        var notchArrow = document.querySelector("div#nav-flyout-anchor");
        if (notchArrow) {
          notchArrow.style.display = "none";
        }
        // Remove HTML body padding (set equal to width of sidebar)
        document.querySelector("body").style.paddingRight = 0;
      }
    };

    // Hide now and...
    ensureHidden();

    // ...register event to re-hide whenever Amazon un-hides (mutation observer
    // is permanent, since sidebar placement/size seem to use JS, not just CSS...)
    const sidebarObserver = new MutationObserver((mutationList, observer) => {
      //console.info("Sidebar attr mutation:", mutationList);
      ensureHidden();
    });
    sidebarObserver.observe(
      sidebar, {
        childList: false,
        attributes: true,
        // attributeOldValue: true,
        attributeFilter: ["style"]
      }
    );
  }
  
  // We could run userscript at document-end instead of doing this, 
  // but then the cart is annoyingly visible for a second or so...
  const docObserver = new MutationObserver((mutationList, observer) => {
    //console.info("Document descendant mutation:", mutationList);
    // Search for sidebar div among all added DOM nodes
    var sidebars = mutationList.flatMap(
      mutation => Array.prototype.find.call(
        mutation.addedNodes, 
        node => node.matches && node.matches("div#nav-flyout-ewc")
      ) || []
    );
    if (sidebars.length > 0) {
      // It appeared, squash it!
      console.info("Detected sidebar div:", sidebars)
      docObserver.disconnect();
      hideSidebar();
    }
  });
  docObserver.observe(
    document, {
      subtree: true,
      childList: true,
      attributes: false,
      characterData: false
    }
  );
})();