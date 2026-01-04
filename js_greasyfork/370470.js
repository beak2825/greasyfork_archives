// ==UserScript==
// @name         Anilist Banner Downloader
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  This script rips the top banner of the page on Anilist.co
// @author       DJ-TrainR3k
// @grant        none
// @match        https://anilist.co/*
// @run-at       context-menu
// @downloadURL https://update.greasyfork.org/scripts/370470/Anilist%20Banner%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/370470/Anilist%20Banner%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var getBanner = document.getElementsByClassName("banner")[0].style.backgroundImage;
    var url = getBanner.replace(/(url\(|\)|'|")/gi, '');
    window.open(url, '_blank');
})();