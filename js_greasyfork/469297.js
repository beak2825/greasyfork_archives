// ==UserScript==
// @name         Block lemmy instances
// @namespace    http://tampermonkey.net/
// @version      0.4.3
// @description  Remove posts and comments from specified instances.
// @author       RyanHx
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469297/Block%20lemmy%20instances.user.js
// @updateURL https://update.greasyfork.org/scripts/469297/Block%20lemmy%20instances.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const target = document.querySelector("#app.lemmy-site");
  const config = { attributes: false, childList: true, subtree: true };
  const callback = (mutationList, observer) => {
      const blockedInstances = ["example.ml", "anotherexample.world"]; // EDIT THIS LINE
      for (const instance of blockedInstances) {
          const selector = `div.post-listing a[title$="@${instance}"], li.comment a.person-listing[title$="@${instance}"]`;
          let link = document.querySelector(selector);
          while (link) {
              const post = link.closest("div.post-listing, li.comment");
              const divider = post.nextElementSibling;
              console.log(`Removing ${instance} post.`);
              post.remove();
              if (divider?.nodeName === "HR") {
                  divider.remove();
              }
              link = document.querySelector(selector);
          }
      }
  }
  const observer = new MutationObserver(callback);
  if (target) {
      observer.observe(target, config);
      callback();
  }
})();