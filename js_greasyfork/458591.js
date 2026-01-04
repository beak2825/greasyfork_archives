// ==UserScript==
// @name         YT Music image shadow
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds "glowing" effect for YT Music song images
// @author       Nesilar
// @license MIT
// @match        https://music.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=music.youtube.com
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.3.0/color-thief.umd.js
// @downloadURL https://update.greasyfork.org/scripts/458591/YT%20Music%20image%20shadow.user.js
// @updateURL https://update.greasyfork.org/scripts/458591/YT%20Music%20image%20shadow.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const colorThief = new ColorThief();

    const song_image = document.querySelector('#song-image').querySelector('#img')

    var observer = new MutationObserver(resetTimer);
    var timer = setTimeout(action, 250, observer); // wait for the page to stay still for 3 seconds
    observer.observe(song_image, {childList: true, subtree: true, attributes: true});

    // reset timer every time something changes
    function resetTimer(changes, observer) {
        clearTimeout(timer);
        timer = setTimeout(action, 250, observer);
    }

    function action(observer) {
        song_image.crossOrigin = "Anonymous";
        let colors = colorThief.getColor(song_image)
        song_image.style = `box-shadow: 0px 0px 50px 25px rgb(${colors[0]},${colors[1]},${colors[2]});`
    }

})();