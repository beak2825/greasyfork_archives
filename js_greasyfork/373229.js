// ==UserScript==
// @name         Scroll to empty text box
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  Press F2 to scroll to an empty text box and focus it
// @author       Valacar
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373229/Scroll%20to%20empty%20text%20box.user.js
// @updateURL https://update.greasyfork.org/scripts/373229/Scroll%20to%20empty%20text%20box.meta.js
// ==/UserScript==

(function() {
  "use strict";

  // custom key. note: anything besides function keys may not work.
  // key code list: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code#Code_values
  const config = {
    key: "F2"
  };

  function findEmptyInput() {
    const inputs =
          document.querySelectorAll('textarea:not([readonly]),input[type="text"]:not([readonly])');
    for (let input of inputs) {
      if (input.value === "") {
        return input;
      }
    }
  }

  addEventListener("keydown", e => {
    if (e.defaultPrevented) {
      return;
    }
    if (e.code === config.key) {
      const emptyInput = findEmptyInput();
      if (emptyInput) {
        //console.debug(emptyInput);
        emptyInput.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest"
        });
        emptyInput.focus();
      }
    }
  });

})();
