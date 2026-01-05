// ==UserScript==
// @name           Bigger Twitch
// @author         Remos
// @version        1.09
// @description    Removes the left nav bar entirely and stretches the twitch player to use as much space as possible.
// @include        http://*.twitch.tv/*
// @include        http://twitch.tv/*
// @include        http://*.twitch.tv/*/c/*
// @include        http://*.twitch.tv/*/b/*
// @exclude        http://www.twitch.tv/
// @exclude        http://www.twitch.tv/*/profile
// @exclude        http://www.twitch.tv/settings
// @exclude        http://www.twitch.tv/settings/*
// @exclude        http://www.twitch.tv/directory
// @exclude        http://www.twitch.tv/directory/*
// @exclude        http://www.twitch.tv/*/chat?popout=
// @exclude        http://www.twitch.tv/*/popout
// @exclude        http://www.twitch.tv/*/dashboard
// @exclude        http://www.twitch.tv/inbox*
// @exclude        http://www.twitch.tv/subscriptions*
// @exclude        http://store.twitch.tv
// @exclude        http://api.twitch.tv/*
// @exclude        https://api.twitch.tv/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @grant          GM_addStyle
// @grant          GM_getValue
// @grant          GM_setValue
// @copyright      2014, Remos
// @run-at         document-end
// @icon           https://monkeyguts.com/icon/288.png
// @namespace   41229d0298d2565bc814c34b46b9158b
// @downloadURL https://update.greasyfork.org/scripts/3301/Bigger%20Twitch.user.js
// @updateURL https://update.greasyfork.org/scripts/3301/Bigger%20Twitch.meta.js
// ==/UserScript==

// Icons used from http://icomoon.io/

GM_addStyle("#left_col.bigttv  { visibility: hidden !important; display: none; }");
GM_addStyle("#main_col.bigttv  { margin-left: 0px !important; }");
GM_addStyle(".ember-view.ember-chat.bigttv { min-width: 0px !important; }");
GM_addStyle(".player-column #player.bigttv, .archive_site_player_container.bigttv, .target-player.bigttv { position: fixed !important; top: 0px !important; left: 0px !important; z-index: 99999; }");
GM_addStyle(".bigttv-button.bigttv-contract { background-image: url(data:image/png;base64,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); }");
GM_addStyle(".bigttv-button { cursor: pointer; position: absolute; bottom: 0px; left: 160px; padding: 3px; width: 21px; height: 21px; background-repeat: no-repeat; background-position: 3px; background-size: 18px; background-image: url(data:image/png;base64,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); }");
GM_addStyle(".archive_site_player_container .bigttv-button { left: 265px }");
GM_addStyle(".js-new-channel-ad { visibility: hidden !important; display: none; }");

GM_addStyle("#bigttv-settings { position: absolute; z-index: 999999; padding: 10px; background-color: #fff; width: 150px; height: 60px; position: absolute; top: 50%; left: 50%; margin-left: -86px; margin-top: -41px; border: 1px solid #777; border-radius: 5px; }");
GM_addStyle("#bigttv-settings span { font-size: 11px; color: #555; }");
GM_addStyle("#bigttv-chatwidth { width: 144px; font-size: 12px; padding: 2px; border: 1px solid #ccc; margin-bottom: 5px; border-radius: 2px; }");
GM_addStyle("#bigttv-label { float: left; font-size: 10px; font-weight: normal; }");
GM_addStyle("#bigttv-auto { position: relative; top: 3px; margin-right: 3px; }");
GM_addStyle("#bigttv-settingsbutton { float: right; padding: 1px 10px; font-size: 12px; background-color: #5cb85c; border: 1px solid #4cae4c; color: #fff; }");

GM_addStyle("#channel.bigttv { padding: 0 }");

GM_addStyle(".target-player { position: relative; }");

var chatWidth = GM_getValue('chatwidth', 340);

var biggerttvEnabled = false;
var selfTriggered = false;
var currentPlayer;

