// ==UserScript==
// @name         Pinterest - Open Original Image
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  Open the original (largest) image in a new tab by pressing 'z' while hovering over a pin
// @author       Valacar
// @include      https://*.pinterest.tld/*
// @grant        GM_openInTab
// @noframes
// @license      MIT
// @compatible   firefox Firefox
// @compatible   chrome Chrome
// @downloadURL https://update.greasyfork.org/scripts/370410/Pinterest%20-%20Open%20Original%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/370410/Pinterest%20-%20Open%20Original%20Image.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Custom key. Only single letters.
  const KEY_TO_OPEN = "z";

  // Immediately switch to new tab?
  // Note: Hold SHIFT key to do the opposite of this (e.g. shift-z)
  const ACTIVATE_NEW_TAB = true;

  function showImage(shouldActivateTab)
  {
    const imageUrl = getOriginalImage();
    if (imageUrl && /\.(?:jpe?g|png|gif|webp)$/.test(imageUrl)) {
      GM_openInTab(imageUrl, {active: shouldActivateTab});
    }
  }

  function getReactInfo(pin)
  {
    return Object.keys(pin).find(
      prop => prop.startsWith("__reactProps")
    );
  }

  function getPathToImagesFromChild(obj)
  {
    if (obj && obj.props) {
      if (obj.props.data && obj.props.data.images) {
        return obj.props.data.images;
      }
      if (obj.props.pin && obj.props.pin.images) {
        return obj.props.pin.images;
      }
    }
  }

  function getOriginalImage()
  {
    // TODO: split into two functions, or combine both loops somehow
    let path, reactInfo;
    const hoveredElements = document.querySelectorAll(':hover');
    let len = hoveredElements.length;
    while (len--) {
      const el = hoveredElements[len];
      if (reactInfo === undefined) reactInfo = getReactInfo(el);
      if (!reactInfo) continue;
      const target = el[reactInfo];
      if (target && target.children) {
        if (Array.isArray(target.children)) {
          for (let child of target.children) {
            path = getPathToImagesFromChild(child);
          }
        } else {
          path = getPathToImagesFromChild(target.children);
        }
        if (path && path.orig && path.orig) {
          return path.orig.url;
        }
      }
    }
    // Try again using img srcset
    len = hoveredElements.length;
    while (len--) {
      const el = hoveredElements[len];
      let img = el.querySelector('img[srcset]');
      if (el && img) {
        let srcset = img.srcset.split(/,\s*/);
        for (let src of srcset) {
          if (src.includes('originals')) {
            let imageOrig = src.split(/\s+/)[0];
            return imageOrig;
          }
        }
        return null;
      }
    }
  }

  window.addEventListener("keydown",
    function(event) {
      // console.debug("active element:", document.activeElement);
      if (event.defaultPrevented ||
        /(input|textarea)/i.test(document.activeElement.nodeName) ||
        document.activeElement.matches('[role="textarea"]') ||
        document.activeElement.matches('[role="textbox"]'))
      {
        return;
      }
      switch (event.key) {
        case KEY_TO_OPEN.toLowerCase():
          showImage(ACTIVATE_NEW_TAB);
          break;
        case KEY_TO_OPEN.toUpperCase():
          showImage(!ACTIVATE_NEW_TAB);
          break;
        default:
          return;
      }
      event.preventDefault();
    },
    true
  );

})();