// ==UserScript==
// @name            Zombs.io anti crasher
// @namespace  none
// @version         who cares about versions 4.0.0.1
// @description  Gift from Shadow✔
// @author          Shadow✔
// @match          http://zombs.io/*
// @downloadURL https://update.greasyfork.org/scripts/394092/Zombsio%20anti%20crasher.user.js
// @updateURL https://update.greasyfork.org/scripts/394092/Zombsio%20anti%20crasher.meta.js
// ==/UserScript==

Game.currentGame.network.addEnterWorldHandler(()=>{Game.currentGame.network.emitter.removeListener("PACKET_RPC",Game.currentGame.network.emitter._events.PACKET_RPC[1]);const onMessageReceived=e=>{const a=Game.currentGame.ui.getComponent("Chat"),s=e.displayName.replace(/<(?:.|\n)*?>/gm, ''),t=e.message.replace(/<(?:.|\n)*?>/gm, ''),m=a.ui.createElement(`<div class="hud-chat-message"><strong>${s}</strong>: ${t}</div>`);a.messagesElem.appendChild(m),a.messagesElem.scrollTop=a.messagesElem.scrollHeight};Game.currentGame.network.addRpcHandler("ReceiveChatMessage",onMessageReceived);})
