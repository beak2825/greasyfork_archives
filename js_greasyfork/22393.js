// ==UserScript==
// @name         Ultamate Agar Script
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Does everything you could want for Agar.
// @author       You
// @match        http://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22393/Ultamate%20Agar%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/22393/Ultamate%20Agar%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';   
    var lastEdit = 1465120103810;
	var profileOptions = {};
	var topPlayers = [], allPlayers = [];
	var loopCount = 0;
	var overlaysOpened = true;
	var gameLoaded = false, coinFirstClick = false;
	var keysHold = {}, ejectorLoop = null;
	var canvas = document.getElementById('canvas');
	var canvas2 = document.getElementById('openfl-content').getElementsByTagName('canvas')[0];

	$(document).ready(function() {
		window.onbeforeunload = function() { return 'Quit game?'; };
		$(document).ajaxComplete(function(e, xhr, stg) {
			if(stg.url.indexOf('findServer') != -1 && xhr.status == 200) {
				if(gameLoaded) setTimeout(onRoomLoad, 800);
				else setTimeout(onGameLoad, 1800);
				gameLoaded = true;
			}
		});
		setTimeout(function() {
			if(!gameLoaded) $('#region').val('US-Atlanta').change();
		}, 10000);
		editOverlays();
		hookOverlays();
		hookKeys();
	});

	function editOverlays() {
		[ 'settings', 'scale_setting', 'quality_setting', 'location' ].forEach(function(e) { localStorage.removeItem(e); });
		$('#leftPanel, #mainPanel, #rightPanel').css({ 'cursor': 'unset' });
		$('button[data-itr="page_play"]').css({ 'width': '230px' });
		$('button[data-itr="page_play_as_guest"]').css({ 'width': '112px' });
		$('button[data-itr="page_login_and_play"]').css({ 'width': '112px' }).after('<button id="joinNewRoom" title="Join new room" style="width: 40px; display: block; float: right;" class="btn btn-success btn-refresh"><i class="glyphicon glyphicon-refresh"></i></button>');

		$('#nick').before('<div id="profiles" style="margin-bottom: 6px;"><span>Profiles: </span></div>');
		for(i = 0; i <= 10; i++) { $('#profiles').append('<button data-title="Loading profile..." class="btn" style="margin: 0px 1px; padding: 0px 5px; border: none;">' + (i ? i : 'Default') + '</button>'); }

		$('#settings').before('<hr style="margin-top: 10px; margin-bottom: 10px;">');
		$('#options').css({ 'margin-top': '16px' })
			.append('<div><label><input id="optnSpawn" type="checkbox">Auto respawn</label></div>')
			.append('<div><label><input id="optnCoin" type="checkbox">Click coin every</label><input id="optnCoin_Interval" type="number" min="1" value="60" disabled="disabled" style="margin: 0px 6px; width: 50px;"><span>min</span></div>');

		var addedOptions = $('#options div');
		for(var i = 0; i < addedOptions.length; i++) {
			addedOptions.eq(i).css({ 'width': '282px', 'margin': '2px 0px' });
			if(i === 0) addedOptions.eq(i).css({ 'border-top': '1px dashed', 'margin-top': '10px', 'padding-top': '10px' });
		}
	}

	function hookOverlays() {
		$('#freeCoins').on('click', function() { getCoin(); });
		$('button[data-itr="page_play"]').on('click', function() { overlaysOpened = false; });
		$('button[data-itr="page_play_as_guest"]').on('click', function() { overlaysOpened = false; });
		$('button[data-itr="page_spectate"]').on('click', function() { overlaysOpened = true; });
		$('button[data-itr="page_logout"]').removeAttr('onclick').on('click', function() { var lg = confirm('Logout?'); if(lg) logout(); });
		$('#joinNewRoom').on('click', function() {
			var q = $('#gamemode').val();
			if(q == ':party') $('button[data-itr="page_create_party"]').click();
			else {
				$('#gamemode').val(':party').change();
				$('#gamemode').val(q).change();
			}
		});
		$('#playerListBox a').on('click', function(e) {
			var curLink = $(this).index();
			if(curLink) {
				$('#playerListBox a').css({ 'background-color': 'transparent', 'color': '#FFF' });
				$(this).css({ 'background-color': '#FFF', 'color': '#000' });
				populatePlayerList(curLink);
			}
			else {
				if($(this).parent().is(':hidden')) $('#playerListBox a').eq(1).click();
				$(this).parent().fadeToggle(200);
			}
			return false;
		});
		$('#profiles button').on('mouseover', function(e) { $('#toolTip').html($(this).attr('data-title')).css({ 'display': 'block', 'top': e.clientY - 20, 'left': e.clientX }); });
		$('#profiles button').on('mouseout', function(e) { $('#toolTip').css({ 'display': 'none' }); });
		$('.modInfo-toggler').on('click', function(e) { $('#modInfo').fadeToggle(); e.preventDefault(); });
		$('.modInfoChangelog-toggler').on('click', function(e) { $(this).next().slideToggle(); e.preventDefault(); });
		$.each(['show', 'hide'], function (i, ev) { var el = $.fn[ev]; $.fn[ev] = function () { this.trigger(ev); return el.apply(this, arguments); }; });
		$('#openfl-content').on('hide', function() {
			setTimeout(function() {
				$('#openfl-content').css({ 'opacity': '1' });
				$('#openfl-overlay').css({ 'pointer-events': '' });
			}, 10);
		});
		$('#advertisement, #agario-web-incentive, .agario-promo, .diep-cross').on('show', function() {
			setTimeout(function() { $('#advertisement, #agario-web-incentive, .agario-promo, .diep-cross').hide(); }, 1);
		});

		var proxyOnDeath = MC.onPlayerDeath;
		MC.onPlayerDeath = function() {
			proxyOnDeath();
			setTimeout(function() {
				loadTrDiv();
				setTimeout(function() {
					if(profileOptions.optnSpawn && !overlaysOpened) MC.setNick($('#nick').val());
				}, 1600);
			}, 400);
		};
	}

	function onGameLoad() {
		setTimeout(loadTrDiv, 400);
		handleOptions();
		setInterval(logicLoop, 1000);
		if(localStorage.getItem('activeProfile') === null) localStorage.setItem('activeProfile', 0);
		$('#profiles button').eq(localStorage.getItem('activeProfile')).click();
		updateProfileTitle();
	}
	function onRoomLoad() {
		if(profileOptions.optnOnJoin == 'spawn') $('button[data-itr="page_play"]').click();
		else if(profileOptions.optnOnJoin == 'spec') $('button[data-itr="page_spectate"]').click();
		topPlayers = [];
		allPlayers = [];
	}

	function updateProfileTitle(p) {
		var n, m;
		if(p === undefined) { n = 0; m = 10; }
		else { n = p; m = p; }
		for(i = n; i <= m; i++) {
			var temp = JSON.parse(localStorage.getItem('rprofile' + i));
			if(temp === null) $('#profiles button').eq(i).attr('data-title', 'Empty profile');
			else {
				var x, y, z = temp.nick;
				$('#region option').each(function(e) { if($(this).val() == temp.region) x = $(this).text().split(' (')[0]; });
				$('#gamemode option').each(function(e) { if($(this).val() == temp.gamemode) y = '<span style="font-weight: bold; color: ' + (e === 0 ? '#3F3' : e == 1 ? '#3AF' : e == 2 ? '#F33' : '#A3F') + ';">' + $(this).text() + '</span>'; });
				$('#profiles button').eq(i).attr('data-title', x + ' - ' + y + '<br>' + z);
			}
		}
	}

	function logicLoop() {
		loopCount++;
		$('button[data-itr="page_spectate"]').removeAttr('disabled');
		if(profileOptions.optnCoin && loopCount % (parseInt($('#optnCoin_Interval').val()) * 60) === 0) showPanel(5);
		if(profileOptions.optnMove && loopCount % parseInt($('#optnMove_Interval').val()) === 0) simulateMove(Math.random() * innerWidth, Math.random() * innerHeight, canvas);
		if(!coinFirstClick) {
			if(profileOptions.optnCoin && $('#coins-blocker').css('display') == 'none') {
				coinFirstClick = true;
				setTimeout(function() { showPanel(5); }, 1600);
				setTimeout(function() { if($('#openfl-content').is(':visible')) { $('#openfl-content, #openfl-overlay').hide(); } }, 5600);
			}
		}
	}

	function hookKeys() {
		$(document).on('keyup', function(e) {
			var key = e.which || e.keyCode;
			keysHold[key] = false;
			if(key == 69) { // key E
				clearInterval(ejectorLoop);
				ejectorLoop = null;
			}
			else if(key >= 37 && key <= 40 || key >= 73 && key <= 76) handleMovementKeys();
		});

		$(document).on('keydown', function(e) {
			var key = e.which || e.keyCode;
			var spKeys = e.ctrlKey || e.altKey || e.shiftKey;
			//console.log('keydown ' + key);
			if($('#overlays').is(':hidden') && !spKeys) {
				if(key == 27) {
					overlaysOpened = true; // key ESC
					setTimeout(loadTrDiv, 400);
				}
				if(!keysHold[key]) {
					if(key == 69) { // key E
						if(!ejectorLoop) {
							ejectorLoop = setInterval(function() {
								window.onkeydown({ keyCode: 87 });
								window.onkeyup({ keyCode: 87 });
							}, 10);
						}
					}
					else if(key == 82) { // key R
						setIntervalX(function() {
							window.onkeydown({ keyCode: 87 }); // key W
							window.onkeyup({ keyCode: 87 });
						}, 120, 7);
					}
					else if(key == 84) { // key T
						setIntervalX(function() {
							window.onkeydown({ keyCode: 32 });  // key SPACE
							window.onkeyup({ keyCode: 32 });
						}, 60, 4);
					}
					else if(key == 83) { // key S
						var mEv = new MouseEvent('mousemove', { 'clientX': window.innerWidth / 2, 'clientY': window.innerHeight / 2 });
						canvas.dispatchEvent(mEv);
					}
					else if(key == 86) showPanel(2); // key V
					else if(key == 66) showPanel(1); // key B
					else if(key == 78) showPanel(3); // key N
					else if(key == 77) showPanel(4); // key M
					else if(key == 188) showPanel(5); // key ,
				}
				keysHold[key] = true;
				if(key >= 37 && key <= 40 || key >= 73 && key <= 76) handleMovementKeys();
			}
			if(document.activeElement.tagName.toUpperCase() != 'INPUT' && document.activeElement.type != 'text') {
				if(key == 192) { // key ~
					$('#playerListBox a').eq(0).click();
					keysHold[key] = true;
				}
				else if(key >= 48 && key <= 57) { // keys 0-9
					var playerPos = key == 48 ? 9 : key - 49;
					if(topPlayers[playerPos] !== undefined) {
						var newName = topPlayers[playerPos];
						var cnfrm = confirm('Copy "' + newName + '" to current profile?');
						if(cnfrm) $('#nick').val(newName).change();
					}
				}
			}
		});
	}

	function handleMovementKeys() {
		var left = keysHold[37] || keysHold[74], up = keysHold[38] || keysHold[73], right = keysHold[39] || keysHold[76], down = keysHold[40] || keysHold[75];
		var point = [ window.innerWidth / 2, window.innerHeight / 2 ];
		if(left) point[0] -= 1000;
		if(up) point[1] -= 1000;
		if(right) point[0] += 1000;
		if(down) point[1] += 1000;
		canvas.dispatchEvent(new MouseEvent('mousemove', { 'clientX': point[0], 'clientY': point[1] }));
	}

	function populatePlayerList(curTab) {
		var playerList = '';
		if(curTab == 1) for(var i = 0; i < topPlayers.length; i++) playerList += (i + 1) + '. ' + topPlayers[i] + (i == topPlayers.length - 1 ? '' : '\n');
		else if(curTab == 2) for(var i = 0; i < allPlayers.length; i++) playerList += (i + 1) + '. ' + allPlayers[i] + (i == allPlayers.length - 1 ? '' : '\n');
		$('#playerListBox textarea').html(playerList);
	}

	function handleOptions() {
		var profiles = $('#profiles button');
		var checkboxes = $('#options input[type="checkbox"]');
		var textfields = $('#nick, #gamemode, #region, #quality, #optnOnJoin, #optnCoin_Interval, #optnMove_Interval');

		checkboxes.on('change', function() {
			var optnID = $(this).attr('id');
			var optnEnabled = $(this).is(':checked');
			profileOptions[optnID] = optnEnabled;
			localStorage.setItem('rprofile' + localStorage.getItem('activeProfile'), JSON.stringify(profileOptions));
			updateProfileTitle(localStorage.getItem('activeProfile'));
			if(optnID == 'optnCoin') {
				if(optnEnabled) $('#optnCoin_Interval').removeAttr('disabled');
				else $('#optnCoin_Interval').attr('disabled', 'disabled');
			}
			else if(optnID == 'optnMove') {
				if(optnEnabled) $('#optnMove_Interval').removeAttr('disabled');
				else $('#optnMove_Interval').attr('disabled', 'disabled');
			}
		});
		textfields.on('change', function() {
			var optnID = $(this).attr('id');
			var optnValue = $(this).val();
			if(parseInt(optnValue) < parseInt($(this).attr('min'))) $(this).val($(this).attr('min')).change();
			profileOptions[optnID] = optnValue;
			localStorage.setItem('rprofile' + localStorage.getItem('activeProfile'), JSON.stringify(profileOptions));
			updateProfileTitle(localStorage.getItem('activeProfile'));
			if(optnID == 'optnCoin_Interval') loopCount = 0;
		});

		profiles.on('click', function() {
			var curProfile = parseInt($(this).text()) ? parseInt($(this).text()) : 0;
			var profileExist = false;
			profiles.css({ 'background-color': '#222', 'color': '#EEE' });
			$(this).css({ 'background-color': '#D22' });
			localStorage.setItem('activeProfile', curProfile);
			if(localStorage.getItem('rprofile' + curProfile)) { profileOptions = JSON.parse(localStorage.getItem('rprofile' + curProfile)); profileExist = true; }
			if(!Object.keys(profileOptions).length) profileExist = false;

			checkboxes.each(function() {
				var optnID = $(this).attr('id');
				var optnEnabled = $(this).is(':checked');
				if(profileExist) {
					if(optnEnabled && !profileOptions[optnID]) $(this).click().change();
					else if(profileOptions[optnID] === true && !optnEnabled) $(this).click().change();
				}
			});
			textfields.each(function() {
				var optnID = $(this).attr('id');
				var optnValue = $(this).val();
				if(!profileExist) {
					if(optnID == 'nick') {
						if(localStorage.getItem('profile' + curProfile) !== null) {
							$(this).val(JSON.parse(localStorage.getItem('profile' + curProfile)).nick);
							localStorage.removeItem('profile' + curProfile);
						}
						else $(this).val('tiny.cc/iAgar');
						//else $(this).val('ௌௌௌௌௌௌௌௌௌௌௌௌௌௌௌ');
					}
					profileOptions[optnID] = $(this).val();
				}
				if(profileExist && profileOptions[optnID] != optnValue) $(this).val(profileOptions[optnID]).change();
			});
			if($('#gamemode').val() == ':party')$('button[data-itr="page_create_party"]').click();
			else if(window.location.href.indexOf('#') != -1) $('#cancel-party-btn').click();
			localStorage.setItem('rprofile' + localStorage.getItem('activeProfile'), JSON.stringify(profileOptions));
			updateProfileTitle(localStorage.getItem('activeProfile'));
		});
	}

	var adData = { counter: -1, el: [document.getElementById('a1'),document.getElementById('a2')], slot: ['3754844826','4406088424'], res: [[300,250],[336,280]] };
	function loadTrDiv() {
		adData.counter++; adData.el = [document.getElementById('a1'),document.getElementById('a2')]; adData.el[adData.counter % adData.el.length].innerHTML = '';
		document.getElementsByClassName('agario-promo-container')[0].setAttribute('style', 'display: block !important; min-height: 366px;');
		var script = document.createElement('script'); script.async = true; script.src = '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'; adData.el[adData.counter % adData.el.length].appendChild(script);
		var ins = document.createElement('ins'); ins.style = 'display: inline-block; width: ' + adData.res[adData.counter % adData.res.length][0] + 'px; height: ' + adData.res[adData.counter % adData.res.length][1] + 'px;'; ins.className = 'adsbygoogle'; ins.setAttribute('data-ad-client', 'ca-pub-8318511014856551'); ins.setAttribute('data-ad-slot', adData.slot[adData.counter % adData.slot.length]); adData.el[adData.counter % adData.el.length].appendChild(ins);
		var script2 = document.createElement('script'); script2.innerHTML = '(adsbygoogle = window.adsbygoogle || []).push({});'; adData.el[adData.counter % adData.el.length].appendChild(script2);
	}

	function getCoin() {
		var xPoses = [ -150, 192, 192, 192, 232 ];
		var yPoses = [ 30, -208, -160, -150, -62 ];
		var delays = [ 500, 1700, 1750, 1800, 2000 ];
		for(var i = 0; i < xPoses.length; i++) {
			(function(j) {
				setTimeout(function() { simulateClick(window.innerWidth / 2 + xPoses[j], window.innerHeight / 2 + yPoses[j], canvas2); }, delays[j]);
			})(i);
		}
	}

	function showPanel(x) {
		$('#openfl-content').css({ 'opacity' : '0.30' });
		$('#openfl-overlay').css({ 'pointer-events' : 'none' });
		if(x == 1) $('#openShopBtn').click();
		else if(x == 2) $('#skinButton').click();
		else if(x == 3) $('#boostButton').click();
		else if(x == 4) $('#massButton').click();
		else if(x == 5) $('#freeCoins').click();
	}

	function simulateMove(x, y, el) {
		if(!el) el = document.elementFromPoint(x, y);
		var ev = new MouseEvent('mousemove', { 'clientX': x, 'clientY': y }); el.dispatchEvent(ev);
	}

	function simulateClick(x, y, el) {
		// console.log(x + ',' + y);
		if(!el) el = document.elementFromPoint(x, y);
		var ev = new MouseEvent('mousedown', { 'clientX': x, 'clientY': y }); el.dispatchEvent(ev);
		ev = new MouseEvent('mouseup', { 'clientX': x, 'clientY': y }); el.dispatchEvent(ev);
	}

	function setIntervalX(callback, delay, repetitions) {
		var x = 0;
		var intervalID = window.setInterval(function () {
			callback();
			if (++x === repetitions) window.clearInterval(intervalID);
		}, delay);
	}

	function timeSince(date) {
		var seconds = Math.floor((new Date() - date) / 1000);
		var interval = Math.floor(seconds / 31536000);
		if(interval > 1) return interval + ' years'; interval = Math.floor(seconds / 2592000);
		if(interval > 1) return interval + ' months'; interval = Math.floor(seconds / 86400);
		if(interval > 1) return interval + ' days'; interval = Math.floor(seconds / 3600);
		if(interval > 1) return interval + ' hours'; interval = Math.floor(seconds / 60);
		if(interval > 1) return interval + ' minutes';
		return Math.floor(seconds) + ' seconds';
	}

	function canvasModding() {
		var proxiedFillText = CanvasRenderingContext2D.prototype.fillText;
		CanvasRenderingContext2D.prototype.fillText = function() {
			if(arguments[0] == 'Leaderboard') {
				arguments[0] = 'tiny.cc/iAgar';
				topPlayers = [];
			}
			else if(parseInt(arguments[0]) >= 1 && parseInt(arguments[0]) <= 10) { // 1. xxx to 10. xxx
				var rank = parseInt(arguments[0]);
				if(rank <= 9 && arguments[0][1] == '.' || rank == 10 && arguments[0][2] == '.') {
					var tempName = arguments[0].substr(rank == 10 ? 4 : 3);
					topPlayers[rank - 1] = tempName;
					if(allPlayers.indexOf(tempName) == -1) allPlayers.push(tempName);
				}
			}
			return proxiedFillText.apply(this, arguments);
		};
		var proxiedStrokeText = CanvasRenderingContext2D.prototype.strokeText;
		CanvasRenderingContext2D.prototype.strokeText = function() {
			if(isNaN(arguments[0]) && allPlayers.indexOf(arguments[0]) == -1) allPlayers.push(arguments[0]);
			return proxiedStrokeText.apply(this, arguments);
		};
	}
	canvasModding();
    
    
    //The clicker part
    
    var EjectDown = false;
	var speed = 25;

	document.getElementById("canvas").addEventListener("mousedown", function(event) {
		if (event.which == 1) {
			$("body").trigger($.Event("keydown", { keyCode: 32})); //key space
			$("body").trigger($.Event("keyup", { keyCode: 32})); //jquery is required for split to work
		} else if (event.which == 2) {
			for (var n = 0; n < 4; n++) {
				$("body").trigger($.Event("keydown", { keyCode: 32})); //key space
				$("body").trigger($.Event("keyup", { keyCode: 32})); //jquery is required for split to work
			}
		}else if (event.which == 3) {
			EjectDown = true;
			setTimeout(eject, speed);
		}
	});

	document.getElementById("canvas").addEventListener("mouseup", function(event) {
		if (event.which == 3) {
			EjectDown = false;
		}
	});

	document.getElementById("canvas").addEventListener("mousewheel", function(event) {
		var X = window.innerWidth/2;
		var Y = window.innerHeight/2;
		$("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
	});

	$('#canvas').bind('contextmenu', function(e) {
		e.preventDefault();
	});

	function eject() {
		if (EjectDown) {
			window.onkeydown({keyCode: 87}); // key W
			window.onkeyup({keyCode: 87});
			setTimeout(eject, speed);
		}
	}

})();