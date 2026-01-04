// ==UserScript==
// @name 	     TW beeper
// @description TW script for beeping when your nick was typed in chat
// @author 	Macabre2077
// @version 	0.73
// @include 	https://*.the-west.*.*/game.php*
// @namespace https://greasyfork.org/users/1156278
// @downloadURL https://update.greasyfork.org/scripts/487351/TW%20beeper.user.js
// @updateURL https://update.greasyfork.org/scripts/487351/TW%20beeper.meta.js
// ==/UserScript==


function exec(fn) {
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = '(' + fn + ')();';
    document.body.appendChild(script);
    document.body.removeChild(script);
}

exec(function() {
Sounds = {
	roomsListening:[],
	playSound: function(sound) {
		AudioController.play(sound);
	},
	addListeners: function() {
		var roomChanged = function (room, type, data) {
			switch (type) {
				case "NewMessage":
					var div = $(data[0]);
					var text = div.find(".chat_text").html();
					if (!text) return;
					var nickInText = text.toLowerCase().indexOf(Chat.MyClient.pname.toLowerCase()) > -1;
					if(nickInText) {
						Sounds.playSound('newmsg');
					}
				break;
			}
		};
		var r, room, rooms = Chat.Resource.Manager.getRooms();
		for(r in rooms) {
			room = Chat.Resource.Manager.getRoom(r);
			if(!Sounds.roomsListening.hasOwnProperty(room.id)){
				Sounds.roomsListening.push(room.id);
				room.addListener(roomChanged);
			}
		}
	},
};

$(document).ready(function() {
	try {
		if(EventHandler.hasOwnProperty("add")) {
			EventHandler.add("chat_room_added",function(room){
				Sounds.addListeners();
			});
		} else {
			EventHandler.listen("chat_room_added",function(room){
				Sounds.addListeners();
			});
		}
	} catch(e) {
		console.log(e.stack);
		alert("TW Beeper error: " + e);
	}
});
});