// ==UserScript==
// @name         Restore poa.st video-audio controls
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Restores default browser controls for audio/video elements for poa.st
// @author       kamehamic
// @match        https://poa.st/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=poa.st
// @grant        none
// @license GPLv2
// @downloadURL https://update.greasyfork.org/scripts/468509/Restore%20poast%20video-audio%20controls.user.js
// @updateURL https://update.greasyfork.org/scripts/468509/Restore%20poast%20video-audio%20controls.meta.js
// ==/UserScript==

//requires ublock origin (this script can probably be modified to do the ublock part... maybe in the future)
//lines for ublock (my filters section)
//poa.st##.active.video-player__controls
//poa.st##.audio-player__canvas

function func(){
    'use strict';
    var d = document.querySelectorAll("video:not([controls])");
    for (var i = 0; i < d.length; ++i)
    {
        //console.log(d[i].id);
        d[i].setAttribute("controls", "true");
    }
    var e = document.querySelectorAll("audio:not([controls])");
    for (var j = 0; j < e.length; ++j)
    {
        //console.log(e[j].id);
        e[j].setAttribute("controls", "true");
    }
}

setInterval(func, 2000);