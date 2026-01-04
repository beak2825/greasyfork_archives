// ==UserScript==
// @name         Dark mode
// @namespace    https://github.com/EastSun5566
// @version      0.0.5
// @description  Enable dark mode with only one line of CSS
// @author       Michael Wang
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472251/Dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/472251/Dark%20mode.meta.js
// ==/UserScript==

(function () {
  const style = document.createElement('style');
  style.textContent = `
    html {
      filter: invert(1) hue-rotate(180deg) contrast(0.8);
    }

    /** reverse filer for media elements */
    img, video, picture, canvas, iframe, embed {
      filter: invert(1) hue-rotate(180deg);
    }
  `;
  document.head.appendChild(style);
}());
