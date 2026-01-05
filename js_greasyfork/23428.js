// ==UserScript==
// @name		RIT MnC timetracker clock favicon
// @namespace	harry
// @version		0.1
// @include		https://www.rit.edu/marketing/timetracker/*
// @description	clock favicon for time tracker
// @downloadURL https://update.greasyfork.org/scripts/23428/RIT%20MnC%20timetracker%20clock%20favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/23428/RIT%20MnC%20timetracker%20clock%20favicon.meta.js
// ==/UserScript==

(function() {
    var link = document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = '//www.rit.edu/academicaffairs/etctest/assets/favicon/clock.ico';
    document.getElementsByTagName('head')[0].appendChild(link);
}());