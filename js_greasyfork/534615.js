// ==UserScript==
// @name         Poki 游戏全屏/Poki game full screen
// @namespace    https://poki.com/
// @version      1.2
// @author       z6os
// @description  Maximize the poki game window and remove navigation bar
// @match        https://poki.com/en/g/*
// @match        https://poki.com/zh/g/*
// @grant        none
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534615/Poki%20%E6%B8%B8%E6%88%8F%E5%85%A8%E5%B1%8FPoki%20game%20full%20screen.user.js
// @updateURL https://update.greasyfork.org/scripts/534615/Poki%20%E6%B8%B8%E6%88%8F%E5%85%A8%E5%B1%8FPoki%20game%20full%20screen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var element = document.querySelector('#game-player');

    function makeElementFullScreen(element) {
        if (element) {
            element.style.position = 'fixed';
            element.style.top = '0';
            element.style.left = '0';
            element.style.width = '100vw';
            element.style.height = '100vh';
            element.style.margin = '0';
            element.style.padding = '0';
            element.style.zIndex = 3;
        }
    }

    makeElementFullScreen(element);

    // Hide specific UI elements
    var uiElements = document.querySelector('.J91n1ymJasoch_FZq89b');
    if (uiElements) {
        uiElements.style.display = 'none';
    }

    // Remove navigation bar
    var navBar = document.querySelector('nav#nav.qoMYGbBhf9dsbaBGBphh.DJT17TB5hYo14sdLEAwk');
    if (navBar) {
        navBar.remove();
    }

    // Select all matching ad elements
    var ads = document.querySelectorAll('.yqRHsCZfzhtS8CI82MRw');
    // Traverse each element and hide them
    ads.forEach(function(ad) {
        ad.style.display = 'none';
    });
})();