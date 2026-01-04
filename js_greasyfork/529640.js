// ==UserScript==
// @name         MOOMOO.IO SUPER MOD!! ALL WORKING! MOD, OP INSTA, OP CPS(50+), AND MORE!
// @namespace    BEST radar in MooMoo.io
// @version      7
// @description  [G] For Spike + BoostPad, [N] For 1 Windmills, [O] For 5 Windmills, [H] For Turrets [F] For BoostPad, [V] For Spike, [P] For 4 Walls, [B] for Active/Unactive Auto Hat and [M] For 4 Spikes, [T] for Active/Unactive AutoHeal, [R] for Insta-Kill and [I] for 4 Trap or BoostPad !
// @author       Nuro.
// @match        *://moomoo.io/*
// @match        *://dev.moomoo.io/
// @match        *://sandbox.moomoo.io/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.5/socket.io.min.js
// @require https://greasyfork.org/scripts/368273-msgpack/code/msgpack.js?version=598723
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @require https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.js

// @downloadURL https://update.greasyfork.org/scripts/529640/MOOMOOIO%20SUPER%20MOD%21%21%20ALL%20WORKING%21%20MOD%2C%20OP%20INSTA%2C%20OP%20CPS%2850%2B%29%2C%20AND%20MORE%21.user.js
// @updateURL https://update.greasyfork.org/scripts/529640/MOOMOOIO%20SUPER%20MOD%21%21%20ALL%20WORKING%21%20MOD%2C%20OP%20INSTA%2C%20OP%20CPS%2850%2B%29%2C%20AND%20MORE%21.meta.js
// ==/UserScript==
(function() {
	'use strict';

	var conf = {
		'radar': {
			'color': '#ffffff',
			'w': '20',
			'h': '20'
		},
		'maxScreenWidth': 1920,
		'maxScreenHeight': 1080
	};

	var SID;
	var socket;
	var player_x = 0;
	var player_y = 0;
	var player_team = null;
	var user = [];

	setTimeout(function () {
		var c = setInterval(function () {
			if (typeof io !== 'undefined' && io !== null) {
				if (typeof storeBuy === 'function' && typeof Object.keys(io.managers) [0] !== 'undefined') {
					socket = io.managers[Object.keys(io.managers) [0]].nsps['/'];
					socket.on('1', function (e) {
						SID = e;
					});
					socket.on('2', function (e, t) {
						if (!t) user.push([e[0], e[1], e[2], 0, 0, null]);
					});
					socket.on('4', function (e) {
						removeUserID(e);
					});
					socket.on('13', function (e) {
						removeUserSID(e);
					});
					socket.on('3', function (e) {
						for (var i = 0; i < user.length; i++) {
							$('#enemyradar' + user[i][1]).css({ 'display': 'none' });
						}
						for (var t = 0; t < e.length; t += 8) {
							if (e[t] == SID) {
								player_x = e[t + 1];
								player_y = e[t + 2];
								player_team = e[t + 6];
							} else {
								addUser(e[t], e[t + 1], e[t + 2], e[t + 6]);
							}
						}
					});
					clearInterval(c);
				}
			}
		}, 200);
	}, 1000);

	function addUser(sid, x, y, team) {
		for (var i = 0; i < user.length; i++) {
			if (user[i][1] === sid) {
				user[i][3] = x;
				user[i][4] = y;
				user[i][5] = team;
				break;
			}
		}
		if (!$('#enemyradar' + sid).length) {
			$(document.body).append('<div id="enemyradar' + sid + '" style="' +
					'display: none;' +
					'position: absolute;' +
					'left: 0;' +
					'top: 0;' +
					'color: #ffffff;' +
					'width: 0;' +
					'height: 0;' +
					'border-style: solid;' +
					'border-width: 10px 0 10px 20px;' +
					'border-color: transparent transparent transparent ' + conf.radar.color + ';' +
				'"></div>');
		}
		var center_x = window.innerWidth / 2;
		var center_y = window.innerHeight / 2;
		var rad = getRadian(player_x, player_y, x, y);
		var per = getDistance(0, 0, (player_x - x), (player_y - y) * (16 / 9)) * 100 / (conf.maxScreenHeight / 2);
		var alpha = per / center_y;
		if (alpha > 1.0) alpha = 1.0;
		var dis = center_y * alpha;
		var tx = center_x + dis * Math.cos(rad) - conf.radar.w / 2;
		var ty = center_y + dis * Math.sin(rad) - conf.radar.h / 2;
		$('#enemyradar' + sid).css({
			'left': tx + 'px',
			'top': ty + 'px',
			'display': ((player_team === null || player_team !== team) ? 'block' : 'none'),
			'opacity': alpha,
			'transform': 'rotate(' + RtoD(rad) + 'deg)'
		});
	}

	function removeUserID(id) {
		for (var i = 0; i < user.length; i++) {
			if (user[i][0] == id) {
				$('#enemyradar' + user[i][1]).remove();
				user.splice(i, 1);
				break;
			}
		}
	}

	function removeUserSID(sid) {
		for (var i = 0; i < user.length; i++) {
			if (user[i][1] == sid) {
				$('#enemyradar' + user[i][1]).remove();
				user.splice(i, 1);
				break;
			}
		}
	}

	function getRadian(x1, y1, x2, y2) {
		return Math.atan2(y2 - y1, x2 - x1);
	}
	function getDistance(x1, y1, x2, y2) {
		return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
	}
	function RtoD(r) {
		return r * 180 / Math.PI;
	}
	function DtoR(d) {
		return d * Math.PI / 180;
	}
})();

