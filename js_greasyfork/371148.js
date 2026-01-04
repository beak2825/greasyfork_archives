// ==UserScript==
// @name        Germs.io auto
// @namespace   http://redd.it/3ut09g
// @description Autospawn + Autoclick Coin + Profiles + Macros + Name Copier + Server Reloader + Arrow Movement Keys + Spectate Mode + More!
// @version     109
// @author      condoriano
// @icon        http://i.imgur.com/YkDG9CI.png
// @include     http://germs.io/*
// @include     https://germs.io/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/371148/Germsio%20auto.user.js
// @updateURL https://update.greasyfork.org/scripts/371148/Germsio%20auto.meta.js
// ==/UserScript==

(function() {

	if(window.top != window.self || (window.iGerms && window.iGerms.enabled)) { if(window.iGerms && Array.isArray(iAgar.versions)) iGerms.versions.push('script-local'); return; }
	if(!window.Germs) window.iGerms = { enabled: true, versions: ['script-local'] }; var isFirefox = /Firefox/.test(navigator.userAgent);

	var lastEdit = 1465120103810, profileOptions = {}, topPlayers = [], allPlayers = [], keysHold = {}, partyCode = location.href.indexOf('#') != -1 ? location.href : '';
	var loopCount = 0, overlaysOpened = true, gameLoaded = false, coinFirstClick = false, ejectorLoop = null;
	var canvas = document.getElementById('canvas'), canvas2 = document.getElementById('openfl-content').children[0];

	$(document).ready(function() {
		/*
		$(document).ajaxComplete(function(e, xhr, stg) {
			if(stg.url.indexOf('findServer') != -1 && xhr.status == 200) {
				if(gameLoaded) setTimeout(onRoomLoad, 800);
				else setTimeout(onGameLoad, 1800);
				gameLoaded = true;
			}
		});
		*/
		$('#blocker').on('hide', function() {
			if(gameLoaded) setTimeout(onRoomLoad, 800);
			else setTimeout(onGameLoad, 1800);
			gameLoaded = true;
		});
		setTimeout(function() {
			if(!gameLoaded) $('#region').val('EU-London').change();
		}, 30000);
		editOverlays();
		hookOverlays();
		hookKeys();
	});

	function editOverlays() {
		[ 'settings', 'scale_setting', 'quality_setting', 'location' ].forEach(function(e) { localStorage.removeItem(e); });
		$('#leftPanel, #mainPanel, #rightPanel').css({ 'cursor': 'unset' });
		$('#mainPanel').parent().after('<div style="position: absolute; display: inline-block; margin: 2px 0px 0px 2px;"><div id="as0" style="display: none; margin-bottom: 4px;"></div><div id="as1" style="display: none;"></div><div id="as2"></div><div id="as3" style="position: absolute; left: -546px; top: -94px;"></div></div>');
		$('button[data-itr="page_play"]').css({ 'width': '230px' }).attr('onclick', 'if(!window.holdOffSpawn) MC.setNick(document.getElementById(\'nick\').value); return false;');
		$('button[data-itr="page_play_as_guest"]').css({ 'width': '112px' });
		$('button[data-itr="page_login_and_play"]').css({ 'width': '112px' }).after('<button id="joinNewRoom" title="Join new room" style="width: 40px; display: block; float: right;" class="btn btn-success btn-refresh"><i class="glyphicon glyphicon-refresh"></i></button>');

		$('#nick').before('<div id="profiles" style="margin-bottom: 6px;"><span>Profiles: </span></div>');
		for(i = 0; i <= 10; i++) { $('#profiles').append('<button data-title="Loading profile..." class="btn" style="margin-left: 1.3px; padding: 0px 5px; border: none;">' + (i ? i : 'Default') + '</button>'); }

		$('#settings').before('<hr style="margin-top: 10px; margin-bottom: 10px;">');
		$('#options').css({ 'margin-top': '16px' })
			.append('<div>Action on room join:<select id="optnOnJoin" style="margin: 0px 6px"><option value="">Do nothing</option><option value="spawn">Spawn</option><option value="spec">Join spectator</option></select></div>')
			.append('<div><label><input id="optnSpawn" type="checkbox">Auto respawn</label></div>')
			.append('<div><label><input id="optnCoin" type="checkbox">Click coin every</label><input id="optnCoin_Interval" type="number" min="1" value="16" disabled="disabled" style="margin: 0px 6px; width: 50px;"><span>min</span></div>')
			.append('<div><label><input id="optnMove" type="checkbox">Randomized movement every</label><input id="optnMove_Interval" type="number" min="1" value="5" disabled="disabled" style="margin: 0px 6px; width: 50px;"><span>sec</span></div>');

		var addedOptions = $('#options div');
		for(var i = 0; i < addedOptions.length; i++) {
			addedOptions.eq(i).css({ 'width': '282px', 'margin': '2px 0px' });
			if(i === 0) addedOptions.eq(i).css({ 'border-top': '1px dashed', 'margin-top': '10px', 'padding-top': '10px' });
		}

		$('#instructions')
			.html('<div style="text-align: center;"><strong>Instructions</strong>Move your mouse to control your cell<br>Press <b>Space</b> to split<br>Press <b>W</b> to eject some mass</div><hr style="margin: 10px 0px;">')
			.append('<div><strong>Ingame Shortcuts / Macros</strong><span style="width: 300px; text-align: center;"><b>~</b> Toggle selectable leaderboard list</span><span style="width: 300px; text-align: center;"><b>1</b> - <b>0</b> Copy leaderboard name #1 to #10</span><span style="width: 300px; text-align: center;"><b>Arrow</b> OR <b>IJKL</b> Alternate movement keys</span><span style="margin-top: 6px;"><b>E</b> Shoot mass cont.</span><span><b>R</b> Shoot mass 7 times</span><span><b>T</b> Split into 16 pieces</span><span><b>S</b> Stop movement</span><span><b>V</b> Skin panel</span><span><b>B</b> Shop panel</span><span><b>N</b> XP Boost panel</span><span><b>M</b> Mass Boost panel</span><span><b>,</b> Free coins panel</span></div>')
			.after('<div style="font-size: 75%; float: right; margin-bottom: 6px !important;">Mod by condoriano. <a href="#" class="modInfo-toggler">More Info</a></div>');
		$('#instructions div').css({ 'color': '#555', 'padding': '0px 10px', 'font-size': '12px', 'margin': '12px 0px' });
		$('#instructions strong').css({ 'color': '#333', 'display': 'block', 'margin-bottom': '6px', 'text-align': 'center', 'font-size': '16px' });
		$('#instructions b').css({ 'background-color': '#333', 'color': '#EEE', 'padding': '1px 5px', 'border-radius': '3px', 'min-width': '20px', 'display': 'inline-block', 'margin': '1px 0px', 'text-align': 'center' });
		$('#instructions span').css({ 'display': 'inline-block', 'min-width': '150px' });

		$('footer.tosBox.left').removeClass('left').addClass('gamemodes').css({ 'position': 'absolute', 'bottom': '32px', 'right': '0px', 'font-size': '12px', 'background-color': '#3071A9', 'border-radius': '15px 0px 0px 15px', 'padding-left': '18px' });
		$('footer.tosBox.right').removeClass('right').addClass('tos').css({ 'position': 'absolute', 'bottom': '2px', 'right': '0px', 'font-size': '12px', 'background-color': '#3071A9', 'border-radius': '15px 0px 0px 15px', 'padding-left': '18px' })
			.after('<footer class="donate" style="position: absolute; bottom: -2px; right: 380px;"><form id="donate-mod" action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank"><input type="hidden" name="cmd" value="_donations"><input type="hidden"name="business" value="keyzint@gmail.com"><input type="hidden" name="lc" value="US"><input type="hidden" name="item_name" value="Donation"><input type="hidden" name"no_not" value="0"><input type="hidden" name="currency_code" value="USD"><input type="hidden" name="bn" value="PP-DonationsBF:btn_donateCC_LG.gif:NonHostedGuest"><input type="image" style="height: 24px;" name="submit" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" alt="PayPal button" border="0"></footer>')
			.after('<footer class="tosBox homepage" style="position: absolute; bottom: 0px; right: 280px; background-color: #398439; border-radius: 5px 5px 0px 0px;"><a href="https://greasyfork.org/en/scripts/14297-agar-io-auto-respawn-evergreen" target="_blank">Homepage</a></footer>');
		$('footer a').css({ 'color': '#FFF' });

		$('footer').eq(0).before('<div id="toolTip" style="position: absolute; display: none; transform: translate(-50%, -100%); background-color: #222; color: #EEE; text-align: center; padding: 2px 6px; border-radius: 3px;"></div><div id="modInfo"><div id="modInfo-header"><button class="modInfo-toggler">&#x2716;</button><h2>Script Info</h2><span title="' + Date(lastEdit).toString() + '">Last update: ' + timeSince(lastEdit) + ' ago</span></div><div id="modInfo-content"></div><div id="modInfo-footer"></div></div>');
		$('#modInfo').css({ 'display': 'none', 'width': '820px', 'height': '500px', 'padding': '0px 20px', 'position': 'absolute', 'top': '50%', 'left': '50%', 'transform': 'translate(-50%, -50%)', 'background-color': '#123', 'color': '#AAA', 'border': '1px solid #000000', 'border-radius': '12px', 'box-shadow': '0px 0px 100px #012 inset' });
		$('#modInfo-header').css({ 'font-family': 'Consolas', 'color': '#EEE', 'padding': '20px 0px', 'text-align': 'center', 'border-bottom': '2px solid #28B', 'position': 'relative' });
		$('#modInfo-header button').css({ 'float': 'right', 'color': '#AAA', 'border': 'none', 'background-color': 'rgba(0, 0, 0, 0.3)', 'position': 'absolute', 'top': '10', 'right': '0' });
		$('#modInfo-header h2').css({ 'margin': '0px' });
		$('#modInfo-header span').css({ 'font-size': '80%', 'color': '#999' });
		$('#modInfo-content').css({ 'font-family': 'Tahoma, sans-serif', 'width': '780px', 'height': '338px', 'overflow': 'auto', 'margin': '20px 0px' });
		$('#modInfo-footer').css({ 'font-size': '80%' });
		$('#modInfo-content').html('<div id="modInfo-content-features"><span style="color: #EEE;">Features</span><ul><li>Auto respawn<li>Auto click hourly coin - clicks at set interval<li>Auto-save settings<li>Profiles - you can save 10 different profiles each with their own settings<li>Reload server button<li>Various macros/shortcuts<li>Join room action - choose between do nothing, spawn, or join spectator<li>List and copy player names<li>Arrow movement keys (IJKL keys also work)<li>Randomize movement - move randomly at set interval<li>Confirm dialog on logout and closing/reloading tab<li>Hide ads and promos<li>...more will be added on updates</ul></div>\
<div id="modInfo-content-changelogs"><span style="color: #EEE;">Changelog</span> <a href="#" class="modInfoChangelog-toggler" style="font-size: 11px;">Show</a><div style="display: none; width: 90%; background: rgba(0,0,0,0.3); font-size: 11px; padding: 10px"><ul style="padding-left: 20px;">\
<li>2016-06-26 - Added new feature: Arrow movement keys (IJKL keys also work)</li><li>2016-07-10<ul><li>Added new feature: Copy leaderboard player names (use key 1-0)<li>Added shortcut to display selectable leaderboard list (key ~)</ul></li><li>2016-06-22 - Profile buttons now diplay region, game mode and name when you hover over them</li><li>2016-06-04<ul><li>Fixed pressing "login to play" button making overlay close if you have autospawn enabled<li>You will also click coin when you start the game if you have the autoclick coin enabled<li>Added delay before applying profile settings just to be safe</ul></li>\
<li>2016-06-03 - Rewrote most of the codes</li><li>2016-05-27<ul><li>Changed source code location</li><li>Added auto-click hourly coin feature</li><li>Auto movement and autoclick coin interval now can be set</li></ul></li><li>2016-05-24 - Fixed broken stop moving and random moving function. The \'go to map center\' function is still broken though.</li><li>2016-05-23<ul><li>Opening free coins panel will automatically clicks the get coins button<li>Replaced promo banner with google ads banner</ul></li><li>2016-04-20 - Added profiles - you can save 10 different profiles each with their own settings</li><li>2016-04-06 - Changed leaderboard text to show what mode it currently is</li><li>2016-03-23<ul><li>Added confirm box on clicking log out button<li>Refresh server button now also works in party mode</li></li></ul></li><li>2016-03-01<ul><li>Made all panels opened with the ingame shortcut to be semi-transparent</li><li>Added new feature - Press , to open free coin panel</li><li>Added new feature - Spectator Mode - You will be put into spectatormode when you join a server</li></ul></li>\
<li>2015-02-19<ul><li>Added new feature - Press V to open skin panel</li><li>Added new feature - Press B to open shop panel</li><li>Added new feature - Press M to open mass boost panel</li><li>Added new feature - Press N to open xp panel</li><li>Removed checkboxes for ingame shortcut features - they are now not toggle-able</li><li>Reworked instruction UI</li></ul></li><li>2015-12-29<ul><li>Added new feature - Press R to eject mass 7 times</li><li>Added new fature - Press T to split 4 times</li></ul></li><li>2015-12-26<ul><li>Moved connecting panel to top right corner of the screen</li><li>Added region and gamemode info on connecting panel</li></ul></li><li>2015-12-24 - Added new feature - Acid mode</li><li>2015-12-23 - Resized stats panel to exclude ads height</li>\
<li>2015-12-22<ul><li>Added new feature - Press S key to stop movement</li><li>Added new feature - Press C to go to the center of the map</li><li>Added new feature - Randomize movement - change direction every 5 seconds</li></ul></li><li>2015-12-18 - Added changelog into the info panel</li><li>2015-12-16 - Added info panel</li><li>2015-12-13 - Fixed gamemode not always changing to the saved value</li><li>2015-12-11 - Fixed not being able to spectate</li><li>2015-12-09 - Script is now hosted on pastebin to make updating easy</li><li>2015-12-08<ul><li>Fixed overlay not displayed on center y-axis</li><li>Updated link for update script url</li><li>Added donate button in the footer</li></ul></li>\
<li>2015-12-06<ul><li>Added promo hiding</li><li>Stylized footer and moved it to the right</li></ul></li><li>2015-12-05<ul><li>Rewrote code to use jQuery</li><li>Fixed auto spawn not working for guest players</li><li>Added ads hiding feature</li><li>Added instruction for "hold E to W"</li><li>Added link to this page</li><li>Stylized instructions a little bit</li></ul></li><li>2015-12-02 - Added refresh server button</li><li>2015-12-01<ul><li>Fixed button style on chrome</li><li>Added "hold E to W" function</li><li>Removed debugging alert message</li></ul></li><li>2015-11-30 - Fixed auto spawn checkbox not working</li><li>2015-11-29 - Initial release</li></ul></div></div>');
		$('#modInfo-footer').html('<a href="https://greasyfork.org/en/scripts/14297-agar-io-auto-respawn-evergreen" target="_blank">Homepage</a> - <a href="https://greasyfork.org/scripts/20003-agar-io-auto-respawn-code/code/Agario%20auto%20respawn%20code.js" target="_blank">Source Code</a> - <a href="#" onclick="$(\'#donate-mod input[name=submit]\').click(); return false;">Donate</a>');
		$('#overlays').after('<div id="playerListBox" style="display: none; z-index: 201; position: absolute; top: 10px; left: 10px; opacity: 0.9; background-color: #000; padding: 8px; border-radius: 6px;"><a href="#" style="position: absolute; top: 0px; right: 0px;">&times;</a><a href="#">Leaderboard</a><a href="#">All Players</a><textarea rows="10" cols="50" readonly="readonly" wrap="off" style="display: block; border: none; padding: 8px 0px 8px 8px;"></textarea></div>');

		$('#playerListBox a').css({ 'text-decoration': 'none', 'color': '#FFF', 'display': 'inline-block', 'padding': '2px 12px', 'border-radius': '4px 4px 0px 0px' });
		$('#playerListBox a').eq(0).css({ 'position': 'absolute', 'top': '-2px', 'right': '6px', 'font-size': '20px', 'padding': '0' });
		$('#playerListBox a').eq(1).css({ 'background-color': '#FFF', 'color': '#000' });

		$('#advertisement, #agario-web-incentive, .agario-promo, .diep-cross, .us-elections').hide().css({ 'visibility': 'hidden' });
		$('#region').val('').css({ 'display': 'block' });
		$('#adsBottom').remove();
		setTimeout(function() { $('#___ytsubscribe_0').css({ 'width': '112px' }); }, 12000);
	}

	function hookOverlays() {
		$('#freeCoins').on('click', function() { getCoin(); });
		$('button[data-itr="page_play"]').on('click', function() { overlaysOpened = false; });
		$('button[data-itr="page_play_as_guest"]').on('click', function() { overlaysOpened = false; });
		$('button[data-itr="page_spectate"]').on('click', function() { overlaysOpened = true; });
		$('span[data-itr="page_menu_login_facebook"]').parent().on('click', function() { localStorage.setItem('loginType', 'facebook'); });
		$('span[data-itr="page_menu_login_google"]').parent().on('click', function() { localStorage.setItem('loginType', 'google'); });
		$('button[data-itr="page_logout"]').removeAttr('onclick').on('click', function() {
			var lg = confirm('Logout?');
			if(lg) {
				logout();
				localStorage.removeItem('loginType');
			}
		});
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
		$('#advertisement, #Germs io-web-incentive, .agario-promo, .diep-cross, .us-elections, .agario-promo-container, #mcbanners-container').on('show', function() {
			setTimeout(function() { $('#advertisement, #Germs.io-web-incentive, .Germs.io-promo, .diep-cross, .us-elections, .Germsio-promo-container, #mcbanners-container').hide(); }, 50);
		});
		$('#rightPanel').css({ 'left': '300px' });
		$('#helloContainer').css({ 'top': '70px' });

		var aDisplay = '';
		var observer2 = new MutationObserver(function(changes) {
			changes.forEach(function(change) {
				var disp = change.target.style.display;
				if(disp != aDisplay) {
					adData.afkLoop = 0;
					if(disp != 'none') {
						window.onbeforeunload = null;
						if(window.iGerms && iGerms.debug) console.log('DEBUG: overlays opened');
						loadTrDiv();
					}
					else {
						window.onbeforeunload = function() { return 'Quit game?'; };
						if(window.iGerms && iAgar.debug) console.log('DEBUG: overlays closed');
						if(window.googletag) googletag.pubads().clear();
						if(document.getElementById('as1')) document.getElementById('as1').innerHTML = '';
					}
				}
				aDisplay = disp;
			});
		});
		observer2.observe(document.getElementById('overlays'), { attributes: true, attributeFilter: ['style'] });

		var observer = new MutationObserver(function(changes) {
			changes.forEach(function(change) {
				var topInt = parseInt(change.target.style.top);
				if(!topInt) change.target.style.top = '70px';
				/*
				if(!topInt) document.getElementById('as3').style.top = '0px';
				else if(topInt < 50) document.getElementById('as3').style.top = (94 - 50 + topInt) * -1 + 'px';
				else document.getElementById('as3').style.top = '-94px';*/
			});
		});
		observer.observe(document.getElementById('helloContainer'), { attributes: true, attributeFilter: ['style'] });
	}

	function respawnPlayer() { MC.setNick($('#nick').val()); }
	function onGameLoad() {
		if(localStorage.getItem('loginType') && $('#helloContainer').attr('data-logged-in') == '0') {
			if(localStorage.getItem('loginType') == 'facebook') { $('span[data-itr="page_menu_login_facebook"]').parent().click(); $('span[data-itr="page_menu_login_facebook"]').parent().click(); }
			else { $('span[data-itr="page_menu_login_google"]').parent().click(); $('span[data-itr="page_menu_login_google"]').parent().click(); }
		}
		handleOptions();
		setInterval(logicLoop, 1000);
		if(localStorage.getItem('activeProfile') === null) localStorage.setItem('activeProfile', 0);
		$('#profiles button').eq(localStorage.getItem('activeProfile')).click();
		$('#helloContainer').css({ 'top': '70px' });
		updateProfileTitle();
	}
	function onRoomLoad() {
		if(window.MC._server === null || window.MC._server.status.indexOf('CONNECTED') == -1) return;
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
		loopCount++; adData.afkLoop++;
		$('button[data-itr="page_spectate"]').removeAttr('disabled');
		if(adData.afkLoop % 10 == 9 && document.getElementById('overlays').style.display != 'none') { if(window.googletag) googletag.pubads().clear(); loadTrDiv(); }
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
			//console.log('DEBUG: keydown ' + key);
			if($('#overlays').is(':hidden') && !spKeys) {
				if(key == 27) overlaysOpened = true; // key ESC
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
				else if(key >= 48 && key <= 57 && !spKeys) { // keys 0-9
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

			if($('#gamemode').val() == ':party') {
				if(partyCode) {
					$('#cancel-party-btn').click();
					setTimeout(function() {
						$('#joinPartyToken').val(partyCode);
						$('#join-party-btn').click();
					}, 500);
				}
				else $('button[data-itr="page_create_party"]').click();
			}
			else if(window.location.href.indexOf('#') != -1) $('#cancel-party-btn').click();

			localStorage.setItem('rprofile' + localStorage.getItem('activeProfile'), JSON.stringify(profileOptions));
			updateProfileTitle(localStorage.getItem('activeProfile'));
		});
	}

	var adData = { check: 0, count: 0, time: 0, time2: 0, afkLoop: 0, main: [], alt: [], all: [], adsense: 2, loaded: false, fetched: 0, done: 0 };
	function loadTrDiv() {
		if(typeof googletag == 'undefined' || googletag.cmd.length === 0 || !googletag.apiReady || !document.getElementById('as0')) { if(adData.check <= 55) { if(adData.check == 55) disableAutoSpawn(); setTimeout(loadTrDiv, 200); adData.check++; return; } }
		adData.count++; if(adData.count == 1) {
			googletag.cmd.push(function() {
				var asd0 = googletag.defineSlot('/55407423/any300x250', [300, 250], 'as0').addService(googletag.pubads()); var asd1 = googletag.defineSlot('/55407423/any336x280', [336, 280], 'as1').addService(googletag.pubads()); var asd2 = googletag.defineSlot('/55407423/any300x600', [300, 600], 'as2').addService(googletag.pubads()); var asd3 = googletag.defineSlot('/55407423/any728x90', [728, 90], 'as3').addService(googletag.pubads()); adData.main = [ asd0, asd3 ]; adData.alt = [ asd2, asd3 ]; adData.all = [ asd0, asd1, asd2, asd3 ];
				googletag.pubads().enableSingleRequest(); googletag.pubads().disableInitialLoad(); googletag.enableServices(); googletag.display('as0'); googletag.display('as1'); googletag.display('as2'); googletag.display('as3'); googletag.pubads().addEventListener('slotRenderEnded', function(ev) { if(adData.all.indexOf(ev.slot) == -1) return; adData.loaded = true; if(!ev.isEmpty) { adData.fetched++; if(window.iAgar && iAgar.debug) console.log('DEBUG: ad fetched: ' + adData.fetched); } }); googletag.pubads().addEventListener('impressionViewable', function(ev) { if(adData.all.indexOf(ev.slot) == -1) return; window.holdOffSpawn = false; adData.done++; adData.time2 = Date.now(); if(window.iAgar && iAgar.debug) console.log('DEBUG: ad done: ' + adData.done); });
			});
		} if(adData.count == adData.adsense) googletag.cmd.push(function() { adData.main.splice(1, 0, adData.all[1]); });
		else if(adData.count < adData.adsense && adData.count % 2) { var ael = document.getElementById('as1'); ael.innerHTML = ''; ael.innerHTML = '<ins class="adsbygoogle" style="display: inline-block; width: 300px; height: 250px;" data-ad-client="ca-pub-8318511014856551" data-ad-slot="2742443229"></ins>'; var script = document.createElement('script'); script.async = true; script.src = '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'; ael.appendChild(script); var script2 = document.createElement('script'); script2.innerHTML = '(adsbygoogle = window.adsbygoogle || []).push({});'; ael.appendChild(script2); }
		var ass = document.querySelectorAll('#as0, #as1, #as2'); for(var i = 0; i < ass.length; i++) { ass[i].style.display = ass[i].style.display == 'none' ? 'block' : 'none'; } adData.loaded = false; adData.fetched = 0; adData.done = 0; adData.time = Date.now(); setTimeout(function() { googletag.cmd.push(function() { googletag.pubads().refresh(adData.count % 2 ? adData.main : adData.alt); }); }, 0); if(!adData.adBlock) checkSwift();
	} loadTrDiv();

	function checkSwift() {
		window.holdOffSpawn = true; var q = document.querySelector('#as1 iframe'), qDone = false; if(adData.count < adData.adsense && q && !q.src) { var qq = q.contentDocument; if(window.iAgar && iAgar.debug && !qDone) console.log(qq.readyState); if(qq.readyState == 'complete') qDone = true; } else qDone = true;
		if((adData.loaded && adData.done == adData.fetched && qDone) || Date.now() - adData.time >= 8000) { window.holdOffSpawn = false; setTimeout(function() { if(profileOptions.optnSpawn && !overlaysOpened) respawnPlayer(); if(window.iAgar && iAgar.debug) console.log('DEBUG: all done - ' + (Date.now() - adData.time2) + 'ms ----------------'); }, 777); }
		else if(document.getElementById('overlays').style.display != 'none') setTimeout(checkSwift, 100);
	}

	function disableAutoSpawn() {
		adData.adBlock = true; var el = document.getElementById('optnSpawn'); if(!el) return;
		el.setAttribute('disabled', 'disabled'); el.nextSibling.textContent += ' (disabled for Adblock users)';
		el.parentElement.setAttribute('title', 'Auto-respawn disabled for Adblock users'); el.parentElement.style.color = '#F22';
	}

	function getCoin() {
		var xPoses = [ -200, 192, 192, 192, 232 ];
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
			if(++x === repetitions) window.clearInterval(intervalID);
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

})();