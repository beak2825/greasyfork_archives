// ==UserScript==
// @name         WaybackMachine BlogSpot remove Sensitve Content Warning
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Removes the Sensitve Content Warning from Blogspot pages that are saved in the WaybackMachine
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Blogger_icon.svg/800px-Blogger_icon.svg.png
// @author       Creepler13
// @match        https://web.archive.org/web/*/https://*.blogspot.com/*
// @downloadURL https://update.greasyfork.org/scripts/448017/WaybackMachine%20BlogSpot%20remove%20Sensitve%20Content%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/448017/WaybackMachine%20BlogSpot%20remove%20Sensitve%20Content%20Warning.meta.js
// ==/UserScript==

(function () {
    "use strict";

    setInterval((e) => {
        let iframe = document.getElementById("injected-iframe");
        if (iframe) iframe.style.visibility = "hidden";

        if (document.getElementById("removeAgeRestriction")) return;
        let styles = " body * {  visibility:visible;} ";
        let styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        styleSheet.id = "removeAgeRestriction";
        document.body.append(styleSheet);
    }, 100);
})();
