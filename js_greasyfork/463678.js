// ==UserScript==

// @name GeoGuessr Pro

// @description Removes white bar and resizes to full

// @author u/Artyer

// @include /^(https?)?(\:)?(\/\/)?([^\/]*\.)?geoguessr\.com($|\/.*)/

// @grant none

// @require http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js

// @version 0.0.1.20230410121228
// @namespace https://greasyfork.org/users/1057495
// @downloadURL https://update.greasyfork.org/scripts/463678/GeoGuessr%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/463678/GeoGuessr%20Pro.meta.js
// ==/UserScript==



document.documentElement.className = document.documentElement.className.replace(/(^|\s)no-pro(?=$|\s)/, '$1');



(function() {

'use strict';

var target = document.documentElement;

target.classList.remove ("no-pro");

target.classList.add ("pro");

})();

