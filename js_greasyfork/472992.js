// ==UserScript==
// @name         old google Favicon
// @namespace    https://churro.net
// @version      0.1
// @description  old google.
// @author       Churro
// @match        https://www.google.com/*
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472992/old%20google%20Favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/472992/old%20google%20Favicon.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //Change @match and add another site to change that sites favicon example:
    // @match        https://stackoverflow.com

    const favicon = document.querySelector("link[rel='shortcut icon']");
    [favicon, ...document.querySelectorAll("link[rel='icon']")].forEach(favicon => {
        favicon.remove();
    })
    console.log("Favicon Removed");

    const clone = favicon.cloneNode();
    //Change link to whatever image you want to change the favicon to that image.
    clone.href = "https://www.favicon.cc/?action=icon&file_id=837778";
    document.head.appendChild(clone);
})();