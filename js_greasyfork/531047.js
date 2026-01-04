// ==UserScript==
// @name         One.com webmail width fix
// @namespace    http://tampermonkey.net/
// @version      2024-12-11
// @description  Fixes the stupid width issue of the first sidebar.
// @author       BramDriesen
// @match        https://mail.one.com/mail/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=one.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/531047/Onecom%20webmail%20width%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/531047/Onecom%20webmail%20width%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function (){
        // Enlarge the left sidebar.
        document.querySelector("#leftContainer").setAttribute("style", "width: 320px; max-width: 320px");
        document.querySelector("#leftContainer > div.panel1").setAttribute("style", "inset: 0px auto 0px 0px; max-width: 600px;");

        // Update all list labels.
        const elements = document.querySelectorAll(".folderList-label");
        elements.forEach(element => {
            element.setAttribute("style", "max-width: fit-content !important");
        });
    }, 1000);
})();