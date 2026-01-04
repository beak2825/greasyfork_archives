// ==UserScript==
// @name         Bind right click to tab
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Bind right click to tab ez
// @author       master2500
// @match        http*://astr.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401209/Bind%20right%20click%20to%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/401209/Bind%20right%20click%20to%20tab.meta.js
// ==/UserScript==
document.addEventListener('contextmenu', () => {
  document.dispatchEvent(new KeyboardEvent("keydown", {keyCode: 9}))
  document.dispatchEvent(new KeyboardEvent("keyup",   {keyCode: 9}))
})