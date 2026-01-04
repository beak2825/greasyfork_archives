// ==UserScript==
// @name        MS Stream Default Sort
// @license     MIT
// @version     1
// @author      https://github.com/TwentyPorts
// @namespace   https://greasyfork.org/users/737264
// @include     https://web.microsoftstream.com/group/*?view=videos
// @description Sets the default sort for Microsoft Stream when viewing a group's videos
// @downloadURL https://update.greasyfork.org/scripts/423624/MS%20Stream%20Default%20Sort.user.js
// @updateURL https://update.greasyfork.org/scripts/423624/MS%20Stream%20Default%20Sort.meta.js
// ==/UserScript==

let callback = function (mutationList, observer) {
  const dropDown = document.querySelector(
    "[id^=drop-down-][id$=-display-name]"
  );
  const list = document.querySelector("div.drop-down-list-container");
  if (dropDown !== null) {
    //console.log("found dropdown");
    dropDown.click();
    setSelectedValue(list, "Publish date"); // Replace "Publish date" with any of the available sorting options:
                                            // Name, Relevance, Trending, Publish date, Views, Likes
    observer.disconnect();
  }

  function setSelectedValue(list, valueToSet) {
    for (var i = 0; i < list.children.length; i++) {
      const value = list.children[i].children[0];
      if (value.innerHTML === valueToSet) {
        value.click();
      }
    }
  }
};

// Setup a MutationObserver to watch the document for the nodes we need.
let targetNode = document.querySelector("body");
let observerConfig = {
  childList: true,
  subtree: true,
};
let observer = new MutationObserver(callback);
observer.observe(targetNode, observerConfig);
