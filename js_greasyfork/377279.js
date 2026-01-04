// ==UserScript==
// @name        MediaFire
// @namespace   Yr
// @include     http://www.mediafire.com/file/*
// @include     https://www.mediafire.com/file/*
// @include     http://www.mediafire.com/file_premium/*
// @include     https://www.mediafire.com/file_premium/*
// @version     2.1
// @grant       none
// @description Auto Download MediaFire
// @downloadURL https://update.greasyfork.org/scripts/377279/MediaFire.user.js
// @updateURL https://update.greasyfork.org/scripts/377279/MediaFire.meta.js
// ==/UserScript==
// if error occurs with closing windows, try config firefox by accessing about:config
var set;

(function () {
    'use strict';
    var dl = document.querySelector('.download_link .input').getAttribute('href');
    console.log(dl)
    location.replace(dl); // start download
    set = setInterval(closeWindows, 1000 * 5);
})();

function closeWindows () {
    window.close();
    clearInterval(set);
}
