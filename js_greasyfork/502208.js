// ==UserScript==
// @name         Block Ad Animevietsub
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Demo Block Ad Animevietsub @license MIT2
// @author       pvq2k2
// @match        https://*.animevietsub.app/*
// @grant        GM_log
// @icon         https://www.google.com/s2/favicons?sz=64&domain=animevietsub.app
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502208/Block%20Ad%20Animevietsub.user.js
// @updateURL https://update.greasyfork.org/scripts/502208/Block%20Ad%20Animevietsub.meta.js
// ==/UserScript==
let allCenterElement = document.querySelectorAll("center");
let pcCatfixxElement = document.querySelector(".pc-catfixx");
(function() {
    'use strict';
    pcCatfixxElement.style.display = "none";
    for (let i = 0; i < allCenterElement.length; i++) {
        allCenterElement[i].style.display = "none";
    }
})();