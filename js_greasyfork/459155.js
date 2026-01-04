// ==UserScript==
// @name         OpenSpotify-For-Mobile
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Make spotify web player working on mobile device.
// @run-at       document-start
// @author       dev-angelist
// @include      http*://open.spotify.com/*
// @license      MIT; https://opensource.org/licenses/MIT
// @copyright    2020, dev-angelist
// @grant        none
// @namespace    https://greasyfork.org/en/scripts/459155-openspotify-for-mobile
// @downloadURL https://update.greasyfork.org/scripts/459155/OpenSpotify-For-Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/459155/OpenSpotify-For-Mobile.meta.js
// ==/UserScript==
// Simple script that permits you to simulate desktop vs on your
// mobile phone and run open spotify free.
(
 function () {
 
    'use strict';
    let _scr = {};
 
    for (const key in window.screen) {
        _scr[key] = window.screen[key];
    }
    
    //Setting display size

    Object.setPrototypeOf(_scr, Object.getPrototypeOf(window.screen));
    
    _scr.width = 1080;
    _scr.height = 1920;
 
    window.screen = _scr;
 
 } 
 
)();