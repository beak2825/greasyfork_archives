// ==UserScript==
// @name         CHI2021 playback speed adjust
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Use shift+. and shift+, (like Youtube) to change playback rate on CHI2021 videos
// @author       Tobias Lunte
// @match        https://acmchi.delegateconnect.co/talks/*
// @icon         https://www.google.com/s2/favicons?domain=delegateconnect.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426215/CHI2021%20playback%20speed%20adjust.user.js
// @updateURL https://update.greasyfork.org/scripts/426215/CHI2021%20playback%20speed%20adjust.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function onKeydown(evt) {
        var elem;
        if (evt.shiftKey && evt.keyCode == 190) {
            elem=document.getElementById('talkFeaturedPlayer_html5_api');
            elem.playbackRate = Math.min(elem.playbackRate+=0.25, 2);
        }
        if (evt.shiftKey && evt.keyCode == 188) {
            elem=document.getElementById('talkFeaturedPlayer_html5_api');
            elem.playbackRate = Math.max(elem.playbackRate-=0.25,0.5);
        }
    }
    document.addEventListener('keydown', onKeydown, true);
})();