function updateSizes(player) {
	player = (typeof player === 'undefined') ? currentPlayer : player;

	var columnVisible = $('#right_col').is(':visible');
	if(biggerttvEnabled) {
		var windowWidth = $(window).width();
		var windowHeight = $(window).height();
		var playerWidth = windowWidth;

		if(columnVisible)
			playerWidth = windowWidth - chatWidth;

		//$('#player, .archive_site_player_container, .target-player').attr('style', 'height: ' + windowHeight + 'px !important; width: ' + playerWidth + 'px !important;');
		$(player).attr('style', 'height: ' + windowHeight + 'px !important; width: ' + playerWidth + 'px !important;');
		$('[id$=flash-player], #archive_site_player_flash').attr('style', 'height: 100% !important; width: 100% !important; visibility: inherit !important');
		if(columnVisible)
			$('#main_col').css('margin-right', chatWidth);
		else
			$('#main_col').css('margin-right', 0);
		$('#main_col').width('auto');

		$('#right_col').width(chatWidth);
		$('#right_col').width(chatWidth);
		$('#right_nav').parent().width(chatWidth);
		$('#right_nav').width(chatWidth - 19);
		$('#chat').width(chatWidth);
		$('.js-new-channel-ad').width(chatWidth);

		currentPlayer = player;
	} else {
		currentPlayer = null;

		$(player).attr('style', '');

		var resetChatWidth = 340;
		if(!columnVisible && !$('#right_col').hasClass('ember-view'))
			resetChatWidth = 0;
		$('#right_col').width(resetChatWidth);
		$('#chat').width(340);
		$('#main_col').css('margin-right', '');

		selfTriggered = true;
		window.dispatchEvent(new Event('resize'));
		selfTriggered = false;
	}
}

var safetyTimer;

function toggleBigger(enable, target) {
	if(typeof enable != 'boolean')
		enable = !biggerttvEnabled;
	biggerttvEnabled = enable;

	var player = typeof target === 'undefined' ? $('#player, .archive_site_player_container, .target-player') : $(target).parent();

	if(player.length === 0)
		return;

	if(enable)
		safetyTimer = setTimeout(toggleBigger, 500, enable);
	else
		clearTimeout(safetyTimer);

	$('#channel').toggleClass('bigttv', enable);
	$('#main_col').toggleClass('bigttv', enable);
	$('#left_col').toggleClass('bigttv', enable);
	$('.ember-view.ember-chat').toggleClass('bigttv', enable);

	$(player).toggleClass('bigttv', enable);
	//$('#player, .archive_site_player_container').toggleClass('bigttv', enable);

	$('.bigttv-button').toggleClass('bigttv-contract', enable);

	updateSizes(player);
}


function createSettingsWindow() {
	var settingswindow = $(
		'<div id="bigttv-settings">' +
		'<span>Set chat width</span>' +
		'<form action="#"><input id="bigttv-chatwidth" type="number" min="0" step="1" />' +
		'<label id="bigttv-label"><input id="bigttv-auto" type="checkbox" />Auto-activate</label>' +
		'<input type="submit" id="bigttv-settingsbutton" value="Save"></form>' +
		'</div>'
		);
	$('body').prepend(settingswindow);
	$('#bigttv-settings').hide();

	$('#bigttv-settings form').submit(function(e) {
		var newWidth = $('#bigttv-chatwidth').val();
		if($.isNumeric(newWidth)) {
			chatWidth = parseInt(newWidth);
			GM_setValue('chatwidth', chatWidth);
			updateSizes();
		}
		GM_setValue('autoactivate', $('#bigttv-auto').prop('checked'));

		$('#bigttv-settings').hide();

		e.preventDefault();
		return false;
	});
}

function showSettingsWindow() {
	$('#bigttv-chatwidth').val(GM_getValue('chatwidth', 340));
	$('#bigttv-auto').prop('checked', GM_getValue('autoactivate', false));

	$('#bigttv-settings').show();
}

function createButton() {
	var button = $('<a title="Right click to set chat width." class="bigttv-button bigttv-expand"> </a>');
	button.unbind().click(function(e) {
		if(e.which == 1) {
			toggleBigger(null, e.target);
			return false;
		}
	}).on('contextmenu', function(e) {
		showSettingsWindow($(e.target).parent());
		return false;
	});

	return button;
}

$(createSettingsWindow);

var resizeTimer;
$(window).resize(function() {
	if(selfTriggered)
		return;
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(updateSizes, (typeof BTTVLOADED === 'undefined') ? 0 : 1500);
});

function addButton(items) {
	items.each(function(index) {
		if($(this).has('.bigttv-button').length === 0)
			$(this).append(createButton());
	});
}

var findPlayerInterval = setInterval(function() {
	var elems = $('#player:not(.bigttv-loaded), .archive_site_player_container:not(.bigttv-loaded), .target-player:not(.bigttv-loaded)');
	if(elems.length > 0) {
		elems.toggleClass('bigttv-loaded', true);
		addButton(elems);
		if(GM_getValue('autoactivate', false)) {
			$(function() { toggleBigger(true, elems); });
		}
	}
}, 300);