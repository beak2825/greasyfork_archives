// ==UserScript==
// @name         Restore Watch later
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  move watch later back to the player
// @author       Kyle Boyd
// @include http://www.youtube.com/*
// @include https://www.youtube.com/*
// @match http://www.youtube.com/*
// @match https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @run at document-idle
// @downloadURL https://update.greasyfork.org/scripts/437556/Restore%20Watch%20later.user.js
// @updateURL https://update.greasyfork.org/scripts/437556/Restore%20Watch%20later.meta.js
// ==/UserScript==

var origbutt = document.getElementsByClassName('ytp-watch-later-button ytp-button')[0]
var watchlaterbutt = origbutt.cloneNode(1);

watchlaterbutt.style.float = 'right';
watchlaterbutt.addEventListener('click', function(e){
    origbutt.click();
})

document.getElementsByClassName('ytp-chrome-controls')[0].appendChild(watchlaterbutt
)();