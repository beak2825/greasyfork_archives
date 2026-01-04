// ==UserScript==
// @name         Copy Password
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Can copy password in ***
// @author       You
// @match        *://*/*
// @icon         https://lh3.googleusercontent.com/_gTzBYiTeDAzp2Z12gfT-iiyfYnSTFd_VCd8E3GhdMykKazFkHFGzMGdN09Kl60TYNdo1Nvrnk9mnjPSOVecHNQlsA=s256-rw
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451764/Copy%20Password.user.js
// @updateURL https://update.greasyfork.org/scripts/451764/Copy%20Password.meta.js
// ==/UserScript==

(function () {
  function isMac() {
    return /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent);
  }

  let copyModifierKey = isMac() ? "Meta" : "Control";
  let isCopyModifierKeyDown = false;

  window.addEventListener("keydown", (event) => {
    if (event.key === copyModifierKey) {
      isCopyModifierKeyDown = true;
    } else if (isCopyModifierKeyDown && event.key === "c") {
      if (document.activeElement.type === "password" && document.activeElement.value !== "") {
        navigator.clipboard.writeText(document.activeElement.value);
      }
    }
  });
  window.addEventListener("keyup", (event) => {
    if (event.key === copyModifierKey) {
      isCopyModifierKeyDown = false;
    }
  });
})();
