// ==UserScript==
// @name         Sodapoppin Overlay Test 1.1
// @namespace    None
// @version      1.1
// @description  A visual overlay to show errors in tile colors of a desired image in r/place (forked from https://github.com/marcus-grant/place-overlay)
// @author       None
// @match        https://garlic-bread.reddit.com/embed*
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/471339/Sodapoppin%20Overlay%20Test%2011.user.js
// @updateURL https://update.greasyfork.org/scripts/471339/Sodapoppin%20Overlay%20Test%2011.meta.js
// ==/UserScript==
if (window.top !== window.self) {
    window.addEventListener('load', () => {
      document
        .getElementsByTagName("garlic-bread-embed")[0]
        .shadowRoot
        .children[0]
        .getElementsByTagName("garlic-bread-share-container")[0]
        .getElementsByTagName("garlic-bread-camera")[0]
        .getElementsByTagName("garlic-bread-canvas")[0]
        .shadowRoot
        .children[0]
        .appendChild(
          (function () {
              const img = document.createElement("img");
              img.src = "https://kappa.lol/QQZS5";
              img.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 1000px;height: 1000px;";
              console.log(img);
              return img;
          })())
  }, false);
}