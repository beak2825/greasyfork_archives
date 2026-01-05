// ==UserScript==
// @name         Slither.io Server Picker
// @namespace    http://tampermonkey.net/
// @version      0.1.11
// @description  Pings available servers and lets you pick the one you want. This is a good plugin for playing with friends.
// @author       SystemDisc
// @match        http://slither.io/
// @grant        none
// @run-at       document-start
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/26464/Slitherio%20Server%20Picker.user.js
// @updateURL https://update.greasyfork.org/scripts/26464/Slitherio%20Server%20Picker.meta.js
// ==/UserScript==

(function() {
	'use strict';

	let serverData = $.ajax({
		type: 'GET',
		url: 'http://slither.io/i33628.txt',
		async: false
	}).responseText;

	let currentZoom = 0.9;

	$(function() {
		let css = `
			iframe[src="/social-box/"] {
				display: none !important;
			}
			#HUD, #sidebar {
				position: fixed;
				top: 0;
				left: 0;
				z-index: 20;
				padding: 15px;
				background-color: rgba(0,0,0,0.5);
				color: #fff;
			}
			#sidebar {
				height: 100vh;
				overflow: auto;
			}
			#connectForm {
				margin-bottom: 15px;
			}
			#serverList > .server-listing {
				margin-bottom: 5px;
				cursor: pointer;
			}
			#serverList > .server-listing > .server-name, #serverList > .server-listing > .server-ping {
				display: inline-block;
			}
			#serverList > .server-listing > .server-ping {
				margin-left: 10px;
				color: green;
			}
			#serverList > .server-listing > .server-ping.bad {
				color: red;
			}
		`;
		let styleSheet = $('<style type="text/css">');
		styleSheet.html(css);

		let HUD = $('<div id="HUD">');
		let server = $('<div class="server">');
		let coordinates = $('<div class="coordinates">');
		let section = $('<div class="section">');
		HUD.append(server);
		HUD.append(coordinates);
		HUD.append(section);

		let sidebar = $('<div id="sidebar">');

		let connectForm = $('<div id="connectForm">');
		let serverInput = $('<input class="server-input" type="test" name="serverHostname" placeholder="ip:port">');
		let serverConnect = $('<button class="connect-button" type="button">Connect</button>');
		connectForm.append(serverInput);
		connectForm.append(serverConnect);

		let serverList = $('<div id="serverList">');

		sidebar.append(connectForm);
		sidebar.append(serverList);
		$('body').append(HUD);
		$('body').append(sidebar);
		$('head').append(styleSheet);

		$('#HUD').hide();

		$(document).on('click', '#connectForm > .connect-button', function(e) {
			selectServer($('.server-input').val());
		});

		$(document).on('click', '#serverList > .server-listing', function(e) {
			selectServer($(e.currentTarget).find('.server-name').text());
		});

		let start = true;
		setInterval(function() {
			if (!window.playing) {
				$('#sidebar').show();
				$('#HUD').hide();
				if (!$('#nick').hasClass('loaded')) {
					$('#nick').val(localStorage.getItem('savedNick'));
					$('#nick').addClass('loaded');
				}
				if (start) {
					loadServers();
					start = false;
				}
			}
			else {
				$('#sidebar').hide();
				$('#HUD').show();
				start = true;
			}
			window.want_quality = 1;
			window.render_mode = 1;
			window.high_quality = true;
			window.gla = false;
			window.ggbg = false;
			if (window.gbgi) {
				window.gbgi.src = '';
				window.gbgi.onload = null;
				window.gbgi = null;
				if (window.gbgmc) {
					window.gbgmc = null;
				}
			}

			window.gsc = currentZoom;

			if (window.snake) {
				$('#HUD').find('.server').text('Server: ' + window.bso.ip + ':' + window.bso.po);
				$('#HUD').find('.coordinates').text('Coordinates: ' + Math.round(window.snake.xx / 100) + ', ' + Math.round(window.snake.yy / 100));
				$('#HUD').find('.section').text('Section: ' + Math.round((window.snake.xx - 22000) / 1000) + ', ' + Math.round((window.snake.yy - 22000)/1000));
				localStorage.setItem('savedNick', snake.nk);
			}

			if (window.bso && window.bso.ip) {
				document.title = 'slither.io - ' + window.bso.ip + ':' + window.bso.po;
			}
			else {
				document.title = 'slither.io - disconnected'
			}
		}, 15);

		$(document).bind('DOMMouseScroll mousewheel', zoom);

		$(window).keydown(function(e) {
			console.log('keydown: ' + e.keyCode);

			if (e.keyCode === 27) {
				quit();
			}

			if (e.keyCode === 90) {
				currentZoom = 0.9;
			}
		});
	});

	function loadServers() {
		let serverList = $('#serverList');
		serverList.children().remove();
		let servers = loadSos(serverData);
		let savedServers = window.localStorage.getItem('servers');
		if (!savedServers) {
			savedServers = {};
		}
		else {
			savedServers = JSON.parse(savedServers);
		}
		for (let servername in savedServers) {
			let ip;
			let port;
			[ip, port] = servername.split(':');
			servers.push({ip: ip, po: port});
		}
		let promises = [];
		servers.forEach(function(server) {
			let serverElem = $('[id="' + server.ip + '"]');
			let serverNameElem;
			let serverPingElem;
			if (serverElem.length === 0) {
				serverElem = $('<div id="' + server.ip + '" class="server-listing">');
				serverNameElem = $('<div class="server-name">');
				serverPingElem = $('<div class="server-ping">');
				serverNameElem.text(server.ip + ':' + server.po);
				serverElem.append(serverNameElem);
				serverElem.append(serverPingElem);
				serverList.append(serverElem);
			}
			else {
				serverNameElem = serverElem.find('.server-name');
				serverPingElem = serverElem.find('.server-ping');
			}
			let promise = pingServer(server.ip).then(function(ping) {
				if (savedServers[server.ip + ':' + server.po]) {
					ping = Math.round((savedServers[server.ip + ':' + server.po] + ping) / 2);
				}
				let pingElem = $('[id="' + server.ip + '"]').find('.server-ping');
				pingElem.text(ping);
				if (ping > 75) {
					pingElem.addClass('bad');
				}
				else {
					savedServers[server.ip + ':' + server.po] = ping;
					pingElem.removeClass('bad');
				}
				let serverList = $('#serverList');
				let serverElems = serverList.children();
				serverElems.sort(function(a, b) {
					let an = +$(a).find('.server-ping').text();
					let bn = +$(b).find('.server-ping').text();
					if (an === 0) {
						an = 1000;
					}
					if (bn === 0) {
						bn = 1000;
					}
					return an > bn? 1:(an < bn? -1:0);
				});
				serverElems.detach().appendTo(serverList);
				if (!window.bso || !window.bso.ip) {
					$('.server-input').val(serverElems.first().find('.server-name').text());
				}
			}).catch(function(err) {
				$('[id="' + server.ip + '"]').remove();
				delete savedServers[server.ip + ':' + server.po];
				return false;
			});
			promises.push(promise);
		});

		Promise.all(promises).then(function() {
			localStorage.setItem('servers', JSON.stringify(savedServers));
			selectServer($('.server-input').val());
		});
	}

	function quit() {
		if (window.playing && window.resetGame) {
			window.want_close_socket = true;
			window.dead_mtm = 0;
			if (window.play_btn) {
				window.play_btn.setEnabled(true);
			}
			window.resetGame();
		}
	}

	function zoom(e) {
		console.log(window.gsc);
		if (!window.gsc) {
			return;
		}
		currentZoom *= Math.pow(0.9, e.originalEvent.wheelDelta / -120 || e.originalEvent.detail / 2 || 0);
	}

	function selectServer(servername) {
		let ip;
		let port;
		[ip, port] = servername.split(':');
		console.log(ip, +port);
		window.forceServer(ip, +port);
		let serverElem = $('[id="' + ip + '"]');
		serverElem.addClass('selected');
		serverElem.siblings().removeClass('selected');
		$('.server-input').val(servername);
	}


	function loadSos(chars) {
		/** @type {Array} */
		sos = [];
		/** @type {Array} */
		clus = [];
		chars.charAt(0);
		/** @type {number} */
		var i = 1;
		var d = {};
		/** @type {number} */
		var index = 0;
		/** @type {number} */
		d = index = 0;
		var c;
		/** @type {number} */
		var data = 0;
		/** @type {number} */
		var handle = 0;
		/** @type {Array} */
		var split = [];
		/** @type {Array} */
		var m = [];
		/** @type {Array} */
		var messages = [];
		/** @type {Array} */
		var received = [];
		for (;i < chars.length;) {
			if (c = (chars.charCodeAt(i++) - 97 - handle) % 26, 0 > c && (c += 26), data *= 16, data += c, handle += 7, 1 == d) {
				if (0 == index) {
					split.push(data);
					if (4 == split.length) {
						index++;
					}
				} else {
					if (1 == index) {
						m.push(data);
						if (3 == m.length) {
							index++;
						}
					} else {
						if (2 == index) {
							messages.push(data);
							if (3 == messages.length) {
								index++;
							}
						} else {
							if (3 == index && (received.push(data), 1 == received.length)) {
								d = {};
								/** @type {number} */
								index = c = 0;
								for (;index < m.length;index++) {
									c *= 256;
									c += m[index];
								}
								/** @type {number} */
								index = m = 0;
								for (;index < messages.length;index++) {
									m *= 256;
									m += messages[index];
								}
								/** @type {string} */
								d.ip = split.join(".");
								d.po = c;
								d.ac = m;
								d.wg = m + 5;
								d.clu = received[0];
								/** @type {Array} */
								sos.push(d);
								/** @type {Array} */
								split = [];
								/** @type {Array} */
								m = [];
								/** @type {Array} */
								messages = [];
								/** @type {Array} */
								received = [];
								/** @type {number} */
								index = 0;
							}
						}
					}
				}
				/** @type {number} */
				d = data = 0;
			} else {
				d++;
			}
		}
		return sos;
	}

	function pingServer(ip) {
		return new Promise(function(resolve, reject) {
			let handle = null;
			let ping = Date.now();
			try {
				handle = new WebSocket('ws://' + ip + ':80/ptc');
			}
			catch (e) {
				handle = null;
				reject(e);
			}
			if (handle) {
				handle.binaryType = "arraybuffer";
				handle.onerror = function(err) {
					reject(err);
				};
				handle.onmessage = function(data) {
					let pong = Date.now();
					if (testing) {
						console.log(ip, ping, pong, pong - ping, data);
					}
					resolve(pong - ping);
				};
				handle.onopen = function(body) {
					console.log(body);
					ping = Date.now();
					let data = new Uint8Array(1);
					data[0] = 112;
					this.send(data);
				};
			}
		});
	}
})();