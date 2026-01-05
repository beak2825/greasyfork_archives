// ==UserScript==
// @name        Chaos Life navigation Improvements
// @namespace   http://userscripts.org/users/scuzzball/scripts
// @include     http://chaoslife.findchaos.com/*
// @description Provides arrow key navigation
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/5308/Chaos%20Life%20navigation%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/5308/Chaos%20Life%20navigation%20Improvements.meta.js
// ==/UserScript==


function leftArrowPressed() {
  if(! document.getElementsByClassName('navi navi-prev')[0].classList.contains("navi-void")){
	 window.location = document.getElementsByClassName('navi navi-prev')[0].href;
  }
}

function rightArrowPressed() {
  if(! document.getElementsByClassName('navi navi-next')[0].classList.contains("navi-void")){
	 window.location = document.getElementsByClassName('navi navi-next')[0].href;
  }
}

document.onkeydown = function(evt) {
    evt = evt || window.event;
    switch (evt.keyCode) {
        case 37:
            leftArrowPressed();
            break;
        case 39:
            rightArrowPressed();
            break;
    }
};
