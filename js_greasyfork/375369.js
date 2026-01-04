// ==UserScript==
// @name         RPGBot
// @namespace    http://whatever.com/
// @version      1.337
// @description  rpgmo bot... click [Bot] in top right to turn on/off. type "/enemy <name>" to add enemies to the list
// @author       Frank Wolf
// @match        http://rpg.mo.ee/
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/375369/RPGBot.user.js
// @updateURL https://update.greasyfork.org/scripts/375369/RPGBot.meta.js
// ==/UserScript==


var btn = document.createElement("span");
btn.id = 'bot';
btn.innerText = '[ Bot ] ';
btn.style.color = 'red';
btn.onclick = function(){ toggle(); }
document.getElementById('toolbar_padding_holder').appendChild(btn);

//document.getElementById('toolbar_padding_holder').innerHTML += "<span id='bot' style='color:red;'> [Bot] </span>&nbsp;";
//document.getElementById('bot').setAttribute('onclick', "if (this.style.color == 'lime') {this.style.color = 'red';} else {this.style.color = 'lime';} startingPos.x = players[0].i; startingPos.y = players[0].j;");
Chat.client_commands['/en'] = function(a){ window.newEnemy = a.join(' '); };
Chat.client_commands['/scan'] = function(){
	for (var x=0; x<100; x++) {
		for (var y=0; y<100; y++) {
			if (!obj_g(on_map[current_map][x][y]).name) continue;
			if (obj_g(on_map[current_map][x][y]).name.toLowerCase().includes('[rare]')) {
				alert(x +' '+ y);
			}
		}
	}
};


function scan() { // can every so often for a rare
	for (var x=0; x<100; x++) {
		for (var y=0; y<100; y++) {
			if (!obj_g(on_map[current_map][x][y]).name) continue;
			if (obj_g(on_map[current_map][x][y]).name.toLowerCase().includes('[rare]')) alert(x +' '+ y);
			else console.log('nothing found');
		}
	}
}

function toggle() { // change color of [Bot], save position
	if (document.getElementById('bot').style.color == 'lime') {document.getElementById('bot').style.color = 'red';}
	else {document.getElementById('bot').style.color = 'lime';}
	startingPos.x = players[0].i;
	startingPos.y = players[0].j;
}

function target(enemy) {
	Socket.send("set_target", { target: enemy.id });
	players[0].path = enemy.path;
}

var startingPos = {}; // no starting position before starting the bot
var delay = 0; // dynamic delay
var enemies =   ['nothing',
                 'sapphire dragon']; // 69 27

setInterval(scan, 120000); // scan for rares every so often
setTimeout(erobot, 10000); // first run

