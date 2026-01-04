// ==UserScript==
// @name         Discuz Real Image
// @namespace    null
// @version      0.1
// @description  Change image attachments of Discuz forums to real source. ES6 required.
// @author       You
// @match        *://*/forum.php?*
// @match        *://*/thread-*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367619/Discuz%20Real%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/367619/Discuz%20Real%20Image.meta.js
// ==/UserScript==

document.querySelectorAll('img[zoomfile]').forEach(e=>e.src = e.getAttribute('zoomfile'));