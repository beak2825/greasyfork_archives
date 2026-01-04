// ==UserScript==
// @name         Vatvo, suong, vuive improve football watching
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Improve the space and disable chat box in those sites
// @author       github@vuongggggg
// @match        https://vuive.tv/*
// @match        https://vatvo.club/*
// @match        https://suong.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391630/Vatvo%2C%20suong%2C%20vuive%20improve%20football%20watching.user.js
// @updateURL https://update.greasyfork.org/scripts/391630/Vatvo%2C%20suong%2C%20vuive%20improve%20football%20watching.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // https://vuive.tv/*
    document.querySelector(".section-link-video .row .col-sm-8").setAttribute("class", "col-md-12")
    document.querySelector(".section-link-video .row .col-sm-4, .top-header").setAttribute("style", "display: none !important;")
})();