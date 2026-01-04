// ==UserScript==
// @name         Wiki Sticky Table Headings
// @namespace    https://greasyfork.org/en/users/46159-tom-burris2
// @version      0.1
// @description  Makes table headings stick to the top of the screen on wikipedia
// @author       Tom Burris
// @match        https://*.wikipedia.org/wiki/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407687/Wiki%20Sticky%20Table%20Headings.user.js
// @updateURL https://update.greasyfork.org/scripts/407687/Wiki%20Sticky%20Table%20Headings.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const enableSticky = table => {
        let ths = table.getElementsByTagName("th");
        for (const th of ths) {
            th._bounds = th.getBoundingClientRect();
            th.style.position = "sticky";
            th.style.top = `${th._bounds.top - table._bounds.top}px`;
        }
        table._isSticky = true;
    };
    const disableSticky = table => {
        let ths = table.getElementsByTagName("th");
        for (const th of ths) th.style.top = "unset";
        table._isSticky = false;
    };

    const onscroll = event => {
        let tables = document.getElementsByTagName("table");
        for (const table of tables) {
            let bounds = table._bounds = table.getBoundingClientRect();
            const shouldBeSticky = bounds.top < 0 && -bounds.top < bounds.height;
            if (shouldBeSticky != table._isSticky)
                (shouldBeSticky ? enableSticky : disableSticky)(table);
        }
    };

    document.addEventListener("scroll", onscroll);
})();