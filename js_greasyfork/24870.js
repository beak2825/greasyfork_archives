// ==UserScript==
// @name         WazeWrapBeta
// @namespace    https://greasyfork.org/users/30701-justins83-waze
// @version      2023.03.14.03
// @description  A base library for WME script writers
// @author       JustinS83/MapOMatic
// @include      https://beta.waze.com/*editor*
// @include      https://www.waze.com/*editor*
// @exclude      https://www.waze.com/*user/editor/*
// @grant        none
// ==/UserScript==

/* global WazeWrap */
/* global $ */
/* jshint esversion:6 */

var WazeWrap = {};

(function() {
    'use strict';
    const MIN_VERSION = '2019.05.01.01';
    const WW_URL = 'https://cdn.jsdelivr.net/gh/WazeDev/WazeWrap@2023.03.14.04/WazeWrapLib.js';

    async function init(){
        const sandboxed = typeof unsafeWindow !== 'undefined';
        const pageWindow = sandboxed ? unsafeWindow : window;
        const wwAvailable = pageWindow.WazeWrap && (!pageWindow.WazeWrap.Version || pageWindow.WazeWrap.Version > MIN_VERSION);

        if (wwAvailable) {
            WazeWrap = pageWindow.WazeWrap;
        } else {
            pageWindow.WazeWrap = WazeWrap;
        }
        if (sandboxed) window.WazeWrap = WazeWrap;
        if (!wwAvailable) await $.getScript(WW_URL);
    }
    
    function bootstrap(tries = 1) {
        if (typeof $ != 'undefined')
            init();
        else if (tries < 1000)
            setTimeout(function () { bootstrap(tries++); }, 100);
        else
            console.log('WazeWrap launcher failed to load');
    }
    
    bootstrap();
    
})();
