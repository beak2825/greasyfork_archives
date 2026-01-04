// ==UserScript==
// @name         Auto realod free serveur server.pro
// @namespace    https://greasyfork.org/fr/users/11667-hoax017
// @version      0.1
// @description  Auto clique on reload server
// @author       Hoax017
// @match        https://server.pro/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416480/Auto%20realod%20free%20serveur%20serverpro.user.js
// @updateURL https://update.greasyfork.org/scripts/416480/Auto%20realod%20free%20serveur%20serverpro.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let button = document.querySelector(".sidebar-desktop .margin-tiny a.action");
    if (button) {
        setTimeout(() => button.click(), 5000)
        setInterval(() => button.click(), 1000 * 60 * 50)
    }
})();