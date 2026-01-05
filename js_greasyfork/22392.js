// ==UserScript==
// @name         Ultamate Agar Script
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Does everything you could want for Agar.
// @author       You
// @match        http://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22392/Ultamate%20Agar%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/22392/Ultamate%20Agar%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    
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
	});
    
    function editOverlays() {
        [ 'settings', 'scale_setting', 'quality_setting', 'location' ].forEach(function(e) { localStorage.removeItem(e); });
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
		$('button[data-itr="play"]').on('click', function() { overlaysOpened = false; });
		$('button[data-itr="play_as_guest"]').on('click', function() { overlaysOpened = false; });
		$('button[data-itr="spectate"]').on('click', function() { overlaysOpened = true; });
		$('button[data-itr="logout"]').removeAttr('onclick').on('click', function() { var lg = confirm('Logout?'); if(lg) logout(); });
		$('#joinNewRoom').on('click', function() {
			var q = $('#gamemode').val();
			if(q == ':party') $('button[data-itr="create_party"]').click();
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
				$('#openfl-content').css({'opacity' : '1'});
				$('#openfl-overlay').css({'pointer-events' : ''});
			}, 10);
		});
	}
    
    
    function getCoin() {
		var xPoses = [ -151, 192, 192, 192, 232 ];
		var yPoses = [ 31, -208, -160, -150, -62 ];
		var delays = [ 500, 1700, 1750, 1800, 2000 ];
		for(var i = 0; i < xPoses.length; i++) {
			(function(j) {
				setTimeout(function() { simulateClick(window.innerWidth / 2 + xPoses[j], window.innerHeight / 2 + yPoses[j], canvas2); }, delays[j]);
			})(i);
		}
	}
    function simulateClick(x, y, el) {
		// console.log(x + ',' + y);
		if(!el) el = document.elementFromPoint(x, y);
		var ev = new MouseEvent('mousedown', { 'clientX': x, 'clientY': y }); el.dispatchEvent(ev);
		ev = new MouseEvent('mouseup', { 'clientX': x, 'clientY': y }); el.dispatchEvent(ev);
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
						else $(this).val('ௌௌௌௌௌௌௌௌௌௌௌௌௌௌௌ');
					}
					profileOptions[optnID] = $(this).val();
				}
				if(profileExist && profileOptions[optnID] != optnValue) $(this).val(profileOptions[optnID]).change();
			});
			if($('#gamemode').val() == ':party')$('button[data-itr="create_party"]').click();
			else if(window.location.href.indexOf('#') != -1) $('#cancel-party-btn').click();
			localStorage.setItem('rprofile' + localStorage.getItem('activeProfile'), JSON.stringify(profileOptions));
			updateProfileTitle(localStorage.getItem('activeProfile'));
		});
	}
    
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