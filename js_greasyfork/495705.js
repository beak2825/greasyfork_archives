// ==UserScript==
// @name        Bring Them Home
// @license MIT
// @namespace   Violentmonkey Scripts
// @match       https://sass-lang.com/*
// @grant       none
// @version     1.0
// @author      Dovid Weisz
// @description Replace the Horible "Free Palestine" Banner with ✡Am Yisrael CHAI✡
// @downloadURL https://update.greasyfork.org/scripts/495705/Bring%20Them%20Home.user.js
// @updateURL https://update.greasyfork.org/scripts/495705/Bring%20Them%20Home.meta.js
// ==/UserScript==


Array.from(document.querySelectorAll(".sl-c-alert")).filter(node => node.innerText.match(/free palestine/i)).forEach(node => {
    node.innerHTML = "<strong>✡Am Yisrael CHAI✡</strong>"
    node.setAttribute("style", node.getAttribute("style").replace("black", "blue"));
})