function erobot() {
	setTimeout(erobot, 2000 + delay); // put this below any events that would cause extra delay
	var offset =  6; // 6; // max spots in any direction
	var maxView = 13; // 13; // width height of board. 17 should be good in fullscreen mode
	var coordX, coordY;
	var tempPath; // placeholder for shortest plath
	var enemy = {};

    enemy.path = new Array(100); // primed with long path. trying to find the smallest path
	delay = 0; // reset any additional delay for this loop
    updateEnemies(); // what even is this?

    if (document.getElementById('bot').style.color == 'red') {return;} // bots off
	if (inAFight) {return;} // exit if were in a fight
	if (players[0].path.length > 0) {return;} // exit if already walking somewhere
	if (skills[0].health.current*1.4 < players[0].params.health) {fatso(); return;} // eat if were low on health
	if (document.getElementById("captcha_menu").style.display == "block") {Music.sound_effect("notification"); return;} // exit if captchas up
	if (document.getElementById('penalty_points_bonus').innerText < 0) {return;} // exit if he have -1 captcha points
	if (document.getElementById("captcha_bonus_assign_form").style.display == "block") {return;} // exit if captchas up
	for (var z=0; z<enemies.length; z++) {
		for (var x=0; x<maxView; x++) {
			for (var y=0; y<maxView; y++) {
				coordX = players[0].i - offset+x;
				coordY = players[0].j - offset+y; //console.log(obj_g(on_map[current_map][coordX][coordY]));
				if (coordX < 0 || coordY < 0) continue; // < 0 would be off board and give error
                if (!obj_g(on_map[current_map][coordX][coordY]).name) continue;
				if (obj_g(on_map[current_map][coordX][coordY]).name.toLowerCase() != enemies[z].toLowerCase()) continue; // skip if not on enemies list
                if ( (players[0].i+1 == coordX && players[0].j == coordY) ||
                   (players[0].i-1 == coordX && players[0].j == coordY) ||
                   (players[0].j+1 == coordY && players[0].i == coordX) ||
                   (players[0].j-1 == coordY && players[0].i == coordX) ) { // enemy right next to us
					enemy.path = tempPath;
					enemy.i = coordX;
					enemy.j = coordY;
					enemy.id = on_map[current_map][coordX][coordY].id;
                    target(enemy);
					 console.log('right next to us');
                    return;
				}
				tempPath = findPathFromTo(players[0], {'i':coordX, 'j':coordY}, players[0]); // how long is the path to enemy
				if (tempPath.length === 0) continue; // skip, no path to enemy
				if (tempPath.length < enemy.path.length) { // find the shortest path
					enemy.path = tempPath;
					enemy.i = coordX;
					enemy.j = coordY;
					enemy.id = on_map[current_map][coordX][coordY].id;
				}
			}
		}
	}
	if (enemy.id) {target(enemy);}
	else { // no enemies, try walking back to where the bot started
		let coords = {};
		let range = {};
		range.x = Math.abs(startingPos.x - players[0].i);
		range.y = Math.abs(startingPos.y - players[0].j);

		if (range.x > 6) range.x = 6;
		if (range.y > 6) range.y = 6;

		for (var x=0; x<range.x; x++) {
			for (var y=0; y<range.y; y++) {
				if (players[0].i <= startingPos.x) coords.x = players[0].i + range.x - x;
				else coords.x = players[0].i - range.x + x;

				if (players[0].j <= startingPos.y) coords.y = players[0].j + range.y - x;
				else coords.y = players[0].j - range.y + y;

				let path = findPathFromTo(players[0], {'i':coords.x, 'j':coords.y}, players[0]);
				console.log(path);
				if (path.length > 0) {
					players[0].path = path;
					return;
				}
			}
		}
	}
}
// the effort of life would be worth it if there was an ultimate goal
function updateEnemies() { // what is this even?
    if (!window.newEnemy) return;
    else if (enemies.indexOf(window.newEnemy) == -1) {
        enemies.push(window.newEnemy);
        window.newEnemy = ''; console.log(enemies);
    }
    else {
        enemies.splice(enemies.indexOf(window.newEnemy), 1);
        window.newEnemy = ''; console.log(enemies);
    }
}

function fatso() { // this part works, but greasyfork wont let me post with it. assholes
	if (inAFight) {return;} // exit if were in a fight
	var tempItem;
	var lowestHeal;
	var lowestHealIndex;
	var count = 0;
	for (var i=0; i<players[0].temp.inventory.length; i++) {
		tempItem = item_base[players[0].temp.inventory[i].id];
		if (!tempItem.params.heal) continue; // not healing item
		if (!lowestHeal || tempItem.params.heal < lowestHeal) { // havent set first heal item, or found lower one
			lowestHeal = tempItem.params.heal; // found lower heal item
			lowestHealIndex = i;
			count = 0;
		}
		if (!lowestHeal) continue; // lowest heal not set yet
		if (tempItem.params.heal == lowestHeal) count++;
	}
	if (!lowestHealIndex) return; // nothing to eat was found
	var healthGap = players[0].params.health - skills[0].health.current;
	var foodClicks = Math.floor( healthGap/lowestHeal );
	if (count < foodClicks) foodClicks = count; // not enough food to get

	for (var k=0; k<foodClicks; k++) {
		setTimeout(function(){inventoryClick(lowestHealIndex); console.log('eating');}, k*220);
	}
	//inventoryClick(lowestHealIndex);
}

function bestWeapon() { // player asked for this to be a mods function
	var tempItem;
	var highestDmg;
	var highestDmgIndex;
	for (var i=0; i<players[0].temp.inventory.length; i++) {
		tempItem = item_base[players[0].temp.inventory[i].id];
		if (!tempItem.params.power) continue; // not healing item
		if (!highestDmg || tempItem.params.power > highestDmg) { // havent set first heal item, or found lower one
			highestDmg = tempItem.params.power;
			highestDmgIndex = i;
		}
	}
	if (!highestDmgIndex) return; // nothing to eat was found
	console.log(highestDmgIndex);
	inventoryClick(highestDmgIndex);
}






//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////// Proper Fishing //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

