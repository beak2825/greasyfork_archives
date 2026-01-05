var colorScheme = {
	'rgb(205,205,205)':		'rgb(30,30,30)',		// background
	'rgb(245,245,245)':		'rgb(222,222,222)',		// name
	'rgb(255,255,255)':		'rgb(255,255,255)',		// all text except name
	'rgb(0,0,0)':			'rgb(0,0,0)',			// black overlays usually semi opaque
	'rgb(0,178,225)':		'rgb(22,99,222)',		// blue tank
	'rgb(241,78,84)':		'rgb(222,22,22)',		// red tank / ffa bullet
	'rgb(153,153,153)':		'rgb(55,55,55)',		// tank's nozzle
	'rgb(85,85,85)':		'rgb(10,10,10)',		// outline for objects, names and healthbar

	'rgb(255,232,105)':		'rgb(255,222,55)',		// square
	'rgb(252,118,119)':		'rgb(255,66,33)',		// triangle
	'rgb(118,141,252)':		'rgb(111,55,255)',		// hexagon
	'rgb(241,119,221)':		'rgb(255,111,255)',		// triangle bot
	'rgb(252,195,118)':		'rgb(255,155,55)',		// square minion

	'rgb(252,173,118)':		'rgb(252,173,118)',		// stat - hp regen
	'rgb(249,67,255)':		'rgb(249,67,255)',		// stat - max hp
	'rgb(133,67,255)':		'rgb(133,67,255)',		// stat - body dmg
	'rgb(67,127,255)':		'rgb(67,127,255)',		// stat - bullet speed
	'rgb(255,222,67)':		'rgb(255,222,67)',		// stat - bullet penetration
	'rgb(255,67,67)':		'rgb(255,67,67)',		// stat - bullet damage
	'rgb(130,255,67)':		'rgb(130,255,67)',		// stat - reload
	'rgb(67,255,249)':		'rgb(67,255,249)',		// stat - move speed
};

function onCanvasFill(fullColor) {
	fullColor = fullColor.replace(/ /g, '');
	if(colorScheme.hasOwnProperty(fullColor)) return document.getElementById('optnDarkTheme').checked ? colorScheme[fullColor] : fullColor;
	else return fullColor;
}
function onCanvasStroke(fullColor) {
	fullColor = fullColor.replace(/ /g, '');
	if(colorScheme.hasOwnProperty(fullColor)) return document.getElementById('optnDarkTheme').checked ? colorScheme[fullColor] : fullColor;
	else return fullColor;
}

var canvas = document.getElementById('canvas');
var nick = document.getElementById('textInput');
var optionsDiv, popupsDiv;
var keepOptionOpen = false, playerAlive = -1;
var holdingKey = {};
var tankInfo = {}, statInfo = {}, currentTank = '';

