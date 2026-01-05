// ==UserScript==
// @name			★moomoo.io ItemCounter
// @version			0.8
// @description		Always display the count of items.
// @author			nekosan
// @match			*://moomoo.io/*
// @grant			none
// @namespace		https://greasyfork.org/ja/scripts/28930-moomoo-io-itemcounter
// @downloadURL https://update.greasyfork.org/scripts/28930/%E2%98%85moomooio%20ItemCounter.user.js
// @updateURL https://update.greasyfork.org/scripts/28930/%E2%98%85moomooio%20ItemCounter.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// groupID:0 food	 limit: -
	// groupID:1 walls	 limit: 25
	// groupID:2 spikes	 limit: 15
	// groupID:3 mill	 limit: 6
	// groupID:4 mine	 limit: 1
	// groupID:5 trap	 limit: 6
	// groupID:6 booster limit: 12

	var socket;
	var SID;
	var maxnum_wall = 25;
	var maxnum_spike = 15;
	var maxnum_mill = 6;
	var maxnum_mine = 1;
	var maxnum_trap = 6;
	var maxnum_boost = 12;
	var item = [];

	var c1 = setInterval(function () {
		if (typeof io !== 'undefined' &&
			io !== null &&
			typeof storeBuy === 'function' &&
			typeof Object.keys(io.managers) [0] !== 'undefined'
		) {

			socket = io.managers[Object.keys(io.managers) [0]].nsps['/'];
			socket.on('1', function (e) {
				SID = e;
			});

			var c2 = setInterval(function () {
				if (typeof SID !== 'undefined' && SID !== null) {

					for (var i = 0; i < 9; i++) {
						item[i] = document.createElement('div');
						item[i].setAttribute('id', 'itemnum' + (i + 8));
						item[i].style.cssText =
							'position: absolute;' +
							'top: 0;' +
							'padding-left: 5px;' +
							'font-size: 2em;' +
							'color: #fff;';
						document.getElementById('actionBarItem' + (i + 8)).appendChild(item[i]);
					}
					item[0].innerHTML = maxnum_wall;
					item[1].innerHTML = maxnum_wall;
					item[2].innerHTML = maxnum_spike;
					item[3].innerHTML = maxnum_spike;
					item[4].innerHTML = maxnum_mill;
					item[5].innerHTML = maxnum_mill;
					item[6].innerHTML = maxnum_mine;
					item[7].innerHTML = maxnum_trap;
					item[8].innerHTML = maxnum_boost;

					socket.on('14', function (e, t) {
						switch (e) {
							// wall
							case 1:
								document.getElementById('itemnum8').innerHTML =
								document.getElementById('itemnum9').innerHTML = maxnum_wall - t;
								break;
							// spikes
							case 2:
								document.getElementById('itemnum10').innerHTML =
								document.getElementById('itemnum1').innerHTML = maxnum_spike - t;
								break;
							// mill
							case 3:
								document.getElementById('itemnum12').innerHTML =
								document.getElementById('itemnum13').innerHTML = maxnum_mill - t;
								break;
							// mine
							case 4:
								document.getElementById('itemnum14').innerHTML = maxnum_mine - t;
								break;
							// pit trap
							case 5:
								document.getElementById('itemnum15').innerHTML = maxnum_trap - t;
								break;
							// boost pad
							case 6:
								document.getElementById('itemnum16').innerHTML = maxnum_boost - t;
								break;
						}
					});

					clearInterval(c2);
				}
			}, 200);
			clearInterval(c1);
		}
	}, 200);

})();