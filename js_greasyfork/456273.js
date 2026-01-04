// ==UserScript==
// @name         ceskyflorbal.cz
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Detail automaticky přesměruje do správné live url pro přidávání
// @author       Jarda Kořínek
// @match        https://www.ceskyflorbal.cz/match/detail/default/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ceskyflorbal.cz
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456273/ceskyflorbalcz.user.js
// @updateURL https://update.greasyfork.org/scripts/456273/ceskyflorbalcz.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const newUrl = location.href.replace("default", "match");

    location.href = newUrl;
})();