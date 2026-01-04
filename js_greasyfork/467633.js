// ==UserScript==
// @name         Esporty - ivibets
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Přesměruje do správné live url pro přidávání - nemusí se přepisovat ručně
// @author       Jarda Kořínek
// @match        https://ivibets.org/cz/prematch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ivibet1.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467633/Esporty%20-%20ivibets.user.js
// @updateURL https://update.greasyfork.org/scripts/467633/Esporty%20-%20ivibets.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const newUrl = location.href.replace("prematch", "live");

    location.href = newUrl;
})();