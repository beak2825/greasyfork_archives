// ==UserScript==
// @name         CSS Prefer Dark Mode
// @namespace    http://j1.io/
// @version      0.1
// @description  Tells CSS in all pages to use the new CSS "prefers-color-scheme: dark" mode.
// @author       jswny
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373632/CSS%20Prefer%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/373632/CSS%20Prefer%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    var styleTags = document.getElementsByTagName("style");
    var content = `
    /* Text and background color for light mode */
    body {
      color: #333;
    }

    /* Text and background color for dark mode */
    @media (prefers-color-scheme: dark) {
      body {
        color: #ddd;
        background-color: #222;
      }
    }
    `;

    if (styleTags.length == 0) {
    var newStyleTag = document.createElement("style");
    newStyleTag.innerHTML = content;
    document.body.appendChild(newStyleTag);
    } else {
    styleTags[0].innerHTML += content;
    }
})();