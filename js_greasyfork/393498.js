//Se ha pausado el vídeo. ¿Quieres seguir viéndolo? auto ok

// ==UserScript==
// @name         Youtube 'Video paused. Continue watching?' Auto confirmer
// @namespace    Youtube 'Video paused. Continue watching?' Auto confirmer
// @version      1
// @description  Automatically clicks 'Ok' when the 'Video paused. Continue watching?' dialog pops up and pauses your videos.
// @author       AngusWR
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393498/Youtube%20%27Video%20paused%20Continue%20watching%27%20Auto%20confirmer.user.js
// @updateURL https://update.greasyfork.org/scripts/393498/Youtube%20%27Video%20paused%20Continue%20watching%27%20Auto%20confirmer.meta.js
// ==/UserScript==

//mod for spainsh yt version

setInterval(function() {
    'use strict';
    if (document.getElementsByClassName('line-text style-scope yt-confirm-dialog-renderer').length >= 1) {
        for (let i = 0; i < document.getElementsByClassName('line-text style-scope yt-confirm-dialog-renderer').length; i++) {
        	var temp = document.getElementsByClassName('line-text style-scope yt-confirm-dialog-renderer')[i].innerText;
        	console.log(temp);
            if (temp.includes("paus")) {
                document.getElementsByClassName('line-text style-scope yt-confirm-dialog-renderer')[i].parentNode.parentNode.parentNode.querySelector('#confirm-button').click()
            }

        }
    }
}, 10)();