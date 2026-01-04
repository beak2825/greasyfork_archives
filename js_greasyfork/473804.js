// ==UserScript==
// @name         Now Week
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add the color to JPREP's Dashboard.
// @author       You
// @match        https://portal.jprep.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jprep.jp
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473804/Now%20Week.user.js
// @updateURL https://update.greasyfork.org/scripts/473804/Now%20Week.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const elements = Array.from(document.querySelectorAll('.nav-item.tab_level_0'));
    const dates = elements.map((element) => {
        const content = element.textContent.match(/Week [0-9]+ \((.*)\-(.*)\)/);
        if(content)
            return [new Date(content[1]), new Date(content[2])];
        else
            return false;
    });
    dates.forEach((date, index) => {
        let today = new Date();
        today.setYear(2001);
        if (date[0] <= today && today <= date[1]) {
            elements[index].querySelector('a').style = "background: yellow;";
        }
    })
})();