function editPanels() {
	optionsDiv = document.createElement('div');
	optionsDiv.id = 'gameOptions';
	optionsDiv.style = 'position: absolute; display: none; top: 60%; left: 50%; transform: translate(-50%, 0%); width: 340px; padding: 6px 12px; border: 2px dashed #333; background-color: #EEE; color: #000; font-family: Tahoma; font-size: 12px;';
	optionsDiv.innerHTML = '<div></div><div></div><div></div>';
	document.body.insertBefore(optionsDiv, nick.parentElement.nextElementSibling);
	optionsDiv.children[0].style = 'margin-bottom: 4px; padding-bottom: 6px; border-bottom: 1px solid #888; font-family: Ubuntu; font-size: 16px; text-align: center';
	optionsDiv.children[1].style = 'margin-bottom: 12px;';
	optionsDiv.children[2].style = 'font-size: 10px; text-align: right;';
	optionsDiv.children[0].innerHTML += 'Game Options<a style="position: absolute; top: 1px; right: 4px; color: #222; text-decoration: none; font-family: serif; font-size: 12px;" href="#">&#x2716;</a>';
	optionsDiv.children[1].innerHTML += '<div><strong>(Z)</strong><label><input type="checkbox" id="optnAutoRespawn">Auto respawn</label></div>';
	optionsDiv.children[1].innerHTML += '<div><strong>(X)</strong><label><input type="checkbox" id="optnAutoFire">Auto fire</label></div>';
	optionsDiv.children[1].innerHTML += '<div><strong>(C)</strong><label><input type="checkbox" id="optn4x3">4:3 aspect</label></div>';
	optionsDiv.children[1].innerHTML += '<div><strong>(V)</strong><label><input type="checkbox" id="optnDarkTheme">Dark theme</label></div>';
	optionsDiv.children[2].innerHTML += 'Mod by condoriano. <a style="color: blue; text-decoration: none;" target="_blank" href="https://greasyfork.org/en/scripts/19892-diep-io-auto-respawn-mod">Homepage</a> - <a style="color: blue; text-decoration: none;" target="_blank" href="http://pastebin.com/raw/MQGQLuiy">Source</a> <form style="display: inline-block;" id="donate-mod" action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank"><input name="cmd" value="_donations" type="hidden"><input name="business" value="keyzint@gmail.com" type="hidden"><input name="lc" value="US" type="hidden"><input name="item_name" value="Donation" type="hidden"><input name="no_note" value="0" type="hidden"><input name="currency_code" value="USD" type="hidden"><input name="bn" value="PP-DonationsBF:btn_donateCC_LG.gif:NonHostedGuest" type="hidden"><input style="height: 11px; vertical-align: bottom; margin-left: 5px;" name="submit" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" alt="PayPal btn" border="0" type="image"><img src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" alt="" height="1" border="0" width="1"></form>';

	popupsDiv = document.createElement('div');
	popupsDiv.id = 'notificationPopups';
	popupsDiv.style = 'position: absolute; display: flex; flex-direction: column-reverse; bottom: 10px; left: 210px; width: 260px; max-height: 200px; overflow: hidden; font-family: Ubuntu;';
	document.body.insertBefore(popupsDiv, optionsDiv.nextElementSibling);
	optionsDiv.children[0].getElementsByTagName('a')[0].onclick = function(e) { toggleOptions(); e.preventDefault(); };

	var options = optionsDiv.children[1];
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
	if(this.id == 'optnAutoRespawn' && this.checked) respawnPlayer();
	else if(this.id == 'optnAutoFire') canvas.dispatchEvent(new MouseEvent(this.checked ? 'mousedown' : 'mouseup'));
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
document.addEventListener('keydown', function(e) {
	var key = e.keyCode || e.which;
	if(key == 27) toggleOptions();
	if(document.activeElement == nick) { if(key == 13) onPlayerSpawn_Pre(); }
	else {
		if(e.ctrlKey || e.altKey) return;
		if(key == 90) document.getElementById('optnAutoRespawn').click();
		else if(key == 88) document.getElementById('optnAutoFire').click();
		else if(key == 67) document.getElementById('optn4x3').click();
		else if(key == 86) document.getElementById('optnDarkTheme').click();
	}
});
function toggleOptions() {
	optionsDiv.style.display = optionsDiv.style.display == 'none' ? 'block' : 'none';
	keepOptionOpen = keepOptionOpen ? false : true;
}
function createPopup(msg, displayTime=2000, bgColor='rgba(0,0,0,0.7)') {
	var popup = document.createElement('div');
	popup.style = 'display: table; background-color: ' + bgColor + '; color: #DDD; margin: 2px 0px; max-width: 260px; padding: 0px 16px 2px 16px; border-radius: 30px; font-size: 12px;';
	popup.innerHTML = msg;
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

function onGameLoad() {
	nick.value = localStorage.getItem('textInput');
	optionsDiv.style.display = 'block';
	if(document.getElementById('optnAutoRespawn').checked) setTimeout(function() { respawnPlayer(); }, 1000);
	if(document.getElementById('optn4x3').checked) toggle4x3(true);
}
function onPlayerSpawn_Pre() { if(!keepOptionOpen) optionsDiv.style.display = 'none'; }
function onPlayerSpawn() {
	currentTank = '';
	for(var i = 0; i < statInfo.level.length; i++) statInfo.level[i] = 0;
	if(document.getElementById('optnAutoFire').checked) canvas.dispatchEvent(new MouseEvent('mousedown'));
}
function onPlayerDeath() {
	if(document.getElementById('optnAutoRespawn').checked) respawnPlayer();
	else optionsDiv.style.display = 'block';
}
function respawnPlayer() {
	nick.focus();
	if(navigator.userAgent.toLowerCase().indexOf('firefox') != -1) {
		window.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 13 }));
		window.dispatchEvent(new KeyboardEvent('keyup', { keyCode: 13 }));
	}
	else {
		var eventObj;
		eventObj = document.createEvent("Events"); eventObj.initEvent("keydown", true, true); eventObj.keyCode = 13; window.dispatchEvent(eventObj);
		eventObj = document.createEvent("Events"); eventObj.initEvent("keyup", true, true); eventObj.keyCode = 13; window.dispatchEvent(eventObj);
	}

	if(!keepOptionOpen) optionsDiv.style.display = 'none';
}
['blur', 'focus'].forEach(function(e) {
	window.addEventListener(e, function() {
		if(document.getElementById('optnAutoFire').checked) canvas.dispatchEvent(new MouseEvent('mousedown'));
		holdingKey = {};
	});
});
canvas.addEventListener('click', function() {
	if(document.getElementById('optnAutoFire').checked) {
		canvas.dispatchEvent(new MouseEvent('mouseup'));
		canvas.dispatchEvent(new MouseEvent('mousedown'));
	}
});
window.addEventListener('resize', function() { if(document.getElementById('optn4x3').checked) toggle4x3(true); });

