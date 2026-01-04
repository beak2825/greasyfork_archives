// ==UserScript==
// @name         public Oxygen u Key System Bypasser
// @version      1.0
// @description  Bypass the Oxygen u Key System
// @author       nonculturedperson / dindin
// @match        *://lootlinks.co/*
// @match        *://oxygenu.xyz/*
// @license      lol
// @namespace    https://greasyfork.org/en/users/1242451
// @downloadURL https://update.greasyfork.org/scripts/483785/public%20Oxygen%20u%20Key%20System%20Bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/483785/public%20Oxygen%20u%20Key%20System%20Bypasser.meta.js
// ==/UserScript==
 
 
(function() {
    'use strict';
 
    const redirectMap = {
        "https://lootlinks.co/s?dmC0": "oxygenu.xyz/KeySystem/Check1.php",
        "https://lootlinks.co/s?dmC1": "oxygenu.xyz/KeySystem/Main.php",
        "https://oxygenu.xyz/KeySystem/Check1.php": "lootlinks.co/s?dmC1",
    };
 
    const currentURL = window.location.href;
 
    if (currentURL in redirectMap) {
        window.location.replace(`https://${redirectMap[currentURL]}`);
    }
})();