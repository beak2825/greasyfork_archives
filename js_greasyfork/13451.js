// ==UserScript==
// @name        Canvas Instructure long input and spellcheck
// @description Canvas Instructure long input and on spellcheck
// @author      DnAp
// @namespace   DnAp
// @license     LGPL
// @version     0.1
// @grant       GM_registerMenuCommand
// @match       https://canvas.instructure.com/*
// @downloadURL https://update.greasyfork.org/scripts/13451/Canvas%20Instructure%20long%20input%20and%20spellcheck.user.js
// @updateURL https://update.greasyfork.org/scripts/13451/Canvas%20Instructure%20long%20input%20and%20spellcheck.meta.js
// ==/UserScript==


function spellOn(){
  var spell = document.querySelectorAll('input.question_input[type=text]');
  for (var i=0; i<spell.length; i++){
   spell[i].removeAttribute("spellcheck");
  }
}

(function() {
	spellOn();
	var css = 'question_text.user_content.enhanced .question input[type=text] { min-width: 320px; }',
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet){
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    
    head.appendChild(style);
})();