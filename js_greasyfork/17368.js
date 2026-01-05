// ==UserScript==
// @name         Reddit Sidebar Offscreen
// @namespace    https://jyoko.github.io/
// @version      1.4
// @description  Moves Reddit right sidebar offscreen, uses "q" to toggle
// @author       jyoko
// @include      http*://*.reddit.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17368/Reddit%20Sidebar%20Offscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/17368/Reddit%20Sidebar%20Offscreen.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

if (window.hasOwnProperty('$')) {
  window.addEventListener('keyup', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.keyCode === 81) { // q
      toggler($('.side'));
    }
  });
  toggler($('.side'));
}
// Full credit to /u/GameFreak4321 here, excellent idea
// https://www.reddit.com/r/Enhancement/comments/swp8s/feature_request_a_button_to_hide_the_sidebar
function toggler(side) {
  if (side.hasClass('RESSidebarHide')){
    side.css('margin-right', '0px').removeClass('RESSidebarHide');
  } else {
    side.css('margin-right','-'+side.width()+'px').addClass('RESSidebarHide');
  }            
}

