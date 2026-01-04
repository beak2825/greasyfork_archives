// ==UserScript==
// @name         d4builds map enhancement
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @license      GPL
// @description  makes adjustments to the layout so items fit better. this is mostly for the map but helps the other areas as well.
// @author       uselessartifact
// @include      https://d4builds.gg/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=d4builds.gg
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/469674/d4builds%20map%20enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/469674/d4builds%20map%20enhancement.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var waitForMap = setInterval(function() {
        if ($('.app__header__wrapper')) {
            $('div.app__toolbar, div.app__header').css({"height":"45px"});
            $('div.countdown').after($('div.navigation'));
            $('div.app__navigation').css({"display":"none"});
            $('div.app__header__wrapper').css({"justify-content":"space-between","width":"100%"});
            $('header.app__header').css("margin-bottom","0px");
            $('section.mapbox').css({"top":"45px","height":"95.3vh"});
            $('div.map-sidebar').css({"width":"345px"});
            $('div.leaflet-container').css({"margin-left":"345px","width":"calc(100% - 345px)","height":"calc(100vh - 45px)"});
            //$('');
            clearInterval(waitForMap);
        }
    },1200);

})();