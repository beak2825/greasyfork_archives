// ==UserScript==
// @name        Twitter Old Logo back - twitter.com
// @namespace   Violentmonkey Scripts
// @match       https://twitter.com/*
// @match       https://mobile.twitter.com/*
// @run-at      document-start
// @grant       none
// @version     3.0
// @author      LiefLayer
// @description 4/4/2023, 18:52:11
// @downloadURL https://update.greasyfork.org/scripts/463279/Twitter%20Old%20Logo%20back%20-%20twittercom.user.js
// @updateURL https://update.greasyfork.org/scripts/463279/Twitter%20Old%20Logo%20back%20-%20twittercom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    init();

    function init() {
        setTimeout(display, 2000);
    }

  function display(){
    try{
      document.querySelectorAll('[href="/home"]')[0].children[0].innerHTML = '<svg viewBox="328 355 335 276" xmlns="http://www.w3.org/2000/svg"><path d="M 630, 425 A 195, 195 0 0 1 331, 600 A 142, 142 0 0 0 428, 570 A  70,  70 0 0 1 370, 523 A  70,  70 0 0 0 401, 521 A  70,  70 0 0 1 344, 455 A  70,  70 0 0 0 372, 460 A  70,  70 0 0 1 354, 370 A 195, 195 0 0 0 495, 442 A  67,  67 0 0 1 611, 380 A 117, 117 0 0 0 654, 363 A  65,  65 0 0 1 623, 401 A 117, 117 0 0 0 662, 390 A  65,  65 0 0 1 630, 425 Z" style="fill:#3BA9EE;"/></svg>'
    }catch(e){
      return false;
    }
  }
})();