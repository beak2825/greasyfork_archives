// ==UserScript==
// @name         typeracer.com - Any Car Picture
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Use any picture as your car without a premium account! The picture should be 58x24 px, or different size with the same aspect ratio.
// @author       Balint Sotanyi
// @match        https://play.typeracer.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/420877/typeracercom%20-%20Any%20Car%20Picture.user.js
// @updateURL https://update.greasyfork.org/scripts/420877/typeracercom%20-%20Any%20Car%20Picture.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var interval = setInterval(function() {

        var image_url = 'https://i.imgur.com/QIGSs8p.png'; // paste your image link here

        var my_car = document.querySelector('.avatar-self > .avatarContainer');
        if (my_car) {
                document.querySelector('.avatar-self > .avatarContainer').style.backgroundImage = `url('${image_url}')`;
        }
    }, 100);
})();