// ==UserScript==
// @name         Youtube music dislike
// @namespace    https://greasyfork.org/ja/scripts/483807-youtube-music-dislike
// @version      0.2
// @description  Youtube Musicでまとめてdislike
// @author       You
// @match        https://music.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483807/Youtube%20music%20dislike.user.js
// @updateURL https://update.greasyfork.org/scripts/483807/Youtube%20music%20dislike.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var newButton = document.createElement('button');
    newButton.textContent = 'まとめてdislike';

    newButton.addEventListener('click', function() {
        document.querySelectorAll('yt-button-shape#button-shape-dislike button[aria-pressed="false"]').forEach((button, index) => {
            setTimeout(() => {
                button.click();
                newButton.textContent = 'まとめてdislike#' + (index+1);
                console.log(index);
            }, 1500 * index);
        });
    });

    var targetElement = document.querySelector('.ytmusic-nav-bar .settings-button');
    targetElement.parentNode.insertBefore(newButton, targetElement.nextSibling);
})();