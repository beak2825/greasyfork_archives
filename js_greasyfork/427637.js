// ==UserScript==
// @name        Improve Ricemine 
// @namespace   Destiny Child Scripts
// @match       http*://*.mnyiaa.com/*
// @grant       none
// @version     1.0.2
// @author      KingMob
// @description Increase Live2D size, add ability to exit popups with Escape key 
// @downloadURL https://update.greasyfork.org/scripts/427637/Improve%20Ricemine.user.js
// @updateURL https://update.greasyfork.org/scripts/427637/Improve%20Ricemine.meta.js
// ==/UserScript==

(() => {
  const config = {
    childList: true,
    subtree: true
  };

  const bod = document.querySelector("body");

  const callback = (mutationsList, observer) => {
      // Use traditional 'for loops' for IE 11
      for(const mutation of mutationsList) {
          if (mutation.type === 'childList') {
            // console.log('A child node has been added or removed.');

            const added = mutation.addedNodes;
            added.forEach((n) => {
              if(n instanceof Element) {
                const links = n.querySelectorAll('a[href*="live2d-dcg.github.io/viewerK.html"')
                links.forEach((a) => {
                  // console.log("Updating link: " + a); 
                  a.href = a.href.replace(/size=[0-9]*/, 'size=3000').replace(/mY=[0-9.]*/, 'mY=0.1')})
              }
            })
          }
      }
  };


  const observer = new MutationObserver(callback);
  observer.observe(bod, config);
})();

(() => {
  document.addEventListener('keydown', e => {
    // Ignore IME
    if (e.isComposing || e.keyCode === 229) {
      return;
    }
    
    if(e.key === "Escape") {
      const exitButton = document.querySelector('.exit-button2');
      
      if(exitButton && exitButton.style.visibility !== 'hidden') {
        exitButton.click();
      }
    }
  });
})();