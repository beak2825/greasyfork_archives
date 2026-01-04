// ==UserScript==
// @name        Custom - xxx-image.com Direct Image
// @namespace   Violentmonkey Scripts
// @match       https://xxx-image.com/img-*
// @grant       none
// @version     1.1
// @author      KeratosAndro4590
// @description Redirects page to image file.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/481842/Custom%20-%20xxx-imagecom%20Direct%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/481842/Custom%20-%20xxx-imagecom%20Direct%20Image.meta.js
// ==/UserScript==

// Redirects the page to the image file
window.location.href = document.querySelector(".not-active");