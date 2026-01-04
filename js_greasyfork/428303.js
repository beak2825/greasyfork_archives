// ==UserScript==
// @name         bikkuri donki-
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ^^
// @author       bikkuri~
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?domain=undefined.
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428303/bikkuri%20donki-.user.js
// @updateURL https://update.greasyfork.org/scripts/428303/bikkuri%20donki-.meta.js
// ==/UserScript==

 

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

 

function bikkuri(){
    const before = document.body.innerHTML
    const bikkuri_element = document.createElement("img")
    bikkuri_element.style.position = "absolute"
    bikkuri_element.style.top = "0"
    bikkuri_element.style.left = "0"
    bikkuri_element.style.width = "100vw"
    bikkuri_element.style.height = "100vh"
    bikkuri_element.src = "https://i.ytimg.com/vi/etMX5ULf0Fc/hqdefault.jpg"
    document.body.innerHTML = "";
    document.body.appendChild(bikkuri_element);
}

 

(function() {
    setInterval(() => {
        if(getRandomIntInclusive(0, 1000) === 666) bikkuri()
    }, 1000)
})();