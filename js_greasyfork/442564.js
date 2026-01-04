// ==UserScript==
// @name         r/Place Overlay
// @namespace    https://github.com/marcus-grant/place-overlay
// @version      1.0.1
// @description  A visual overlay to show errors in tile colors of a desired image in r/place
// @author       github.com/marcus-grant
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/442564/rPlace%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/442564/rPlace%20Overlay.meta.js
// ==/UserScript==
if (window.top !== window.self) {
    window.addEventListener('load', () => {
      document
        .getElementsByTagName("mona-lisa-embed")[0]
        .shadowRoot
        .children[0]
        .getElementsByTagName("mona-lisa-canvas")[0]
        .shadowRoot
        .children[0]
        .appendChild(
          (function () {
              const img = document.createElement("img");
              img.src = "https://github.com/marcus-grant/place-qr-overlay/raw/main/qroverlay.png";
              img.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 2000px;height: 1000px;";
              console.log(img);
              return img;
          })())
  }, false);
}
