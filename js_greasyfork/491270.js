// ==UserScript==
// @name 	     Fort bot
// @description TW script to move by chat commands
// @author 	You
// @version 	0.1.8
// @include 	https://*.the-west.*.*/game.php*
// @namespace    http://tampermonkey.net/
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491270/Fort%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/491270/Fort%20bot.meta.js
// ==/UserScript==


function exec(fn) {
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = '(' + fn + ')();';
    document.body.appendChild(script);
    document.body.removeChild(script);
}

exec(function() {
GameMap.FortBot = {
    arrows: ["↑", "↓", "←", "→"],
    whitelist: [
        "EnergyStriker",
        "ShadowLegend",
        "Noob4eg",
        "3ак",
        "Raistlin Majere",
        "w1zard",
        "Gigant1",
        "Гера321",
    ],
    roomsListening:[],
    botToken: "7194106399:AAHjteUE6YljOAOLU5ILdGVRQXwtcEgWt5k",
    chatId: -732543551,

	onRoomAdded: function(room) {
        if (room.public || !room.client)
            return;
        let client = room.client.pname;
        if (!GameMap.FortBot.whitelist.some(x => x == client)) {
            GameMap.FortBot.sendTgNotification(`${Character.name}: личное сообщение от ${client}`);
            return;
        }

		var fortArrowSender = function (room, type, data) {
			switch (type) {
				case "NewMessage":
                    let div = $(data[0]);
                    let username = div.find(".client_name").html();
                    if (username == Character.name) return;

					let text = div.find(".chat_text").html();
                    let isFortCommand = false;
                    for (let i = 0; i < GameMap.FortBot.arrows.length; i++) {
                        if (text.containsString(GameMap.FortBot.arrows[i])) {
                            isFortCommand = true;
                            break;
                        }
                    }

					if(isFortCommand) {
                        GameMap.FortBot.setArrow(text, room.client.pname);
                        return;
					}

                    if (text == 'спать' && GameMap.Beans) {
                        GameMap.Beans.goSleep();
                    }

                    if (text == 'работать!' && GameMap.Beans) {
                        GameMap.Beans.goWork();
                    }

                    if (text == 'отменить' && GameMap.Beans) {
                        GameMap.Beans.cancelJobs();
                    }

				break;
			}
		};

        if(!GameMap.FortBot.roomsListening.hasOwnProperty(room.id)){
            GameMap.FortBot.roomsListening.push(room.id);
            room.addListener(fortArrowSender);
        }
	},

    setArrow: function(msg, client) {
        const width = 34;
        let direction = 0;
        const numbers = [];
        for (const match of msg.matchAll(/^(\d+)\W|>(\d+)</g)) {
            numbers.push(parseInt(match[1] || match[2]));
        }

        if (!numbers) return;
        let horizontalMoveIndex = numbers.length == 1 ? 0 : 1;
        if (msg.containsString(GameMap.FortBot.arrows[0]))
            direction -= numbers[0] * width;
        if (msg.containsString(GameMap.FortBot.arrows[1]))
           direction += numbers[0] * width;
        if (msg.containsString(GameMap.FortBot.arrows[2]))
           direction -= numbers[horizontalMoveIndex];
        if (msg.containsString(GameMap.FortBot.arrows[3]))
           direction += numbers[horizontalMoveIndex];

        GameMap.FortBot.GoToCell(direction);
        Chat.Request.Tell(client, "+");
    },

    sendTgNotification: function(message) {
        fetch(`https://api.telegram.org/bot${GameMap.Beans.botToken}/sendMessage?chat_id=${GameMap.Beans.chatId}&text=${message}`);
    },
};

FortBattleWindow.addPointerEventsNotPatched = FortBattleWindow.addPointerEvents;
FortBattleWindow.addPointerEvents = function () {
    FortBattleWindow.addPointerEventsNotPatched.call(this);
    var that = this;
    GameMap.FortBot.GoToCell = function(toCell) {
        EventHandler.signal(`${that.mainId}_send_order`,
            [that.ownPlayer.characterid, that.ownPlayer.position + toCell]);
    }
}


$(document).ready(function() {
	try {
        EventHandler.listen("chat_room_added",function(room){
            GameMap.FortBot.onRoomAdded(room);
		});
	} catch(e) {
		alert("Fort bot error: " + e);
	}
});
});