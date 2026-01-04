// ==UserScript==
// @name         Dribbble Profile Links
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Add profile links to the profile popup menu;
// @author       Fei Sun
// @match        https://dribbble.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dribbble.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471902/Dribbble%20Profile%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/471902/Dribbble%20Profile%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let menu=document.querySelector(".nav-v2-profile__menu");
    let maker=document.createElement("div");
    let baseURL=document.querySelector("[data-nav-event-clicked=Profile]").href;
    maker.innerHTML=`
                     <li class="nav-v2-profile__item"><a data-nav-event-clicked="Work" href="${baseURL}/shots" xt-marked="ok">Work</a></li>
                     <li class="nav-v2-profile__item"><a data-nav-event-clicked="Boosted Shots" href="${baseURL}/boosts" xt-marked="ok">Boosted Shots</a></li>
                     <li class="nav-v2-profile__item"><a data-nav-event-clicked="Collections" href="${baseURL}/collections" xt-marked="ok">Collections</a></li>
                     <li class="nav-v2-profile__item" style="padding-bottom:calc(var(--profile-item-gap) / 2);margin-bottom: calc(var(--profile-item-gap) / 2);border-bottom: 1px solid #e7e7e9;"><a data-nav-event-clicked="Liked Shots" href="${baseURL}/likes" xt-marked="ok">Liked Shots</a></li>

    `
    document.querySelector(".nav-v2-profile__menu").prepend(...Array.from(maker.children));

})();