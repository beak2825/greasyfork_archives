// ==UserScript==
// @name        Diep.io rMod (evergreen)
// @description Autospawn + Autofire + Dark Theme + Team Changer + Macros / Shortcuts + Class Tree + More!
// @author      condoriano
// @icon        http://i.imgur.com/T074JpV.png
// @include     http://diep.io/*
// @include     https://diep.io/*
// @connect     greasyfork.org
// @connect     diep.io
// @run-at      document-start
// @grant       none
// @version 0.0.1.20160804140021
// @namespace https://greasyfork.org/users/58576
// @downloadURL https://update.greasyfork.org/scripts/22005/Diepio%20rMod%20%28evergreen%29.user.js
// @updateURL https://update.greasyfork.org/scripts/22005/Diepio%20rMod%20%28evergreen%29.meta.js
// ==/UserScript==


function doMod() {
	var colorScheme = {
		'rgb(205,205,205)':		'rgb(38,38,38)',		// background
		'rgb(245,245,245)':		'rgb(222,222,222)',		// name
		'rgb(0,178,225)':		'rgb(22,127,255)',		// blue tanks & bullets
		'rgb(241,78,84)':		'rgb(255,33,33)',		// red tanks & bullets
		'rgb(153,153,153)':		'rgb(55,55,55)',		// tanks nozzle
		'rgb(85,85,85)':		'rgb(16,16,16)',		// outline for tanks, objects, minimap, names and health bar
		'rgb(255,232,105)':		'rgb(255,222,44)',		// square, sentry
		'rgb(252,118,119)':		'rgb(255,66,0)',		// triangle
		'rgb(118,141,252)':		'rgb(111,55,255)',		// hexagon
		'rgb(241,119,221)':		'rgb(255,111,255)',		// triangle bot
		'rgb(252,195,118)':		'rgb(255,155,55)'		// square minion
	};

	var debug_logc = false, debug_colors = [], debug_text = '';
	function onCanvasFill(fullColor) {
		fullColor = fullColor.replace(/ /g, '');
		//if(debug_logc) { if(debug_colors.indexOf(fullColor) == -1 && !colorScheme.hasOwnProperty(fullColor)) debug_colors.push(fullColor); }
		if(colorScheme.hasOwnProperty(fullColor)) return document.getElementById('optnDarkTheme').checked ? colorScheme[fullColor] : fullColor;
		else return fullColor;
	}
	function onCanvasStroke(fullColor) {
		fullColor = fullColor.replace(/ /g, '');
		//if(debug_logc) { if(debug_colors.indexOf(fullColor) == -1 && !colorScheme.hasOwnProperty(fullColor)) debug_colors.push(fullColor); }
		if(colorScheme.hasOwnProperty(fullColor)) return document.getElementById('optnDarkTheme').checked ? colorScheme[fullColor] : fullColor;
		else return fullColor;
	}

	setTimeout(function() {
		if(debug_logc) {
			for(var i=0; i<debug_colors.length; i++) debug_text += debug_colors[i] + '   ';
			if(debug_text !== '') prompt('Color list', debug_text);
		}
		debug_logc = false;
	}, 10000);

	var canvas = document.getElementById('canvas');
	var nick = document.getElementById('textInput');
	var optionsDiv, controlsDiv, popupsDiv, trDiv;
	var keepOptionOpen = false, playerAlive = -1;
	var tankUpgradeAttempt = 0;
	var holdingKey = {}, holdL = true;
	window.onbeforeunload = function() { return 'Quit game?'; };

	function editPanels() {
		optionsDiv = document.createElement('div');
		optionsDiv.id = 'gameOptions';
		optionsDiv.style = 'position: absolute; display: none; top: 50%; left: 50%; transform: translate(-50%, 0%); margin-top: 40px; width: 340px; padding: 6px 12px; border: 2px dashed #333; background-color: #EEE; color: #000; font-family: Tahoma; font-size: 12px;';
		optionsDiv.innerHTML = '<div></div><div></div><div></div><div></div>';
		document.body.insertBefore(optionsDiv, nick.parentElement.nextElementSibling);
		optionsDiv.children[0].style = 'margin-bottom: 4px; padding-bottom: 6px; border-bottom: 1px solid #888; font-family: Ubuntu; font-size: 16px; text-align: center';
		optionsDiv.children[1].style = 'display: none; padding: 6px 0px; text-align: center;';
		optionsDiv.children[2].style = 'margin-bottom: 12px;';
		optionsDiv.children[3].style = 'font-size: 10px; text-align: right; margin-top: 6px;';
		optionsDiv.children[0].innerHTML += 'Game Options<a style="position: absolute; top: 1px; right: 4px; color: #222; text-decoration: none; font-family: serif; font-size: 12px;" href="#">&#x2716;</a>';
		optionsDiv.children[1].innerHTML += '<strong>Party Code:</strong> <span id="partyCode" style="background-color: #CFC; padding: 1px 6px; border: 1px dashed #555;"></span> <a style="text-decoration: none; color: blue; margin-left: 4px;" href="">Change team</a>';
		optionsDiv.children[2].innerHTML += '<div><strong>(Z)</strong><label><input type="checkbox" id="optnAutoRespawnz">Auto respawn</label></div>';
		optionsDiv.children[2].innerHTML += '<div><strong>(X)</strong><label><input type="checkbox" id="optnAutoFire">Auto fire</label></div>';
		optionsDiv.children[2].innerHTML += '<div><strong>(C)</strong><label><input type="checkbox" id="optnAutoSpin">Auto spin</label></div>';
		optionsDiv.children[2].innerHTML += '<div><strong>(V)</strong><label><input type="checkbox" id="optnDarkTheme">Dark theme</label></div>';
		optionsDiv.children[2].innerHTML += '<div><strong>(B)</strong><label><input type="checkbox" id="optn4x3">4:3 aspect</label></div>';
		optionsDiv.children[3].innerHTML += '<span style="background-color: #222; padding: 1px 6px; border-radius: 2px; float: left; margin-right: 3px;"><a href="https://imgur.com/a/RcuUg" target="_blank" style="color: #AF3; text-decoration: none;">Classes treez</a> <a href="https://docs.google.com/spreadsheets/d/132Hlgn7gpZR9qgoII5Jm1Fu3Vpvw9bHJ-KFQrk3Nizk" target="_blank" style="color: #DDD; text-decoration: none;">(alt)</a> </span><a id="toggleControls" style="background-color: #222; color: #3DF; padding: 1px 6px; border-radius: 2px; text-decoration: none; float: left;" href="#">Controls</a>Mod by condoriano. <a style="color: blue; text-decoration: none;" target="_blank" href="https://greasyfork.org/en/scripts/19892-diep-io-auto-respawn-mod">Homepage</a><form style="display: inline-block;" id="donate-mod" action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank"><input name="cmd" value="_donations" type="hidden"><input name="business" value="keyzint@gmail.com" type="hidden"><input name="lc" value="US" type="hidden"><input name="item_name" value="Donation" type="hidden"><input name="no_note" value="0" type="hidden"><input name="currency_code" value="USD" type="hidden"><input name="bn" value="PP-DonationsBF:btn_donateCC_LG.gif:NonHostedGuest" type="hidden"><input style="height: 11px; vertical-align: bottom; margin-left: 5px;" name="submit" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" alt="PayPal btn" border="0" type="image"><img src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" alt="" height="1" border="0" width="1"></form>';

		popupsDiv = document.createElement('div');
		popupsDiv.id = 'notificationPopups';
		popupsDiv.style = 'position: absolute; display: flex; flex-direction: column-reverse; bottom: 10px; left: 210px; width: 260px; max-height: 200px; overflow: hidden; font-family: Ubuntu;';
		document.body.insertBefore(popupsDiv, optionsDiv.nextElementSibling);
		trDiv = document.createElement('div');
		trDiv.id = 'topRight';
		trDiv.style = 'position: absolute; top: 5px; right: 5px;';
		document.body.insertBefore(trDiv, popupsDiv.nextElementSibling);
		optionsDiv.children[0].getElementsByTagName('a')[0].onclick = function(e) { toggleOptions(); e.preventDefault(); };

		var options = optionsDiv.children[2];
		for(var i = 0; i < options.children.length; i++) {
			options.children[i].style = 'display: inline-block; width: 50%; margin: 2px 0px;';
			options.children[i].children[0].style = 'display: inline-block; width: 18px;';
			options.children[i].children[1].style = 'position: relative; top: 1px;';
			options.children[i].children[1].children[0].style = 'position: relative; top: 2px;';
		}
	}
	editPanels();

	var inputs = document.getElementsByTagName('input');
	for(var i = 0; i < inputs.length; i++) {
		if(!inputs[i].id) continue;
		if(localStorage.getItem(inputs[i].id) !== null) {
			if(inputs[i].type == 'checkbox') inputs[i].checked = JSON.parse(localStorage.getItem(inputs[i].id));
			else inputs[i].value = localStorage.getItem(inputs[i].id);
		}
		inputs[i].addEventListener('change', onInputsChanged);
	}
	function onInputsChanged() {
		if(this.id == 'optnAutoRespawnz' && this.checked) respawnPlayer();
		else if(this.id == 'optnAutoFire') simulateKeyPress(69);
		else if(this.id == 'optn4x3') toggle4x3(this.checked);
		if(this != nick) createPopup(this.parentNode.textContent + ' <span style="color: ' + (this.checked ? '#9D2;">Enabled</span>' : '#F33;">Disabled</span>'));
		if(this.type == 'checkbox') localStorage.setItem(this.id, this.checked);
		else localStorage.setItem(this.id, this.value);
	}
	function toggle4x3(enabled) {
		if(enabled) {
			canvas.setAttribute('width', window.innerHeight * 4 / 3 + 'px');
			canvas.style.width = window.innerHeight * 4 / 3 + 'px';
		}
		else {
			canvas.setAttribute('width', window.innerWidth);
			canvas.style.width = '';
		}
		optionsDiv.style.left = canvas.width / 2 + 'px';
	}

	var controls = {
		0: [  6,  7,'WASD', 'Move' ],
		1: [  6,  6, 'Mouse', 'Aiming & firing' ],
		2: [ 12, 12, '1-8', 'Stat upgrade' ],
		3: [  4,  3,' M + 1-8', 'Max stat upgrade' ],
		4: [  0,  0, 'Shift + 1-5', 'Tank upgrade' ],
		5: [ 10, 11, 'ESC', 'Options menu' ],
		6: [  6,  6, 'ZXCVB', 'Enable/disable options' ],
		7: [ 16, 15, 'E', 'Autofire' ],
		8: [ 16, 15, 'C', 'Spin tank' ],
		9: [ 16, 15, 'L', 'Server & ping info' ],
	}, controlStr = [];

	for(var i = 0; i < Object.keys(controls).length; i++) controlStr[i] = (new Array(controls[i][navigator.userAgent.toLowerCase().indexOf('firefox') != -1 ? 0 : 1] + 1).join(' ')) + controls[i][2] + '  :  ' + controls[i][3];
	document.getElementById('toggleControls').addEventListener('click', function(e) {
		alert(controlStr.join('\n'));
		e.preventDefault();
	});

	document.addEventListener('keydown', function(e) {
		var key = e.keyCode || e.which;
		if(holdingKey[key]) { e.stopPropagation(); return; }
		if(key == 27) toggleOptions();
		if(e.target == nick) { if(key == 13) onPlayerSpawn_Pre(); }
		else {
			if(!e.ctrlKey && !e.altKey && !e.shiftKey) {
				if(key == 76) e.stopPropagation();
				else if(key == 90) document.getElementById('optnAutoRespawnz').click();
				else if(key == 88) document.getElementById('optnAutoFire').click();
				else if(key == 67) document.getElementById('optnAutoSpin').click();
				else if(key == 86) document.getElementById('optnDarkTheme').click();
				else if(key == 66) document.getElementById('optn4x3').click();
			}
			else if(e.shiftKey) {
				if(key >= 49 && key <= 53) {
					tankUpgradeAttempt = 0;
					clickTankUpgrade(key);
				}
				e.stopPropagation();
			}
			holdingKey[key] = true;
		}
	});
	function clickTankUpgrade(key) {
		tankUpgradeAttempt++
		canvas.dispatchEvent(new MouseEvent('mousemove', { 'clientX': 60, 'clientY': 70 })); // 150,540
		if(canvas.style.cursor == 'pointer') {
			var nextTank = tankInfo.order[currentTank][key - 49];
			if(nextTank) {
				var data = new Uint8Array([4, nextTank]);
				proxiedSend.call(wsPrototype, data);
				currentTank = nextTank;
				createPopup('Tank upgrade: <span style="color: #FA2;">' + tankInfo.list[nextTank] + '</span>', 4000, '#811', '#FFF');
			}
			tankUpgradeAttempt = 0;
		}
		else if(tankUpgradeAttempt < 50) setTimeout(function() { clickTankUpgrade(key) }, 1);
	}

	document.addEventListener('keyup', function(e) {
		var key = e.keyCode || e.which;
		holdingKey[key] = false;
		if(key == 76) { // key L
			e.stopPropagation();
			if(document.activeElement != nick) {
				holdL = !holdL;
				simulateKeyPress(76, holdL);
			}
		}
	});
	function toggleOptions() {
		optionsDiv.style.display = optionsDiv.style.display == 'none' ? 'block' : 'none';
		keepOptionOpen = keepOptionOpen ? false : true;
	}
	function createPopup(msg, displayTime, bgClr, clr) {
		displayTime = displayTime === undefined ? 2000 : displayTime;
		bgClr = bgClr === undefined ? 'rgba(0, 0, 0, 0.8)' : bgClr;
		clr = clr === undefined ? '#DDD' : clr;
		var popup = document.createElement('div');
		popup.innerHTML = msg;
		popup.style = 'display: table; background-color: ' + bgClr + '; color: ' + clr + '; margin: 2px 0px; max-width: 260px; padding: 0px 16px 2px 16px; border-radius: ' + (popup.textContent.length > 50 ? '3px' : '30px') + '; font-size: 12px;';
		popupsDiv.insertBefore(popup, popupsDiv.firstChild);
		setTimeout(function() { popup.remove(); }, displayTime);
	}

	var observer = new MutationObserver(function(changes) {
		changes.forEach(function(change) {
			if(nick.parentElement.style.display == 'none') {
				onPlayerSpawn();
				playerAlive = true;
			}
			else {
				if(playerAlive == -1) onGameLoad();
				else if(playerAlive === true) onPlayerDeath();
				playerAlive = false;
			}
		});
	});
	observer.observe(nick.parentElement, { attributes: true, attributeFilter: ['style'] });

	function loadTrDiv() {
		window.google_ad_client = "ca-pub-8318511014856551"; window.google_ad_slot = "4263853620"; window.google_ad_width = 300; window.google_ad_height = 250;
		var container = document.getElementById('topRight'), script = document.createElement('script'), w = document.write, tDelay = Math.floor(Math.random() * 30000);
		document.write = function (content) { container.innerHTML = content; document.write = w; };
		script.src = 'http://pagead2.googlesyndication.com/pagead/show_ads.js';
		document.body.appendChild(script);
		setTimeout(function() { setIntervalX(tempFix, 1, 300); }, 100);
		setTimeout(function() {
			if(script) script.remove();
			setTimeout(loadTrDiv, 5000);
		}, tDelay);
	}
	setTimeout(loadTrDiv, 5000);

	function tempFix() { window.google_ad_client = undefined; }
	function onGameLoad() {
		nick.value = localStorage.getItem('textInput');
		optionsDiv.style.display = 'block';
		if(document.getElementById('optnAutoRespawnz').checked) setTimeout(function() { respawnPlayer(); }, 1000);
		if(document.getElementById('optn4x3').checked) toggle4x3(true);
	}
	function onPlayerSpawn_Pre() {
		trDiv.style.display = 'none';
		if(!keepOptionOpen) optionsDiv.style.display = 'none';
	}
	function onPlayerSpawn() {
		currentTank = 0;
		for(var i = 0; i < Object.keys(statInfo).length; i++) statInfo[Object.keys(statInfo)[i]][2] = 0;
		if(document.getElementById('optnAutoFire').checked) simulateKeyPress(69);
		if(document.getElementById('optnAutoSpin').checked) simulateKeyPress(67);
	}
	function onPlayerDeath() {
		trDiv.style.display = 'block';
		if(document.getElementById('optnAutoRespawnz').checked) respawnPlayer();
		else optionsDiv.style.display = 'block';
	}
	setInterval(function() {
		if(document.getElementById('optnAutoRespawnz').checked) respawnPlayer();
	}, 1000);
	function respawnPlayer() {
		trDiv.style.display = 'none';
		nick.focus();
		simulateKeyPress(13);
		if(!keepOptionOpen) optionsDiv.style.display = 'none';
	}
	['blur', 'focus'].forEach(function(e) {
		window.addEventListener(e, function() {
			holdingKey = {};
			if(e == 'focus' && holdL) simulateKeyPress(76, holdL);
		});
	});
	window.addEventListener('resize', function() { if(document.getElementById('optn4x3').checked) toggle4x3(true); });

	function simulateKeyPress(key, hold) {
		if(navigator.userAgent.toLowerCase().indexOf('firefox') != -1) {
			window.dispatchEvent(new KeyboardEvent('keydown', { keyCode: key }));
			if(!hold) { window.dispatchEvent(new KeyboardEvent('keyup', { keyCode: key })); }
		}
		else {
			var eventObj;
			eventObj = document.createEvent("Events"); eventObj.initEvent("keydown", true, true); eventObj.keyCode = key; window.dispatchEvent(eventObj);
			if(!hold) { eventObj = document.createEvent("Events"); eventObj.initEvent("keyup", true, true); eventObj.keyCode = key; window.dispatchEvent(eventObj); }
		}
	}
	function setIntervalX(callback, delay, repetitions) {
		var x = 0;
		var intervalID = window.setInterval(function () {
			callback();
			if(++x === repetitions) window.clearInterval(intervalID);
		}, delay);
	}

	// Big thanks to the folks at https://github.com/firebolt55439/Diep.io-Protocol for the codes below
	var proxiedSend = window.WebSocket.prototype.send;
	var wsInstances = new Set();
	var wsPrototype = null;
	window.WebSocket.prototype.send = function(data) {
		if(!wsInstances.has(this)) {
			wsInstances.add(this);
			var inst = this;
			var proxiedRecv = inst.onmessage;
			this.onmessage = function(event) {
				event = handleRecvData.call(this, event, proxiedRecv);
				return proxiedRecv.call(this, event);
			};
			wsPrototype = this;
			console.log("Successfully hijacked onmessage handler.");
		}
		data = handleSendData.call(this, data);
		return proxiedSend.call(this, data);
	};
	var statInfo = {
		0:  [ 'Movement Speed',      '43FFF9', 0 ],
		2:  [ 'Reload',              '82FF43', 0 ],
		4:  [ 'Bullet Damage',       'FF4343', 0 ],
		6:  [ 'Bullet Penetration',  'FFDE43', 0 ],
		8:  [ 'Bullet Speed',        '437FFF', 0 ],
		10: [ 'Body Damage',         '8543FF', 0 ],
		12: [ 'Max Health',          'F943FF', 0 ],
		14: [ 'Health Regen',        'FCAD76', 0 ]
	};
	var currentTank = 0;
	var tankInfo = {
		'list': {
			2: 'Twin', 4: 'Triplet', 6: 'Triple Shot', 8: 'Quad Tank', 10: 'Octo Tank', 12: 'Sniper', 14: 'Machine Gun', 16: 'Flank Guard', 18: 'Tri-Angle', 20: 'Destroyer',
			22: 'Overseer', 24: 'Overlord', 26: 'Twin Flank', 28: 'Penta Shot', 30: 'Assassin', 34: 'Necromancer', 36: 'Triple Twin', 38: 'Hunter', 40: 'Gunner',
			42: 'Stalker', 44: 'Ranger', 46: 'Booster', 48: 'Fighter', 50: 'Hybrid', 52: 'Manager', 56: 'X Hunter', 58: 'Sprayer', 60: 'Predator', 62: 'Trapper',
			64: 'Gunner Trapper', 66: 'Overtrapper', 68: 'Mega Trapper', 70: 'Tri-Trapper', 72: 'Smasher', 74: 'Mega Smasher', 76: 'Landmine', 78: 'Auto Gunner',
			82: '__flankguardslot4', 80: 'Auto Tank'
		},
		'order': {
			0:  [ 2, 12, 14, 16, 72],   // 'Default': [ 'Twin', 'Sniper', 'Machine Gun', 'Flank Guard', Smasher ],
			2:  [ 6, 8, 26 ],           // 'Twin': [ 'Triple Shot', 'Quad Tank', 'Twin Flank' ],
			12: [ 30, 22, 38, 62 ],     // 'Sniper': [ 'Assassin', 'Overseer', 'Hunter', 'Trapper' ],
			14: [ 20, 40, 58 ],         // 'Machine Gun': [ 'Destroyer', 'Gunner', Sprayer ],
			16: [ 18, 8, 26, 82 ],      // 'Flank Guard': [ 'Tri Angle', 'Quad Tank', 'Twin Flank', '__flankguardslot4' ],
			6:  [ 4, 28 ],              // 'Triple Shot': [ 'Triplet', 'Penta Shot' ],
			8:  [ 10 ],                 // 'Quad Tank': [ 'Octo Tank' ],
			26: [ 10, 36 ],             // 'Twin Flank': [ 'Octo Tank', 'Triple Twin' ],
			30: [ 44, 42 ],             // 'Assassin': [ 'Ranger', 'Stalker' ],
			22: [ 24, 34, 52, 66 ],     // 'Overseer': [ 'Overlord', 'Necromancer', 'Manager', 'Overtrapper' ],
			20: [ 50 ],                 // 'Destroyer' : [ 'Hybrid' ],
			18: [ 46, 48 ],             // 'Tri-Angle': [ 'Booster', 'Fighter' ],
			38: [ 56, 60 ],             // 'Hunter': [ 'X Hunter', 'Predator' ],
			40: [ 78, 64 ],             // 'Gunner': [ 'Auto Gunner', 'Gunner Trapper' ],
			62: [ 70, 64, 66, 68 ],     // 'Trapper': [ 'Tri-Trapper', 'Gunner Trapper', 'Overtrapper', 'Mega Trapper' ]
			72: [ 74, 76 ],             // 'Smasher': [ 'Mega Smasher', 'Landmine' ]
			82: [ 80, 78 ]              // '__flankguardslot4': [ 'Auto Tank', 'Auto Gunner' ]
		},
		'fullorder': { 0:{2:{6:[4,28],8:[10],26:[10,36]},12:{30:[44,42],22:[24,34,52,66],38:[56,60],62:[70,64,66,68]},14:{20:[50],40:[78,64],58:[]},16:{18:[46,48],8:[10],26:[10,36],82:[80,78]},72:{74:[],76:[]}} }
	};
	function handleRecvData(event, proxiedRecv) {
		var dv = new DataView(event.data);
		var arr = new Uint8Array(event.data);
		if(arr[0] == 4) { // server info
			var str = String.fromCharCode.apply(null, arr.slice(1, arr.length - 1));
			console.log('WS Packet: ServerInfo. str: ' + str);
			if(str.indexOf(':') != -1) getPartyHash(); // other than FFA mode
			else document.getElementById('partyCode').parentElement.style.display = 'none';
		}
		return event;
	}
	function handleSendData(data) {
		if(data[0] == 0 || data[0] == 2) { // server connect
			var str = String.fromCharCode.apply(null, data.slice(1, data.length - 1));
			if(data[0] == 0) {
				console.log('WS Packet: OnConnect. Player ID: ' + str);
				if(playerAlive == -1) simulateKeyPress(76, true);
			}
			else console.log('WS Packet: OnSpawn. Name: "' + str + '"');
		}
		else if(data[0] == 3) { // stat upgrade
			var upgrade = data[1];
			statInfo[upgrade][2]++;
			createPopup('Upgraded level ' + statInfo[upgrade][2] + ' <span style="color: #' + statInfo[upgrade][1] + '">' + statInfo[upgrade][0] + '</span>');
		}
		else if(data[0] == 4) { // tank upgrade
			var upgrade = data[1];
			if(tankInfo.list.hasOwnProperty(upgrade)) {
				currentTank = upgrade;
				createPopup('Tank upgrade: <span style="color: #FA2;">' + tankInfo.list[upgrade] + '</span>', 4000, '#800');
			}
			else createPopup('New tank ID: ' + upgrade + '<br> Please notify MOD author of the ID so it can be included.', 16000, '#FFF', '#000');
		}
		return data;
	}

	var proxiedStrokeText = CanvasRenderingContext2D.prototype.strokeText;
	function getPartyHash() {
		if(location.hash) getPartyCode(location.host + '/' + location.hash);
		else {
			CanvasRenderingContext2D.prototype.strokeText = function() {
				if(arguments[0].indexOf('diep.io/#') != -1) {
					getPartyCode(arguments[0]);
					CanvasRenderingContext2D.prototype.strokeText = proxiedStrokeText;
				}
				return proxiedStrokeText.apply(this, arguments);
			};
		}
	}
	function getPartyCode(code) {
		var tempArr = { 0:1,2:3,4:5,6:7,8:9,1:0,3:2,5:4,7:6,9:8,'A':'B','C':'D','E':'F','B':'A','D':'C','F':'E' };
		var code2 = code.substr(0, code.length - 2);
		code2 += tempArr[code[code.length - 2]] + code[code.length - 1];
		document.getElementById('partyCode').innerHTML = code.substr(8);
		document.getElementById('partyCode').nextElementSibling.addEventListener('click', function(e) {
			location.assign(code2.substr(8));
			location.reload();
			e.preventDefault();
		});
		document.getElementById('partyCode').parentElement.style.display = 'block';
	}
}


