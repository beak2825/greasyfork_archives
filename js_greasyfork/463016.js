// ==UserScript==
// @name         Lackadaisy - Friction Reduction
// @namespace    https://linktr.ee/towai
// @version      0.1
// @author       twi
// @license      https://cohost.org/lifning/post/1023282-bbhl-license-v1
// @description  try to make the page automatically scroll to where the comic is
// @match        https://www.lackadaisycats.com/comic.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lackadaisycats.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/463016/Lackadaisy%20-%20Friction%20Reduction.user.js
// @updateURL https://update.greasyfork.org/scripts/463016/Lackadaisy%20-%20Friction%20Reduction.meta.js
// ==/UserScript==

(function() {
    console.log("userscript loaded successfully");
    setTimeout(() => { window.scrollTo(0 , 236); }, 100);
})();