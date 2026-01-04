// ==UserScript==
// @name         Zombs.io AntiCrasher (No Message)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Edited version of demostanis anticrasher.
// @author       Lucky
// @match        http://zombs.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392565/Zombsio%20AntiCrasher%20%28No%20Message%29.user.js
// @updateURL https://update.greasyfork.org/scripts/392565/Zombsio%20AntiCrasher%20%28No%20Message%29.meta.js
// ==/UserScript==
Game.currentGame.network.addEnterWorldHandler(() => {
    Game.currentGame.network.emitter.removeListener("PACKET_RPC", Game.currentGame.network.emitter._events.PACKET_RPC[1]), Game.currentGame.network.sendRpc({
        name: "SendChatMessage",
        channel: "",
        message: atob("")
    });
    const onMessageReceived = e => {
        const a = Game.currentGame.ui.getComponent("Chat"),
            s = e.displayName.replace(/<(?:.|\n)*?>/gm, ''),
            t = e.message.replace(/<(?:.|\n)*?>/gm, ''),
            m = a.ui.createElement(`<div class="hud-chat-message"><strong>${s}</strong>: ${t}</div>`);
        a.messagesElem.appendChild(m), a.messagesElem.scrollTop = a.messagesElem.scrollHeight
    };
    Game.currentGame.network.addRpcHandler("ReceiveChatMessage", onMessageReceived);
})