// ==UserScript==
// @name         Prevent Right-Click Context Menu Hijaak
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.0.2
// @license      AGPLv3
// @author       jcunews
// @description  Prevent websites from entirely disable web browser's Right-Click context menu by allowing use of SHIFT+RightClick, CTRL+RightClick, or CTRL+SHIFT+RightClick (configurable in the script code). This script is designed for Chrome and Chromium based web browsers. Firefox already has this feature built in via SHIFT+RightClick.
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/387540/Prevent%20Right-Click%20Context%20Menu%20Hijaak.user.js
// @updateURL https://update.greasyfork.org/scripts/387540/Prevent%20Right-Click%20Context%20Menu%20Hijaak.meta.js
// ==/UserScript==

(() => {
  //=== CONFIGURATION BEGIN ===

  //At least either SHIFT or CTRL should be set to true. 
  let useShift = true;
  let useCtrl  = false;

  //=== CONFIGURATION END ===

  let epd = Event.prototype.preventDefault;
  Event.prototype.preventDefault = function() {
    if (this.type === "contextmenu") {
      if (((useShift && this.shiftKey) && (useCtrl && this.ctrlKey)) || (useShift && this.shiftKey) || (useCtrl && this.ctrlKey)) return;
    }
    return epd.apply(this, arguments);
  };
})();
