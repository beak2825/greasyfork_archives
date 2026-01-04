// ==UserScript==
// @name         Cartel Empire - Remove Custom Chat Colors
// @namespace    baccy.ce
// @version      0.1
// @description  Replaces all custom color class text colors with white text. This replaces these colors globally and not just in chat.
// @author       Baccy
// @match        https://*.cartelempire.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cartelempire.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533634/Cartel%20Empire%20-%20Remove%20Custom%20Chat%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/533634/Cartel%20Empire%20-%20Remove%20Custom%20Chat%20Colors.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = '.orangeName { color: white !important; } .purpleName { color: white !important; } .blueName { color: white !important; } .greenName { color: white !important; } .aquaName { color: white !important; } .gradorangeName { color: white !important; } .gradpurpleName { color: white !important; } .gradblueName { color: white !important; } .gradgreenName { color: white !important; } .gradaquaName { color: white !important; } .rainbowName { color: white !important; } .goldenName { color: white !important; }';
    document.head.appendChild(style);

    // Remove /* */ if you want to also remove staff colors
    /*
    const staff = document.createElement('style');
    staff.textContent = '.AdministratorHighlight { color: white !important; } .DeveloperHighlight { color: white !important; } .ModeratorHighlight { color: white !important; }';
    document.head.appendChild(staff);
    */
})();