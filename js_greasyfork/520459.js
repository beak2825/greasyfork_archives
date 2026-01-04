// ==UserScript==
// @name         Twitch Title Fix
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  Recent Twitch UI change where title is above video player. This reverts that.
// @author       Nanakusa
// @match        https://www.twitch.tv/*
// @icon         https://static-cdn.jtvnw.net/jtv_user_pictures/6a277ac2-ed5f-4daf-bb27-5a605b69a1f2-profile_image-300x300.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520459/Twitch%20Title%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/520459/Twitch%20Title%20Fix.meta.js
// ==/UserScript==

function fixPosition() {
    const item = document.querySelector('.channel-root__upper-watch');
    const container = document.querySelector('.channel-info-content');
    const beforeDiv = container.querySelector("section");
    if (!item || !container || !beforeDiv) return;
    if (!container.querySelector(".channel-root__upper-watch"))
        container.insertBefore(item, beforeDiv);
    item.style.width = "100%";
};

window.addEventListener('load', () => {
    fixPosition();
});

fixPosition();

new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        fixPosition();        
    });
}).observe(document.body, { childList: true, subtree: true, attributes: true });
