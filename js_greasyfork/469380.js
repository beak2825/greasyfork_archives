// ==UserScript==
// @name         Invidious maximized video
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Maximizes the video in Insidous for YouTube to use the entire width of the browser window.
// @author       Magusbear
// @license MIT
// @match        http*://*.vern.cc/*
// @match        http*://inv.vern.cc/*
// @match        http*://*.vern.cc/*
// @match        http*://inv.vern.cc/*
// @match        http*://inv.bp.projectsegfau.lt/*
// @match        http*://inv.odyssey346.dev/*
// @match        http*://inv.riverside.rocks/*
// @match        http*://invidious.baczek.me/*
// @match        http*://invidious.epicsite.xyz/*
// @match        http*://invidious.esmailelbob.xyz/*
// @match        http*://invidious.flokinet.to/*
// @match        http*://invidious.lidarshield.cloud/*
// @match        http*://invidious.nerdvpn.de/*
// @match        http*://invidious.privacydev.net/*
// @match        http*://invidious.snopyta.org/*
// @match        http*://invidious.tiekoetter.com/*
// @match        http*://invidious.weblibre.org/*
// @match        http*://iv.melmac.space/*
// @match        http*://vid.puffyan.us/*
// @match        http*://watch.thekitty.zone/*
// @match        http*://y.com.sb/*
// @match        http*://yewtu.be/*
// @match        http*://yt.artemislena.eu/*
// @match        http*://yt.funami.tech/*
// @match        http*://yt.oelrichsgarcia.de/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vern.cc
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469380/Invidious%20maximized%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/469380/Invidious%20maximized%20video.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var elements = document.querySelectorAll('.pure-u-md-20-24, .pure-u-md-5-6');
    var playerContainer = document.getElementById('player-container');
    var playerDimensions = document.getElementById('player');

    playerContainer.style.marginLeft = '0px';
    playerContainer.style.marginRight = '0px';
    playerContainer.style.marginTop = '10%';
    playerContainer.style.setProperty('padding-bottom', '55%', 'important');
    playerDimensions.style.setProperty('padding-top', '56.3%', 'important');

    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        // Set the width to 100%
        element.style.width = '100%';

    }
})();