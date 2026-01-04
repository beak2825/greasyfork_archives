// ==UserScript==
// @name        5RiversChatMusicSuppress - protradingroom.com
// @namespace   Arathelas.script
// @match       https://chat.protradingroom.com/?id=63ef8a6607762a108381d21f
// @grant       none
// @version     1.0.2
// @author      Brian.bto
// @license    GPL3
// @description 3/6/2023, 9:30:49 AM
// @supportURL https://github.com/btoInc/5RiversChatSounds/issues
// @downloadURL https://update.greasyfork.org/scripts/470627/5RiversChatMusicSuppress%20-%20protradingroomcom.user.js
// @updateURL https://update.greasyfork.org/scripts/470627/5RiversChatMusicSuppress%20-%20protradingroomcom.meta.js
// ==/UserScript==



function removeAudio(){
  //findAudio();
  $('#mp3player').parent().empty();
  console.log("removed mp3player");
  //findAudio();
}

function findAudio(){
  var audio = $('audio');
  audio.each(function(i, k){
    console.log($(this));
  });
}

function waitForAudio(){
  if ($('#mp3player').length === 0)
    setTimeout(waitForAudio, 1000);
  else
    removeAudio();
}

setTimeout(waitForAudio, 3000);