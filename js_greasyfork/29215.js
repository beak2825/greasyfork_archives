// ==UserScript==
// @name			★moomoo.io EnemyRadar
// @version			1.0
// @description		Shows the direction and rough distance of invisible enemies.
// @author			nekosan
// @match			*://moomoo.io/*
// @grant			none
// @namespace		https://greasyfork.org/en/scripts/29215-moomoo-io-enemyradar
// @downloadURL https://update.greasyfork.org/scripts/29215/%E2%98%85moomooio%20EnemyRadar.user.js
// @updateURL https://update.greasyfork.org/scripts/29215/%E2%98%85moomooio%20EnemyRadar.meta.js
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