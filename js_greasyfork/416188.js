// ==UserScript==
// @name         prts redirector
// @namespace    https://github.com/x94fujo6rpg/SomeTampermonkeyScripts
// @version      0.1
// @description  auto redirect to desktop version 
// @author       x94fujo6
// @match        http://prts.wiki/*
// @exclude      http://prts.wiki/index.php?title=*&mobileaction=toggle_view_desktop
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416188/prts%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/416188/prts%20redirector.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let link = window.location.href;

    if (!link.includes("prts.wiki/w/")) return;
    if (link.includes("toggle_view_desktop")) return;

    link = link.replace("http://prts.wiki/w/", "").split("/");

    let title = "";
    for (let index in link) {
        if (index == 0) {
            title += link[index];
        } else {
            title += `/${link[index]}`;
        }
    }

    window.location.href = `http://prts.wiki/index.php?title=${title}&mobileaction=toggle_view_desktop`;
})();