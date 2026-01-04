// ==UserScript==
// @name         Edit Text On Webpage
// @namespace    http://tampermonkey.net/
// @version      1.4.0
// @description  A script that enables you to edit Text on ANY webpage.
// @author       Cracko298
// @icon         https://static.thenounproject.com/png/317376-200.png
// @match        *://*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453858/Edit%20Text%20On%20Webpage.user.js
// @updateURL https://update.greasyfork.org/scripts/453858/Edit%20Text%20On%20Webpage.meta.js
// ==/UserScript==

document.addEventListener('keydown', function(event) {
  if (event.keyCode === 112) {
    document.designMode='on'
    console.log("Enabled Design Mode.")
  }
  if (event.keyCode === 113) {
    document.designMode='off'
    console.log("Disabled Design Mode.")
  }
});
