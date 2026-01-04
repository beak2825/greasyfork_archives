// ==UserScript==
// @name         WazeWrap_laurent
// @namespace    https://greasyfork.org/fr/scripts/390913-wazewrap
// @version      2019.05.03.01
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
    const WW_URL = 'https://greasyfork.org/scripts/390912-wazewrap-site-suite/code/WazeWrap%20site_suite.js?';

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