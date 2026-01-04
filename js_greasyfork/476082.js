// ==UserScript==
// @name        Always See More
// @namespace   Microsoft Teams Tweaks
// @match       https://teams.microsoft.com/*
// @grant       none
// @license     MIT
// @version     1.1
// @author      alatar224
// @description Always "See More" in Microsoft Teams messages
// @homepageURL https://gist.github.com/alatar224/d254f36b214ee356f0b42ca54960a4ce
// @downloadURL https://update.greasyfork.org/scripts/476082/Always%20See%20More.user.js
// @updateURL https://update.greasyfork.org/scripts/476082/Always%20See%20More.meta.js
// ==/UserScript==

const displayNoneStyle = document.createElement('style');
displayNoneStyle.innerHTML = '.display-none { display: none !important }';
// For some reason, doing this immediately or on DOMContentLoaded or on load breaks Chat
setTimeout(() => document.head.append(displayNoneStyle), 1000);

const seeMore = (button) => {
  // Let Angular (or whatever) handle showing stuff
  button.click();
  // And then make our button disappear
  button.classList.add('display-none');
}

// Click on any elements with the 'ts-see-more-fold' class whenever they've got it
const seeMoreHandler = (mutationList) => {
  mutationList.forEach((mutation) => {
    if (mutation.type === "childList") {
      for (let node of mutation.addedNodes) {
        if (node.classList.contains('ts-see-more-fold')) {
          seeMore(node);
        }
      }
    } else if (mutation.type === "attributes") {
      if (mutation.target.classList.contains('ts-see-more-fold')) {
        seeMore(mutation.target);
      }
    }
  });
}

const config = { attributes: true, childList: true, subtree: true, attributeFilter: ["class"] };
const observer = new MutationObserver(seeMoreHandler);
observer.observe(document.documentElement, config);
