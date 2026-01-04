// ==UserScript==
// @name         Aliexpress key scroll & autoclose
// @namespace    http://tampermonkey.net/
// @version      2023-12-21
// @description  Aliexpress key scroll
// @author       You
// @match        https://aliexpress.ru/item/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliexpress.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488503/Aliexpress%20key%20scroll%20%20autoclose.user.js
// @updateURL https://update.greasyfork.org/scripts/488503/Aliexpress%20key%20scroll%20%20autoclose.meta.js
// ==/UserScript==

document.addEventListener("keydown", function(event) {
    if (event.code == 'KeyZ') {
        window.scrollBy(0, -90)
    } else if (event.code == 'KeyC') {
        window.scrollBy(0, 90)
    }
})
document.addEventListener("contextmenu", (event) => {
    if(event.altKey) {
        event.preventDefault()
        window.stop()
    }
})