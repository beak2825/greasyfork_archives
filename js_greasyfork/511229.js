// ==UserScript==
// @name         Grundos Cafe Fetch! Keyboard Controls
// @namespace     https://greasyfork.org/en/users/1291562-zarotrox
// @version      0.1
// @description  Add keyboard navigation for Fetch!
// @author       Zarotrox
// @match        https://www.grundos.cafe/games/fetch/*
// @icon         https://i.ibb.co/44SS6xZ/Zarotrox.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511229/Grundos%20Cafe%20Fetch%21%20Keyboard%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/511229/Grundos%20Cafe%20Fetch%21%20Keyboard%20Controls.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Listen for keydown events
    document.addEventListener('keydown', function(event) {
        switch(event.key) {
            case "ArrowUp":
                var northArea = document.querySelector('area[onclick="goNorth()"]');
                if (northArea) {
                    goNorth();  // Trigger the goNorth function
                }
                break;
            case "ArrowDown":
                var southArea = document.querySelector('area[onclick="goSouth()"]');
                if (southArea) {
                    goSouth();  // Trigger the goSouth function
                }
                break;
            case "ArrowLeft":
                var westArea = document.querySelector('area[onclick="goWest()"]');
                if (westArea) {
                    goWest();  // Trigger the goWest function
                }
                break;
            case "ArrowRight":
                var eastArea = document.querySelector('area[onclick="goEast()"]');
                if (eastArea) {
                    goEast();  // Trigger the goEast function
                }
                break;
        }
    });
})();
