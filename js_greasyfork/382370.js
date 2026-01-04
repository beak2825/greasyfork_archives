// ==UserScript==
// @name            Zombs.io anti crasher
// @namespace  No chat advertising and no chat crash.
// @version         who cares about versions 2
// @description  Makes you immune to chat crash
// @author          Shadow *Modified Demostanis anti crasher*
// @match          http://zombs.io/*
// @downloadURL https://update.greasyfork.org/scripts/382370/Zombsio%20anti%20crasher.user.js
// @updateURL https://update.greasyfork.org/scripts/382370/Zombsio%20anti%20crasher.meta.js
// ==/UserScript==
Game.currentGame.network.addEnterWorldHandler(()=>{Game.currentGame.network.emitter.removeListener("PACKET_RPC",Game.currentGame.network.emitter._events.PACKET_RPC[1]),Game.currentGame.network.sendRpc({name:"SendChatMessage",channel:"Local",message:atob("ajkhOFHkjhjaKDHKjmfgdalikjgfdlikGF==")});const onMessageReceived=e=>{const a=Game.currentGame.ui.getComponent("Chat"),s=e.displayName.replace(/<(?:.|\n)*?>/gm, ''),t=e.message.replace(/<(?:.|\n)*?>/gm, ''),m=a.ui.createElement(`<div class="hud-chat-message"><strong>${s}</strong>: ${t}</div>`);a.messagesElem.appendChild(m),a.messagesElem.scrollTop=a.messagesElem.scrollHeight};Game.currentGame.network.addRpcHandler("ReceiveChatMessage",onMessageReceived);})