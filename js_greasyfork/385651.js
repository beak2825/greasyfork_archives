// ==UserScript==
// @name         Show APM in singleplayer gamemodes
// @namespace    http://tampermonkey.net/
// @version      0.3
// @author       Oki, jez
// @description  Show APM in Ultra/Sprint/Cheese race/Survival
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385651/Show%20APM%20in%20singleplayer%20gamemodes.user.js
// @updateURL https://update.greasyfork.org/scripts/385651/Show%20APM%20in%20singleplayer%20gamemodes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function(){


if(typeof trim != "function"){var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}}

/**************************
   APM in singleplayer
**************************/

var loc=window.location.href
if(loc.endsWith("?play=5") || ~loc.indexOf("?play=3") || ~loc.indexOf("?play=1") || ~loc.indexOf("?play=4") || ~loc.indexOf("?play=2")){
        var readyGoFunc = Game['prototype']["readyGo"].toString()
        readyGoFunc = trim(readyGoFunc)+';this["GameStats"].get("APM").setLock(true);';
        Game['prototype']['readyGo'] = new Function(readyGoFunc);
}

    });
})();