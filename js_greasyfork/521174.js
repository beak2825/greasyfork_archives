// ==UserScript==
// @name     Lowes Credit Card Un-Saver
// @description Stop Lowes.com from saving your credit card without permission
// @version  1
// @grant    none
// @match https://www.lowes.com/checkout
// @run-at     document-end
// @namespace https://greasyfork.org/users/22981
// @downloadURL https://update.greasyfork.org/scripts/521174/Lowes%20Credit%20Card%20Un-Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/521174/Lowes%20Credit%20Card%20Un-Saver.meta.js
// ==/UserScript==
function do_uncheck() {
  console.log("Unchecking")
  document.getElementById("save-new-cc").checked = false;
  console.log("Unchecked")
}

window.setTimeout(do_uncheck, 1000)