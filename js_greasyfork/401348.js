// ==UserScript==
// @name        Yes i'm here, youtube !
// @namespace   momala
// @description This script disable the auto pausing of youtube videos if you don't interact with the screen for a certain amount of time. So, this disable the functionnality "Video paused. Continue watching?" on youtube.
// @include     https://youtube.com/*
// @include     https://*.youtube.com/*
// @version     3
// @run-at      document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/401348/Yes%20i%27m%20here%2C%20youtube%20%21.user.js
// @updateURL https://update.greasyfork.org/scripts/401348/Yes%20i%27m%20here%2C%20youtube%20%21.meta.js
// ==/UserScript==

var count = 0;
var inited = false;
var interval = setInterval(function() {
    if (document.querySelector('ytd-watch-flexy')) {
        if (!inited) {
            // prevent future loading of the function
            document.querySelector('ytd-watch-flexy').youthereDataChanged_ = function() {};
            inited = true;
        }
        if (count < 30) {
            // disable data that was filled at load time
            document.querySelector('ytd-watch-flexy').youThereManager_.youThereData_ = null;
        }
        else {
            clearInterval(interval);
        }
    }
    if (count > 100) {
        clearInterval(interval);
    }

    count++;
}, 1000);