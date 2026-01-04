// ==UserScript==
// @name         Minds Submit on Enter.
// @namespace    http://www.minds.com/
// @version      0.8
// @description  Shows comments on the right hand side of the page.
// @author       You
// @match        https://www.minds.com/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/367966/Minds%20Submit%20on%20Enter.user.js
// @updateURL https://update.greasyfork.org/scripts/367966/Minds%20Submit%20on%20Enter.meta.js
// ==/UserScript==

window.onload = function() {
$('textarea[name=message]')[0].onkeydown = function(e) {
  var key;
  var isShift;
  if (window.event) {
    key = window.event.keyCode;
    isShift = !!window.event.shiftKey;
  } else {
    key = ev.which;
    isShift = !!ev.shiftKey;
  }
  if ( !isShift ) {
    switch (key) {
      case 13:
      $('.mdl-button--colored')[0].click();
      break;
    }
  }
}
};