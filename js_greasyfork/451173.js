// ==UserScript==
// @name            Queen Pegman
// @license MIT
// @match           https://www.google.co.uk/maps/*
// @match           https://www.google.com/maps/*
// @match           https://www.google.co.uk/maps
// @match           https://www.google.com/maps
// @description          Sets Google Streetview the queen
// @description:en           Sets Google Streetview the queen
// @version 0.0.1.20220911144711
// @namespace https://greasyfork.org/users/957551
// @downloadURL https://update.greasyfork.org/scripts/451173/Queen%20Pegman.user.js
// @updateURL https://update.greasyfork.org/scripts/451173/Queen%20Pegman.meta.js
// ==/UserScript==
var a;
a = setTimeout(fun, 2000);
function fun() {
    const div = document.querySelector('.q2sIQ');
    div.style.background = 'url(//maps.gstatic.com/tactile/pegman_v3/queen/runway-1x.png)';
}
// Not much but it works