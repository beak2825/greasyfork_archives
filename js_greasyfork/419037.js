// ==UserScript==
// @name base building  
// @version 1 
// @description [p] for wall 
// @author I am noob
// @match        *://moomoo.io/*
// @match        *://dev.moomoo.io/
// @match        *://sandbox.moomoo.io/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.5/socket.io.min.js
// @require https://greasyfork.org/scripts/368273-msgpack/code/msgpack.js?version=598723
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @require https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.js

// @namespace https://greasyfork.org/users/719950
// @downloadURL https://update.greasyfork.org/scripts/419037/base%20building.user.js
// @updateURL https://update.greasyfork.org/scripts/419037/base%20building.meta.js
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




    

