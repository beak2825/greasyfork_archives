// ==UserScript==
// @name         Box Critters mod helper
// @namespace    http://tampermonkey.net/
// @version      1.1.4
// @description  Contains some features to help modders on bc, you can see your items and rooms ids and some assets.
// @author       Keffen/Tekhion/Tehk8
// @match        https://boxcritters.com/play/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401611/Box%20Critters%20mod%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/401611/Box%20Critters%20mod%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var enter = document.createElement("br"); //we'll need it
    var items_button = document.createElement("button");
    items_button.innerHTML = "See every item id";
    items_button.setAttribute("onclick","window.showAllItemsIds();");
    var rooms_button = document.createElement("button");
    rooms_button.innerHTML = "See the available rooms ids";
    rooms_button.setAttribute("onclick","window.showRoomsIds();")
    var assets_button = document.createElement("button");
    assets_button.innerHTML = "See this room assets";
    assets_button.setAttribute("onclick","window.showRoomAssets();");
    var result = document.createElement("div");
    result.innerHTML = "BC mod helper successfully loaded.";
    result.setAttribute("id","bcmodhelper_result");
    document.body.appendChild(items_button);
    document.body.appendChild(rooms_button);
    document.body.appendChild(assets_button);
    document.body.appendChild(enter);
    document.body.appendChild(result);
    document.body.appendChild(enter);
    window.showAllItemsIds = function() {
		var itemstring="";
        var itemlist=world.data.items.Items;
		for(var i in itemlist) {
			itemstring+=itemlist[i].ItemId+",\n";
		}
		result.innerHTML=itemstring;
	}
    window.showRoomsIds = function() {
        var roomstring="";
        var roomdata=world.data.rooms;
        for(var i in roomdata) {
            roomstring+=roomdata[i].RoomId+",\n";
        }
        result.innerHTML=roomstring;
    }
    window.getRoomData = function() {
        var roomid=world.room.roomId;
        var roomdata=null;
        for(var i=0;i<world.data.rooms.length;i++) {
            if(world.data.rooms[i].RoomId==roomid) {
                roomdata=world.data.rooms[i];
                break;
            }
        }
        return roomdata;
    }
    window.showRoomAssets = function() {
        var roomdata = window.getRoomData();
        var assetsstring = "";
        assetsstring+="Room background: <img src=\""+roomdata.Background+"\" /><br />";
        assetsstring+="Room foreground: <img src=\""+roomdata.Foreground+"\" /><br />";
        assetsstring+="NavMesh: <img src=\""+roomdata.NavMesh+"\" /><br />";
        var client_map = roomdata.Map;
        if (client_map) {
            assetsstring+="Client map: <img src=\""+client_map+"\" /><br />";
        }
        else {
            assetsstring+="There is no client map.<br />";
        }
        assetsstring+="Server map: <img src=\""+roomdata.Background.replace("background.png","map_server.png")+"\" /><br />";
        var sprites = roomdata.Sprites.images[0];
        if(typeof sprites == "string") {
            assetsstring+="Sprites: <img src=\""+sprites+"\" /><br />";
        }
        else {
            assetsstring+="Sprites: <img src=\""+sprites.src+"\" /><br />";
        }
        result.innerHTML=assetsstring;
    }
})();