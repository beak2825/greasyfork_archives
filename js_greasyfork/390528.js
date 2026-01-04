// ==UserScript==
// @name         SkipSAM
// @namespace    http://tampermonkey.net/
// @version      6.9.1
// @description  Skip yt vids in SAM assignments with the P key or the skip button
// @author       Pan
// @match        https://samcp.cengage.com/Player2016/AssignmentTake/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390528/SkipSAM.user.js
// @updateURL https://update.greasyfork.org/scripts/390528/SkipSAM.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';

    window.addEventListener('load', () => {
        var skipBtn = document.createElement('button');
        skipBtn.innerText = 'Skip';
        skipBtn.onclick = skipYt;
        document.querySelector('.vcr-buttons.cc').after(skipBtn);
    });

    window.addEventListener('keydown', e => {
        if(e.key == 'p') skipYt();
    });

    function skipYt() {
        var text = `
$('.button.play').click();
var player = YT.get($('iframe')[0].id);
console.log(player.getVideoUrl());
player.playVideo();
player.seekTo(9999999);`;

        var script = document.createElement('script');
        var code = document.createTextNode(text);
        script.appendChild(code);
        (document.body || document.head).appendChild(script);
    }
})();