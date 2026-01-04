// ==UserScript==
// @name         RANDOM FOR RYM GENRES
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  IT WORKS. DON'T ASK WHY.
// @author       WHO
// @match        https://rateyourmusic.com/genre/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rateyourmusic.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468451/RANDOM%20FOR%20RYM%20GENRES.user.js
// @updateURL https://update.greasyfork.org/scripts/468451/RANDOM%20FOR%20RYM%20GENRES.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const maxelem = document.getElementsByClassName("ui_pagination_btn ui_pagination_number")
    const maxInt = parseInt(maxelem[maxelem.length-1].innerHTML)
    let botoncito2 = document.createElement("a");
    botoncito2.innerHTML = "GO TO RANDOM ENTRY IN PAGE";
    botoncito2.onclick = () => {
        const entries = document.getElementsByClassName("component_discography_item")
        let random = Math.floor(Math.random() * entries.length-1)
        const selected = entries[random].getElementsByTagName('a')[0]
        selected.click()
    }
    let wrapper = document.createElement("div")
    wrapper.style.display = "flex";
    wrapper.style["flex-direction"] = "column";

    let botoncito = document.createElement("a");
    botoncito.innerHTML = "GO TO RANDOM PAGE";
    botoncito.onclick = () => {
        let random = Math.floor(Math.random() * maxInt);
        let HREF = window.location.href;
        if (HREF.match(/\d+\/?$/)) {
            HREF = HREF.replace(/\/\d+?\/?$/, "/"+random);
        }
        else {
            HREF = HREF + "/" + random;}
        window.location.href = HREF;
    }
    const banner = document.getElementsByClassName("component_discography_items_heading")[0]
    wrapper.appendChild(botoncito);
    wrapper.appendChild(botoncito2);
    banner.appendChild(wrapper);

})();