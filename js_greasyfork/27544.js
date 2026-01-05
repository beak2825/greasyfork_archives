// ==UserScript==
// @name           Gazelle :: Custom Torrent Name Maker
// @author         newstarshipsmell
// @namespace      https://greasyfork.org/en/scripts/27544-gazelle-custom-torrent-name-maker
// @description    Creates a customized torrent name or path from a user-defined template
// @version        1.2.1
// @include        https://redacted.ch/*
// @include        https://orpheus.network/*
// @include        https://notwhat.cd/*
// @grant          GM_addStyle
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/27544/Gazelle%20%3A%3A%20Custom%20Torrent%20Name%20Maker.user.js
// @updateURL https://update.greasyfork.org/scripts/27544/Gazelle%20%3A%3A%20Custom%20Torrent%20Name%20Maker.meta.js
// ==/UserScript==
//
// Many thanks to the original userscript author on WCD who wrote this, and modified it at my request (to include template path support.)
//
// CHANGELOG
//
// 1.2.0           2020/01/26
//         change: Remove GM_config and replace with custom settings panel accessed via the site Link Box (GM menu item removed.)
//
// 1.1.3           2017/03/11
//            fix: Thanks to hofr for supplying the code to fix the bug with the slash (/) replacement.
//
// 1.1.2           2017/02/20
//
//            add: GM_config settings menu with userscript and template guides.
//            add: Trackers Apollo and NotWhat added.
//         change: Tracker PassTheHeadphones renamed to Redacted.
//            add: % character added to list of Illegal Characters.


