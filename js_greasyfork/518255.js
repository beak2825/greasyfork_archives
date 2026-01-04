// ==UserScript==
// @name         Remove placeholder text on Snapchat for Web
// @namespace    https://web.snapchat.com/
// @version      1.0
// @license      GPLv3
// @description  Remove the placeholder text on Snapchat for Web
// @author       xdpirate
// @match        https://web.snapchat.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=snapchat.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518255/Remove%20placeholder%20text%20on%20Snapchat%20for%20Web.user.js
// @updateURL https://update.greasyfork.org/scripts/518255/Remove%20placeholder%20text%20on%20Snapchat%20for%20Web.meta.js
// ==/UserScript==

new MutationObserver(function(event) {
    document.querySelectorAll("div[role='textbox']").forEach(elem => {
        let parsed = elem.getAttribute("parsed");
        if(parsed == null) {
            elem.setAttribute("parsed", true);
            elem.setAttribute("placeholder", "");
        }
    });
}).observe(document, {subtree: true, childList: true});