// ==UserScript==
// @name        Reddit Mobile App Nag Remover
// @description Stops Reddit from pushing you to use the mobile app.
// @namespace   Violentmonkey Scripts
// @match       https://*reddit.com/*
// @grant       none
// @version     1.2.2
// @author      Jupiter Liar
// @description 2023-05-25 6:52 PM
// @license     Attribution CC BY
// @downloadURL https://update.greasyfork.org/scripts/466915/Reddit%20Mobile%20App%20Nag%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/466915/Reddit%20Mobile%20App%20Nag%20Remover.meta.js
// ==/UserScript==

// Function to remove the nag popup element or XPromoPopupRpl element
function removeNagPopup() {
  const nagPopup = document.querySelector('shreddit-experience-tree, .XPromoPopupRpl, .XPromoBlockingModalRpl, [class*="XPromo"]');

  if (nagPopup) {
    nagPopup.style.display = 'none';
    document.body.style.overflow = 'unset';
    document.body.style.position = 'unset';
  }
}

// Function to remove the nag bottom element or XPromoBottomBar element
function removeNagBottom() {
  const navFrame = document.querySelector('.NavFrame');
  
  if (navFrame) {
    const nagBottoms = navFrame.querySelectorAll('[bundlename="bottom_bar_xpromo"], .XPromoBottomBar');

    nagBottoms.forEach(nagBottom => {
      nagBottom.style.display = 'none';
    });

    document.body.style.overflow = 'unset';
    document.body.style.position = 'unset';
  }
}

// Remove nag elements when the page has loaded
window.addEventListener('load', function() {
  removeNagPopup();
  removeNagBottom();
});

// Create a MutationObserver instance for nagPopup
const popupObserver = new MutationObserver(function(mutationsList) {
  for (let mutation of mutationsList) {
    if (mutation.type === 'childList') {
      removeNagPopup();
      break;
    }
  }
});

// Start observing the body for changes related to nagPopup
popupObserver.observe(document.body, { childList: true, subtree: true });

// Create a MutationObserver instance for nagBottom
const bottomObserver = new MutationObserver(function(mutationsList) {
  for (let mutation of mutationsList) {
    if (mutation.type === 'childList') {
      removeNagBottom();
      break;
    }
  }
});

// Start observing the body for changes related to nagBottom
bottomObserver.observe(document.body, { childList: true, subtree: true });

// Create a MutationObserver instance to monitor body's overflow property
const overflowObserver = new MutationObserver(function(mutationsList) {
  for (let mutation of mutationsList) {
    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
      const bodyOverflow = document.body.style.overflow;
      if (bodyOverflow === 'hidden') {
        document.body.style.overflow = 'unset';
        document.body.style.position = 'unset';
      }
      break;
    }
  }
});

// Start observing the body for changes related to overflow property
overflowObserver.observe(document.body, { attributes: true });

// Detect and hide the element with bundlename="bottom_bar_xpromo"
const bottomBarXpromo = document.querySelector('[bundlename="bottom_bar_xpromo"]');

if (bottomBarXpromo) {
  bottomBarXpromo.style.display = 'none';
}
