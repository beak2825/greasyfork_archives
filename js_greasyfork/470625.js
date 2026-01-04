// ==UserScript==
// @name        5RiversChatSounds - protradingroom.com
// @namespace   Arathelas.script
// @match       https://chat.protradingroom.com/?id=63ef8a6607762a108381d21f
// @grant       none
// @version     1.0.7
// @author      Brian.bto
// @license    GPL3
// @description 3/6/2023, 9:30:49 AM
// @supportURL https://github.com/btoInc/5RiversChatSounds/issues
// @downloadURL https://update.greasyfork.org/scripts/470625/5RiversChatSounds%20-%20protradingroomcom.user.js
// @updateURL https://update.greasyfork.org/scripts/470625/5RiversChatSounds%20-%20protradingroomcom.meta.js
// ==/UserScript==

var audioAlert = new Audio('https://github.com/btoInc/5RiversChatSounds/blob/dcefad41b6071f57992a9e77fdd6ea76ff05937c/wet-431.mp3?raw=true');
audioAlert.volume = 0.35;
var audioAlertAdmin = new Audio('https://github.com/btoInc/5RiversChatSounds/blob/dcefad41b6071f57992a9e77fdd6ea76ff05937c/ti-na-83.mp3?raw=true');
audioAlertAdmin.volume = 0.5;
var audioAlertStock = new Audio('https://github.com/btoInc/5RiversChatSounds/blob/dcefad41b6071f57992a9e77fdd6ea76ff05937c/Coins.mp3?raw=true');
audioAlertStock.volume = 0.75;

function chatCallback(data){
  data.forEach(function(record){
    if(typeof record.target == "object"){
      var parent = $(record.target);
      if (parent.children().last().find('div.msg-box-adm').length != 0)
        audioAlertAdmin.play();
      else if (parent.children().last().find('span.stockColor').length != 0)
        audioAlertStock.play();
      else
        audioAlert.play();
    }
  });
}

//setInterval(chatCallback, 1000);

function setObserver(){
  console.log(" ** create observer **");
  var obsv = new MutationObserver(chatCallback);
  var config = {
    childList: true
  };
  console.log(" ** setting observer **");
  $("app-chat app-roomscroller > div").each(function(){
    obsv.observe(this, config);
  });
}

function waitForChat(){
    if( $("app-chat").length === 0)
        setTimeout(waitForChat, 1000);
    else
        setObserver();
}

setTimeout(waitForChat, 3000);