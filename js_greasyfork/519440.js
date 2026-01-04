// ==UserScript==
// @name        Lazy Loading Image Replacer
// @namespace   Violentmonkey Scripts
// @match       https://mangapill.com/chapters/*/*
// @grant       none
// @version     1.0
// @author      a0fefd
// @description 12/11/2024, 11:27:58
// @downloadURL https://update.greasyfork.org/scripts/519440/Lazy%20Loading%20Image%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/519440/Lazy%20Loading%20Image%20Replacer.meta.js
// ==/UserScript==
let stuff = document.getElementsByTagName("picture");
let stuff2 = [];
for (let i = 0; i < stuff.length; i++) {
    let src = stuff[i].children[0].getAttribute("data-src");
    stuff2[i] = document.createElement("img");
    stuff[i].appendChild(stuff2[i]);
    stuff2[i].src = src;
    stuff2[i].height = stuff[i].children[0].height;
    stuff2[i].width = stuff[i].children[0].width;
    stuff[i].children[0].remove();
}