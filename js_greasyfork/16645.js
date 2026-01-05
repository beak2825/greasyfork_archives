// ==UserScript==
// @name         Imgur - Load albums in fullscreen slideshow
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Loads Imgur albums as a fullscreen slideshow automatically.
// @author       Andrivious
// @match        http://imgur.com/a/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16645/Imgur%20-%20Load%20albums%20in%20fullscreen%20slideshow.user.js
// @updateURL https://update.greasyfork.org/scripts/16645/Imgur%20-%20Load%20albums%20in%20fullscreen%20slideshow.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var url = window.location.href;

var url_grid_album_matches = url.match(/^http(s)?:\/\/imgur.com\/a\/[^\/]+\/layout\/grid.*/);
var url_default_album_matches = url.match(/^http(s)?:\/\/imgur.com\/a\/[^\/]+/);

if (!url_grid_album_matches) {
    window.location.assign(url_default_album_matches[0] + '/layout/grid');
}
else {
    document.getElementsByClassName('post')[0].click();
}
