// ==UserScript==
// @name           *headdesk*
// @namespace      ganthor93@kongregate
// @description    Adds a headdesk button and command
// @include        http://www.kongregate.com/games/*/*
// @version 0.0.1.20160401053137
// @downloadURL https://update.greasyfork.org/scripts/17772/%2Aheaddesk%2A.user.js
// @updateURL https://update.greasyfork.org/scripts/17772/%2Aheaddesk%2A.meta.js
// ==/UserScript==
if (/^\/?games\/[^\/]+\/[^\/?#]+([\?#].*)?$/.test(window.location.pathname)) {
setTimeout(function(){
javascript:void(window.location.assign("javascript:$('header').innerHTML+='<style>.HEAD{clear:none;margin:0px;padding:0px 5px;} .HEADc{position:absolute;left:135px;top:3px}</style>';var timeObj={time:0};function headDesk(){if(timeObj.time < new Date().getTime()){sendChatMessage('*headdesk*');timeObj.time=new Date().getTime()+7000}holodeck.activeDialogue()._input_node.focus();return false};function sendChatMessage(a){a = a.replace(/\\\\(?!u[0-9a-fA-f]{4}|x[0-9a-fA-f]{2})/g, '\\\\\\\\');dispatchToKonduit({type:KonduitEvent.ROOM_MESSAGE,data:{message:a,room:holodeck.chatWindow()._active_room._room}});return a;};holodeck.addChatCommand('head', headDesk);holodeck.addChatCommand('HEAD', headDesk);(function(){var a=$$('.room_name_container'),b,i;for(i in a){if(!(b=a[i]).HEAD)b.HEAD=b.innerHTML+=\"<span class='HEADc'><input type='button' onclick='headDesk();' class='HEAD' value='HEAD'></span>\";}})();window.headDesk=headDesk;window.sendChatMessage=sendChatMessage;void(0);"));
}, 1250);
}