var drops = [
	{"id":127,"name":"cage"},
	{"id":78,"name":"lionfish"},
	{"id":14,"name":"salmon"},
	{"id":16,"name":"bass"},
	{"id":1370,"name":"eel"},
	{"id":86,"name":"angel"},
	{"id":100,"name":"shark"},
	{"id":98,"name":"manta"},
	{"id":1368,"name":"frog"},
	{"id":72,"name":"sardine"},
	{"id":10,"name":"trout"},
	{"id":8,"name":"perch"},
	{id:33, name:'tin'},
	//{id:185, name:'silver'},
	{id:186, name:'coal'},
	//{id:184, name:'gold'},
	{id:4, name:'sword'},
	{id:272, name:'bones'},
	//{id:484, name:'Wgold'}
];

var action = {i:30, j:90};

function toggleDrop(id, name) {
	for(var i=0; i<drops.length; i++) {
		if (drops[i].id == id) {
			drops.splice(i, 1); // add id and name to drops array
			return;
		}
	}
	var newDrop = {}; // necessary?
	newDrop.id = id;
	newDrop.name = name;
	drops.push(newDrop);
}
// inventory updated
Inventory.client_inventory_changed = function() {
	hasClass(document.getElementById("pet_nest_form"), "hidden") || Breeding.open_nest();
	windowOpen && (FormHelper.is_form_visible("forging") && Forge.forging_open(),
	FormHelper.is_form_visible("recycle") && Forge.recycle_open(),
	FormHelper.is_form_visible("enchanting") && Forge.enchanting_open(),
	FormHelper.is_form_visible("fletching") && Fletching.open(),
	"block" == document.getElementById("cabinet_form").style.display && Chest.cabinet_open(!0),
	FormHelper.is_form_visible("armor_stand") && ArmorStand.open()),
	  console.log(players[0].temp.inventory[players[0].temp.inventory.length-1].id +' '+ players[0].temp.inventory[players[0].temp.inventory.length-1].selected); // log id
	if (players[0].temp.inventory.length == 40) setTimeout(dropShit, 5000);
	if (document.getElementById("captcha_menu").style.display == "block") {setTimeout(function(){ Music.sound_effect("notification"); }, 750); return;} // exit if captchas up
}
function dropShit() {
	let found = []; // items we found to be droppeg
	for (var i=0; i<players[0].temp.inventory.length; i++) {
			var invoItem = players[0].temp.inventory[i].id;
			for (records in drops) { // dont use for in here?
					if (invoItem == drops[records].id) {
							if (found.indexOf(drops[records].id) == -1) {
									found.push(drops[records].id);
									 console.log(found);console.log('found');
									Socket.send("inventory_destroy", {
											//item_id: drops[records].id,
											item_id: found[found.length-1],
											all: !0
									});
							}
					}
			}
	}
	setTimeout(function(){
			0 == players[0].path.length && "object" == typeof selected_object && selected_object.activities && selected_object.activities[0] && 0 < selected_object.activities[0].length && inDistance(players[0].i, players[0].j, selected_object.i, selected_object.j) && ActionMenu.act(0);
			selected_object = obj_g(on_map[current_map][action.i][action.j], players[0]);
	}, 2000);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


Chat.remove_line= function(a, b) {
	SpectateWindow.iframe && SpectateWindow.sendMessage({
		action: "remove_line_slave",
		line: a,
		moderator: b
	});
	for (var d = document.getElementsByClassName("chat_" + a), e = 0, g = d.length; e < g; e++) {
		var h = d[e];
		if (h) {
			var k = /(.*?)&gt;/g.exec(h.innerHTML)[0];
			h.innerHTML += k + " &lt;" + _ti("Message removed by {player}", {
				player: b
			}) + "&gt;"
		}
	}
	for (d = chat_history.length - 1; 0 <= d; d--) { // dont support censorship
		if (chat_history[d] && chat_history[d].id && chat_history[d].id == a) {
			chat_history[d].text += "<" + _ti("Message removed by {player}", {
				player: b
			}) + ">";
			break
		}
	}
}


// make transaction item clicky
Market.client_transaction_offers= function(a) {
    for (var b = 0, d = a.length; b < d; b++)
        a[b].available = parseInt(a[b].available),
            a[b].classes = b % 2 ? "row even" : "row";
    market_transaction_offers = a;
    document.getElementById("market_transaction_offers").innerHTML = Market.client_transaction_offers_template()({
        results: a
    });
    var listings = document.getElementById("market_transaction_offers").getElementsByClassName('row');
    for (var i=0; i<listings.length; i++) {
        id = listings[i].cells[1].childNodes[0].getAttribute("item_id");
        listings[i].cells[1].childNodes[0].setAttribute("onClick", "Market.find_buy("+id+")");
    }
}