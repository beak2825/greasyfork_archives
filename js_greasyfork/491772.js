// ==UserScript==
// @name         omc_simple_like_buttons
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  OMC の問題ページの Like ボタンを目立たなくします
// @author       tamuraup
// @match        https://onlinemathcontest.com/contests/*/tasks/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491772/omc_simple_like_buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/491772/omc_simple_like_buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let container=document.querySelector(".bookmark-container");
    container.querySelector(".dropdown-toggle").remove();
    container.style.wdith="100%";
    container.style.display="flex";
    container.style.justifyContent="flex-end";
    container.style.margin="0";
    let outer_container=document.querySelector("challenge-container");
    container.remove();
    outer_container.prepend(container);
    // remove writer
    let wp=Array.from(document.querySelector("challenge-container").querySelectorAll("p").values()).filter(x=>x.textContent.match(/\s*Writer:/));
    if(wp.length>0)wp[0].remove();

})();