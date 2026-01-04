// ==UserScript==
// @name        amongus.com
// @namespace   Violentmonkey Scripts
// @match       https://example.com/
// @grant       none
// @version     1.0
// @author      -
// @description 9/21/2022, 3:41:32 PM
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/451783/amonguscom.user.js
// @updateURL https://update.greasyfork.org/scripts/451783/amonguscom.meta.js
// ==/UserScript==
document.body.style.backgroundColor = "#ff0000"
document.body.querySelector("body div").style.backgroundColor = "#00ffff"
document.body.querySelector("body div").querySelector("h1").innerText = "Example Impostor"
document.body.querySelector("body div").querySelector("p").innerText = "This domain is for use in finding the impostor. You may use this to find the imposter."
document.getElementsByTagName("a").item(0).href = "https://www.google.com/search?q=among+us&tbm=isch"