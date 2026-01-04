// ==UserScript==
// @name         Chaturbate Crawler Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  cycle through cam models when you're not at your computer and make the feed full screen-ish
// @author       You
// @match        https://chaturbate.com/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/383569/Chaturbate%20Crawler%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/383569/Chaturbate%20Crawler%20Script.meta.js
// @grant    GM_addStyle// ==/UserScript==

var models = [
    'secretchloe',
    'lindamei',
    'belka22',
    'cum4myass',
    'sionarei',
    'space_miamii',
    'fallingangel_',
    'skye_princess_new',
    'ritamoonhot',
    'melaninmelanix',
    'vanessablonde',
    'polsound'
];

(function() {
    if (modelOffline() == true) {
      cycleModels()
    } else {
      formatVideo()
      setTimeout(cycleModels, 60000)
    }
})();

function cycleModels() {
    changeModels()
    if ( modelOffline() === true ) {
        changeModels();
    } else {
        setTimeout(cycleModels, 60000)
    }
}

function changeModels() {
        let model = models[Math.floor(Math.random()*models.length)];
        window.location.assign("https://chaturbate.com/" + model);
}

function modelOffline() {
    return ($("p:contains('Room is currently offline')").length >= 1);
}

function formatVideo() {
        document.querySelector('video').setAttribute("style", "position: fixed; top: 50%; left: 50%; min-width: 100%; min-height: 100%; width: auto; height: auto; z-index: 100; transform: translateX(-50%) translateY(-50%);")
        document.querySelector('.ui-resizable-handle').setAttribute("style", "z-index: 1");
}

