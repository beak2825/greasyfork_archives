// ==UserScript==
// @name     Allow full screen for YouTube embedded videos
// @description     Always allow full screen for YouTube embedded videos that don't allow it by default
// @version  1
// @match    https://*/*
// @exclude  *://youtube.com/embed/*
// @exclude  *://*.youtube.com/embed/*
// @namespace https://greasyfork.org/users/4654
// @downloadURL https://update.greasyfork.org/scripts/435238/Allow%20full%20screen%20for%20YouTube%20embedded%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/435238/Allow%20full%20screen%20for%20YouTube%20embedded%20videos.meta.js
// ==/UserScript==

/*jshint esversion:6 */

;(function AddFullScreenToEmbeddedVideos() {
  "use strict";
  let utils = {
    $$: (selector, _parent = document.body) => 
      _parent.matches(selector) ? [_parent] : [..._parent.querySelectorAll(selector)],  // return as a JS Array instead of a NodeList

    concurrent: (job) =>
      (window.requestIdleCallback || window.requestAnimationFrame || window.setTimeout)(job),

    isElement: (any) => typeof any === "object" && any.nodeType === Node.ELEMENT_NODE
  };

  let YT_IFRAME_SELECTORS = [
      "youtube.com", "youtube-nocookie.com"
    ]
    .map((url) => `iframe[src*="${url}/embed/"]:not(allowfullscreen)`)
    .join(",");

  let selectVideoIFrames = (parent) => utils.$$(YT_IFRAME_SELECTORS, parent);
  
  let addFullScreen = (videoFrame) => {
    console.debug('adding fullscreen to iframe', videoFrame);
    videoFrame.allowFullscreen = true;
    videoFrame.src = videoFrame.src; // to force a reload of the iframe
  };


  let onDomMutation = (mutationList) =>
    mutationList.forEach((mutation) =>
      [...mutation.addedNodes].filter(utils.isElement)
                         .flatMap(selectVideoIFrames)
                         .forEach((iframe) => utils.concurrent(addFullScreen(iframe)))
    );

  let start = () => {
    selectVideoIFrames().forEach(addFullScreen);

    var observer = new MutationObserver(onDomMutation);
    observer.observe(document.body, {subtree: true, childList: true});
  }

  window.addEventListener("load", start);
  console.debug("Loaded script:", GM.info.script.name);

})()