// ==UserScript==
// @name         HTML5 video controls
// @namespace    http://tampermonkey.net/
// @version      0.1
// @include      http://*
// @include      https://*
// @grant        none
// @license      MIT
// @description  show video controls 
// @downloadURL https://update.greasyfork.org/scripts/484035/HTML5%20video%20controls.user.js
// @updateURL https://update.greasyfork.org/scripts/484035/HTML5%20video%20controls.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function addVideoControls(videoNode) {
    videoNode.setAttribute("controls", "");
    console.log("*** Enabled HTML 5 video controls for", videoNode);
  }

  for (let el of document.getElementsByTagName("video")) {
    addVideoControls(el);
  }

  const observer = new MutationObserver(mutations => {
    for (let i = 0, mLen = mutations.length; i < mLen; ++i) {
      let mutation = mutations[i];
      if (mutation.type === "childList") {
        for (let j = 0, aLen = mutation.addedNodes.length; j < aLen; ++j) {
          let addedNode = mutation.addedNodes[j];
          if (addedNode.nodeType === 1 && addedNode.tagName === "VIDEO") {
            addVideoControls(addedNode);
          }
        }
      }
    }
  });

  observer.observe(document.body, {childList: true, subtree: true});
})();

