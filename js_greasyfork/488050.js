// ==UserScript==
// @name         Show images without grey cover
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      1
// @description  Show images without grey cover + Top Random BTN and images.
// @author       hacker09
// @include      https://h*.*v/browse/random?r=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488050/Show%20images%20without%20grey%20cover.user.js
// @updateURL https://update.greasyfork.org/scripts/488050/Show%20images%20without%20grey%20cover.meta.js
// ==/UserScript==

(function() {
  'use strict';
  document.head.insertAdjacentHTML('beforeend', '<style>.hvc2 .hvc2__poster { position: unset; background: unset; } .hvc2 .hvc2__poster .hvc2__poster__image { opacity: unset; filter: unset; } .hvc2 .hvc2__data { opacity: .5; height: 42px; } .hvc2 .hvc2__data .hvc2__data__title {min-height: unset; padding: unset;} .hvc2 .hvc2__data .hvc2__data__details { padding: unset;} .hvc2 .hvc2__data .hvc2__data__cover_image {left:0; bottom: 0; width: 25%;} .layout.mb-5.flex.row { position: absolute; top: 0; left: 700px; z-index: 999} .relative.mb-5 { top: -73px;} .browse { overflow: unset; }</style>');
})();