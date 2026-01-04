// ==UserScript==
// @name         Delete Notify DOT
// @namespace    https://telegra.ph/i-like-FGO-03-29
// @version      0.1
// @description  delete notify dot. i hete that dot.
// @author       c2tr
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462843/Delete%20Notify%20DOT.user.js
// @updateURL https://update.greasyfork.org/scripts/462843/Delete%20Notify%20DOT.meta.js
// ==/UserScript==

(function() {
    setInterval(()=>{
        if (document.querySelector("[aria-label=\"アカウントメニュー\"] > div > div:nth-child(2)") !== null) {
            document.querySelector("[aria-label=\"アカウントメニュー\"] > div > div:nth-child(2)").remove();
            console.log("delete notify dot!")
        }
    }, 30)
})();