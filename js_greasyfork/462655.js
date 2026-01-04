// ==UserScript==
// @name         google definition to lockie
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Defintion on google turns into lckie on load
// @author       Nick
// @match        https://www.google.com/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462655/google%20definition%20to%20lockie.user.js
// @updateURL https://update.greasyfork.org/scripts/462655/google%20definition%20to%20lockie.meta.js
// ==/UserScript==

document.title = document.title.replaceAll(document.getElementsByClassName("yKMVIe")[0].innerText, "lockie")
document.body.innerHTML = document.body.innerHTML.replaceAll(document.getElementsByClassName("yKMVIe")[0].innerText, "lockie")