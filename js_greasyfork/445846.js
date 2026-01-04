// ==UserScript==
// @name         AO3: [Wrangling] Jump to Page!
// @description  Adds button to let you jump to a certain page of tag results!
// @version      1.0.1

// @author       owlwinter
// @namespace    N/A
// @license      MIT license

// @match        *://*.archiveofourown.org/tags/*/wrangle?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445846/AO3%3A%20%5BWrangling%5D%20Jump%20to%20Page%21.user.js
// @updateURL https://update.greasyfork.org/scripts/445846/AO3%3A%20%5BWrangling%5D%20Jump%20to%20Page%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const change_page = function change_page(a) {
        const old_page = new URL(window.location);
        const search = old_page.searchParams;
        search.set("page", a);
        old_page.search = "?" + search.toString();
        window.location = old_page.toString();
    }

    const nextbuttons = document.querySelectorAll("li.next");
    for (let a of nextbuttons) {
        const form = document.createElement("form")
        const textbox = document.createElement("input");
        textbox.type = "text";
        textbox.style.paddingLeft = "5px";
        textbox.style.paddingRight = "5px";
        textbox.style.marginLeft = "10px";
        textbox.style.width = "50px";
        textbox.style.textAlign = "center"
        textbox.placeholder = "Jump";
        form.appendChild(textbox)
        form.addEventListener("submit", (e) => { e.preventDefault(); change_page(textbox.value)});
        a.parentElement.appendChild(form);
    }
})();