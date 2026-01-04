// ==UserScript==
// @name         Multi-Item mod
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  Lets you wear multiple items of same type on Box Critters. You can also see your items ids and a player list.
// @author       Keffen/Tekhion/Tehk8
// @match        https://boxcritters.com/play/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401102/Multi-Item%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/401102/Multi-Item%20mod.meta.js
// ==/UserScript==

(function() {
    	var form = document.createElement("form");
	form.setAttribute("id","multiitem-form");
    var linebreak = document.createElement("br");
	var item_label = document.createElement("label");
	item_label.setAttribute("id","multiitem-itemlabel");
	item_label.innerHTML="Item id";
	var item_input = document.createElement("input");
	item_input.setAttribute("type","text");
	item_input.setAttribute("id","multiitem-iteminput");
	var slot_label = document.createElement("label");
	slot_label.innerHTML="New item type";
	slot_label.setAttribute("id","multiitem-slotlabel");
	var slot_input = document.createElement("input");
	slot_input.setAttribute("type","text");
	slot_input.setAttribute("id","multiitem-slotinput");
	var submit = document.createElement("button");
	submit.setAttribute("id","multiitem-submit");
	submit.setAttribute("onClick","world.changeItemTypeButton();");
	submit.innerHTML="Change the item";
	var see_items = document.createElement("button");
	see_items.setAttribute("id","multiitem-itemlist");
	see_items.setAttribute("onClick","world.showItemsIds();");
	see_items.innerHTML="See your items ids";
	var see_players = document.createElement("button");
	see_players.setAttribute("id","multiitem-playerlist");
	see_players.setAttribute("onClick","world.showOnlinePlayers();");
	see_players.innerHTML="See the online players names in this room";
	var result = document.createElement("p");
	result.setAttribute("id","multiitem-result");
	result.innerHTML="BC-MultiItem successfully loaded.";
	form.appendChild(item_label);
	form.appendChild(item_input);
	form.appendChild(slot_label);
	form.appendChild(slot_input);
	document.body.appendChild(form);
	document.body.appendChild(result);
	document.body.appendChild(submit);
	document.body.appendChild(see_items);
	document.body.appendChild(see_players);
    document.body.appendChild(linebreak);
	world.changeItemTypeButton = function() {
		var item_id = document.getElementById("multiitem-iteminput").value;
		var item_type = document.getElementById("multiitem-slotinput").value;
		world.changeItemType(item_id,item_type);
	}
	world.changeItemType = function(item_id,item_type) {
		var found = false;
		for(var i=0;i<world.player.inventory.length;i++) {
			if(world.player.inventory[i].itemId == item_id) {
				found = true;
				world.player.inventory[i].slot=item_type;
			}
		}
		var result=document.getElementById("multiitem-result");
		if(found) {
			result.innerHTML="Result: Item modified!";
		}
		else {
			result.innerHTML="Result: Item not found.";
		}
	}
	world.showItemsIds = function() {
		var itemlist="";
		for(var i=0;i<world.player.inventory.length;i++) {
			itemlist+=world.player.inventory[i].itemId+"\n";
		}
		alert(itemlist);
	}
	world.showOnlinePlayers = function() {
		var playerlist="";
		for(var i in world.room.players) {
			playerlist+=world.room.players[i].n+"\n";
		}
		alert(playerlist);
	}
	world.commands.change = function(options) {
		world.changeItemType(options[0],options[1]);
	}


})();