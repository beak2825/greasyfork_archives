// ==UserScript==
// @name         animepahe scroll to player
// @namespace    https://jinpark.net/
// @version      0.1.2
// @description  Automatically scrolls to the player and activates player to get ready for playback.
// @author       Jin
// @match        https://animepahe.com/play/*
// @match        https://animepahe.org/play/*
// @match        https://animepahe.ru/play/*
// @icon         https://www.google.com/s2/favicons?domain=animepahe.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428271/animepahe%20scroll%20to%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/428271/animepahe%20scroll%20to%20player.meta.js
// ==/UserScript==
 
/* jshint esversion:6 */
 
(function() {
    'use strict';
    window.onload = (event) => {
        var d = document.querySelectorAll('div.embed-responsive.embed-responsive-16by9')[0];
        var l = document.querySelectorAll('div.click-to-load')[0];
        d.scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center'
        });
        l.click();
    }
})();