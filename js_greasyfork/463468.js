// ==UserScript==
// @name        New script - followchess.com
// @namespace   Violentmonkey Scripts
// @match       https://live.followchess.com/live-game
// @grant       none
// @version     1.0
// @author      -
// @description 07/04/2023, 16:01:07
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463468/New%20script%20-%20followchesscom.user.js
// @updateURL https://update.greasyfork.org/scripts/463468/New%20script%20-%20followchesscom.meta.js
// ==/UserScript==

(function() {
	'use strict';
  document.onkeydown = function(e){
    e = e || window.event;
    var key = e.which || e.keyCode;
    if(key===37){
        left();
    }
    if(key == 39) {
      right();
    }
}

})();

function left(){
  document.querySelector("[src='images/svg/backward.svg']").click();
}

function right(){
  document.querySelector("[src='images/svg/farward.svg']").click();
}