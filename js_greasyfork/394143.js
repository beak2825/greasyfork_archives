// ==UserScript==
// @name         Agma XMAS Script
// @namespace    Agma XMAS Script
// @version      1.0.3
// @description  XMAS / Winter Script for Agma - making Agma look pretty for Christmas / winter!
// @author       Samira
// @license      MIT
// @match        *://agma.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394143/Agma%20XMAS%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/394143/Agma%20XMAS%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Transparent: 'https://i.imgur.com/iizFYrk.png'
    var coinImageWhite = new Image(128, 128);
    coinImageWhite.src = 'https://i.imgur.com/1XjyHaC.png'; // 'https://i.imgur.com/Ryex01c.png';
    var coinImageBlack = new Image(128, 128);
    coinImageBlack.src = 'https://i.imgur.com/1XjyHaC.png'; // 'https://i.imgur.com/t8DE0aV.png';

    var rawSettings = localStorage.getItem('settings');
    var settings = JSON.parse(rawSettings);

    var originalDrawImage = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function (image, sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY, targetWidth, targetHeight) {
        if ((image.src != undefined)) {
            // Detect virus
            //if ((image.src == 'http://agma.io/img/store/virus3.png')) {
            //    arguments[0] = coinImageWhite;
            //}
            // Detect coin - small version and big version
            if (image.src == 'http://agma.io/skins/objects/9_lo.png?v=1' || image.src == 'http://agma.io/skins/objects/9.png?v=1'
               || image.src == 'https://agma.io/skins/objects/9_lo.png?v=1' || image.src == 'https://agma.io/skins/objects/9.png?v=1') {
                if (settings.sDark) {
                    arguments[0] = coinImageBlack;
                } else {
                arguments[0] = coinImageWhite;
                }
            }
        }

        return originalDrawImage.apply(this, arguments);
    }

    console.log('🎄 XMAS script loaded');
})();