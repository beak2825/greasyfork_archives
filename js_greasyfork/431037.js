// ==UserScript==
// @name Unpress Shortcut Buttons
// @version 0
// @description read the home page lol
// @author coauthored
// @namespace      coauthored
// @match https://www.youtube.com/*
// @match https://www.bilibili.com/*
// @exclude-match https://*.youtube.com/live_chat?*
// @exclude-match        https://*.youtube.com/live_chat_replay?*
// @license Unlicense
// @run-at document-start
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/431037/Unpress%20Shortcut%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/431037/Unpress%20Shortcut%20Buttons.meta.js
// ==/UserScript==

// The exclude-match rule is just for showcasing some unresonable, yet hardly managable coverage of the script's intention, violating some ppl's habits...
// UNCONFIRMED: Conflicts among the functions XP

// author: noahyann
// 禁用空格键、UP键、DN键影响滚动条 DisableSpaceBarScroll
(function(){
 document.onkeydown = function() {
  if((event.keyCode==32)||(event.keyCode==38)||(event.keyCode==40))
  {/* 空格 || UP || DN  */
   //alert(document.activeElement.tagName);
   if(document.activeElement.tagName=='BODY'){
       event.keyCode=0;
       event.returnValue=false;
   }
  }
 };
})();

// namespace      GrayFace
//Allows you to open links in new tabs by middle or control clicking on buggy sites like Instagram
function handler(e){
	if(e.button == 1 || (e.button == 0 && e.ctrlKey)){
		e.stopPropagation();
	}
}

addEventListener('click', handler, true);
addEventListener('mousedown', handler, true);
addEventListener('mouseup', handler, true);

// author unknown
function keyboard_event_handler(e) {
    // Don't prevent entering numbers in input areas, removing of the /* and */ to release more targets(?)
    if (e.target.tagName == 'INPUT' /*||
	e.target.tagName == 'SELECT' ||
	e.target.tagName == 'TEXTAREA' ||
	e.target.isContentEditable*/
       ) {
	return;
    }
    // Trap the mute of a HP latop of mine from sending it to YT :P
    // The original trapping (hrashly truncated by me) from here is simialr to Disable YouTube number shortcuts (greasyfork.org/scripts/424823-disable-youtube-number-shortcuts/feedback)
if (e.key == 'AudioVolumeMute') {
	e.stopImmediatePropagation();
    }
}
window.addEventListener('keydown', keyboard_event_handler, true);

