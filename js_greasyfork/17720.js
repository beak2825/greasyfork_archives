// ==UserScript==
// @name            "That's what she said."
// @namespace       skyboy@kongregate
// @author          skyboy
// @version         1.2.0final+
// @description     Adds a "That's what she said." button and chat command
// @include         *://www.kongregate.com/*
// @homepage        http://userscripts.org/scripts/show/72086
// @downloadURL https://update.greasyfork.org/scripts/17720/%22That%27s%20what%20she%20said%22.user.js
// @updateURL https://update.greasyfork.org/scripts/17720/%22That%27s%20what%20she%20said%22.meta.js
// ==/UserScript==
if (/^\/?games\/[^\/]+\/[^\/?#]+([\?#].*)?$/.test(window.location.pathname)) {
setTimeout(function(){
javascript:void(window.location.assign("javascript:$('header').innerHTML+='<style>.TWSS{clear:none;margin:0px;padding:0px 5px;} .TWSSc{position:absolute;left:235px;top:3px}</style>';var timeObj={time:0};function sheSaid(){if(timeObj.time < new Date().getTime()){sendChatMessage('That\\\'s what she said.');timeObj.time=new Date().getTime()+7000}holodeck.activeDialogue()._input_node.focus();return false};function sendChatMessage(a){a = a.replace(/\\\\(?!u[0-9a-fA-f]{4}|x[0-9a-fA-f]{2})/g, '\\\\\\\\');dispatchToKonduit({type:KonduitEvent.ROOM_MESSAGE,data:{message:a,room:holodeck.chatWindow()._active_room._room}});return a;};holodeck.addChatCommand('twss', sheSaid);holodeck.addChatCommand('TWSS', sheSaid);(function(){var a=$$('.room_name_container'),b,i;for(i in a){if(!(b=a[i]).TWSS)b.TWSS=b.innerHTML+=\"<span class='TWSSc'><input type='button' onclick='sheSaid();' class='TWSS' value='TWSS'></span>\";}})();window.sheSaid=sheSaid;window.sendChatMessage=sendChatMessage;void(0);"));
}, 1250);
}