(function() {
	'use strict';

	var website = location.hostname.replace(/www\./, '').split('.')[0];
	var websitePath = window.location.href.replace(window.location.protocol + '//' + window.location.hostname + '/', '');

	var s, settings, pA, stngPnl, setM;

	getSettings();

	pA = getPanel();
	stngPnl = {}; setM = [];

	buildPanel();

	addPanel();

	if (/^((artist|torrents)\.php\?(page=\d+&|)(id=\d+|action=notify).*|(bookmarks|collages?|requests|top10|trumpable)\.php.*|collections\.php\?(page=\d+&|)id=\d+|better\.php.+|user\.php\?id=\d+|userhistory\.php\?action=subscribed_collages.*)$/.test(websitePath)) {
		var CTNMSettingsLink = '<a href="javascript:void(0);" id="ctnm_settings_linkbox" class="brackets">CTNM settings</a> ';

		document.getElementsByClassName("linkbox")[0].insertAdjacentHTML(/^collages?\.php(|\?(page=\d+&|)(?!id=\d+)$)/.test(websitePath) ?
																		 'afterbegin' :
																		 'beforeend', CTNMSettingsLink);

		document.getElementById('ctnm_settings_linkbox').addEventListener('click', function(e){
			e.preventDefault();
			document.getElementById('ctnm_settings').classList.remove('hidden');
			console.log("unhid settings");
		});
	} else {
		return;
	}

	var replacements = {
		'\\': settings.backslash_replacement,
		':': settings.colon_replacement,
		'*': settings.asterisk_replacement,
		'?': settings.question_replacement,
		'"': settings.quotation_replacement,
		'<': settings.lessthan_replacement,
		'>': settings.greaterthan_replacement,
		'|': settings.pipe_replacement,
		'%': settings.percent_replacement,
		'/': settings.slash_replacement
	};
	var pattern = /[\:*?"<>|%/]/g;

	var ph = {
		relTypes: { 1: 'Album', 3: 'Soundtrack', 5: 'EP', 6: 'Anthology', 7: 'Compilation',
				   8: 'DJ Mix', 9: 'Single', 11: 'Live album', 13: 'Remix', 14: 'Bootleg',
				   15: 'Interview', 16: 'Mixtape', 21: 'Unknown', 22: 'Concert Recording', 23: 'Demo' },

		re: /%([^%]*)(artist|title|year[12]|type|media|format[12]|score|label|cat_num|edition)([^%]*)%/g,

		decode: function (str) {
			this.decoder = this.decoder || document.createElement('div');
			this.decoder.innerHTML = str;
			str = this.decoder.textContent;
			return settings.replace_illegal_characters ? this.cleanUp(str) : str;
		},

		cleanUp: function (str) {
			return str.replace(pattern, function (ch) {
				return replacements[ch];
			});
		},

		resolve: function (word, g, t) {
			switch (word) {
				case 'artist':
					var artists = g.musicInfo.dj.length > 0 ? g.musicInfo.dj : g.musicInfo.artists;
					return artists.length > settings.max_artists ?
						settings.various_artists :
					this.decode(artists.map(function (a) { return a.name; }).join(settings.artist_separator));
				case 'title':
					//        return this.decode(g.name);
					return this.decode(g.name + (g.releaseType == 5 && !/EP$/.test(g.name) ? ' EP' : ''));
				case 'type':
					return this.relTypes[g.releaseType];
				case 'year1':
					return g.year;
				case 'year2':
					//        return t.remasterYear || g.year;
					return this.decode(t.remastered && t.remasterYear > g.year ? t.remasterYear : '');
				case 'media':
					return t.media;
				case 'format1':
					return t.format;
				case 'format2':
					return t.format == 'FLAC' ?
						t.encoding.replace('Lossless', 'FLAC') :
					(/^(V\d|AP[SX])/.test(t.encoding) ? '' : t.format + ' ') + t.encoding.split(' ')[0];
				case 'score':
					return t.hasLog ? t.logScore : '';
				case 'label':
					//        return this.decode(t.remastered ? t.remasterRecordLabel : g.recordLabel);
					return this.decode(t.remastered ? (t.remasterRecordLabel == '' ? 'Self-Released' : t.remasterRecordLabel) : (g.recordLabel == '' ? 'Self-Released' : g.recordLabel));
				case 'cat_num':
					return this.decode(t.remastered ? t.remasterCatalogueNumber : g.catalogueNumber);
				case 'edition':
					return this.decode(t.remastered ? t.remasterTitle : '');
			}
			return '';
		},

		build: function (data) {
			var result = settings.template_string.replace(this.re, function (m, p1, p2, p3) {
				var str = ph.resolve(p2, data.group, data.torrent);
				return str !== '' ? [p1, str, p3].join('') : '';
			});
			return result.trim();
		}
	};

	var evt = {
		job: null,

		onClick: function (e) {
			if ((e.ctrlKey || e.shiftKey || true) &&
				e.target.tagName == 'A' &&
				e.target.href.indexOf('action=download') > -1 &&
				(settings.apply_to_token_link === true ||
				 e.target.href.indexOf('usetoken=1') < 0)) {
				e.preventDefault();
				if (evt.job) return;

				evt.job = { link: e.target, snatch: !e.shiftKey };
				e.target.classList.add('ctnm_loading');
				var id = /[?&]id=(\d+)/.exec(e.target.href)[1];
				var xhr = new XMLHttpRequest();
				xhr.timeout = 8000;
				xhr.onload = xhr.onerror = xhr.ontimeout = evt.handleResponse;
				xhr.open('GET', 'ajax.php?action=torrent&id=' + id, true);
				xhr.send(null);
			}
		},

		handleResponse: function () {
			var resp, group;
			try {
				resp = JSON.parse(this.responseText).response;
				group = resp.group;
			} catch (e) {}

			evt.job.link.classList.remove('ctnm_loading');
			var output = group && group.categoryId == 1 ? ph.build(resp) : '';

			// CHEAP HACK
			output = /FLAC\]$/.test(output) ? output : output.replace(/FLAC /, '');
			// END CHEAP HACK

			GM_setClipboard(output);
			if (evt.job.snatch) {
				window.location = evt.job.link.href;
			}
			setTimeout(function () { evt.job = null; }, 2000);
		}
	};

	try {
		GM_addStyle('.ctnm_loading { opacity: 0.6; }');
	} catch(e) {}

	document.getElementById('content').addEventListener('click', evt.onClick, false);

	function getSettings() {
		s = GM_getValue('custom_torrent_name_maker_settings');
		if (s === undefined) resetSettings(false);
		else settings = JSON.parse(s);
		if (settings.template_string === undefined) settings.template_string = '%artist% - %title% - %year2% (%media% - %format2%)';
		if (settings.apply_to_token_link === undefined) settings.apply_to_token_link = false;
		if (settings.max_artists === undefined) settings.max_artists = 2;
		if (settings.artist_separator === undefined) settings.artist_separator = ' & ';
		if (settings.various_artists === undefined) settings.various_artists = 'VA';
		if (settings.replace_illegal_characters === undefined) settings.replace_illegal_characters = true;
		if (settings.slash_replacement === undefined) settings.slash_replacement = '／';
		if (settings.backslash_replacement === undefined) settings.backslash_replacement = '＼';
		if (settings.colon_replacement === undefined) settings.colon_replacement = '：';
		if (settings.asterisk_replacement === undefined) settings.asterisk_replacement = '＊';
		if (settings.question_replacement === undefined) settings.question_replacement = '？';
		if (settings.quotation_replacement === undefined) settings.quotation_replacement = '＂';
		if (settings.lessthan_replacement === undefined) settings.lessthan_replacement = '＜';
		if (settings.greaterthan_replacement === undefined) settings.greaterthan_replacement = '＞';
		if (settings.pipe_replacement === undefined) settings.pipe_replacement = '｜';
		if (settings.percent_replacement === undefined) settings.percent_replacement = '％';
		return 'Settings are awesome';
	}

	function resetSettings(reloadPage) {
		settings = {
			'template_string': '%artist% - %title% - %year2% (%media% - %format2%)',
			'apply_to_token_link': false,
			'max_artists': 2,
			'artist_separator': ' & ',
			'various_artists': 'VA',
			'replace_illegal_characters': true,
			'slash_replacement': '／',
			'backslash_replacement': '＼',
			'colon_replacement': '：',
			'asterisk_replacement': '＊',
			'question_replacement': '？',
			'quotation_replacement': '＂',
			'lessthan_replacement': '＜',
			'greaterthan_replacement': '＞',
			'pipe_replacement': '｜',
			'percent_replacement': '％'
		}

		s = JSON.stringify(settings);
		GM_setValue('custom_torrent_name_maker_settings', s);
		if (reloadPage) location.reload(true);
	}

	function saveSettings() {
		var setCtn = 0;
		settings.template_string = stngPnl[setM[setCtn]].value; setCtn++;
		settings.apply_to_token_link = stngPnl[setM[setCtn]].checked === true ? true : false; setCtn++;
		settings.max_artists = Number.isInteger(parseInt(stngPnl[setM[setCtn]].value)) ? Math.max(1, parseInt(stngPnl[setM[setCtn]].value)) : 2; setCtn++;
		settings.artist_separator = stngPnl[setM[setCtn]].value; setCtn++;
		settings.various_artists = stngPnl[setM[setCtn]].value; setCtn++;
		settings.replace_illegal_characters = stngPnl[setM[setCtn]].checked === true ? true : false; setCtn++;
		settings.slash_replacement = stngPnl[setM[setCtn]].value; setCtn++;
		settings.backslash_replacement = stngPnl[setM[setCtn]].value; setCtn++;
		settings.colon_replacement = stngPnl[setM[setCtn]].value; setCtn++;
		settings.asterisk_replacement = stngPnl[setM[setCtn]].value; setCtn++;
		settings.question_replacement = stngPnl[setM[setCtn]].value; setCtn++;
		settings.quotation_replacement = stngPnl[setM[setCtn]].value; setCtn++;
		settings.lessthan_replacement = stngPnl[setM[setCtn]].value; setCtn++;
		settings.greaterthan_replacement = stngPnl[setM[setCtn]].value; setCtn++;
		settings.pipe_replacement = stngPnl[setM[setCtn]].value; setCtn++;
		settings.percent_replacement = stngPnl[setM[setCtn]].value; setCtn++;
		s = JSON.stringify(settings);
		GM_setValue('custom_torrent_name_maker_settings', s);
		location.reload(true);
	}

	function getPanel() {
		return {
			l1: {tn: 'div', cl: 'box hidden', id: 'ctnm_settings'},
			l1_1: {tn: 'div', cl: 'head'},
			l1_1_1: {tn: 'strong'},
			l1_1_1_1: {txt: 'Custom Torrent Name Maker settings'},
			l1_1_2: {tn: 'span', cl: 'edit_ctnm_settings', float: 'right'},
			l1_1_2_1: {isCloseLink: true, tn: 'a', href: 'javascript:void(0);', cl: 'brackets'},
			l1_1_2_1_1: {txt: 'Close settings'},
			l1_2: {tn: 'div', cl: 'body'},
			l1_2_1: {txt: 'Template string:\u00A0'},
			l1_2_2: {tn: 'br'},
			l1_2_3: {tn: 'br'},
			l1_2_4: {setting: 'template_string', tn: 'input', type: 'text', size: 96, name: 'template_string', id: 'template_string', title:
					 'A template for the string to be copied to the clipboard, when clicking the torrent DL link.\n\nCan be used to rename the torrent title in the client.\nCan also include a full path for replacing the save path in the client.'},
			l1_2_5: {tn: 'br'},
			l1_2_6: {tn: 'br'},
			l1_2_7: {setting: 'apply_to_token_link', tn: 'input', type: 'checkbox', name: 'apply_to_token_link', id: 'apply_to_token_link'},
			l1_2_8: {tn: 'label', lfor: 'apply_to_token_link', title:
					 'Checking this option will apply the same script actions (copy string and download .torrent with Ctrl, copy string only with Shift) when those keys are depressed and the FL link is clicked.'},
			l1_2_8_1: {txt: '\u00A0Apply userscript actions to FL (freeleech token) links as well'},
			l1_2_9: {tn: 'br'},
			l1_2_10: {tn: 'br'},
			l1_2_11: {setting: 'max_artists', tn: 'input', type: 'text', size: 1, name: 'max_artists', id: 'max_artists', title:
					  'The maximum number of artists to include in the string copied to the clipboard.'},
			l1_2_12: {txt: '\u00A0Max Artists'},
			l1_2_13: {tn: 'br'},
			l1_2_14: {setting: 'artist_separator', tn: 'input', type: 'text', size: 1, name: 'artist_separator', id: 'artist_separator', title:
					  'This string will be used to separate multiple artists in the torrent title when copied to the clipboard.'},
			l1_2_15: {txt: '\u00A0Artist Separator'},
			l1_2_16: {tn: 'br'},
			l1_2_17: {setting: 'various_artists', tn: 'input', type: 'text', size: 1, name: 'various_artists', id: 'various_artists', title:
					  '"Various Artists" in the torrent title will be replaced with this string in the string copied to the clipboard.'},
			l1_2_18: {txt: '\u00A0Various Artists'},
			l1_2_19: {tn: 'br'},
			l1_2_20: {tn: 'br'},
			l1_2_21: {setting: 'replace_illegal_characters', tn: 'input', type: 'checkbox', name: 'replace_illegal_characters', id: 'replace_illegal_characters'},
			l1_2_22: {tn: 'label', lfor: 'replace_illegal_characters', title:
					  'If enabled, the reserved characters / \\ : * ? " < > | % will be replaced with the characters specified below'},
			l1_2_22_1: {txt: '\u00A0Replace Illegal Characters:'},
			l1_2_23: {tn: 'br'},
			l1_2_24: {tn: 'br'},
			l1_2_25: {setting: 'slash_replacement', tn: 'input', type: 'text', size: 1, name: 'slash_replacement', id: 'slash_replacement', title:
					  'The illegal character / (Slash) will be replaced with this character'},
			l1_2_26: {txt: '\u00A0Slash (/)'},
			l1_2_27: {tn: 'br'},
			l1_2_28: {setting: 'backslash_replacement', tn: 'input', type: 'text', size: 1, name: 'backslash_replacement', id: 'backslash_replacement', title:
					  'The illegal character \\ (Backslash) will be replaced with this character'},
			l1_2_29: {txt: '\u00A0Backslash (\\)'},
			l1_2_30: {tn: 'br'},
			l1_2_31: {setting: 'colon_replacement', tn: 'input', type: 'text', size: 1, name: 'colon_replacement', id: 'colon_replacement', title:
					  'The illegal character : (Colon) will be replaced with this character'},
			l1_2_32: {txt: '\u00A0Colon (:)'},
			l1_2_33: {tn: 'br'},
			l1_2_34: {setting: 'asterisk_replacement', tn: 'input', type: 'text', size: 1, name: 'asterisk_replacement', id: 'asterisk_replacement', title:
					  'The illegal character * (Asterisk) will be replaced with this character'},
			l1_2_35: {txt: '\u00A0Asterisk (*)'},
			l1_2_36: {tn: 'br'},
			l1_2_37: {setting: 'question_replacement', tn: 'input', type: 'text', size: 1, name: 'question_replacement', id: 'question_replacement', title:
					  'The illegal character ? (Question Mark) will be replaced with this character'},
			l1_2_38: {txt: '\u00A0Question Mark (?)'},
			l1_2_39: {tn: 'br'},
			l1_2_40: {setting: 'quotation_replacement', tn: 'input', type: 'text', size: 1, name: 'quotation_replacement', id: 'quotation_replacement', title:
					  'The illegal character " (Quotation Mark) will be replaced with this character'},
			l1_2_41: {txt: '\u00A0Quotation Mark (")'},
			l1_2_42: {tn: 'br'},
			l1_2_43: {setting: 'lessthan_replacement', tn: 'input', type: 'text', size: 1, name: 'lessthan_replacement', id: 'lessthan_replacement', title:
					  'The illegal character < (Less Than Sign) will be replaced with this character'},
			l1_2_44: {txt: '\u00A0Less Than Sign (<)'},
			l1_2_45: {tn: 'br'},
			l1_2_46: {setting: 'greaterthan_replacement', tn: 'input', type: 'text', size: 1, name: 'greaterthan_replacement', id: 'greaterthan_replacement', title:
					  'The illegal character > (Greater Than Sign) will be replaced with this character'},
			l1_2_47: {txt: '\u00A0Greater Than Sign (>)'},
			l1_2_48: {tn: 'br'},
			l1_2_49: {setting: 'pipe_replacement', tn: 'input', type: 'text', size: 1, name: 'pipe_replacement', id: 'pipe_replacement', title:
					  'The illegal character | (Pipe) will be replaced with this character'},
			l1_2_50: {txt: '\u00A0Pipe (|)'},
			l1_2_51: {tn: 'br'},
			l1_2_52: {setting: 'percent_replacement', tn: 'input', type: 'text', size: 1, name: 'percent_replacement', id: 'percent_replacement', title:
					  'The illegal character % (Percent Sign) will be replaced with this character'},
			l1_2_53: {txt: '\u00A0Percent Sign (%)'},
			l1_2_54: {tn: 'br'},
			l1_2_55: {tn: 'br'},
			l1_2_56: {isHelpLink: true, tn: 'a', href: 'javascript:void(0);', cl: 'brackets'},
			l1_2_56_1: {txt: 'Show help'},
			l1_3: {tn: 'div', cl: 'body hidden', id: 'ctnm_help'},
			l1_3_1: {txt: 'Script use:'},
			l1_3_2: {tn: 'br'},
			l1_3_3: {tn: 'p'},
			l1_3_3_1: {txt: 'This script will copy a custom torrent name (or path) based on the template string (specified above) into the clipboard ' +
					   'before/after downloading.'},
			l1_3_4: {tn: 'p'},
			l1_3_4_1: {txt: 'To download a .torrent and copy the custom string to the clipboard at the same time, hold CTRL while clicking the torrent DL link. ' +
					   'Then paste the clipboard into the appropriate field in your client.'},
			l1_3_5: {tn: 'p'},
			l1_3_5_1: {txt: 'To copy the custom string without downloading the .torrent, hold SHIFT while clicking the torrent DL link.'},
			l1_3_6: {tn: 'p'},
			l1_3_6_1: {txt: 'This can be used to rename the torrent in the client, or to specify a folder in which to save the contents.'},
			l1_3_7: {tn: 'br'},
			l1_3_8: {tn: 'br'},
			l1_3_9: {txt: 'Template help:'},
			l1_3_10: {tn: 'br'},
			l1_3_11: {tn: 'p'},
			l1_3_11_1: {txt: 'The following placeholders can be used in the template string:'},
			l1_3_11: {tn: 'p'},
			l1_3_11_1: {tn: 'strong'},
			l1_3_11_1_1: {txt: '%artist%'},
			l1_3_11_2: {txt: ': The main artist(s) of the album, or "Various Artists" if there are more than the Max Artists value below. If there\'s a ' +
						'DJ/Compiler then that will be used instead.'},
			l1_3_12: {tn: 'p'},
			l1_3_12_1: {tn: 'strong'},
			l1_3_12_1_1: {txt: '%title%'},
			l1_3_12_2: {txt: ': The name of the album.'},
			l1_3_13: {tn: 'p'},
			l1_3_13_1: {tn: 'strong'},
			l1_3_13_1_1: {txt: '%type%'},
			l1_3_13_2: {txt: ': Release type: Album/EP/Compilation etc.'},
			l1_3_14: {tn: 'p'},
			l1_3_14_1: {tn: 'strong'},
			l1_3_14_1_1: {txt: '%year1%'},
			l1_3_14_2: {txt: ': The initial/original release year of the album.'},
			l1_3_15: {tn: 'p'},
			l1_3_15_1: {tn: 'strong'},
			l1_3_15_1_1: {txt: '%year2%'},
			l1_3_15_2: {txt: ': The release year of this edition. Same as %year1% if it is an Original Release.'},
			l1_3_16: {tn: 'p'},
			l1_3_16_1: {tn: 'strong'},
			l1_3_16_1_1: {txt: '%media%'},
			l1_3_16_2: {txt: ': Source media: CD/Vinyl/WEB etc.'},
			l1_3_17: {tn: 'p'},
			l1_3_17_1: {tn: 'strong'},
			l1_3_17_1_1: {txt: '%format1%'},
			l1_3_17_2: {txt: ': FLAC/MP3/AAC etc.'},
			l1_3_18: {tn: 'p'},
			l1_3_18_1: {tn: 'strong'},
			l1_3_18_1_1: {txt: '%format2%'},
			l1_3_18_2: {txt: ': Like %format1% but fancier. Examples: FLAC / 24bit FLAC / V0 / MP3 320 / AAC 256'},
			l1_3_19: {tn: 'p'},
			l1_3_19_1: {tn: 'strong'},
			l1_3_19_1_1: {txt: '%score%'},
			l1_3_19_2: {txt: ': The log score of a CD FLAC (can return null.)'},
			l1_3_20: {tn: 'p'},
			l1_3_20_1: {tn: 'strong'},
			l1_3_20_1_1: {txt: '%edition%'},
			l1_3_20_2: {txt: ': The title of this edition (can return null.)'},
			l1_3_21: {tn: 'p'},
			l1_3_21_1: {tn: 'strong'},
			l1_3_21_1_1: {txt: '%label%'},
			l1_3_21_2: {txt: ': The record label of this edition (can return null.)'},
			l1_3_22: {tn: 'p'},
			l1_3_22_1: {tn: 'strong'},
			l1_3_22_1_1: {txt: '%cat_num%'},
			l1_3_22_2: {txt: ': The catalogue number of this edition (can return null.)'},
			l1_3_23: {tn: 'br'},
			l1_3_24: {tn: 'p'},
			l1_3_24_1: {txt: 'Any extra characters inside the percent signs are omitted if the value is empty. Percent signs cannot be nested.'},
			l1_3_25: {tn: 'p'},
			l1_3_25_1: {txt: 'Examples:'},
			l1_3_26: {tn: 'p'},
			l1_3_26_1: {txt: 'Conditional characters in %label% and %score%:'},
			l1_3_27: {tn: 'p'},
			l1_3_27_1: {txt: '%artist% - %title% (%year2%% label%) [%media% %format2%% (score)%]'},
			l1_3_28: {tn: 'p'},
			l1_3_28_1: {txt: 'Full path, sorted in subfolders by year:'},
			l1_3_29: {tn: 'p'},
			l1_3_29_1: {txt: 'D:\\Music\\%year1%\\%artist% - %title%'},
			l1_4: {tn: 'div', cl: 'body', id: 'ctnm_save_reset'},
			l1_4_1: {txt: '\u00A0'},
			l1_4_2: {tn: 'span', cl: 'save_reset_buttons', float: 'right'},
			l1_4_2_1: {tn: 'input', type: 'button', name: 'reset_ctnm_settings', id: 'reset_ctnm_settings', value: 'Reset', title:
					   'Reset the settings to defaults'},
			l1_4_2_2: {txt: '\u00A0'.repeat(4)},
			l1_4_2_3: {tn: 'input', type: 'button', name: 'save_ctnm_settings', id: 'save_ctnm_settings', value: 'Save', title:
					   'Save the settings'},
		};
	}

	function buildPanel() {
		for (var j in pA) {
			if (!pA.hasOwnProperty(j)) continue;

			stngPnl[j] = pA[j].txt === undefined ? document.createElement(pA[j].tn) : document.createTextNode(pA[j].txt);

			switch (pA[j].tn) {

				case 'a':
					stngPnl[j].id = pA[j].id;
					stngPnl[j].href = pA[j].href === undefined ? 'javascript:void(0);' : pA[j].href;
					stngPnl[j].target = '_blank';
					break;

				case 'div':
					stngPnl[j].id = pA[j].id;
					break;

				case 'input':
					stngPnl[j].type = pA[j].type;
					stngPnl[j].name = pA[j].name;
					stngPnl[j].id = pA[j].id;
					stngPnl[j].title = pA[j].title;

					switch (pA[j].type) {
						case 'checkbox':
							stngPnl[j].checked = settings[pA[j].setting];
							break;

						case 'text':
							stngPnl[j].size = pA[j].size;
							stngPnl[j].setAttribute('value', settings[pA[j].setting]);
							break;

						case 'button':
							stngPnl[j].title = pA[j].title;
							stngPnl[j].value = pA[j].value;
							break;

						default:
					}
					break;

				case 'label':
					stngPnl[j].setAttribute('for', pA[j].lfor);
					stngPnl[j].title = pA[j].title;
					break;

				case 'span':
					stngPnl[j].style.float = pA[j].float;
					break;

				default:
			}

			if (pA[j].setting) setM.push(j);

			if (pA[j].cl) {
				var classes = pA[j].cl.split(' ');
				for (var i = 0, len = classes.length; i < len; i++) {
					stngPnl[j].classList.add(classes[i]);
				}
			}

			if (j != 'l1') stngPnl[j.replace(/_\d+$/, '')].appendChild(stngPnl[j]);

			if (pA[j].isCloseLink) {
				stngPnl[j].addEventListener('click', function(e) {
					e.preventDefault();
					document.getElementById('ctnm_help').classList.add('hidden');
					document.getElementById('ctnm_settings').classList.add('hidden');
					console.log("hid settings");
				});
			}

			if (pA[j].isHelpLink) {
				stngPnl[j].addEventListener('click', function(e) {
					e.preventDefault();
					var ctnm_help = document.getElementById('ctnm_help');
					ctnm_help.classList.toggle('hidden');
					e.target.textContent = (ctnm_help.classList.contains('hidden') ? 'Show' : 'Hide') + ' help'
				});
			}

			if (pA[j].id == 'reset_ctnm_settings') {
				stngPnl[j].addEventListener('click', function() {
					if (confirm('Are you sure you want to reset all settings to their defaults?')) {
						resetSettings(true);
						document.getElementById('ctnm_settings').classList.add('hidden');
					}
				});
			}

			if (pA[j].id == 'save_ctnm_settings') {
				stngPnl[j].addEventListener('click', function() {
					if (confirm('Are you sure you want to save all settings to their current selections?')) {
						saveSettings(true);
						document.getElementById('ctnm_settings').classList.add('hidden');
					}
				});
			}
		};
	}

	function addPanel() {
		var header = document.querySelector('div.header');
		header.appendChild(stngPnl.l1);
	}
})();