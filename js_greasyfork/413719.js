// ==UserScript==
// @name         Queslar Alerts (ZW)
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Audio alerts for various things in Queslar. Work in progress.
// @author       euphone
// @match        https://www.queslar.com/
// @match        http://www.queslar.com/
// @match        https://queslar.com/
// @match        http://queslar.com/
// @connect      docs.google.com
// @connect      googleusercontent.com
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/413719/Queslar%20Alerts%20%28ZW%29.user.js
// @updateURL https://update.greasyfork.org/scripts/413719/Queslar%20Alerts%20%28ZW%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function runSetup() {
        var rootElement = getAllAngularRootElements()[0].children[1]["__ngContext__"][30];
        var playerGeneralService = rootElement.playerGeneralService;

        if (!playerGeneralService
            || !playerGeneralService.playerActionService
            || !playerGeneralService.playerActionService.actionSocketData
            || !playerGeneralService.playerActionService.socketService
            || !playerGeneralService.playerActionService.socketService.socket
            || !playerGeneralService.playerActionService.socketService.socket._callbacks
            || !playerGeneralService.playerActionService.socketService.socket._callbacks["$battle action result"]
            || !playerGeneralService.playerActionService.socketService.socket._callbacks["$battle action result"].length)
        {
            setTimeout(runSetup, 500);
            return;
        }

        var normalColour = rootElement.playerSettingsService.miscSettings.textColor;
        var unreadColour = "yellow" // Change to whatever colour you'd like.

        var mainSoundFile = "https://docs.google.com/uc?export=open&id=10kEvFS5rPaixRRes2etGL2o5u2NDHi6i"; // Change to whatever audio file you'd like.
        var resSoundFile = "https://docs.google.com/uc?export=open&id=1gMzsd2BnU9Lum8tBjFKoExx7UfDTBGpa"; // Change to whatever audio file you'd like.

        let notifSound = document.createElement('audio');
        notifSound.src = mainSoundFile
        notifSound.autoplay = false

        let resNotifSound = document.createElement('audio');
        resNotifSound.src = resSoundFile
        resNotifSound.autoplay = false

        var playerActionService = playerGeneralService.playerActionService;
        var chatSocket = playerGeneralService.chatService.chatMessageSocket;
        var yourUsername = playerGeneralService.gameService.playerData.username.toString().toLowerCase();
        var yourTag = "@"+yourUsername;
        var lastResMessageID = playerGeneralService.chatService.channelList.zwres.messages[0].id;
        var partnerID = playerGeneralService.playerPartnerService.activePartner;
        var resCheck = playerGeneralService.playerPartnerService.partnerData[partnerID].currentHarvest;
        var lastWhisperID = playerGeneralService.chatService.channelList.whispers.messages[0].id;
        var lastVillageMessageID = playerGeneralService.chatService.channelList.village.messages[0].id;
        var resType;

        playerGeneralService.chatService.socketService.socket._callbacks["$receive message"][0] = e => {
            chatSocket.next(e);
            var activeChannel = playerGeneralService.chatService.activeChannel;

            // Notifications for when your res is tagged with @ in our trade channel. Delete from this line up to and including the end comment if you don't like it.
            var newResMessageID = playerGeneralService.chatService.channelList.zwres.messages[0].id
            var resMessageContent = playerGeneralService.chatService.channelList.zwres.messages[0].message
            switch (resCheck)
            {
                case "hunting":
                    resType = "@meat"
                    break;
                case "mining":
                    resType = "@iron"
                    break;
                case "woodcutting":
                    resType = "@wood"
                    break;
                case "stonecarving":
                    resType = "@stone"
                    break;
            }

            if (lastResMessageID != newResMessageID)
            {
                if (resMessageContent.includes(resType) || resMessageContent.includes(yourTag)) {
                    resNotifSound.play();
                    lastResMessageID = newResMessageID;

                    var nameRes = document.getElementsByClassName("cdk-drag");
                    for (var i = 0; i < nameRes.length; i++) {
                        if (nameRes[i].innerText.includes("Zwres")) {
                            const resButton = nameRes[i];
                            resButton.style.color = unreadColour;
                            resButton.onclick = function(){ resButton.style.color = normalColour;}
                        }
                    }
                }
            }
            // End of res trade notifications section.

            // Notifications for when you receive a whisper. Delete from this line up and to including the end comment if you don't like it.
            var newWhisperID = playerGeneralService.chatService.channelList.whispers.messages[0].id
            var whisperRecipient = playerGeneralService.chatService.channelList.whispers.messages[0].receiverUsername.toLowerCase()
            if (lastWhisperID !== newWhisperID) {
                if (activeChannel !== "whispers") {
                    if (whisperRecipient == yourUsername) {
                        notifSound.play();
                        lastWhisperID = newWhisperID;

                        var nameWhisper = document.getElementsByClassName("cdk-drag");
                        for (var j = 0; j < nameWhisper.length; j++) {
                            if (nameWhisper.innerText.includes("whispers")) {
                                const whisperButton = nameWhisper[j];
                                whisperButton.style.color = unreadColour;
                                whisperButton.onclick = function(){ whisperButton.style.color = normalColour;}
                            }
                        }
                    }
                }
            }
            // End of whisper notification

            // Notifications for when you are tagged with an @ in village chat. Delete from this line up to and including the end comment if you don't like it.
            var newVillageMessageID = playerGeneralService.chatService.channelList.village.messages[0].id
            var villageMessageContent = playerGeneralService.chatService.channelList.village.messages[0].message.toLowerCase()
            if (lastVillageMessageID != newVillageMessageID) {
                if (villageMessageContent.includes(yourTag)) {
                    notifSound.play();
                    lastVillageMessageID = newVillageMessageID;
                    if (activeChannel !== "village") {
                        var nameVillage = document.getElementsByClassName("cdk-drag");
                        for (var k = 0; k < nameVillage.length; k++) {
                            var nameVillageText = nameVillage[k].innerText;
                            if (nameVillageText.includes("village")) {
                                const villageButton = nameVillage[k];
                                villageButton.style.color = unreadColour;
                                villageButton.onclick = function(){ villageButton.style.color = normalColour;}
                            }
                        }
                    }
                }
            }
            // End of village tag notifications.
        };
    }

    function checkSetup()
    {
        if (typeof getAllAngularRootElements !== "function")
        {
            setTimeout(checkSetup, 500);
        }
        else
        {
            runSetup();
        }
    }

    checkSetup();
})();