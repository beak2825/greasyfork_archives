// ==UserScript==
// @name         RotateImage
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a button to rotate images when they are opened in the browser.
// @author       idjawoo
// @include      *.jpg
// @include      *.png
// @include      *.gif
// @icon         https://cdn.discordapp.com/attachments/816751871896453120/920381149484822590/unknown.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437049/RotateImage.user.js
// @updateURL https://update.greasyfork.org/scripts/437049/RotateImage.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let button = document.createElement("div")
    button.innerHTML = `<img width="100%" height="100%" margin="0px" padding="0px" src="https://cdn.discordapp.com/attachments/816751871896453120/920388895462547476/rotation.png"></img>`
    let body = document.evaluate("/html/body", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue

    button.style.cursor = "pointer"
    button.style.position = "absolute"
    button.style.margin = "20px"
    button.style.width = "40px"
    button.style.height = "40px"
    button.style.background = "#fff"
    button.style.padding = "5px"
    button.style.borderRadius = "10px"
    button.style.transition = "0.2s ease-in-out"
    button.style.boxShadow = "inset 0 0 4px rgba(0, 0, 0, 0.5)"

    button.onmouseenter = () => {button.style.boxShadow = "inset 0 0 8px rgba(0, 0, 0, 1)"}
    button.onmouseleave = () => {button.style.boxShadow = "inset 0 0 4px rgba(0, 0, 0, 0.8)"}

    let image = document.evaluate("html[1]/body[1]/img[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
    let degrees = 0

    function applyStyle() {
        image.style.transform = String(`rotate(${String(degrees)}deg)`)
    }

    button.addEventListener ("click", () => {
        degrees += 90
        applyStyle()
    }, false);

    let callback = function(m) {
        applyStyle()
    }

    let observer = new MutationObserver(callback)
    observer.observe(image, {attributes: true, childList: true})
    body.appendChild(button)
})();