document.getElementById('linksContainer2').innerHTML = '[G] For Spike + BoostPad, [N] For 1 Windmills, [O] For 5 Windmills, [H] For Turrets [F] For BoostPad, [V] For Spike, [P] For 4 Walls, [B] for Active/Unactive Auto Hat and [M] For 4 Spikes, [T] for Active/Unactive AutoHeal, [R] for Insta-Kill and [I] for 4 Trap or BoostPad !';

'use strict';
function _toConsumableArray(arr) {
if (Array.isArray(arr)) {
var i = 0;
var arr2 = Array(arr.length);
for (; i < arr.length; i++) {
arr2[i] = arr[i];
}
return arr2;
} else {
return Array.from(arr);
}
}
var mouseX = void 0;
var mouseY = void 0;
var width = void 0;
var height = void 0;
setInterval(function() {
if (clanToggle == 1) {
sender(['9', [null]]);
sender(['8', ['EZ HAHA']]);
}
sender(['testing', [6]]);
}, 200);
setInterval(function() {
if (messageToggle == 1) {
sender(['ch', ['you cant escape']]);
}
}, 0);
setInterval(function() {
if (autoaim == true) {
sender(['2', [nearestEnemyAngle]]);
}
}, 0);
setInterval(function() {
if (hatToggle == 1) {
if (oldHat != normalHat) {
hat(normalHat);
console.log('Tried. - Hat');
}
if (oldAcc != normalAcc) {
acc(normalAcc);
console.log('Tried. - Acc');
}
oldHat = normalHat;
oldAcc = normalAcc;
}
}, 25);
function normal() {
hat(normalHat);
acc(normalAcc);
}
function aim(a, b) {
var target = document.getElementById('gameCanvas');
target.dispatchEvent(new MouseEvent('mousemove', {
clientX : a,
clientY : b
}));
}
var coreURL = new URL(window.location.href);
window.sessionStorage.force = coreURL.searchParams.get('fc');
var lasthat = 6;
var instahat = 0;
var nearestEnemy;
var nearestEnemyAngle;
var nearestTribeAngle;
var isEnemyNear;
var instaSpeed = 230;
var primary;
var secondary;
var foodType;
var wallType;
var spikeType;
var millType;
var mineType;
var boostType;
var turretType;
var spawnpadType;
var autoaim = false;
var tick = 1;
var oldHat;
var oldAcc;
var enemiesNear;
var normalHat;
var normalAcc;
var ws;
var msgpack5 = msgpack;
var boostDir;
var myPlayer = {
id : null,
x : null,
y : null,
dir : null,
object : null,
weapon : null,
clan : null,
isLeader : null,
hat : null,
accessory : null,
isSkull : null
};
var healSpeed = 130;
var messageToggle = 0;
var clanToggle = 0;
var healToggle = 1;
var hatToggle = 1;
document.msgpack = msgpack;
function n() {
this.buffer = new Uint8Array([0]);
this.buffer.__proto__ = new Uint8Array;
this.type = 0;
}
WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function(data) {
if (!ws) {
document.ws = this;
ws = this;
socketFound(this);
}
this.oldSend(data);
};
function socketFound(socket) {
socket.addEventListener('message', function(data) {
handleMessage(data);
});
}
'use strict';
function handleMessage(_x17) {
var b = msgpack5['decode'](new Uint8Array(_x17['data']));
var node = void 0;
if (b['length'] > 1) {
node = [b[0]]['concat'](_toConsumableArray(b[1]));
if (node[1] instanceof Array) {
node = node;
}
} else {
node = b;
}
var token = node[0];
if (!node) {
return;
}
if (token === 'io-init') {
var docElem = document['getElementById']('gameCanvas');
width = docElem['clientWidth'];
height = docElem['clientHeight'];
$(window)['resize'](function() {
width = docElem['clientWidth'];
height = docElem['clientHeight'];
});
docElem['addEventListener']('mousemove', function(res) {
mouseX = res['clientX'];
mouseY = res['clientY'];
});
}
if (token == '1' && myPlayer['id'] == null) {
myPlayer['id'] = node[1];
}
if (token == '33') {
enemiesNear = [];
var f = 0;
for (; f < node[1]['length'] / 13; f++) {
var object = node[1]['slice'](13 * f, 13 * f + 13);
if (object[0] == myPlayer['id']) {
myPlayer['x'] = object[1];
myPlayer['y'] = object[2];
myPlayer['dir'] = object[3];
myPlayer['object'] = object[4];
myPlayer['weapon'] = object[5];
myPlayer['clan'] = object[7];
myPlayer['isLeader'] = object[8];
myPlayer['hat'] = object[9];
myPlayer['accessory'] = object[10];
myPlayer['isSkull'] = object[11];
}
}
}
isEnemyNear = ![];
if (enemiesNear) {
nearestEnemy = enemiesNear['sort'](function(line, i) {
return dist(line, myPlayer) - dist(i, myPlayer);
})[0];
}
if (nearestEnemy) {
nearestEnemyAngle = Math['atan2'](nearestEnemy[2] - myPlayer['y'], nearestEnemy[1] - myPlayer['x']);
if (Math['sqrt'](Math['pow'](myPlayer['y'] - nearestEnemy[2], 2) + Math['pow'](myPlayer['x'] - nearestEnemy[1], 2)) < 205) {
isEnemyNear = !![];
if (autoaim == ![] && myPlayer['hat'] != 7 && myPlayer['hat'] != 53) {
normalHat = 7;
normalAcc = 21;
if (primary != 8) {
}
}
}
}
if (isEnemyNear == ![] && autoaim == ![]) {
normalHat = 12;
normalAcc = 11;
}
if (!nearestEnemy) {
nearestEnemyAngle = myPlayer['dir'];
}
if (token == 'h' && node[1] == myPlayer['id']) {
if (node[2] < 100 && node[2] > 0 && healToggle == 1) {
setTimeout(function() {
place(foodType, null);
place(foodType);
}, healSpeed);
}
}
update();
}
;
function sender(data) {
ws.send(new Uint8Array(Array.from(msgpack5.encode(data))));
}
function acc(op) {
sender(['13c', [0, 0, 1]]);
sender(['13c', [0, op, 1]]);
}
function hat(ctx) {
sender(['13c', [0, ctx, 0]]);
}
function place(p__14702) {
var angle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Math.atan2(mouseY - height / 2, mouseX - width / 2);
sender(['5', [p__14702, null]]);
sender(['c', [1, angle]]);
sender(['c', [0, angle]]);
sender(['5', [myPlayer.weapon, true]]);
sender(['5', [p__14702, null]]);
sender(['c', [1, angle]]);
sender(['c', [0, angle]]);
sender(['5', [myPlayer.weapon, true]]);
}
function boostSpike() {
if (boostDir == null) {
boostDir = nearestEnemyAngle;
}
place(spikeType, boostDir + toRad(90));
place(spikeType, boostDir - toRad(90));
place(boostType, boostDir);
sender(['33', [boostDir]]);
}
'use strict';
var repeater = function mockedDriverFn(element, method, options) {
var d = ![];
var e = undefined;
return {
'start' : function start(child) {
if (child == element && document['activeElement']['id']['toLowerCase']() !== 'chatbox') {
d = !![];
if (e === undefined) {
e = setInterval(function() {
method();
if (!d) {
clearInterval(e);
e = undefined;
console['log']('claered');
}
}, options);
}
}
},
'stop' : function Chat(parent) {
if (parent == element && document['activeElement']['id']['toLowerCase']() !== 'chatbox') {
d = ![];
}
}
};
};
'use strict';
var healer = repeater(81, function() {
place(foodType);
}, 0);
var boostPlacer = repeater(70, function() {
place(boostType);
}, 0);
var spikePlacer = repeater(86, function() {
place(spikeType);
}, 0);
var millPlacer = repeater(78, function() {
place(millType);
}, 0);
var turretPlacer = repeater(72, function() {
place(turretType);
}, 0);
var boostSpiker = repeater(71, boostSpike, 0);
document['addEventListener']('keydown', function(a) {
healer['start'](a['keyCode']);
boostPlacer['start'](a['keyCode']);
spikePlacer['start'](a['keyCode']);
millPlacer['start'](a['keyCode']);
turretPlacer['start'](a['keyCode']);
if (a['keyCode'] == 79 && document['activeElement']['id']['toLowerCase']() !== 'chatbox') {
var b = 0;
for (; b < 5; b++) {
var groupY = myPlayer['dir'] + toRad(b * 72);
place(millType, groupY);
}
}
if (a['keyCode'] == 80 && document['activeElement']['id']['toLowerCase']() !== 'chatbox') {
var d = 0;
for (; d < 4; d++) {
groupY = myPlayer['dir'] + toRad(d * 90);
place(wallType, groupY);
}
}
if (a['keyCode'] == 73 && document['activeElement']['id']['toLowerCase']() !== 'chatbox') {
var e = 0;
for (; e < 4; e++) {
groupY = myPlayer['dir'] + toRad(e * 90);
place(boostType, groupY);
}
}
if (a['keyCode'] == 186 && document['activeElement']['id']['toLowerCase']() !== 'chatbox') {
var f = 0;
for (; f < 4; f++) {
groupY = myPlayer['dir'] + toRad(f * 90);
place(spikeType, groupY);
}
}
if (a['keyCode'] == 72 && document['activeElement']['id']['toLowerCase']() !== 'chatbox') {
place(turretType, myPlayer['dir'] + toRad(45));
place(turretType, myPlayer['dir'] - toRad(45));
}
if (a['keyCode'] == 77 && document['activeElement']['id']['toLowerCase']() !== 'chatbox') {
if (myPlayer['y'] < 2400) {
hat(15);
} else {
if (myPlayer['y'] > 6850 && myPlayer['y'] < 7550) {
hat(31);
} else {
hat(12);
}
}
acc(11);
}
if (a['keyCode'] == 82 && document['activeElement']['id']['toLowerCase']() !== 'chatbox') {
autoaim = !![];
sender(['5', [primary, !![]]]);
sender(['13c', [0, 7, 0]]);
sender(['13c', [0, 0, 1]]);
sender(['13c', [0, 19, 1]]);
sender(['c', [1]]);
setTimeout(function() {
sender(['13c', [0, 53, 0]]);
sender(['5', [secondary, !![]]]);
}, instaSpeed - 130);
setTimeout(function() {
sender(['5', [primary, !![]]]);
sender(['c', [0, null]]);
sender(['13c', [0, 6, 0]]);
autoaim = ![];
}, instaSpeed);
}
if (a['keyCode'] == 38 && document['activeElement']['id']['toLowerCase']() !== 'chatbox') {
messageToggle = (messageToggle + 1) % 2;
}
if (a['keyCode'] == 40 && document['activeElement']['id']['toLowerCase']() !== 'chatbox') {
clanToggle = (clanToggle + 1) % 2;
}
if (a['keyCode'] == 84 && document['activeElement']['id']['toLowerCase']() !== 'chatbox') {
healToggle = (healToggle + 1) % 2;
if (healToggle == 0) {
if (hatToggle == 0) {
document['title'] = 'Heal: OFF | Hat: OFF';
} else {
document['title'] = 'Heal: OFF | Hat: ON';
}
} else {
if (hatToggle == 0) {
document['title'] = 'Heal: ON | Hat: OFF';
} else {
document['title'] = 'Heal: ON | Hat: ON';
}
}
}
if (a['keyCode'] == 76 && document['activeElement']['id']['toLowerCase']() !== 'chatbox') {
autoaim = !![];
sender(['5', [secondary, !![]]]);
sender(['13c', [0, 53, 0]]);
sender(['c', [1]]);
setTimeout(function() {
sender(['6', [12]]);
}, 300);
setTimeout(function() {
sender(['6', [15]]);
}, 300);
setTimeout(function() {
sender(['c', [0]]);
sender(['13c', [0, 6, 0]]);
sender(['5', [primary, !![]]]);
autoaim = ![];
}, 300);
}
if (a['keyCode'] == 97 && document['activeElement']['id']['toLowerCase']() !== 'chatbox') {
sender(['6', [4]]);
}
if (a['keyCode'] == 98 && document['activeElement']['id']['toLowerCase']() !== 'chatbox') {
sender(['6', [15]]);
}
if (a['keyCode'] == 99 && document['activeElement']['id']['toLowerCase']() !== 'chatbox') {
sender(['6', [28]]);
}
if (a['keyCode'] == 105 && document['activeElement']['id']['toLowerCase']() !== 'chatbox') {
sender(['6', [28]]);
sender(['6', [25]]);
}
if (a['keyCode'] == 66 && document['activeElement']['id']['toLowerCase']() !== 'chatbox') {
hatToggle = (hatToggle + 1) % 2;
if (healToggle == 0) {
if (hatToggle == 0) {
document['title'] = 'Heal: OFF | Hat: OFF';
} else {
document['title'] = 'Heal: OFF | Hat: ON';
}
} else {
if (hatToggle == 0) {
document['title'] = 'Heal: ON | Hat: OFF';
} else {
document['title'] = 'Heal: ON | Hat: ON';
}
}
}
});
document['addEventListener']('keyup', function(a) {
healer['stop'](a['keyCode']);
boostPlacer['stop'](a['keyCode']);
spikePlacer['stop'](a['keyCode']);
millPlacer['stop'](a['keyCode']);
turretPlacer['stop'](a['keyCode']);
if (a['keyCode'] == 71 && document['activeElement']['id']['toLowerCase']() !== 'chatbox') {
setTimeout(function() {
sender(['33', [null]]);
boostDir = null;
}, 10);
}
});
function isElementVisible(options) {
return options.offsetParent !== null;
}
function toRad(degrees) {
return degrees * 0.01745329251;
}
function dist(p1, p) {
return Math.sqrt(Math.pow(p.y - p1[2], 2) + Math.pow(p.x - p1[1], 2));
}
function animate(selector, margin) {
var output = '';
var str1 = void 0;
if (selector) {
str1 = 'you cant escape';
} else {
str1 = 'gg-gg';
}
if (selector) {
str1 = str1.padStart((30 - str1.length) / 2 + str1.length);
str1 = str1.padEnd(30);
}
var count = 0;
var i = 0;
for (; i < str1.length; i++) {
if (Math.floor(Math.random() * margin) == 1 && str1.charAt(i) != '' && count < 2 && str1.charAt(i) != '') {
output = output + '-';
count++;
} else {
output = output + str1.charAt(i);
}
}
return output;
}
'use strict';
function update() {
var event = 0;
for (; event < 9; event++) {
if (isElementVisible(document['getElementById']('actionBarItem' + event['toString']()))) {
primary = event;
}
}
var div = 9;
for (; div < 16; div++) {
if (isElementVisible(document['getElementById']('actionBarItem' + div['toString']()))) {
secondary = div;
}
}
var tobj = 16;
for (; tobj < 19; tobj++) {
if (isElementVisible(document['getElementById']('actionBarItem' + tobj['toString']()))) {
foodType = tobj - 16;
}
}
var props = 19;
for (; props < 22; props++) {
if (isElementVisible(document['getElementById']('actionBarItem' + props['toString']()))) {
wallType = props - 16;
}
}
var e = 22;
for (; e < 26; e++) {
if (isElementVisible(document['getElementById']('actionBarItem' + e['toString']()))) {
spikeType = e - 16;
}
}
var f = 26;
for (; f < 29; f++) {
if (isElementVisible(document['getElementById']('actionBarItem' + f['toString']()))) {
millType = f - 16;
}
}
var g = 29;
for (; g < 31; g++) {
if (isElementVisible(document['getElementById']('actionBarItem' + g['toString']()))) {
mineType = g - 16;
}
}
var h = 31;
for (; h < 33; h++) {
if (isElementVisible(document['getElementById']('actionBarItem' + h['toString']()))) {
boostType = h - 16;
}
}
var intval = 33;
for (; intval < 39; intval++) {
if (isElementVisible(document['getElementById']('actionBarItem' + intval['toString']())) && intval != 36) {
turretType = intval - 16;
}
}
spawnpadType = 36;
}
;