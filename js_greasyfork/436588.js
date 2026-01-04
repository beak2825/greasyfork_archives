// ==UserScript==
// @name         deleteelementsupermechs
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @license MIT
// @match        https://www.supermechs.com/*
// @icon         https://www.google.com/s2/favicons?domain=supermechs.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436588/deleteelementsupermechs.user.js
// @updateURL https://update.greasyfork.org/scripts/436588/deleteelementsupermechs.meta.js
// ==/UserScript==

function removeDummy(elem) {
    elem.parentNode.removeChild(elem);
    return false;
}



window.onload = function() {
    removeDummy(document.querySelector("div.fullscreen-bottom-frame-background"))
};