// ==UserScript==
// @name            MiscCommands *OLD*
// @namespace       skyboy@kongregate
// @description     Adds slap commands
// @author          skyboy
// @include         http://www.kongregate.com/games/*/*
// @homepage        http://userscripts-mirror.org/scripts/show/75201
// @version 0.0.1.20160401080327
// @downloadURL https://update.greasyfork.org/scripts/17742/MiscCommands%20%2AOLD%2A.user.js
// @updateURL https://update.greasyfork.org/scripts/17742/MiscCommands%20%2AOLD%2A.meta.js
// ==/UserScript==
if (/^\/?games\/[^\/]+\/[^\/?]+(\?.*)?$/.test(window.location.pathname))
window.location.assign("javascript:function foc(){holodeck.activeDialogue()._input_node.focus();};function s(b,a){sendChatMessage('*slaps'+a.replace(/\\/slap/,'')+' with a trout*');foc();return false};function r(a){return a.replace(/\\\\(?!u[0-9a-fA-f]{4}|x[0-9a-fA-f]{2})/g, '\\\\\\\\')};function sp(b,a){sendPrivMessage('*slaps you with a trout*',a); return false};function sendChatMessage(a){dispatchToKonduit({type:KonduitEvent.ROOM_MESSAGE,data:{message:r(a),room:holodeck.chatWindow()._active_room._room}});return a;};function sendPrivMessage(a,b){dispatchToKonduit({type:KonduitEvent.PRIVATE_MESSAGE,data:{message:r(a),username:b.replace(/\\/\\S*\\s([\\s\\S]+)/,'$1')}});return a;};holodeck.addChatCommand('slap', s);holodeck.addChatCommand('pmslap', sp);void(0);")