// ==UserScript==
// @name         Messenger Video Call Tweaks
// @namespace    skoshy.com
// @version      0.2.1
// @description  Tweaks for Messenger video calls
// @author       Stefan Koshy
// @match        https://www.messenger.com/videocall/*
// @match        https://www.messenger.com/groupcall/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404653/Messenger%20Video%20Call%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/404653/Messenger%20Video%20Call%20Tweaks.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const scriptId = "messenger-video-call-tweaks";
  let hasPipBeenTriggered = false;

  function addGlobalStyle(css, id) {
    var head, style;
    head = document.getElementsByTagName("head")[0];
    if (!head) {
      return;
    }
    const styleEl = document.createElement("style");
    styleEl.type = "text/css";
    styleEl.innerHTML = css;
    styleEl.id = id;
    head.appendChild(styleEl);
  }

  const cssToAdd = `
    [aria-label*="Click to show"], [aria-label*="Click to minimize"] {
      position: fixed;
      top: 0px;
      left: 0px;
      height: 100px !important;
      margin-left: 0 !important;
    }
    [aria-label*="Click to minimize"] {
      width: unset !important;
    }
  `;

  addGlobalStyle(cssToAdd, scriptId);

  function setAndGetNodeId(node) {
    const nodeIdString = `${scriptId}-id`;

    let nodeId = node.getAttribute(nodeIdString);
    let hadNodeIdSet = true;

    if (!nodeId) {
      hadNodeIdSet = false;
      nodeId = Math.random().toString();
      node.setAttribute(nodeIdString, nodeId);
    }

    return { nodeId, hadNodeIdSet };
  }

  //then define a new observer
  function addVideoHandler(node) {
    if (node.tagName === "VIDEO") {
      const { nodeId, hadNodeIdSet } = setAndGetNodeId(node);

      console.log("new video", {
        node,
        nodeId,
        hadNodeIdSet,
        hasPipBeenTriggered,
      });

      if (!hadNodeIdSet) {
        // this is a new video element

        if (hasPipBeenTriggered) {
          // pip has already been triggered, so let's now change the pip to be this video
          console.log("triggering request for picture in picture");
          setTimeout(() => {
            node.requestPictureInPicture();
          }, 1000);
        }

        node.addEventListener("enterpictureinpicture", () => {
          console.log("pip has been triggered");
          hasPipBeenTriggered = true;
        });
        node.addEventListener("DOMNodeRemoved", () => {
          // make the nearest video be pip

          setTimeout(() => {
            document.querySelector("video").requestPictureInPicture();
          }, 1000);
        });
      }
    }
  }

  var bodyObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      //How do i egt the video tags to add a listener?
      mutation.addedNodes.forEach((addedNode) => {
        addVideoHandler(addedNode);
        // it might be text node or comment node which don't have querySelectorAll
        addedNode.querySelectorAll &&
          addedNode.querySelectorAll("video").forEach(addVideoHandler);
      });
    });
  });
  var bodyObserverConfig = {
    attributes: true,
    childList: true,
    subtree: true,
    characterData: true,
  };
  bodyObserver.observe(document.body, bodyObserverConfig);
})();
