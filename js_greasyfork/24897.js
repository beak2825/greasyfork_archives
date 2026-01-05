// ==UserScript==
// @name         myHomework Ad removal
// @namespace    https://www.mzimmer.net/
// @version      1.0.1
// @description  Removes ads on myhomework.com and and allows display of third column
// @author       Michel Zimmer <mzimmer@uni-bremen.de> (https://www.mzimmer.net)
// @match        https://myhomeworkapp.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24897/myHomework%20Ad%20removal.user.js
// @updateURL https://update.greasyfork.org/scripts/24897/myHomework%20Ad%20removal.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("body").removeClass("hasAds");
    $(".ads-col").hide();
})();