function modCanvas() {
	currentTank = '';
	tankInfo = {
		'tankList': {
			'Twin': [ 'Triple Shot', 'Quad Tank', 'Twin Flank' ],
			'Sniper': [ 'Assassin', 'Overseer', 'Hunter' ],
			'Machine Gun': [ 'Destroyer', 'Gunner' ],
			'Flank Guard': [ 'Quad Tank', 'Twin Flank', 'Tri Angle' ],
			'Triple Shot': [ 'Triplet', 'Penta Shot' ],
			'Quad Tank': [ 'Octo Tank' ],
			'Twin Flank': [ 'Octo Tank', 'Triple Twin' ],
			'Overseer': [ 'Overlord', 'Necromancer' ],
			'Assassin': [ 'Stalker' ],
		},
		'titlePos': [ 59, 22 ],
		'buttonWidth': 62,
		'buttonHeight': 62,
		'buttonX': 36,
		'buttonY': [ 44, 117, 190, 263 ],
	};
	statInfo = {
		'name': [ 'Health Regen', 'Max Health', 'Body Damage', 'Bullet Speed', 'Bullet Penetration', 'Bullet Damage', 'Reload', 'Movement Speed' ],
		'color': [ 'FCAD76', 'F943FF', '8543FF', '437FFF', 'FFDE43', 'FF4343', '82FF43', '43FFF9' ],
		'oldcolor': [ 'FFAA55', 'FF55FF', 'AA55FF', '55AAFF', 'FFFF55', 'FF3333', '55FF55', '55FFFF' ],
		'level': [ 0, 0, 0, 0, 0, 0, 0, 0 ],
		'buttonWidth': 26,
		'buttonHeight': 9,
		'buttonX': 138,
		'buttonY': [ 540, 556, 572, 588, 604, 620, 636, 652 ],
	};

	document.addEventListener('keydown', function(e) {
		var key = e.keyCode || e.which;
		if(e.ctrlKey || e.altKey) return;
		if(key >= 49 && key <= 56) {
			if(holdingKey[key]) return;
			var upgrade = key - 49;
			if(e.shiftKey) handleTankUpgrade(upgrade, true);
			handleStatUpgrade(upgrade, true);
		}
		holdingKey[key] = true;
	});
	document.addEventListener('keyup', function(e) {
		var key = e.keyCode || e.which;
		holdingKey[key] = false;
	});
	function populatePoses() {
		for(var i = 0; i < tankInfo.buttonY.length; i++) tankInfo.buttonY[i] = 44 + i * 73;
		for(i = 0; i < statInfo.name.length; i++) statInfo.buttonY[i] = canvas.height - 143 + i * 16;
	}
	populatePoses();
	window.addEventListener('resize', populatePoses);
	canvas.addEventListener('click', function(e) {
		if(canvas.style.cursor == 'pointer') {
			for(var i = 0; i < statInfo.name.length; i++) {
				if(e.clientY >= tankInfo.buttonY[i] && e.clientY <= tankInfo.buttonY[i] + tankInfo.buttonHeight && e.clientX >= tankInfo.buttonX && e.clientX <= tankInfo.buttonX + tankInfo.buttonWidth) handleTankUpgrade(i);
				else if(e.clientY >= statInfo.buttonY[i] && e.clientY <= statInfo.buttonY[i] + statInfo.buttonHeight && e.clientX >= statInfo.buttonX && e.clientX <= statInfo.buttonX + statInfo.buttonWidth) handleStatUpgrade(i);
			}
		}
	});
	function handleTankUpgrade(upgrade, byKey) {
		if(byKey) {
			var ctx = canvas.getContext("2d");
			var imgData = ctx.getImageData(tankInfo.titlePos[0], tankInfo.titlePos[1], 1, 1);
			if(imgData.data[0] >= 220 && imgData.data[1] >= 220 && imgData.data[2] >= 220) simulateClick(tankInfo.buttonX, tankInfo.buttonY[upgrade]);
			else return;
		}
		if(currentTank === '') currentTank = Object.keys(tankInfo.tankList)[upgrade];
		else currentTank = tankInfo.tankList[currentTank][upgrade];
		if(currentTank) createPopup('Tank upgrade: <span style="color: #FA2;">' + currentTank + '</span>', 4000, '#500');
	}
	function handleStatUpgrade(upgrade, byKey) {
		var ctx = canvas.getContext("2d");
		var imgData = ctx.getImageData(statInfo.buttonX, statInfo.buttonY[upgrade] - 1, 1, 2);
		if(imgData.data[0] < 90 && imgData.data[1] < 90 && imgData.data[2] < 90) {
			if(isStatOpen(imgData)) {
				if(statInfo.level[upgrade]) statInfo.level[upgrade]++;
				else {
					imgData = ctx.getImageData(26, statInfo.buttonY[upgrade], 1, 1);
					if(imgData.data[0] < 90 && imgData.data[1] < 90 && imgData.data[2] < 90) statInfo.level[upgrade]++;
				}
				if(statInfo.level[upgrade] <= 7) createPopup('Upgraded level ' + statInfo.level[upgrade] + ' <span style="color: #' + statInfo.color[upgrade] + '">' + statInfo.name[upgrade] + '</span>');
			}
		}
	}
	function isStatOpen(imgData) {
		if(document.getElementById('optnDarkTheme').checked) {
			var low, high;
			for(var i=4; i<=6; i++) {
				if(imgData.data[i] > 180 && imgData.data[i] < 200) high = true;
				else if(imgData.data[i] > 40 && imgData.data[i] < 100) low = true;
			}
			if(low && high) return true;
		}
		else if(document.getElementById('optnDarkTheme').checked === false && (imgData.data[4] > 220 || imgData.data[5] > 220 || imgData.data[6] > 220)) return true;
	}
	return false;
}
function simulateClick(x,y) {
	var ev = new MouseEvent('mousemove', { 'clientX': x, 'clientY': y }); canvas.dispatchEvent(ev);
	ev = new MouseEvent('mousedown', { 'clientX': x, 'clientY': y }); canvas.dispatchEvent(ev);
	ev = new MouseEvent('mouseup', { 'clientX': x, 'clientY': y }); canvas.dispatchEvent(ev);
}
modCanvas();