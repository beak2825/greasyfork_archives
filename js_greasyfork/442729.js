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
// @downloadURL https://update.greasyfork.org/scripts/442729/rPlace%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/442729/rPlace%20Overlay.meta.js
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
              img.src = "https://i.imgur.com/dEdeA0U.png";
              img.style = "position: absolute;left: 38.94%;top: 78.4%;image-rendering: pixelated;width: 11px;height: 10px;";
              console.log(img);
              return img;
          })())
  }, false);
}
