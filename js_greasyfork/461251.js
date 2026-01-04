// ==UserScript==
// @name        TC ReCam
// @version     0.2
// @description Auto cam back up when tc glitches, also removes fatal error window
// @author      Osti
// @license     Meh
// @icon        https://avatars.tinychat.com/2c/1725a8/ef/medium/phpSZ6Tuo.gif
// @match       https://tinychat.com/room/*
// @match       https://tinychat.com/*
// @exclude     https://tinychat.com/settings/*
// @exclude     https://tinychat.com/subscription/*
// @exclude     https://tinychat.com/promote/*
// @exclude     https://tinychat.com/coins/*
// @exclude     https://tinychat.com/gifts*
// @grant       none
// @run-at      document-start
// @url https://greasyfork.org/scripts/461251-tc-recam/
// @namespace https://greasyfork.org/users/1036763
// @downloadURL https://update.greasyfork.org/scripts/461251/TC%20ReCam.user.js
// @updateURL https://update.greasyfork.org/scripts/461251/TC%20ReCam.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let loadingInterval = setInterval(() => {
        if(!window?.TinychatApp?.getInstance()?.defaultChatroom?.packetWorker?.tcSocket?.ws?.onmessage && !window?.TinychatApp?.getInstance()?.defaultChatroom?.packetWorker?.tcSocket?.ws?.readyState !== 1) {
            return;
        }
        readData();
        clearInterval(loadingInterval);
    }, 200);

    var VideoListElement = null;
    var MainElement = null;
    var ModalElement = null;

    var broadcastEndTime = 0;
    var handle = null;
    var attempts = 10;
    var attemptCount = 0;

    //Initialize after 4000ms
    setTimeout(function(){
        //Grab the relevant html elements
        MainElement = document.querySelector("tinychat-webrtc-app").shadowRoot;
        VideoListElement = MainElement.querySelector("tc-videolist").shadowRoot;
        ModalElement = MainElement.querySelector("tc-modal").shadowRoot;

        //Check if the fatal error message appears, then removes it
        setTimeout(checkFatal, 6000);
    },4000);

    function readData(){
        const original = window.TinychatApp.getInstance().defaultChatroom.packetWorker.tcSocket.ws.onmessage;
        window.TinychatApp.getInstance().defaultChatroom.packetWorker.tcSocket.ws.onmessage = (e) => {
            const eventData = JSON.parse(e.data);

            //Grab your handle to identify your stream_closed events
            if(eventData.tc === "joined") handle = eventData.self.handle;

            //Note the time your broadcast ends
            if(eventData.tc === "stream_closed" && eventData.handle == handle) broadcastEndTime = Date.now();

            if(eventData.tc === "stream_connected" && eventData.handle == handle) attempts = 0;
            original(e);
        }
    }

    //Check if the broadcast ended in the last 10,000 milliseconds
    function wasBroadcasting(){
        if(Date.now() - broadcastEndTime < 10000) return true;
        return false;
    }

    //Intercept console errors
    console.stderror = console.error.bind(console);
    console.error = function(){
        if(arguments[0] != null){
            //If the console error matches 'Broadcast closed due server request'
            if(arguments[0].toString().includes("Broadcast closed due server request")){
                console.log("CAM CLOSED!!! Handle=" + handle);
                //and if you were broadcasting recently, click the broadcast button (after a 300ms delay)
                if(wasBroadcasting && attemptCount < attempts) {
                    setTimeout(function() { VideoListElement.querySelector("#videos-footer-broadcast").click(); }, 300);
                    attemptCount++;
                }
            }
        }
        console.stderror.apply(console, arguments);
    }

    //If the fatal error message appears - remove it
    function checkFatal(){
        if(MainElement.querySelector("tc-modal-fatalerror") != null) ModalElement.querySelector("#modal-window").style.cssText = "display:none !important;";
        else setTimeout(checkFatal, 2000);
    }
})();