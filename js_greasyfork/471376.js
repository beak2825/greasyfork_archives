// ==UserScript==
// @name         Arma logo Overlay
// @namespace    Armar/place
// @version      1.0
// @description  A visual overlay to show errors in tile colors of a desired image in r/place (forked from https://github.com/marcus-grant/place-overlay)
// @author       Arma
// @match        https://garlic-bread.reddit.com/embed*
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/471376/Arma%20logo%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/471376/Arma%20logo%20Overlay.meta.js
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
              img.src = "https://i.ibb.co/vPR2Dkb/overlay-arma.png";
              img.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 1000px;height: 1000px;";
              console.log(img);
              return img;
          })())
  }, false);
}