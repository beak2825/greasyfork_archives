// ==UserScript==
// @name             OpenAI Chat Copy Code Hotkey
// @namespace        https://userscript.snomiao.com/
// @version          0.0.1
// @description      Binds the "Alt+C" hotkey to find and click the HTML element with the text "Copy code" on chat.openai.com.
// @author           snomiao@gmail.com
// @match            https://chat.openai.com/*
// @grant            none
// @license          GPL-3.0+
// @contributionURL  https://snomiao.com/donate
// @supportURL       https://github.com/snomiao/userscript.js/issues
// @copyright        2017 - 2023, @snomiao <snomiao.com>
// @downloadURL https://update.greasyfork.org/scripts/465309/OpenAI%20Chat%20Copy%20Code%20Hotkey.user.js
// @updateURL https://update.greasyfork.org/scripts/465309/OpenAI%20Chat%20Copy%20Code%20Hotkey.meta.js
// ==/UserScript==

(function () {
  "use strict";

  document.addEventListener("keydown", function (event) {
    // Check if the pressed key is 'C' and the 'Alt' key is held down
    if (event.key === "c" && event.altKey) {
      // Prevent default action (if any)
      event.preventDefault();

      // Find the HTML element with the text "Copy code"
      const elements = [...document.getElementsByTagName("*")].reverse();
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (element.textContent === "Copy code") {
          // Simulate a click event on the element
          element.click();
          break;
        }
      }
    }
  });
})();
