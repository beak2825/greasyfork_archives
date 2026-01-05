// ==UserScript==
// @name			★moomoo.io DetailMiniMap
// @version			1.2
// @description		Add details to the existing mini map. (wood/food/stone/points)
// @author			nekosan
// @match			*://moomoo.io/*
// @grant			none
// @namespace		https://greasyfork.org/en/scripts/29014-moomoo-io-detailminimap
// @downloadURL https://update.greasyfork.org/scripts/29014/%E2%98%85moomooio%20DetailMiniMap.user.js
// @updateURL https://update.greasyfork.org/scripts/29014/%E2%98%85moomooio%20DetailMiniMap.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var conf = {
		'map': {
			'w': '200',
			'h': '200',
			'bottom': '80',
			'left': '20'
		},
		'resource':{
			'wood': {
				'color': '#8ecc51',
				'w': '3',
				'h': '3'
			},
			'food': {
				'color': '#ff3333',
				'w': '5',
				'h': '5'
			},
			'stone': {
				'color': '#888888',
				'w': '5',
				'h': '5'
			},
			'points': {
				'color': '#ffee33',
				'w': '5',
				'h': '5'
			}
		},
		'scale': 13200.0
	};

	var SID;
	var socket;

	// Change Layout
	$('#mapDisplay').css({
		'bottom': conf.map.bottom + 'px',	// default 20px
		'left': conf.map.left + 'px',		// default 20px
		'width': conf.map.w + 'px',			// default 130px
		'height': conf.map.h + 'px'			// default 130px
	});
	$('#scoreDisplay').css({
		'bottom': '20px',					// default 20px
		'left': '20px'						// default 170px
	});

	setTimeout(function () {
		var c = setInterval(function () {
			if (typeof io !== 'undefined' && io !== null) {
				if (typeof storeBuy === 'function' && typeof Object.keys(io.managers) [0] !== 'undefined') {

					socket = io.managers[Object.keys(io.managers) [0]].nsps['/'];
					socket.on('1', function (e) {
						SID = e;
					});

					$('#gameUI').append('<div id="minimap" class=" " ' +
						'style="' +
							'position: absolute;' +
							'bottom: ' + conf.map.bottom + 'px;' +
							'left: ' + conf.map.left + 'px;' +
							'display: inline-block;' +
							'width: ' + conf.map.w + 'px;' +
							'height: ' + conf.map.h + 'px;' +
						'"></div>');

					socket.on('6', function (e) {
						for (var t = 0; t < e.length; t += 8) {
							addItem(e[t], e[t + 1], e[t + 2], e[t + 3], e[t + 4], e[t + 5]);
						}
					});

					clearInterval(c);
				}
			}
		}, 200);
	}, 1000);

	function addItem(sid, x, y, dir, scale, type, item, owner) {
		if (!$('#minimap').length || type === null || $('#resource' + sid).length) return true;

		var name = '';
		var color = '';
		var tx = x * 100 / conf.scale;
		var ty = y * 100 / conf.scale;
		var w;
		var h;

		switch (type) {
			default:
				return;
			case 0:
				name = 'wood';
				color = conf.resource.wood.color;
				w = conf.resource.wood.w;
				h = conf.resource.wood.h;
				break;
			case 1:
				name = 'food';
				color = conf.resource.food.color;
				w = conf.resource.food.w;
				h = conf.resource.food.h;
				break;
			case 2:
				name = 'stone';
				color = conf.resource.stone.color;
				w = conf.resource.stone.w;
				h = conf.resource.stone.h;
				break;
			case 3:
				name = 'points';
				color = conf.resource.points.color;
				w = conf.resource.points.w;
				h = conf.resource.points.h;
				break;
		}
		$('#minimap').append('<div id="resource' + sid + '" style="' +
				'display: block;' +
				'width: ' + w + 'px;' +
				'height: ' + h + 'px;' +
				'background:' + color + ';' +
				'left:' + tx + '%;' +
				'top:' + ty + '%;' +
				'position: absolute;' +
				'border-radius: 9999px;' +
			'"></div>');
	}

	document.addEventListener('keydown', function (e) {
		// [M] key : DetailMiniMap ON/OFF
		if (e.keyCode == 77) {
			$('#minimap').toggle();
		}
	});
})();