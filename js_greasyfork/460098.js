// ==UserScript==
// @name         Fandom auto Dark Mode switcher
// @namespace    https://github.com/Artemis-chan
// @version      1.1
// @description  Automatially redirects to dark mode on fandom wikis
// @author       You
// @match        *.fandom.com/wiki/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fandom.com
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460098/Fandom%20auto%20Dark%20Mode%20switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/460098/Fandom%20auto%20Dark%20Mode%20switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var butt = document.getElementsByClassName("wiki-tools__theme-switch")[0];
    if(butt.title == "Dark Theme")
    {
        console.log("Redirecting to Dark Mode");
        butt.click();
        const retries = 5;
        for(var i = retries; i > 0; --i)
        {
            setTimeout(() => {
                console.log("Retrying dark mode switch");
                butt.click();
            }, 1000 * i);
        }
        setTimeout(() => console.logwarning("Dark mode switch failed"), (retries + 1) * 1000);
    }
})();