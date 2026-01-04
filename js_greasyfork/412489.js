// ==UserScript==
// @name         Queslar Alerts
// @namespace    http://tampermonkey.net/
// @version      0.999
// @description  Audio alerts for various things in Queslar. Work in progress.
// @author       euphone
// @match        https://www.queslar.com/
// @match        http://www.queslar.com/
// @match        https://queslar.com/
// @match        http://queslar.com/
// @connect      notificationsounds.com
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/412489/Queslar%20Alerts.user.js
// @updateURL https://update.greasyfork.org/scripts/412489/Queslar%20Alerts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function runSetup()
    {
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

        var mainSoundFile = "https://proxy.notificationsounds.com/notification-sounds/eventually-590/download/file-sounds-1137-eventually.mp3";
        var resSoundFile = "https://proxy.notificationsounds.com/notification-sounds/clearly-602/download/file-sounds-1143-clearly.mp3";
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
	var lastResMessageID = playerGeneralService.chatService.channelList.one.messages[0].id;
	var partnerID = playerGeneralService.playerPartnerService.activePartner;
	var resCheck = playerGeneralService.playerPartnerService.partnerData[partnerID].currentHarvest;
    var lastWhisperID = playerGeneralService.chatService.channelList.whispers.messages[0].id;
    var lastVillageMessageID = playerGeneralService.chatService.channelList.village.messages[0].id;
	var resType;
    var activeChannel = playerGeneralService.chatService.activeChannel;

	playerGeneralService.chatService.socketService.socket._callbacks["$receive message"][0] = e => {
		chatSocket.next(e);

// Notifications for when your res is tagged with @ in our trade channel. Delete from this line up to and including the end comment if you don't like it.
        var newResMessageID = playerGeneralService.chatService.channelList.one.messages[0].id
		var resMessageContent = playerGeneralService.chatService.channelList.one.messages[0].message
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

                var nameOne = document.getElementsByClassName("cdk-drag");
                for (var i = 0; i < nameOne.length; i++)
                {
                var nameOneText = nameOne[i].innerText;
                if (nameOneText.includes("One"))
                {
                const oneButton = nameOne[i];
                oneButton.style.color = unreadColour;
                oneButton.onclick = function(){ oneButton.style.color = normalColour;
                }}
        }}
        }
// End of res trade notifications section.

// Notifications for when you receive a whisper. Delete from this line up and to including the end comment if you don't like it.
        var newWhisperID = playerGeneralService.chatService.channelList.whispers.messages[0].id
        var whisperRecipient = playerGeneralService.chatService.channelList.whispers.messages[0].receiverUsername.toLowerCase()
        if (lastWhisperID !== newWhisperID)
        {
        if (activeChannel !== "whispers")
        {
        if (whisperRecipient == yourUsername)
            {
            notifSound.play();
            lastWhisperID = newWhisperID;

            var nameWhisper = document.getElementsByClassName("cdk-drag");
            for (var j = 0; j < nameWhisper.length; j++)
            {
            var nameWhisperText = nameWhisper[j].innerText;
            if (nameWhisperText.includes("whispers"))
            {
            const whisperButton = nameWhisper[j];
            whisperButton.style.color = unreadColour;
            whisperButton.onclick = function(){ whisperButton.style.color = normalColour;}
            }}
            }
        }
        }
// End of whisper notification

// Notifications for when you are tagged with an @ in village chat. Delete from this line up to and including the end comment if you don't like it.
        var newVillageMessageID = playerGeneralService.chatService.channelList.village.messages[0].id
        var villageMessageContent = playerGeneralService.chatService.channelList.village.messages[0].message.toLowerCase()

        if (lastVillageMessageID != newVillageMessageID)
        {
            if (villageMessageContent.includes(yourTag))
            {
            notifSound.play();
            lastVillageMessageID = newVillageMessageID;
            if (activeChannel !== "village")
            {
            var nameVillage = document.getElementsByClassName("cdk-drag");
            for (var k = 0; k < nameVillage.length; k++)
            {
            var nameVillageText = nameVillage[k].innerText;
            if (nameVillageText.includes("village")){
            const villageButton = nameVillage[k];
            villageButton.style.color = unreadColour;
            villageButton.onclick = function(){ villageButton.style.color = normalColour;
            }}
            }}
        }}
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
