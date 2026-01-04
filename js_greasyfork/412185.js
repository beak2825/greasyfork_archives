// ==UserScript==
// @name         Moodle: Jump to Current Section
// @version      0.1
// @description  Userscript for Moodle sites that lets you quickly jump to the current week/section. Made for the Boost and Fordson themes.
// @author       dotcomboom
// @match        *://*/course/view.php?id=*
// @grant        none
// @namespace https://greasyfork.org/en/users/691054-dotcomboom
// @downloadURL https://update.greasyfork.org/scripts/412185/Moodle%3A%20Jump%20to%20Current%20Section.user.js
// @updateURL https://update.greasyfork.org/scripts/412185/Moodle%3A%20Jump%20to%20Current%20Section.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // config
    const jump_on_page_load = true; // whether to jump when page first loads
    const navbar = true; // whether to add button to top navbar
    //-----------

    const c = document.getElementsByClassName("current")[1];
    // index 0 is your user avatar, index 1 is the highlighted/current section if the course has one

    if (c) { // check if there is one
        if (jump_on_page_load) {
            c.scrollIntoView();
        }

        if (navbar) {
            const btn = document.createElement("li");
            const link = document.createElement("a");
            const ltext = document.createTextNode("Current Section");

            btn.classList.add("nav-item");
            link.classList.add("nav-link");
            link.href = "javascript:void(0)";
            link.addEventListener("click", () => { c.scrollIntoView() });

            link.appendChild(ltext);
            btn.appendChild(link);
            document.querySelector(".navbar-nav").appendChild(btn);
        }
    }
})();