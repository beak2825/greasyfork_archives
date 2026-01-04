// ==UserScript==
// @name         Jojo's Anti Gift Spam
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Should stop lag caused by spamming rooms with gifts
// @author       Jojo
// @match        https://tinychat.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      “Commons Clause” License Condition v1.0
// @downloadURL https://update.greasyfork.org/scripts/459282/Jojo%27s%20Anti%20Gift%20Spam.user.js
// @updateURL https://update.greasyfork.org/scripts/459282/Jojo%27s%20Anti%20Gift%20Spam.meta.js
// ==/UserScript==


(function() {
    'use strict';
    let loadingInterval = setInterval(() => {
        if(!window?.TinychatApp?.getInstance()?.defaultChatroom?.packetWorker?.tcSocket?.ws?.onmessage && !window?.TinychatApp?.getInstance()?.defaultChatroom?.packetWorker?.tcSocket?.ws?.readyState !== 1) {
            return;
        }
        console.log("INITIALIZING ANTI GIFT SPAM");
        if(window.CreateGift || window.HELLChatCSS || window.CTSChatCSS){
            removeCreateGiftFromScript();
        } else {
            initialize();
        }
        clearInterval(loadingInterval);
    }, 200);
})();

function removeCreateGiftFromScript(){
    window.CreateGift = () => {}
}

function initialize(){
    const hasScript = window.CreateGift ? true : false;
    const original = window.TinychatApp.getInstance().defaultChatroom.packetWorker.tcSocket.ws.onmessage;
    window.TinychatApp.getInstance().defaultChatroom.packetWorker.tcSocket.ws.onmessage = (e) => {
        const eventData = JSON.parse(e.data);
        if(eventData.tc === "gift"){
            return;
        }
        original(e);
    }
}