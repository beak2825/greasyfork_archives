/*jshint multistr: true */
/*global URL, indexedDB, unsafeWindow, GM_addStyle, GM_xmlhttpRequest, GM_getResourceText, GM_info, exportFunction */

// Userscript with no name - A TF2r enhancement userscript
// Copyright (C) 2016 James Lyne <jim@not-null.co.uk>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.

// ==UserScript==
// @name        Userscript with no name
// @namespace   NiGHTS
// @author      James Lyne <jim@not-null.co.uk> [U:1:34673527]
// @description Overhauls the new raffle page and enhances a few others
// @include     http://tf2r.com/*
// @version     1.6.1
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @resource    css https://gist.github.com/JLyne/c02c409932a14c1734c5/raw/e02964c0f965dccca16ce7a64a7548a16b528849/noname-style.css
// @require     http://code.jquery.com/jquery-1.12.0.min.js
// @require     https://greasyfork.org/scripts/18834-userscript-with-no-name-skin-dictionary/code/Userscript%20with%20no%20name%20-%20Skin%20dictionary.js?version=169461
// @require		https://cdnjs.cloudflare.com/ajax/libs/jscolor/2.0.4/jscolor.js
// @run-at      document-start
// @license     GPLv3 - http://www.gnu.org/licenses/gpl-3.0.txt
// @copyright   Copyright (C) 2016, by James Lyne <jim@not-null.co.uk>
// @supportURL  https://greasyfork.org/en/scripts/18644-userscript-with-no-name/feedback
// @connect     steamcommunity.com
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/18644/Userscript%20with%20no%20name.user.js
// @updateURL https://update.greasyfork.org/scripts/18644/Userscript%20with%20no%20name.meta.js
// ==/UserScript==

//Tampermonkey on firefox doesn't have some of these defined for some reason
var console = window.console || {};
console.log = console.log || function() {};
console.info = console.info || console.log;
console.warn = console.warn || console.log;
console.error = console.error || console.log;
console.debug = console.debug || console.log;
console.time = console.time || console.log;
console.timeEnd = console.timeEnd || console.log;
console.trace = console.trace || console.log;
console.group = console.group || console.log;
console.groupEnd = console.groupEnd || console.log;

window.NoName = {
	page: 0,

	pages: {
		'news': {
			id: 'home',
		},
		'donate': {
			id: 'donate',
		},
		'info': {
			id: 'info',
		},
		'chat': {
			id: 'chat-page',
		},
		'newraf': {
			init: 'NewRaffle',
		},
		'settings': {
			init: 'Settings',
		},
		'user': {
			init: 'Profile',
		},
		'raffles': {
			init: 'RaffleList',
		},
		'ilinks': {
			id: 'raffle-invites',
		},
	},

	/**
	 *
	 */
	init: function() {
		'use strict';

		console.log('[NoName::init] Init');
		this.Steam.init();
		this.UI.init();
		this.ScrapTF.init();
		this.determinePage();
	},

	/**
	 *
	 */
	determinePage: function() {
		'use strict';

		var uri = window.location.pathname.replace('.html', '').split('/');

		for(var pageID in this.pages) {
			if(!this.pages.hasOwnProperty(pageID)) {
				continue;
			}

			var page = this.pages[pageID];

			if(uri[1] !== pageID) {
				continue;
			}

			document.body.id = page.id || 'page';
			this.page = pageID;

			if(page.init) {
				try {
					window.NoName[page.init].init();
				} catch(ignored) {
					console.error('[NoName::determinePage] Invalid callback for page: ' + pageID);
				}
			}

			break;
		}

		if(!this.page && $('.participants').length) {
			this.page = 'raffle';
			this.Raffle.init();
		}
	},

	/**
	 * Export override functions to unsafe window
	 * This needs to be run both as early as possible and after page load
	 * We can't know when our script runs relative to the scripts on the page so we need to cover both eventualities
	 */
	exportOverrides: function() {
		'use strict';

		console.log('[NoName::exportOverrides] Exporting overrides');

		try {
			this.UI.exportOverrides();
			this.Raffle.exportOverrides();
			this.RaffleList.exportOverrides();
		} catch(e) {
			console.error(e);
		}
	},

	/**
	 * Generic ajax function
	 * TODO: Replace alert()s with something less shit
	 * @param data
	 * @returns promise
	 * @constructor
	 */
	AJAX: function(data) {
		'use strict';

		var deferred = jQuery.Deferred();

		//noinspection JSUnresolvedFunction
		$.ajax(
			{
				url: 'http://tf2r.com/job.php',
				type: 'POST',
				dataType: 'JSON',
				data: data,
			}
		).done(
			function(data, textStatus, jqXHR) {
				if(data.status !== 'ok') {
					alert(data.message);
					deferred.reject(jqXHR);
				} else {
					deferred.resolve(data, jqXHR);
				}
			}
		).fail(
			function(jqXHR) {
				deferred.reject(jqXHR);
			}
		);

		return deferred.promise();
	},
};

//Generic ui changes
window.NoName.UI = {
	/**
	 *
	 */
	init: function() {
		'use strict';

		console.time("NoName:UI");

		this.initUI();

		if(NoName.Storage.get('other:snow', true)) {
			NoName.Snow.enable();
		}

		NoName.Storage.listen(
			'general:transitions', function(oldValue, newValue) {
				if(newValue) {
					$(document.body).addClass('transitions');
				} else {
					$(document.body).removeClass('transitions');
				}
			}
		);

		//Apply UI colour changes
		NoName.Storage.listen(
			'general:colour general:customcolour general:linksusecolour', function() {
				NoName.UI.updateAccentColor();
			}
		);

		console.timeEnd("NoName:UI");

		NoName.Storage.listen('other:snow', function(oldValue, newValue) {
			if(newValue) {
				NoName.Snow.enable();
			} else {
				NoName.Snow.disable();
			}
		});
	},

	/**
	 * Export override functions to unsafe window
	 * This needs to be run both as early as possible and after page load
	 * We can't know when our script runs relative to the scripts on the page so we need to cover both eventualities
	 */
	exportOverrides: function() {
		'use strict';

		var that = this;

		//Override raffle list getItems() function to handle items that don't display correctly
		unsafeWindow.getItem = exportFunction(
			function(item) {
				return that.getItem(item);
			}, unsafeWindow
		);

		//Remove slDown, message transitions are done in css now
		unsafeWindow.slDown = exportFunction(
			function() {
			}, unsafeWindow
		);
	},

	/**
	 *
	 */
	initUI: function() {
		'use strict';

		console.time('NoName:UI:initUI');

		//Unbind hover event handler added by the existing js
		unsafeWindow.$('.item').unbind('mouseenter mouseleave');

		if(NoName.Storage.get('general:transitions', true)) {
			$(document.body).addClass('transitions');
		}

		$('.infitem').replaceWith(
			$('<div></div>').addClass('infitem').append(
				[
					$('<strong></strong>').addClass('infname'),
					$('<ul></ul>').addClass('infdesc'),
				]
			)
		);

		$('table table.raffle_infomation').each(
			function() {
				$(this).removeClass('raffle_infomation');
				$(this).parent().addClass('raffle_infomation');
			}
		);

		$('#content').children().last().prepend(
			[
				'Extended item information provided by Userscript with No Name, accuracy not guaranteed.<br />',
				'Unusual effect images by backpack.tf.<br />',
			]
		);

		console.timeEnd('NoName:UI:initUI');
	},

	/**
	 * Updates colour of the active states of various elements on the page
	 * If no colors are given, it'll use the currently selected custom colour or the default ones
	 * @param background
	 * @param foreground
	 */
	updateAccentColor: function(background, foreground) {
		'use strict';

		var backgroundColour,
			foregroundColour;

		//Remove existing styles
		$('#noname-colour').remove();

		//Fallback to saved values if needed
		if(!background || !foreground) {
			if(NoName.Storage.get('general:customcolour', false)) { //Custom colour
				var colors = NoName.Storage.get('general:colour', '#CF6A32,#222222').split(',');

				backgroundColour = background || colors[0];
				foregroundColour = foreground || colors[1];
			} else { //Default colour
				backgroundColour = background || '#CF6A32';
				foregroundColour = foreground || '#222222';
			}
		}

		var $css = $('<style></style>').prop('id', 'noname-colour'),
			css =
				'input:focus,\
				textarea:focus,\
				select:focus,\
				button:focus {\
					border: 1px solid ' + backgroundColour + ';\
			}\
			input[type=submit]:hover,\
			input[type=submit]:focus,\
			input[type=submit]:active,\
			input[type=button]:hover,\
			input[type=button]:focus,\
			input[type=button]:active,\
			button:hover,\
			button:focus,\
			button:active {\
				background-color: ' + backgroundColour + ';\
				border-color: ' + backgroundColour + ';\
				color: ' + foregroundColour + ';\
			}\
			.switch-field input:checked + label {\
				background-color: ' + backgroundColour + ';\
				color: ' + foregroundColour + ';\
			}\
			#settings input[type=checkbox] + label:before,\
			#settings input[type=checkbox] + span:before {\
				border-color: ' + backgroundColour + ';\
				background-color: ' + backgroundColour + ';\
				color: ' + foregroundColour + ';\
			}\
			a:hover,\
			a:focus,\
			a:active,\
			.nav_font a:hover,\
			.nav_font a:focus,\
			.nav_font a:active {\
		';

		//Handle links text-shadow/colour setting
		if(NoName.Storage.get('general:linksusecolour', false)) {
			css += 'color: ' + backgroundColour + ' !important;\
			text-shadow: 2px 2px 1px #000000 !important;\
			transition-property: color !important;';
		} else {
			css += 'text-shadow: 2px 2px 1px ' + backgroundColour + ' !important;';
		}

		css += '}';

		$css.text(css);
		$(document.head).append($css);

		console.info('[UI::updateAccentColor] Accent colour set to ' + backgroundColour);
	},

	/**
	 *
	 * @param item
	 * @returns {*}
	 */
	getItem: function(item) {
		'use strict';

		var element = document.createElement('div');

		if(typeof item !== 'object') {
			return null;
		}

		if(!(item instanceof NoName.Item)) {
			var data = {
				name: item.name,
				quality: item.q.substring(1),
				thumbnail: item.image,
				level: item.level,
				wear: item.wear,
			};

			item = new NoName.Item(data, true);
		}

		element.style.backgroundImage = item.getBackgroundImages();
		element.className = item.getCSSClasses();
		element.item = item;

		return element;
	},

	/**
	 * Creates a toggle switch that can replace radio buttons
	 * @param label
	 * @param name
	 * @param options
	 * @returns {*|jQuery}
	 */
	createSwitch: function(label, name, options) {
		'use strict';

		var $container = $('<div></div>').addClass('switch-field'),
			children = [];

		children.push($('<label></label>').addClass('switch-title').text(label));

		options.forEach(
			function(option, index) {
				option.id = option.id || name.replace(' ', '-').toLowerCase() + '-' + index;
				option.value = (typeof option.value !== 'undefined') ? option.value : '';

				children.push(
					$('<input />')
					.prop(
						{
							type: 'radio',
							name: name,
							id: option.id,
							checked: !!option.checked,
						}
					).val(option.value)
				);
				children.push(
					$('<label></label>')
					.prop('for', option.id)
					.text(option.label)
				);
			}
		);

		$container.append(children);

		return $container;
	},

	/**
	 * Item details tooltip
	 * Used everywhere items are shown
	 * Except the new raffle page which uses its own implementation due to different data
	 * @param element
	 */
	showItemInfo: function(element) {
		'use strict';

		var $element = $(element),
			pos = $element.offset(),
			height = $element.height(),
			width = $element.width(),

			item = element.item;

		//Need all item classes other than .item so this'll do
		$('.infname').addClass(item.getCSSClasses()).removeClass('item').html(item.getName());
		//$('.infdesc').html('<li>Level: ' + item.getLevel() + ((item.getSeries()) ? '<br />#' + item.getSeries() : '') + '</li>');
		$('.infdesc').html(item.getDescriptionList());

		$('.infitem').show().css(
			{
				left: pos.left + (width / 2) - ($('.infdesc').outerWidth() / 2) + 'px',
				top: (pos.top + height + 4) + 'px'
			}
		);
	},

	/**
	 *
	 */
	hideItemInfo: function() {
		'use strict';

		$('.infitem').hide();
		$('.infname').removeClass().addClass('infname');
	},

	/**
	 *
	 */
	addStyles: function() {
		'use strict';

		GM_addStyle(GM_getResourceText('css'));
		NoName.UI.updateAccentColor();
	},
};

window.NoName.Snow = {
	enabled: false,

	enable: function() {
		//TODO: Snowfall

		$(document.body).addClass('snow');

		this.enabled =  true;
	},

	disable: function() {
		$(document.body).removeClass('snow');
		this.enabled = false;
	}
};

//Profile pages
window.NoName.Profile = {
	commentBlock: false,
	steamID: null,

	/**
	 *
	 */
	init: function() {
		'use strict';

		document.body.id = 'profile';

		this.getProfileSteamID();
		this.initUI();
	},

	/**
	 *
	 */
	getProfileSteamID: function() {
		'use strict';

		try {
			var result = window.location.href.match(/https?:\/\/tf2r.com\/user\/(\d+)\.html/);
			this.steamID = result[1];
		} catch(ignore) {
			console.warn('[Steam::getSteamID] Unable to determine steamID');
		}
	},

	/**
	 *
	 */
	initUI: function() {
		'use strict';

		var progress,
			$name;

		//Optimisation to avoid excessive style calculations in firefox
		//Detach containing element before making UI changes
		this.$UI = $('#content').detach();
		progress = this.calculateProgression(this.$UI.find('.upvb'));

		//Add ids to things for css styling
		$name = this.$UI.find('td:nth-child(2) > div > a').prop('id', 'name');
		this.$UI.find('.indent > table tr:nth-child(3) > td:nth-child(2)').prop('id', 'rep');
		this.$UI.find('.indent > table > tbody > tr:nth-child(2) > td').prop('id', 'rank');
		this.$UI.find('.indent > table tr:nth-child(2) > td > table tr:nth-child(2) > td:nth-child(2)').prop(
			'id', 'progress'
		);

		//Fix progress bar value and update colour to match username colour
		this.$UI.find('#progress div > div').first().css(
			{
				'background-color': $name.css('color'),
				'font-size': 0,
				width: Math.min(progress, 100) + '%',
				'border-radius': (progress >= 100) ? '3px' : '',
			}
		).next().text(progress.toFixed() + '%');

		this.initFeedbackForm();
		this.checkMoreUserInfo();

		//Reattach updated UI
		this.$UI.insertAfter('#nav_holder');
	},

	/**
	 *
	 */
	initFeedbackForm: function() {
		'use strict';

		var that = this,
			$form = this.$UI.find('.newfeed').empty(),
			$typeSwitch = NoName.UI.createSwitch(
				'Type:', 'type', [
					{
						id: 'type1',
						label: 'Positive',
						value: '1',
					},
					{
						id: 'type2',
						label: 'Negative',
						value: '2',
					},
					{
						id: 'type0',
						label: 'Neutral',
						value: '0',
						checked: true,
					},
				]
			),

			$elements = [
				$typeSwitch, //Type Switch
				$('<label></label>').text('Message:'), //Message Label
				$('<textarea></textarea>').prop('id', 'feedtext').addClass('full-width'), //Message textarea
				$('<button></button>').prop(
					{ //Submit button
						type: 'button',
						id: 'sendfeed',
					}
				).text('Post'),
			];

		$form.append($elements);

		$form.find('#sendfeed').on(
			'click', function(e) {
				e.stopImmediatePropagation();

				if(!NoName.ScrapTF.canComment()) {
					return false;
				}

				that.postFeedback();

				return true;
			}
		);
	},

	/**
	 * Update rep table width if the more user info script is detected
	 * to make it look nicer
	 */
	checkMoreUserInfo: function() {
		'use strict';

		var $rep = this.$UI.find('#rep'),
			$table = this.$UI.find('.indent > table > tbody'),
			repObserver,
			tableObserver,
			rafflesTableObserver;

		if($rep.children().length > 1) {
			$rep.css('width', '100%');
		} else {
			repObserver = new MutationObserver(
				function() {
					$rep.css('width', '100%');
				}
			);

			repObserver.observe(
				$rep.get(0), {
					childList: true,
				}
			);
		}

		tableObserver = new MutationObserver(
			function() {
				var $rafflesTable = $('#raffles_table');

				if($rafflesTable.length) {
					$rafflesTable.find('.item').each(
						function() {
							console.log(this);
							NoName.Raffle.updateItem(this, undefined, 0);
						}
					);

					rafflesTableObserver = new MutationObserver(
						function() {
							console.log($('.item').length);
						}
					);

					rafflesTableObserver.observe(
						$rafflesTable.get(0).tBodies[0], {
							childList: true,
						}
					);
					tableObserver.disconnect();
				}
			}
		);

		tableObserver.observe(
			$table.get(0), {
				childList: true,
			}
		);
	},

	/**
	 *
	 * @param $rep
	 * @returns {number}
	 */
	calculateProgression: function($rep) {
		'use strict';

		var rep = parseInt($rep.text(), 10),
			progress = 0;

		if(rep < 1000) {
			progress = rep / 1000;
		} else if(rep < 2500) {
			progress = (rep - 1000) / 1500;
		} else if(rep < 5000) {
			progress = (rep - 2500) / 2500;
		} else {
			progress = rep / 5000;
		}

		progress *= 100;

		return progress;
	},

	/**
	 *
	 */
	postFeedback: function() {
		'use strict';

		var that = this;

		if(this.commentBlock) {
			return;
		}

		this.commentBlock = true;
		$('#sendfeed').hide();

		NoName.AJAX(
			{
				postfeedback: 'true',
				uid: this.steamID,
				type: $('input[name=type]:checked').val(),
				mess: $('#feedtext').val()
			}
		).done(
			function() {
				window.location.reload();
			}
		).always(
			function() {
				that.commentBlock = false;
				$('#sendfeed').show();
			}
		);
	},
};

//Settings page
window.NoName.Settings = {
	$settings: null,
	sections: {},

	form: null,

	init: function() {
		'use strict';

		document.body.id = 'settings';

		this.form = document.getElementsByTagName('form');

		if(this.form.length) {
			this.form = this.form[0];
			this.initUI();
		}

		this.addSettingsContainer();
		this.addScriptSettings();
	},

	/**
	 *
	 */
	initUI: function() {
		'use strict';

		var $raffleIconInput = $(this.form.raficon),
			$iconWarning = $raffleIconInput.closest('.raffle_infomation').find('h3'),
			$position = NoName.UI.createSwitch(
				'Icon position:', 'position', [
					{
						id: 'tl',
						label: 'Top-left',
						value: 'tl',
						checked: true,
					},
					{
						id: 'tr',
						label: 'Top-right',
						value: 'tr',
					},
					{
						id: 'bl',
						label: 'Bottom-left',
						value: 'bl',
					},
					{
						id: 'br',
						label: 'Bottom-right',
						value: 'br',
					}
				]
			),
			$fileName = $('<span></span>').prop('id', 'fname').text('Click to choose file');

		//Remove old radio buttons for raffle icon position
		$raffleIconInput.next().nextAll().remove();
		$raffleIconInput.prev().remove();

		//Add filename placeholder and position switch
		$raffleIconInput.after($position.hide()).after($fileName);

		//Update placeholder text when hidden input changes
		$raffleIconInput.on(
			'change', function() {
				var file = this.files[0];

				if(file) {
					$position.show();
					$fileName.text(file.name);
				} else {
					$position.hide();
					$fileName.text('Click to choose file');
				}
			}
		);

		//Reformat sidepic warning in a nicer looking way
		$iconWarning.replaceWith(
			$('<strong></strong>').html($iconWarning.text().replace('	Use', '<br />Use'))
		);
	},

	/**
	 * Add a new section for our own settings
	 */
	addSettingsContainer: function() {
		'use strict';

		this.$settings = $('<div></div>').addClass('raffle_infomation').prop('id', 'noname-settings')
		.append(
			[
				$('<h1></h1>').text('Userscript with no name')
			]
		);

		$('.indent', '#content').append('<br />').append(this.$settings);
	},

	/**
	 *
	 * @param id
	 * @param title
	 * @returns {boolean}
	 */
	addSettingsSection: function(id, title) {
		'use strict';

		if(this.sections[id]) {
			console.error('[Settings::addSettingsSection] Duplicate id ' + id);

			return false;
		}

		var $section = $('<div></div>').append(
			$('<h2></h2>').text(title)
		).prop('id', id).addClass('settings-section');

		this.$settings.append($section);
		this.sections[id] = $section;

		return true;
	},

	addToSection: function(id, $elements) {
		'use strict';

		if(!this.sections[id]) {
			console.error('[Settings::addToSection] Invalid id ' + id);

			return false;
		}

		this.sections[id].append($elements);

		return true;
	},

	/**
	 * Add script settings to new section
	 */
	addScriptSettings: function() {
		'use strict';

		this.addGeneralSettings();
		this.addRaffleSettings();
		this.addStorageSettings();
		this.addOtherSettings();
		this.addAbout();
	},

	/**
	 *
	 */
	addGeneralSettings: function() {
		'use strict';

		var storage = NoName.Storage,
			transitionsEnabled = storage.get('general:transitions', true),
			linksUseColour = storage.get('general:linksusecolour', false),
			customColor = storage.get('general:customcolour', false),
			color = storage.get('general:colour', '#CF6A32,#222222').split(','),

			//UI Color
			$color = NoName.UI.createSwitch(
				'Accent Colour: ', 'customcolor', [
					{
						label: 'Default',
						checked: !customColor,
					},
					{
						label: 'Custom',
						value: true,
						checked: customColor,
					}
				]
			),

			$colorpicker = $('<input />').addClass('jscolor').attr(
				{
					id: 'accent-colorpicker',
					'data-jscolor': '{hash:true, padding:0, shadow:false, borderWidth:0, backgroundColor:\'transparent\', insetColor:\'#000\', width: 256}',
				}
			).val(color[0]),

			//Link highlighting
			$links = NoName.UI.createSwitch(
				'Link hover effect: ', 'links', [
					{
						label: 'Text Shadow',
						checked: !linksUseColour,
					},
					{
						label: 'Text Colour',
						value: true,
						checked: linksUseColour,
					}
				]
			),

			//Transitions
			$transitions = NoName.UI.createSwitch(
				'Animations: ', 'transitions', [
					{
						label: 'Disabled',
						checked: !transitionsEnabled,
					},
					{
						label: 'Enabled',
						value: true,
						checked: transitionsEnabled,
					}
				]
			);

		$color.append($colorpicker);

		if(!customColor) {
			$colorpicker.hide();
		}

		$color.on(
			'change', function(e) {
				if(e.target.value) {
					$colorpicker.show();
				} else {
					$colorpicker.hide();
				}

				storage.set('general:customcolour', e.target.value);
			}
		);

		$colorpicker.on(
			'change', function() {
				var background = this.jscolor.toHEXString(),
					foreground = '#FFFFFF',
					rgb = parseInt(background.substring(1), 16),
					r = (rgb >> 16) & 0xff,
					g = (rgb >> 8) & 0xff,
					b = (rgb >> 0) & 0xff,
					luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

				//Use darker text if the background colour is light
				if(luma > 128) {
					foreground = '#222222';
				}
				var colors = [
					background,
					foreground,
				].join(',');

				storage.set('general:colour', colors);
			}
		);

		$links.on(
			'change', function(e) {
				storage.set('general:linksusecolour', e.target.value);
			}
		);

		$transitions.on(
			'change', function(e) {
				storage.set('general:transitions', e.target.value);
			}
		);

		this.addSettingsSection('general', 'General');

		this.addToSection(
			'general', [
				$color,
				$links,
				$transitions,
			]
		);
	},

	/**
	 *
	 */
	addRaffleSettings: function() {
		'use strict';

		var storage = NoName.Storage,
			showAllItemsEnabled = storage.get('raffles:showallitems', false),
			raffleLayout = storage.get('raffles:rafflelayout', false),

			//Show all items in raffle list
			$showAllItems = NoName.UI.createSwitch(
				'Raffle list - Show all items: ', 'show-all-items', [
					{
						label: 'Disabled',
						checked: !showAllItemsEnabled,
					},
					{
						label: 'Enabled',
						value: true,
						checked: showAllItemsEnabled,
					}
				]
			),

			//Alternate raffle layout
			$raffleLayout = NoName.UI.createSwitch(
				'Raffle - Alternate Layout:', 'raffle-layout', [
					{
						label: 'Disabled',
						checked: !raffleLayout,
					},
					{
						label: 'Enabled',
						value: true,
						checked: raffleLayout,
					}
				]
			);

		$showAllItems.on(
			'change', function(e) {
				storage.set('raffles:showallitems', e.target.value);
			}
		);

		$raffleLayout.on(
			'change', function(e) {
				storage.set('raffles:rafflelayout', e.target.value);
			}
		);

		this.addSettingsSection('raffles', 'Raffles');

		this.addToSection(
			'raffles', [
				$raffleLayout,
				$showAllItems,
			]
		);
	},

	/**
	 *
	 */
	addStorageSettings: function() {
		'use strict';

		var storage = NoName.Storage,
			dbEnabled = window.indexedDB && storage.get('storage:dbenabled', true),

			$db = NoName.UI.createSwitch(
				'Cache raffle/item information (Experimental):', 'db-enabled', [
					{
						label: 'Disabled',
						checked: !dbEnabled,
					},
					{
						label: 'Enabled',
						value: true,
						checked: dbEnabled,
					}
				]
			);

		$db.on(
			'change', function(e) {
				storage.set('storage:dbenabled', e.target.value);
			}
		);

		this.addSettingsSection('storage', 'Storage');
		this.addToSection(
			'storage', [
				$db,
			]
		);

		if(!window.indexedDB) {
			$db.append(
				$('<p></p>').text('Not supported by your browser')
			);
			$db.find('input').prop('disabled', true);
		}
	},

	/**
	 *
	 */
	addOtherSettings: function() {
		'use strict';

		var storage = NoName.Storage,
			cookiesEnabled = storage.get('steam:usecookies', false),
			lowResEnabled = storage.get('other:lowresimages', false),
			snowEnabled = storage.get('other:snow', true),
			scrapEnabled = storage.get('scrap:enabled', false),

			$cookies = NoName.UI.createSwitch(
				'Use Steam Inventory language:', 'steam-language', [
					{
						label: 'Disabled',
						checked: !cookiesEnabled,
					},
					{
						label: 'Enabled',
						value: true,
						checked: cookiesEnabled,
					}
				]
			),

			$lowRes = NoName.UI.createSwitch(
				'Low resolution images:', 'lowres-images', [
					{
						label: 'Disabled',
						checked: !lowResEnabled,
					},
					{
						label: 'Enabled',
						value: true,
						checked: lowResEnabled,
					}
				]
			),

			//ScrapTF mode
			$scrap = NoName.UI.createSwitch(
				'ScrapTF Mode:', 'scraptf-mode', [
					{
						label: 'Disabled',
						checked: !scrapEnabled,
					},
					{
						label: 'Enabled',
						value: true,
						checked: scrapEnabled,
					}
				]
			),

			//Snow
			$snow = NoName.UI.createSwitch(
				'Snow:', 'snow', [
					{
						label: 'Disabled',
						checked: !snowEnabled,
					},
					{
						label: 'Enabled',
						value: true,
						checked: snowEnabled,
					}
				]
			);

		//Enable scrapTF mode or check if it can be disabled
		$cookies.on(
			'change', function(e) {
				storage.set('steam:usecookies', e.target.value);
			}
		);

		$lowRes.on(
			'change', function(e) {
				storage.set('other:lowresimages', e.target.value);
			}
		);

		$scrap.on(
			'change', function(e) {
				if(e.target.value) {
					NoName.ScrapTF.enable();
				} else if(!NoName.ScrapTF.disable()) {
					$('#scraptf-mode-1').prop('checked', true);
				}
			}
		);

		$snow.on(
			'change', function(e) {
				storage.set('other:snow', e.target.value);
			}
		);

		$lowRes.append(
			$('<small></small>').html(
				'Reduces image resolution to limit download size'
			)
		);

		$cookies.append(
			$('<small></small>').html(
				'Enable if you aren\'t seeing the language you expect. <br />' +
				'Non-english languages may not work correctly.'
			)
		);

		this.addSettingsSection('other', 'Other');
		this.addToSection(
			'other', [
				$lowRes,
				$cookies,
				$scrap,
				$snow,
			]
		);
	},

	/**
	 *
	 */
	addAbout: function() {
		'use strict';

		this.addSettingsSection('about', 'About');
		this.addToSection(
			'about', [
				$('<p></p>').text(
					'Userscript with no name v' + GM_info.script.version + '.\n©2016 James Lyne. Licensed under GPL-3.0.'
				),
				$('<a></a>').prop('href', 'http://www.gnu.org/licenses/gpl-3.0.txt').text('License'),
				' - ',
				$('<a></a>').prop('href', 'https://greasyfork.org/en/scripts/18644-userscript-with-no-name').text(
					'Changelog'
				),
				' - ',
				$('<a></a>')
				.prop('href', 'https://greasyfork.org/en/scripts/18644-userscript-with-no-name/feedback')
				.text('Feedback'),
			]
		);
	}
};

//New raffle page
window.NoName.NewRaffle = {
	$itemList: null,
	$selectedItemList: null,
	$oldItems: null,
	$banWarning: null,

	$visibility: null,
	$entry: null,
	$type: null,
	$start: null,

	$submit: null,
	$UI: null,

	backpack: null,
	levelData: {},

	/**
	 *
	 */
	init: function() {
		'use strict';

		console.time("NoName:NewRaffle");

		document.body.id = 'new-raffle';

		this.$itemList = $('#allitems');
		this.$selectedItemList = $('#selitems');
		this.$banWarning = $('.ban_warning');

		this.$visibility = $('#ptype1').parent();
		this.$entry = $('#ptype2').parent();
		this.$type = $('#af1').parent();
		this.$start = $('#af2').parent();

		this.$submit = $('#rafBut').parent();

		this.initUI();
		this.addSwitches();

		this.backpack = new NoName.Backpack(
			{
				container: this.$itemList,
				selectedContainer: this.$selectedItemList,
				autoRender: true,
				tradableOnly: true,
				autoLoad: true,
				selectableItems: true,
			}
		);

		console.timeEnd("NoName:NewRaffle");
	},

	/**
	 *
	 */
	addSwitches: function() {
		'use strict';

		var $visibility = NoName.UI.createSwitch(
			'Raffle visibility:', 'rafflepub', [
				{
					id: 'ptype1',
					label: 'Public',
					value: 'public',
					checked: true,
				},
				{
					id: 'ptype2',
					label: 'Private',
					value: 'private',
				}
			]
			),

			$entry = NoName.UI.createSwitch(
				'Entry type:', 'invo', [
					{
						label: 'Open',
						id: 'af1',
						value: 'false',
						checked: true,
					},
					{
						id: 'af2',
						label: 'Invite only',
						value: 'true',
					}
				]
			),

			$type = NoName.UI.createSwitch(
				'Prize distribution:', 'split', [
					{
						id: 'isplit1',
						label: 'A21',
						value: 'alltoone',
					},
					{
						id: 'isplit2',
						label: '121',
						value: 'onerperson',
						checked: true
					}
				]
			),

			$start = NoName.UI.createSwitch(
				'Start timer:', 'stype', [
					{
						id: 'stype1',
						label: 'Instantly',
						value: 'instantly',
					},
					{
						id: 'stype2',
						label: 'After first entry',
						value: 'afterjoin',
						checked: true
					}
				]
			);

		//Add radio button replacement toggles
		this.$visibility.append($visibility);
		this.$entry.append($entry);
		this.$type.append($type);
		this.$start.append($start);
	},

	/**
	 *
	 */
	initUI: function() {
		'use strict';

		//Optimisation to avoid excessive style calculations in firefox
		//Detach containing element before making UI changes
		this.$UI = $('#content').detach();

		this.removeExistingUI();

		//Detach entries and referer, also add :s for consistency
		var that = this,
			$entries = [
				this.$UI.find('#maxentry').parent().prev().text('Maximum entries:').detach(),
				this.$UI.find('#maxentry').parent().detach()
			],

			$referer = [
				$('<td></td>').prop('colspan', 2),
				this.$UI.find('#reffil').parent().prev().text('Referral filter:').detach(),
				this.$UI.find('#reffil').parent().detach()
			];

		//Move entries after duration
		this.$UI.find('#durr').parent().after($entries);

		//Move referer to a new tr after duration/entries
		this.$UI.find('#durr').closest('tr').after(
			$('<tr></tr>').append($referer)
		);

		//Change defaults and other attributes to more sensible values
		this.$UI.find('#rtitle').addClass('full-width').prop(
			{
				placeholder: 'Raffle title',
				maxlength: 32,
				onclick: null,
			}
		).val('');

		this.$UI.find('#mess').parent().prop('colspan', 3);
		this.$UI.find('#mess').prop(
			{
				maxlength: 2048,
			}
		);

		this.$UI.find('#durr').addClass('full-width').val(3600);

		this.$UI.find('#maxentry').addClass('full-width').prop(
			{
				type: 'number',
			}
		).val(1000);

		this.$UI.find('#reffil').addClass('full-width').prop('placeholder', '*').val('');

		//Make selected items style consistent with backpack items
		this.$selectedItemList.addClass('itemtable');

		//Add <colgroup> to form table to make column widths consistent
		this.$UI.find('.text_holder table').prepend(
			$('<colgroup></colgroup>').append(
				[
					$('<col />').css('width', '19%'), //Account for padding on 3rd column. Not nice but calc() doesn't work properly here.
					$('<col />').css('width', '30%'),
					$('<col />').css('width', '20%'),
					$('<col />').css('width', '30%'),
				]
			)
		);

		//TODO: perhaps just overwrite the existing create function via unsafeWindow?
		this.$submit.append(
			$('<button></button>').prop(
				{
					type: 'button',
					id: 'raffle-button' //Different id to prevent old event handler triggering
				}
			).addClass('full-width')
			.text('Raffle it!')
			.on(
				'click', function() {
					that.createRaffle();
				}
			)
		);

		//Lock visibility to private when invite only is selected
		this.$UI.on(
			'change', '#af1, #af2', function() {
				if(this.value === 'true') {
					$('#ptype2').prop(
						{
							checked: true,
						}
					);
				}

				$('#ptype1, #ptype2').prop('disabled', this.value === 'true');
			}
		);

		//New hover handler
		this.$UI.find('.indent').on(
			'mouseover', '.item', function() {
				//Timing issues mean we can't be sure the original hover events are gone
				unsafeWindow.$('.item').unbind('mouseenter mouseleave');

				NoName.UI.showItemInfo(this);
			}
		).on(
			'mouseout', '.item', function() {
				NoName.UI.hideItemInfo();
			}
		);

		//Reattach updated UI
		this.$UI.insertAfter('#nav_holder');
	},

	removeExistingUI: function() {
		'use strict';

		//Remove games selection
		this.$UI.find('#allgames').parent().prev().remove();
		this.$UI.find('#allgames').parent().remove();

		//Remove remaining unneeded radio button <tr>s
		this.$UI.find('#isplit1').closest('tr').remove();
		this.$UI.find('#stype1').closest('tr').remove();

		//I'm sure anyone using this already knows the rules
		this.$banWarning.remove();

		//Empty things we are going to replace
		this.$visibility.empty();
		this.$entry.empty();
		this.$type.empty();
		this.$start.empty();

		//Remove existing button so I can readd it again without existing event handlers
		this.$UI.find('#rafBut').remove();
		this.$UI.find('.infitem').remove();
		this.$UI.find('#rtitle').removeAttr('size');
	},

	createRaffle: function() {
		'use strict';

		var $raffleButton = $('#raffle-button'),
			selected = this.backpack.getSelected(),
			itemData = [],

			raffleData = {
				postraffle: 'true',
				title: $('#rtitle').val(),
				message: $('#mess').val(),
				maxentry: $('#maxentry').val(),
				duration: $('#durr').val(),
				filter: $('#reffil').val() || '*',
				split: $('input[name=split]:checked').val(),
				pub: $('input[name=rafflepub]:checked').val(),
				stype: $('input[name=stype]:checked').val(),
				invo: $('input[name=invo]:checked').val(),
				games: [],
			};

		$raffleButton.prop('disabled', true).text('Please wait...');

		selected.forEach(
			function(item) {
				var data = [
					item.getDefIndex(),
					item.getQuality(),
					item.getLevel(),
					''//item.getSeries() //This is always empty in the original inventory apparently
				];

				itemData.push(data.join(':'));
			}
		);

		raffleData.items = itemData;

		$raffleButton.removeProp('disabled').text('Raffle it!');

		// NoName.DB.saveRaffle({
		// 	id: new Date().getTime(),
		// 	title: raffleData.title,
		// 	date: new Date().getTime(),
		// 	length: raffleData.duration,
		// }, selected);
		// return;

		NoName.AJAX(raffleData).done(
			function(data) {
				NoName.DB.saveRaffle(
					{
						id: data.key.replace('.html', ''),
						title: raffleData.title,
						date: new Date().getTime(),
						length: raffleData.duration,
					}, selected
				).done(
					function() {
						window.location.href = 'http://tf2r.com/k' + data.key;
					}
				);
			}
		).always(
			function() {
				$('#raffle-button').removeProp('disabled').text('Raffle it!');
			}
		);
	},
};

window.NoName.RaffleList = {
	init: function() {
		'use strict';

		var that = this;

		document.body.id = 'raffle-list';

		this.initUI();

		//Update item lists if show all setting changes
		NoName.Storage.listen(
			'raffles:showallitems', function() {
				that.getItems();
			}
		);

		this.getItems();
	},

	/**
	 *
	 */
	exportOverrides: function() {
		'use strict';

		var that = this;

		//Remove getItems() function as we're replacing it with our own implementation
		unsafeWindow.getItems = exportFunction(
			function() {
			}, unsafeWindow
		);

		//Override check raffles function to remove display: none from raffle header
		unsafeWindow.checkraffles = exportFunction(
			function() {
				return that.checkraffles();
			}, unsafeWindow
		);

		//Remove ih() function as we're replacing it with our own implementation
		unsafeWindow.ih = exportFunction(
			function() {
			}, unsafeWindow
		);
	},

	/**
	 *
	 */
	initUI: function() {
		'use strict';

		$('.participants').on(
			'mouseover', '.item', function() {
				NoName.UI.showItemInfo(this);
			}
		).on('mouseout', '.item', NoName.UI.hideItemInfo);

		if(NoName.ScrapTF.isEnabled()) {
			$('.pubrhead-text-right a').each(
				function() {
					if(NoName.ScrapTF.removedByStaff()) {
						console.warn('[ScrapTF::removedByStaff] Raffle title removed by staff');
						$(this).html('<code>[Removed by staff]</code>');
					}
				}
			);
		}
	},

	/**
	 * TODO: This repeats a lot of what getitems() does. Can they be merged?
	 */
	checkraffles: function() {
		'use strict';

		var that = this;

		if(!unsafeWindow.focused) {
			setTimeout(unsafeWindow.checkraffles, 5000);

			return;
		}

		NoName.AJAX(
			{
				checkpublicraffles: 'true',
				lastpraffle: unsafeWindow.lpr,
			}
		).done(
			/**
			 *
			 * @param data
			 * @param data.message.newraf		List of newly created raffles
			 */
			function(data) {
				if(data.message.newraf.length) {
					that.populateRaffles(data.message.newraf);
				}

				unsafeWindow.ih();
			}
		);

		setTimeout(unsafeWindow.checkraffles, 5000);
	},

	/**
	 * Retrieves items for all raffles currently in raffle list
	 * Calls populate when retrieved
	 */
	getItems: function() {
		var list = [],
			that = this;

		$('.jqueryitemsgather').each(
			function(index) {
				$(this).addClass('loading');
				list[index] = $(this).attr('rqitems');
			}
		);

		NoName.AJAX(
			{
				getitems: 'true',
				list: list.join(';'),
			}
		).done(
			function(data) {
				if(data.message.items) {
					that.populateRaffleItems(data.message.items);
				}
			}
		);
	},

	/**
	 * Adds newly created raffles to the raffle list
	 * TODO: Make this less horrible
	 * TODO:  merge with the other populate functions
	 * TODO: Also add getRaffle support
	 * @param raffles
	 * @param raffles.array_member.rname		Raffle title
	 * @param raffles.array_member.rlink		Link to raffle
	 */
	populateRaffles: function(raffles) {
		'use strict';

		var showAll = NoName.Storage.get('raffles:showallitems', false);

		for(var id in raffles) {
			if(!raffles.hasOwnProperty(id)) {
				continue;
			}

			var raffle = raffles[id],
				$header,
				$content,
				$items;

			if(unsafeWindow.lpr < raffle.id) {
				unsafeWindow.lpr = raffle.id;
			}

			if(NoName.ScrapTF.isEnabled() && NoName.ScrapTF.removedByStaff()) {
				console.warn('[ScrapTF::removedByStaff] Raffle title removed by staff');
				raffle.name = '<code>[Removed by Staff]</code>';
			}

			//Not proud of this but there's a lot of html to build
			//Raffle header
			$header = $('<div></div>').addClass('pubrhead').append(
				$('<div></div>').addClass('pubrhead-text-left').append(
					$('<a></a>') //Username
					.prop('href', raffle.link)
					.css('color', '#' + raffle.color)
					.html(raffle.name) //Already escaped
				).append(
					$('<div></div>').addClass('pubrhead-text-right').append(
						$('<a></a>').prop('href', raffle.rlink).text(raffle.rname) //Raffle name
					)
				).append(
					$('<div></div>').addClass('pubrhead-arrow-border')
				).append(
					$('<div></div>').addClass('pubrhead-arrow')
				)
			);

			//Raffle content
			$content = $('<div></div>').addClass('pubrcont').append(
				$('<div></div>').addClass('pubrleft').append(
					$('<div></div>').addClass('pubrav').append(
						$('<a></a>').prop('href', raffle.link).append(
							$('<img />').prop('src', raffle.avatar).css(
								{ //User avatar
									width: '64px',
									height: '64px',
								}
							)
						)
					)
				).append(
					$('<div></div>').addClass('pubrarro')
				)
			);

			$items = $('<div></div>').addClass('pubrright');
			this.populateSingleRaffleItems($items.get(0), raffle.items, showAll);

			$content.append($items);
			$('.participants').prepend($content).prepend($header);
		}
	},

	/**
	 * Populates the item lists for each raffle in the raffle list
	 * Also checks the DB for saved data, and uses it if present
	 * @param items
	 * @param items.array_member.rkey		ID of raffle that contains item
	 */
	populateRaffleItems: function(items) {
		'use strict';

		var that = this,
			showAll = NoName.Storage.get('raffles:showallitems', false),
			raffleItems = {};

		for(var id in items) {
			if(!items.hasOwnProperty(id)) {
				continue;
			}

			var item = items[id];

			if(item.rkey) {
				raffleItems[item.rkey] = raffleItems[item.rkey] || [];
				raffleItems[item.rkey].push(item);
			}
		}

		console.time('NoName:RaffleList:populateRaffleItems');

		$('.participants .jqueryitemsgather').empty().each(
			function() {
				var raffleId = $(this).attr('rqitems'),
					element = this;

				//Query db to see if we have saved items we can use instead
				//Ugh nested callbacks :|
				NoName.DB.getRaffle(raffleId, true).done(
					function(raffle, itemsLoaded) {

						//Use them if we do
						if(raffle && itemsLoaded && raffle.items && raffle.items.length) {
							console.info('[RaffleList::populateRaffleItems] Loaded raffle ' + raffleId);
							that.populateSingleRaffleItems(element, raffle.items, showAll);
						} else {
							that.populateSingleRaffleItems(element, raffleItems[raffleId], showAll);
						}
					}
				).fail(
					function() {
						that.populateSingleRaffleItems(element, raffleItems[raffleId], showAll);
					}
				);
			}
		);

		console.timeEnd('NoName:RaffleList:populateRaffleItems');
	},

	/**
	 * Populates the item list of a single raffle
	 * Moved here to avoid callback hell
	 * @param element
	 * @param items
	 * @param showAll
	 * @returns {*}
	 */
	populateSingleRaffleItems: function(element, items, showAll) {
		'use strict';

		var width = element.offsetWidth - 74,
			remaining = 0,
			toAppend = [];

		for(var id in items) {
			if(!items.hasOwnProperty(id)) {
				continue;
			}

			var item = items[id];

			toAppend.push(NoName.UI.getItem(item));

			//Leave space for "+x" if show all items is disabled
			if(!showAll && (width -= 68) <= 74) {
				remaining = items.length - toAppend.length;

				break;
			}
		}

		$(element).append(toAppend);

		//Add +x if there are any undisplayed items
		if(remaining && !showAll) {
			$(element).attr('data-overflow', '+' + remaining);
		} else {
			$(element).removeAttr('data-overflow');
		}

		$(element).removeClass('loading');

		return element;
	}
};

window.NoName.Raffle = {
	raffleID: '',

	$statsContainer: null,

	$message: null,
	$winChance: null,
	$timeLeft: null,
	$entries: null,
	$prizes: null,

	commentBlock: false,
	entries: 0,
	winChance: 100,
	itemCount: 1,
	timeLeft: 0,
	endTime: 0,
	type: null,

	/**
	 *
	 */
	init: function() {
		'use strict';

		console.time('NoName:Raffle');

		document.body.id = 'raffle';

		//TODO: Are raffle ids always 6 characters?
		this.raffleID = window.location.pathname.substring(2, 8);

		this.$timeLeft = $('#tlefttd');
		this.$message = $('td[colspan="3"]').first();
		this.$entries = $('#entry');
		this.$winChance = $('#winc');
		this.$type = null;

		this.entries = parseInt(this.$entries.text(), 10);
		this.itemCount = $('.raffle_infomation .item').length;
		this.timeLeft = parseInt(unsafeWindow.tleft, 10);
		this.endTime = Date.now() + (this.timeLeft * 1000);

		this.initUI();
		this.initItems();
		this.updateTimer();
		this.checkRaffle();

		NoName.Storage.listen(
			'raffles:rafflelayout', function() {
				unsafeWindow.location.reload();
			}
		);

		console.timeEnd('NoName:Raffle');
	},

	/**
	 *
	 */
	exportOverrides: function() {
		'use strict';

		unsafeWindow.checkraffle = exportFunction(
			function() {
			}, unsafeWindow
		);
		unsafeWindow.updateTimer = exportFunction(
			function() {
			}, unsafeWindow
		);
		unsafeWindow.updateWC = exportFunction(
			function() {
			}, unsafeWindow
		);
	},

	/**
	 *
	 */
	initUI: function() {
		'use strict';

		var that = this;

		//Optimisation to avoid excessive style calculations in firefox
		//Detach containing element before making UI changes
		this.$UI = $('#content').detach();

		//Add ids to things for css styling
		this.$UI.find('.indent table:nth-child(2) > tbody > tr:nth-child(5) > td:nth-child(2)').prop('id', 'rep');
		this.$UI.find('.indent table:nth-child(2) tr:nth-child(7) td').prop('id', 'prizes');
		this.$UI.find('.indent table:nth-child(2) > tbody > tr:nth-child(1) > td > div').prop('id', 'raffle-title');
		this.$UI.find(
			'.indent table:nth-child(2) > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(1) > td:nth-child(2)'
		).prop('id', 'raffle-message');

		this.$prizes = this.$UI.find('#prizes');

		//Add load more comments button if there are 50 comments
		if(this.$UI.find('.userfeedpost').length === 50) {
			this.$UI.find('.userfeed').append(
				$('<button></button>').prop('id', 'load-comments').text('Load more comments...').on(
					'click', function() {
						that.loadComments();
					}
				)
			);
		}

		//Replace raffle delivery links with buttons
		this.$UI.find('.spectik').each(
			function() {
				var type = $(this).attr('id'),
					wid = $(this).attr('wid'),
					text = $(this).text();

				$(this).replaceWith(
					$('<button></button>').addClass('spectik').data(
						{
							win: wid,
							option: type,
						}
					).prop('type', 'button').attr('data-type', type).text(text)
				);
			}
		);

		//Load new raffle layout if enabled
		if(NoName.Storage.get('raffles:rafflelayout', false)) {
			this.addRaffleStats();
		} else {
			this.$type = $('<td></td>').prop('id', 'type').text('...');

			this.$UI.find('#entry').parent().after(
				$('<tr></tr>').append(
					[
						$('<td></td>').text('Type:'),
						this.$type,
					]
				)
			);
		}

		if(NoName.ScrapTF.isEnabled() && NoName.ScrapTF.removedByStaff()) {
			this.$UI.find('#raffle-message').html('<code>[Removed by staff]</code>');
			this.$UI.find('#raffle-title').html('<code>[Removed by staff]</code>');
		}

		this.$prizes.find('.participants_winner').addClass('loading');

		this.initCommentForm();
		this.initEvents();

		//Reattach updated UI
		this.$UI.insertAfter('#nav_holder');
	},

	/**
	 *
	 */
	initCommentForm: function() {
		var $button = this.$UI.find('#newfeed'),
			$form = this.$UI.find('.newfeed').empty(),

			$elements = [
				$('<label></label>').text('Message:'), //Message Label
				$('<textarea></textarea>').prop('id', 'feedtext').addClass('full-width'), //Message textarea
				$('<button></button>').prop(
					{ //Submit button
						type: 'button',
						id: 'sendfeed',
					}
				).text('Post'),
			];

		$button.val('Post new comment');
		$form.append($elements);
	},

	/**
	 *
	 */
	initEvents: function() {
		var that = this;

		//New hover handler
		this.$UI.find('.indent').on(
			'mouseover', '.item', function() {
				//Timing issues mean we can't be sure the original hover events are gone
				unsafeWindow.$('.item').unbind('mouseenter mouseleave');

				NoName.UI.showItemInfo(this);
			}
		).on(
			'mouseout', '.item', function() {
				NoName.UI.hideItemInfo();
			}
		);

		//Remove original event handler on first click
		this.$UI.find('.spectik').one(
			'click', function() {
				unsafeWindow.$('.spectik').unbind('click');
			}
		);

		this.$UI.find('.participants_winner').on(
			'click', '.spectik', function(e) {
				var data = $(this).data();

				data.tik = true;
				data.rid = that.raffleID;

				$(e.target).parent().addClass('loading');

				NoName.AJAX(data).done(
					function() {
						$(e.target).prop('disabled', true).siblings().remove();
					}
				).always(
					function() {
						$(e.target).parent().removeClass('loading');
					}
				);

				return false;
			}
		);

		this.$UI.find('#newfeed').on(
			'click', function(e) {
				e.stopImmediatePropagation();
				$('.newfeed').slideToggle();
			}
		);

		this.$UI.find('#sendfeed').on(
			'click', function(e) {
				e.stopImmediatePropagation();

				if(!NoName.ScrapTF.canComment()) {
					return false;
				}

				that.postComment();

				return true;
			}
		);

		this.$UI.find('#feedtext').on(
			'keypress', function(e) {
				e.stopImmediatePropagation();

				if(e.keyCode == 13) {
					that.postComment();
				}
			}
		);

		setTimeout(
			function() {
				try {
					unsafeWindow.$('#sendfeed').unbind('click');
					unsafeWindow.$('#newfeed').unbind('click');
					unsafeWindow.$('#feedtext').unbind('keypress');
				} catch(ignored) {
					console.log('[Raffle::_initEvents] Ignoring firefox unsafeWindow exception');
				}
			}, 0
		);
	},

	/**
	 * Checks database for saved items
	 * Then calls updateItems with the results
	 * If no items are found, the raffle is saved and the site provided items are used instead
	 */
	initItems: function() {
		var that = this;

		//Check DB for saved items and use them if they exist
		NoName.DB.getRaffle(this.raffleID, true).done(
			function(raffle, itemsLoaded) {
				//TODO: Do we really want to re-save the raffle if the items didn't load?
				if(raffle && itemsLoaded) {
					console.info('[Raffle::initItems] Loaded raffle');
					that.updateItems(raffle.items);
				} else {
					NoName.DB.saveRaffle(
						{
							id: that.raffleID,
							title: $('#raffle-title').text(),
						}, that.updateItems()
					).done(
						function() {
							console.info('[Raffle::initItems] Saved raffle');
						}
					);
				}
			}
		).fail(
			function(event) {
				console.error('[Raffle::init] Loading the raffle from the db failed for some reason', event);
				that.updateItems();
			}
		);
	},

	/**
	 * Renders the items shown in the prizes and winners section of the page
	 * Will either take an array of items (likely loaded from the DB)
	 * and update the existing items using them,
	 * Or will create items using the existing site information
	 * @param items
	 * @returns {*|Array}
	 */
	updateItems: function(items) {
		var that = this,
			useItems = !!items,

			//Reference elements for reattaching
			$prizesContainer = this.$prizes.parent(),
			$winners = $('.participants_winner'),
			$winnersSibling = $winners.prev();

		//Detach to improve append performance
		this.$prizes.detach().removeClass('loading');

		$winners.detach().removeClass('loading');

		items = items || [];

		this.$prizes = this.$prizes.detach();

		console.time('NoName:UI:updateItems');

		//For each prize, either use the provided item if it exists
		//Or create an item from the existing site information and return it
		this.$prizes.find('.item').each(
			function(index) {
				if(useItems && typeof items[index] === 'object') {
					console.log('[Raffle::updateItems] Using loaded item');
					that.updateItem(this, items[index]);
				} else {
					items.push(that.updateItem(this, null, index));
				}
			}
		);

		//Raffle winners seem to be listed in a somewhat unpredictable order
		//Until I work out what this order is (if there even is one) I'll make do with this.
		//Loop over each won item and:
		//1. Create NoName.Item object based off the original html
		//2. Compare created item to array of prize items that was created above
		//3. Use the first match (defindex + quality + level)
		//This should work fine. Multiple identical items that differ in ways the site isn't aware of
		//will be shown in an unpredictable order, but this doesn't matter as you can't tell which order
		//would have been correct to begin with.
		var winnerItems = items; //Use a copy as we'll need to remove matched items to prevent duplicates

		$winners.find('.item').each(
			function(index) {
				var originalItem = that.updateItem(this, null, index);

				for(var i = 0; i < winnerItems.length; i++) {
					var item = winnerItems[i];

					//Compare prize item with winner item
					//If they match closely enough use the prize item to update the winner item
					//Both defindex and name are checked as an OR
					//This handles edge cases where a winner item can resolve to multiple possible defindexes
					//I.e old expired keys
					if((item.defindex === originalItem.defindex ||
						item.name === originalItem.name) &&
						item.quality === originalItem.quality &&
						item.level === originalItem.level) {
						console.log(
							'[Raffle::updateItems] Found match for ' + originalItem.getName() + ' - ' + item.getName()
						);

						that.updateItem(this, item);
						winnerItems.splice(i, 1);
						break;
					}
				}
			}
		);

		//Reattach
		$prizesContainer.append(this.$prizes);
		$winnersSibling.after($winners);

		console.timeEnd('NoName:UI:updateItems');

		return items;
	},

	/**
	 * Renders a single item
	 * If an item object is passed in, it's details are used for rendering
	 * Otherwise the item element's attributes are used
	 * @param element
	 * @param item
	 * @param index
	 * @returns {*}
	 */
	updateItem: function(element, item, index) {
		var $img = $(element).children('img');

		if(!item) {
			//console.log('[Raffle::updateItems] Creating new item');
			var data = {
					id: this.raffleID + index,
					level: $(element).attr('ilevel'),
					name: $(element).attr('iname'),
					wear: $(element).attr('iwear'),
					thumbnail: $img.attr('src'),
				},
				matches = element.className.match(/q(\d+)/);

			if(matches) {
				data.quality = matches[1];
			}

			item = new NoName.Item(data, true);
		}

		$img.remove();
		element.style.width = '';
		element.style.height = '';

		element.style.backgroundImage = item.getBackgroundImages();
		element.className = item.getCSSClasses();
		element.item = item;

		return item;
	},

	/**
	 * Checks the server for current raffle status
	 * @param once
	 */
	checkRaffle: function(once) {
		var that = this;

		NoName.AJAX(
			{
				checkraffle: 'true',
				rid: this.raffleID,
				lastentrys: unsafeWindow.entryc,
				lastchat: unsafeWindow.lastchat,
			}
		).done(
			/**
			 *
			 * @param data
			 * @param data.message
			 * @param data.message.timeleft		Time remaining
			 * @param data.message.entry		Current entry count
			 * @param data.message.cur_entry	Current entry count
			 * @param data.message.max_entry	Maximum entry count
			 * @param data.message.newentry		New raffle entries
			 * @param data.message.wc			Raffle winning chance
			 * @param data.message.chatmax		ID of last comment
			 * @param data.message.chaten		New comments
			 */
			function(data) {
				if(data.message.ended && !unsafeWindow.ended) {
					window.location.reload();
				}

				$('#entry').html(data.message.cur_entry + '/' + data.message.max_entry);

				that.entries = data.message.cur_entry;
				unsafeWindow.entryc = data.message.entry;
				unsafeWindow.nwc = that.winChance = data.message.wc;
				unsafeWindow.lastchat = data.message.chatmax;
				unsafeWindow.tleft = data.message.timeleft;

				that.determineRaffleType();
				that.updateWC();

				if(Math.abs(that.timeLeft - data.message.timeleft) > 1000) {
					console.log('[Raffle::checkRaffle] Time remaining differs by > 1 second, Snapping to server time.');
					that.endTime = Date.now() + (data.message.timeleft * 1000);
				}

				if(!unsafeWindow.started && data.message.started) {
					that.timeLeft = data.message.timeleft;
					unsafeWindow.started = true;
				}

				that.addComments(data.message.chaten, true);
				that.addParticipants(data.message.newentry);
			}
		);

		if(!once) {
			setTimeout(
				function() {
					NoName.Raffle.checkRaffle();
				}, (unsafeWindow.ended) ? 5000 : 3500
			);
		}
	},

	updateTimer: function(once) {
		var that = this;

		if(!unsafeWindow.started) {
			return;
		}

		if(unsafeWindow.ended || this.timeLeft < 0) {
			this.$timeLeft.text('Ended');

			return;
		}

		var timeLeft = Math.ceil((this.endTime - Date.now()) / 1000);

		if(timeLeft !== this.timeLeft) {
			var hours = Math.floor(this.timeLeft / 3600),
				minutes = Math.floor(this.timeLeft / 60 - hours * 60),
				seconds = Math.floor(this.timeLeft - hours * 3600 - minutes * 60),
				time = [];

			if(hours) {
				time.push(hours + 'h'); //Removed leading 0 to fix >=100 hour raffles
			}

			if(minutes) {
				time.push(('00' + minutes).slice(-2) + 'm');
			}

			if(seconds) {
				time.push(('00' + seconds).slice(-2) + 's');
			}

			this.$timeLeft.text(time.join(' '));
			this.timeLeft = timeLeft;
		}

		if(!once) {
			requestAnimationFrame(
				function() {
					that.updateTimer();
				}
			);
		}
	},

	updateWC: function() {
		var that = this;

		//Break loop if remaining difference is too small to be displayed
		if((unsafeWindow.cwc - this.winChance) < 0.0005) {
			return;
		}

		unsafeWindow.cwc -= (unsafeWindow.cwc - this.winChance) / 10;
		this.$winChance.html(unsafeWindow.cwc.toFixed(3) + '%');

		setTimeout(
			function() {
				that.updateWC();
			}, 50
		);
	},

	/**
	 * Determine if this is an A21 or 121 raffle using the win chance and number of entries
	 */
	determineRaffleType: function() {
		//Don't calculate again if we've already done it
		if(this.type) {
			return;
		}

		//Need at least 2 entries to determine type
		if(this.entries <= 1) {
			return;
		}

		var winners = Math.round((this.winChance * this.entries) / 100);

		if(winners > 1) {
			this.type = '121';
			this.$type.empty().append(
				$('<abbr><abbr/>').prop('title', 'One to one').text('121')
			);
		} else {
			this.type = 'A21';
			this.$type.empty().append(
				$('<abbr><abbr/>').prop('title', 'All to one').text('A21')
			);
		}
	},

	/**
	 * Replace old entries/time/chance stats with some new fancy looking ones
	 */
	addRaffleStats: function() {
		var message = this.$message.html();

		//Remove nested table as it only contains one cell we need, the raffle message
		this.$message = this.$message.closest('.raffle_infomation');
		this.$message.prop('id', 'raffle-message').html(message);

		//Remove things we don't need anymore
		this.$entries.closest('tr').remove();

		//TODO: These should be moved somewhere instead of removed
		this.$UI.find('td[data-rstart-unix]').closest('tr').remove();
		this.$UI.find('td[data-rsend-unix]').closest('tr').remove();

		//Create new <tr> and <td> for raffle stats
		this.$statsContainer = $('<td></td>').addClass('raffle_infomation').prop('id', 'raffle-stats');
		this.$message.parent().after(
			$('<tr></tr>').append(this.$statsContainer)
		);

		//Account for extra row on avatar <td>
		this.$UI.find('td[rowspan="2"]').attr('rowspan', '3');

		this.$entries = $('<strong></strong>').prop('id', 'entry').text('...');
		this.$winChance = $('<strong></strong>').prop('id', 'winc').text('...');
		this.$timeLeft = $('<strong></strong>').prop('id', 'tlefttd').text('...');
		this.$type = $('<strong></strong>').prop('id', 'type').text('...');

		this.$statsContainer.append(
			[
				this.$timeLeft,
				this.$entries,
				this.$winChance,
				this.$type,
			]
		);
	},

	/**
	 *
	 */
	loadComments: function() {
		var that = this;

		$('#load-comments').prop('disabled', true).text('Loading...');

		NoName.AJAX(
			{
				checkraffle: 'true',
				rid: this.raffleID,
				lastentrys: unsafeWindow.entryc,
				lastchat: 0 //All comments
			}
		).done(
			function(data) {
				//Remove first 50 comments that are already on the page
				var comments = data.message.chaten.slice(0, -50).reverse();
				that.addComments(comments);

				$('#load-comments').remove();
			}
		);
	},

	/**
	 *
	 * @param comments
	 * @param comments.array_member.avatar
	 * @param comments.array_member.chaten
	 * @param prepend
	 */
	addComments: function(comments, prepend) {
		if(prepend) {
			comments = comments.reverse();
		}

		for(var id in comments) {
			if(!comments.hasOwnProperty(id)) {
				continue;
			}

			var comment = comments[id],

				//Comment container
				$container = $('<div></div>').addClass('userfeedpost').css(
					{
						'background-color': '#' + comment.color,
					}
				),

				//Username
				$username = $('<div></div>').addClass('ufinf').append(
					$('<div></div>').addClass('ufname').append(
						$('<a></a>').prop('href', comment.url).css(
							{
								color: '#' + comment.color,
							}
						).text(comment.name)
					)
				),

				//Avatar
				$avatar = $('<div></div>').addClass('ufavatar').append(
					$('<a></a>').prop('href', comment.url).append(
						$('<img />').prop('src', comment.avatar)
					)
				),

				//Message
				$message = $('<div></div>').addClass('ufmes').html(comment.message); //Already sanitised

			//Append them all together
			$container.append(
				[
					$username.append($avatar),
					$message
				]
			);

			if(prepend) {
				$('.userfeed').prepend($container);
			} else {
				$('.userfeed').append($container);
			}
		}
	},

	/**
	 *
	 */
	postComment: function() {
		var that = this;

		if(this.commentBlock) {
			return;
		}

		this.commentBlock = true;
		$('#sendfeed').hide();

		NoName.AJAX(
			{
				postchat: 'true',
				rid: this.raffleID,
				mess: $('#feedtext').val(),
			}
		).done(
			function() {
				$('#feedtext').val('');
				$('.newfeed').slideUp(150);
			}
		).always(
			function() {
				that.commentBlock = false;
				$('#sendfeed').show();
			}
		);
	},

	/**
	 *
	 * @param participants
	 */
	addParticipants: function(participants) {
		for(var id in participants) {
			if(!participants.hasOwnProperty(id)) {
				continue;
			}

			var participant = participants[id];

			if(unsafeWindow.lastname != participant.name) {
				$('#pholder').prepend(
					'<div class="pentry"><div class="pavatar"><a href="' + participant.link + '"><img src="' + participant.avatar + '" width="64px" height="64px" /></a></div><div class="pname"><a href="' + participant.link + '" style="color:#' + participant.color + ';">' + participant.name + '</a></div></div>'
				);
			}

			unsafeWindow.lastname = participant.name;
		}
	},
};

//Emulates the... interesting choice to add sizeable cooldowns to everything in scrapTF
//Would be a good idea to not take this seriously, just saying, let me have my fun.
//TODO: Auctions?
window.NoName.ScrapTF = {
	enabled: 0,
	lastEntry: 0,
	lastComment: 0,

	COOLDOWN_RAFFLE: 10,
	COOLDOWN_COMMENT: 30,
	COOLDOWN_DISABLE: 30,
	REMOVED_CHANCE: 0.2,

	/**
	 *
	 */
	init: function() {
		'use strict';

		var that = this;

		console.time("NoName:ScrapTF");

		this.enabled = NoName.Storage.get('scrap:enabled', 0);
		this.lastEntry = NoName.Storage.get('scrap:lastentry', 0);
		this.lastComment = NoName.Storage.get('scrap:lastcomment', 0);

		//Opening multiple tabs will not save you
		NoName.Storage.listen(
			'scrap:enabled', function(oldValue, newValue) {
				that.enabled = newValue;
			}
		);

		NoName.Storage.listen(
			'scrap:lastentry', function(oldValue, newValue) {
				that.lastEntry = newValue;
			}
		);

		NoName.Storage.listen(
			'scrap:lastcomment', function(oldValue, newValue) {
				that.lastComment = newValue;
			}
		);

		console.timeEnd("NoName:ScrapTF");
	},

	/**
	 *
	 * @returns {boolean}
	 */
	isEnabled: function() {
		'use strict';

		return !!this.enabled;
	},

	/**
	 *
	 * @returns {boolean}
	 */
	enable: function() {
		'use strict';

		var now = new Date().getTime();

		if(this.enabled) {
			return false;
		}

		NoName.Storage.set('scrap:enabled', now);
		this.enabled = now;

		alert('ScrapTF mode enabled');

		return true;
	},

	/**
	 * Dunno why you would want to turn it off but here you go
	 * @returns {boolean}
	 */
	disable: function() {
		'use strict';

		var now = new Date().getTime(),
			difference = (now - this.enabled) / 1000,
			remaining = this.COOLDOWN_DISABLE - difference;

		//No quick escape for you
		if(remaining > 0) {
			alert('Please wait ' + remaining.toFixed(0) + ' seconds to disable ScrapTF mode.');

			return false;
		} else {
			this.enabled = 0;
			NoName.Storage.set('scrap:enabled', '');

			alert('ScrapTF mode disabled');

			return true;
		}
	},

	/**
	 * Recent development
	 * Luckily we aren't a bot or we would be so screwed here!
	 * @returns {boolean}
	 */
	canEnterRaffle: function() {
		'use strict';

		var now = new Date().getTime(),
			difference = (now - this.lastEntry) / 1000,
			remaining = this.COOLDOWN_RAFFLE - difference;

		if(!this.enabled) {
			return true;
		}

		if(remaining > 0) {
			console.warn('[ScrapTF::canEnterRaffle] Blocking raffle entry');
			alert('Please wait ' + remaining.toFixed(0) + ' seconds to enter this raffle.');
			return false;
		}

		this.lastEntry = now;
		NoName.Storage.set('scrap:lastentry', now);

		return true;
	},

	/**
	 * Stop spamming pls
	 * @returns {boolean}
	 */
	canComment: function() {
		'use strict';

		var now = new Date().getTime(),
			difference = (now - this.lastComment) / 1000,
			remaining = this.COOLDOWN_DISABLE - difference;

		if(!this.enabled) {
			return true;
		}

		if(remaining > 0) {
			console.warn('[ScrapTF::canComment] Blocking comment');
			alert('Please don\'t spam');
			return false;
		}

		NoName.Storage.set('scrap:lastcomment', now);
		this.lastComment = now;

		return true;
	},

	/**
	 *
	 * @returns {boolean}
	 */
	removedByStaff: function() {
		'use strict';

		return Math.random() < this.REMOVED_CHANCE;
	},
};

window.NoName.Storage = {
	available: false,
	callbacks: {},

	/**
	 *
	 */
	init: function() {
		'use strict';

		var that = this;

		if(!localStorage && localStorage.getItem) {
			console.warn('[Storage::init] localStorage not available. Settings will not be saved.');

			return;
		}

		this.available = true;

		window.addEventListener(
			'storage', function(e) {
				that._fire(e);
			}
		);
	},

	/**
	 *
	 * @param key
	 * @param defaultValue
	 * @returns {*}
	 */
	get: function(key, defaultValue) {
		'use strict';

		if(!this.available) {
			return defaultValue;
		}

		return (typeof localStorage[key] === 'undefined') ? defaultValue : localStorage[key];
	},

	/**
	 *
	 * @param key
	 * @param value
	 * @returns {boolean}
	 */
	set: function(key, value) {
		'use strict';

		if(!this.available) {
			return false;
		}

		var old = localStorage[key];
		localStorage[key] = value;

		this._fire(
			{
				key: key,
				oldValue: old,
				newValue: value,
				url: window.location.href,
			}
		);

		return true;
	},

	/**
	 *
	 * @param e
	 * @private
	 */
	_fire: function(e) {
		'use strict';

		if(this.callbacks[e.key]) {
			for(var i = 0; i < this.callbacks[e.key].length; i++) {
				this.callbacks[e.key][i](e.oldValue, e.newValue, e.url);
			}
		}
	},

	/**
	 *
	 * @param keys
	 * @param callback
	 */
	listen: function(keys, callback) {
		'use strict';

		keys = keys.split(' ');

		for(var i = 0; i < keys.length; i++) {
			var key = keys[i];

			this.callbacks[key] = this.callbacks[key] || [];
			this.callbacks[key].push(callback);
		}
	},
};

//noinspection JSUnusedGlobalSymbols
window.NoName.DB = {
	db: null,

	available: false,
	status: 0,
	queue: [],

	/**
	 *
	 */
	init: function() {
		'use strict';

		var that = this,
			request;

		if(!window.indexedDB) {
			console.warn('[DB::init] indexedDB not available');
			NoName.Storage.set('storage:dbenabled', false);

			return;
		}

		if(!NoName.Storage.get('storage:dbenabled', true)) {
			console.warn('[DB::init] indexedDB has been disabled in settings');

			return;
		}

		request = window.indexedDB.open('NoName', 1);
		this.status = 1;

		request.onerror = function() {
			console.error('[DB::init] Failed to open indexedDB database. Error: ' + request.errorCode);
			that.status = 0;

			console.log('[DB::init] Rejecting ' + that.queue.length + ' queue items');

			for(var i = 0; i < that.queue.length; i++) {
				that.queue[i].defer.reject();
			}

			that.queue = [];
		};

		request.onsuccess = function(event) {
			console.info('[DB::init] Database opened');

			that.db = event.target.result;

			that.available = true;
			that.status = 2;

			that.prepareDB();

			console.log('[DB::init] Processing ' + that.queue.length + ' queue items');

			for(var i = 0; i < that.queue.length; i++) {
				try {
					var item = that.queue[i];

					that[item.method].apply(that, item.args);
				} catch(ignored) {
					console.warn('[DB::init] Exception in queue item (' + ignored + ')');
				}
			}

			that.queue = [];
		};

		/**
		 * @param event
		 * @param event.oldVersion
		 * @param event.newVersion
		 */
		request.onupgradeneeded = function(event) {
			var oldVersion = event.oldVersion || 1,
				newVersion = event.newVersion || 1;

			for(var i = oldVersion; i <= newVersion; i++) {
				if(typeof that['upgradeToV' + i] === 'function') {
					console.info('[DB::onupgradeneeded] Upgrading DB to version ' + i);
					that['upgradeToV' + i](event);
				}
			}
		};

		request.onblocked = function() {
			// If some other tab is loaded with the database, then it needs to be closed
			// before we can proceed.
			alert("Please close all other tabs with this site open!");
		};
	},

	/**
	 *
	 */
	prepareDB: function() {
		'use strict';

		var that = this;

		this.db.onversionchange = function() {
			that.db.close();
			alert("A new version of this page is ready. Please reload!");
		};

		this.db.onerror = function(event) {
			console.error('[DB::onerror] A database error has occurred', event);
		};

		$(window).trigger('db:available');
	},

	/**
	 *
	 * @param event
	 */
	upgradeToV1: function(event) {
		'use strict';

		var db = event.target.result,

			//Raffles
			raffles = db.createObjectStore(
				'raffles', {
					keyPath: 'id',
				}
			),

			//Items
			items = db.createObjectStore(
				'items', {
					keyPath: 'id',
				}
			);

		raffles.createIndex(
			'title', 'title', {
				unique: false,
			}
		);

		raffles.createIndex(
			'date', 'date', {
				unique: false,
			}
		);

		//Array of item ids referencing item store
		raffles.createIndex(
			'items', 'items', {
				unique: false,
				multiEntry: true,
			}
		);

		items.createIndex(
			'defindex', 'defindex', {
				unique: false,
			}
		);

		items.createIndex(
			'quality', 'quality', {
				unique: false,
			}
		);

		//List of raffle ids referencing raffle store
		items.createIndex(
			'raffles', 'raffles', {
				unique: false,
				multiEntry: true,
			}
		);
	},

	/**
	 * Save a raffle and its items to the database
	 * @param raffle
	 * @param items
	 * @returns {*}
	 * @param oldDefer
	 */
	saveRaffle: function(raffle, items, oldDefer) {
		'use strict';

		var that = this,
			defer = oldDefer || jQuery.Deferred();

		if(!this.status) {
			console.error('[DB::saveRaffle] Database is not available');
			defer.reject();

			return defer;
		} else if(!this.available) {
			console.warn('[DB:saveRaffle] Database is not yet available, adding method call to queue');

			this.queue.push(
				{
					method: 'saveRaffle',
					defer: defer,
					args: [
						raffle,
						items,
						defer
					]
				}
			);

			return defer;
		}

		if(!raffle.id) {
			defer.reject('Missing raffle ID');
		}

		this.saveItems(items, raffle).done(
			function(raffle) {
				var transaction = that.db.transaction(['raffles'], 'readwrite'),
					raffleStore = transaction.objectStore('raffles');

				raffleStore.put(raffle);

				transaction.onerror = function(event) {
					console.error('[DB::saveRaffle] Failed to save raffle.', event);
					defer.reject(event);
				};

				transaction.oncomplete = function() {
					console.info('[DB::saveRaffle] Raffle saved');
					defer.resolve();
				};
			}
		);

		return defer;
	},

	/**
	 * Saves the items of a raffle to the database
	 * @param items
	 * @param raffle
	 * @returns {*}
	 */
	saveItems: function(items, raffle) {
		'use strict';

		var that = this,
			defer = jQuery.Deferred(),
			taskDefer = jQuery.Deferred().resolve(),
			transaction = this.db.transaction(['items'], 'readwrite');

		transaction.objectStore('items');

		transaction.onerror = function(event) {
			console.error('[DB::saveItems] Failed to save items.', event);
			defer.reject(event);
		};

		transaction.oncomplete = function(event) {
			console.info('[DB::saveItems] Items saved', event);
			defer.resolve(raffle);
		};

		raffle.items = [];

		//Async loop to add each item
		//Using forEach to close over each item
		items.forEach(
			function(item) {
				raffle.items.push(item.id);

				taskDefer = taskDefer.then(
					function() {
						return that.saveItem(item, raffle.id, transaction);
					}
				);
			}
		);

		return defer;
	},

	/**
	 * Saves an individual raffle item to the database
	 * If a transaction is passed, it will be used instead of creating another
	 * @param item
	 * @param raffleId
	 * @param transaction
	 * @returns {*}
	 */
	saveItem: function(item, raffleId, transaction) {
		'use strict';

		var defer = jQuery.Deferred(),
			data, get;

		if(!(item instanceof NoName.Item)) {
			console.warn('[DB::saveItem] Ignoring invalid item');
			defer.reject();
		}

		data = item.export();
		transaction = transaction || this.db.transaction(['items']);
		get = transaction.objectStore('items').get(data.id);

		get.onerror = function(event) {
			console.warn('[DB::saveItem] Failed to save item ' + data.id, event);
			defer.reject(event);
		};

		get.onsuccess = function() {
			var put;

			data.raffles = (this.result) ? this.result.raffles : [];
			data.raffles.push(raffleId);
			put = transaction.objectStore('items').put(data);

			put.onsuccess = function(event) {
				console.info('[DB::saveItem] Saved item ' + data.id, event);
				defer.resolve(data);
			};

			put.onerror = function(event) {
				console.warn('[DB::saveItem] Failed to save item ' + data.id, event);
				defer.reject(event);
			};
		};

		return defer;
	},

	//TODO: Implement getRaffles(raffles, getItems)

	/**
	 * Retrieves a raffle (and optionally its items as NoName.Item objects) from the database
	 * Will resolve with null if the raffle doesn't exist
	 * If getItems is true, the resolved promise will also contain a second argument details whether
	 * items were successfully fetched
	 * If a transaction is passed, it will be used instead of creating another
	 *
	 */
	getRaffle: function(id, getItems, transaction, oldDefer) {
		'use strict';

		var that = this,
			defer = oldDefer || jQuery.Deferred(),
			request;

		if(!this.status) {
			console.error('[DB::getRaffle] Database is not available');
			defer.reject();

			return defer;
		} else if(!this.available) {
			console.warn('[DB:getRaffle] Database is not yet available, adding method call to queue');

			this.queue.push(
				{
					method: 'getRaffle',
					defer: defer,
					args: [
						id,
						getItems,
						transaction,
						defer
					],
				}
			);

			return defer;
		}

		if(!id) {
			defer.reject('Missing raffle ID');
		}

		console.time('NoName:DB:GetRaffle:' + id);

		transaction = transaction || this.db.transaction(['raffles']);
		request = transaction.objectStore('raffles').get(id);

		request.onsuccess = function() {
			//Firefox throws "Not allowed to define cross-origin object as property"
			//if I try to modify the result without cloning it
			//Thanks Firefox
			var raffle = (this.result) ? JSON.parse(JSON.stringify(this.result)) : null;

			if(!raffle) {
				defer.resolve(null);
				console.timeEnd('NoName:DB:GetRaffle:' + id);

				return;
			}

			if(!getItems) {
				defer.resolve(raffle, false);
				console.timeEnd('NoName:DB:GetRaffle:' + id);

				return;
			}

			that.getRaffleItems(id).done(
				function(items) {
					for(var i = 0; i < items.length; i++) {
						var item = items[i],
							index = raffle.items.indexOf(item.id);

						if(index > -1) {
							raffle.items[index] = item;
						} else {
							raffle.items.push(item);
						}
					}

					defer.resolve(raffle, true);
					console.timeEnd('NoName:DB:GetRaffle:' + id);

				}
			).fail(
				function(event) {
					console.error('[DB::getRaffle] Failed to load items for raffle ' + id, event);
					defer.resolve(raffle, false, event);
					console.timeEnd('NoName:DB:GetRaffle:' + id);
				}
			);
		};

		request.onerror = function(event) {
			console.error('[DB::getRaffle] Failed to load raffle ' + id, event);
			defer.reject(event);
		};

		return defer;
	},

	/**
	 * Retrieves a raffle's items from the database as NoName.Item objects
	 * If a transaction is passed, it will be used instead of creating another
	 * @param raffleId
	 * @param transaction
	 * @returns {*}
	 * @param oldDefer
	 */
	getRaffleItems: function(raffleId, transaction, oldDefer) {
		'use strict';

		var defer = oldDefer || jQuery.Deferred(),
			index,
			itemsCursor,
			items = [];

		if(!this.status) {
			console.error('[DB::getRaffleItems] Database is not available');
			defer.reject();

			return defer;
		} else if(!this.available) {
			console.warn('[DB:getRaffleItems] Database is not yet available, adding method call to queue');

			this.queue.push({
				method: 'saveRaffle',
				defer: defer,
				args: [raffleId, transaction, defer]
			});

			return defer;
		}

		if(!raffleId) {
			defer.reject('Missing raffle ID');
		}

		console.time('NoName:DB:getRaffleItems:' + raffleId);

		//noinspection AssignmentToFunctionParameterJS
		transaction = transaction || this.db.transaction(['items']);
		index = transaction.objectStore('items').index('raffles');
		itemsCursor = index.openCursor(IDBKeyRange.only(raffleId));

		itemsCursor.onsuccess = function() {
			var cursor = this.result;

			if(!cursor) {
				defer.resolve(items);
				console.timeEnd('NoName:DB:getRaffleItems:' + raffleId);

				return;
			}

			items.push(new window.NoName.Item(cursor.value, true));
			cursor.continue();
		};

		itemsCursor.onerror = function(event) {
			console.error('[DB::getRaffleItems] Failed to load items for raffle' + id, event);
			console.timeEnd('NoName:DB:getRaffleItems:' + raffleId);

			defer.reject(event);
		};

		return defer;
	},
};

window.NoName.Steam = {
	steamID: '',
	JSON_URL: '',

	/**
	 *
	 */
	init: function() {
		'use strict';

		console.time("NoName:Steam");

		this.getSteamID();
		this.JSON_URL = 'http://steamcommunity.com/profiles/' + this.steamID + '/inventory/json/440/2/';

		console.timeEnd("NoName:Steam");
	},

	/**
	 *
	 */
	getSteamID: function() {
		'use strict';

		try {
			var result = $('#avatar').children('a').first().prop('href').match(/https?:\/\/tf2r.com\/user\/(\d+)\.html/);

			this.steamID = result[1];
		} catch(ignored) {
			console.warn('[Steam::getSteamID] Unable to determine steamID');
		}
	},

	/**
	 *
	 * @returns {*}
	 */
	fetchInventoryJSON: function() {
		'use strict';

		var defer = jQuery.Deferred(),
			anonymous = !NoName.Storage.get('steam:usecookies', false);

		if(!this.steamID) {
			defer.reject();

			return defer;
		}

		GM_xmlhttpRequest(
			{
				method: 'GET',
				url: this.JSON_URL,
				anonymous: anonymous,
				onload: function(response) {
					defer.resolve(response.responseText);
				},
				onerror: function(response) {
					console.error('[Steam::fetchBackpack] Failed to retrieve inventory JSON: ' + response.textStatus);
					defer.reject();
				},
				onprogress: function(response) {
				}
			}
		);

		return defer;
	}
};

//noinspection FunctionTooLongJS
/**
 * Object that handles parsing and displaying of user's backpack
 * @param options
 * @constructor
 */
window.NoName.Backpack = function(options) {
	var that = this;

	console.time("NoName:Backpack");

	this.selectableItems = !!options.selectableItems;
	this.autoRender = !!options.autoRender;
	this.autoLoad = !!options.autoLoad;
	this.tradableOnly = !!options.tradableOnly;
	this.loaded = 0;

	this.items = [];
	this.selectedItems = [];
	this.badItems = []; //Selected items that will not be displayed correctly in raffles

	this.levelData = {};
	this.timeout = null;

	this.filters = {}; //Current search filters
	this.oldFilters = {}; //Previous search filters
	this.searchResults = null; //Item indexes that match current filters

	this.$container = options.container;
	this.$selectedContainer = options.selectedContainer;
	this.$displayWarning = null;
	this.$search = null;

	if(!this.$selectedContainer || !this.$selectedContainer.length) {
		console.error('[Backpack] $container does not exist');

		return;
	}

	/**
	 *
	 * @returns {boolean}
	 * @private
	 */
	function _initElements() {
		that.$container.empty().append($('<ol></ol>'));

		if(that.selectableItems) {
			if(!that.$selectedContainer || !that.$selectedContainer.length) {
				console.error('[Backpack] $selectedContainer must exist for items to be selectable');

				return false;
			}

			that.$selectedContainer.empty().append($('<ol></ol>'));

			that.$container.on(
				'click', 'li', function() {
					if(that.isSelected(this.item)) {
						that.deselect(this);
					} else {
						that.select(this);
					}
				}
			);

			that.$selectedContainer.on(
				'click', 'li', function() {
					that.deselect(this);
				}
			);

			that.$displayWarning = $('<div></div>').addClass('notif lev1').text(
				'Some selected items will not display correctly in your raffle\nConsider listing them in the description.'
			);

			that.$selectedContainer.prepend(that.$displayWarning);
		}

		return true;
	}

	/**
	 *
	 * @private
	 */
	function _initFilters() {
		var $qualities = $('<div></div>').addClass('qualities');

		that.$search = $('<input />').prop(
			{
				'placeholder': 'Search',
			}
		).addClass('search');

		for(var quality in dictionary.qualities) {
			if(!dictionary.qualities.hasOwnProperty(quality)) {
				continue;
			}

			var $quality = $('<input />').prop(
				{
					type: 'checkbox',
					value: quality,
					autocomplete: 'off',
					id: 'q' + quality,
				}
				),
				$label = $('<label></label>').prop(
					{
						title: dictionary.qualities[quality],
						htmlFor: 'q' + quality,
					}
				).addClass('q' + quality);

			$qualities.append(
				[
					$quality,
					$label,
				]
			);
		}

		that.$container.prepend($qualities).prepend(that.$search);
	}

	/**
	 *
	 * @private
	 */
	function _initEvents() {
		that.$container.on(
			'ei:backpackfailed', function() {
				that.$container.addClass('error');
				that.$container.append(
					$('<a></a>').text('Failed to load backpack. Click to retry.')
					.click(
						function() {
							that.load();
						}
					)
				);
			}
		);

		that.$container.on(
			'click', 'ol', function(event) {
				if(event.target == this) {
					that.loadMore();
				}
			}
		);

		that.$container.on(
			'change', '.qualities input', function() {
				var qualities = that.$container.find('.qualities input:checked').map(
					function() {
						return parseInt(this.value, 10);
					}
				).get();

				if(!qualities.length) {
					delete that.filters.quality;
				} else {
					that.filters.quality = qualities;
				}

				_queueSearch(50);
			}
		);

		that.$search.on(
			'change input', function() {
				if(!this.value) {
					delete that.filters.text;
				} else {
					that.filters.text = this.value;
				}

				_queueSearch(150);
			}
		);
	}

	/**
	 *
	 * @private
	 */
	function _initDragDrop() {
		var source;

		that.$selectedContainer.on(
			'dragstart', '.item', function(e) {
				source = e.target;
				e.originalEvent.dataTransfer.effectAllowed = 'move';
				e.originalEvent.dataTransfer.setDragImage(this, 0, 0);
				e.originalEvent.dataTransfer.setData('text/plain', this.item.name); //Needed for DnD to work at all in firefox;

				$(this).addClass('dragging');
			}
		);

		that.$selectedContainer.on(
			'dragenter', '.item', function(e) {
				var position = source.compareDocumentPosition(this);

				//noinspection JSBitwiseOperatorUsage
				if(position & Node.DOCUMENT_POSITION_DISCONNECTED) {
					return false;
				} else { //noinspection JSBitwiseOperatorUsage
					if(position & Node.DOCUMENT_POSITION_PRECEDING) {
						e.target.parentNode.insertBefore(source, e.target);
					} else {
						e.target.parentNode.insertBefore(source, e.target.nextSibling);
					}
				}

				return true;
			}
		);

		that.$selectedContainer.on(
			'dragover', '.item', function(e) {
				e.preventDefault();

				return false;
			}
		);

		that.$selectedContainer.on(
			'dragend drop', '.item', function(e) {
				var oldIndex = that.selectedItems.indexOf(this.item);

				//Otherwise firefox will happily try to visit "http://Strange Australium Black Box/"
				e.preventDefault();

				if(oldIndex < 0) {
					console.warn('[Backpack::_initDragDrop] Ignoring unselected item drop');

					return true;
				}

				var newIndex = that.$selectedContainer.find('.item').index(this);

				if(newIndex < 0) {
					console.warn('[Backpack::_initDragDrop] Ignoring weird situation');

					return true;
				}

				that.selectedItems.splice(oldIndex, 1);
				that.selectedItems.splice(newIndex, 0, this.item);
				$(this).removeClass('dragging');

				console.debug(
					'[Backpack::_initDragDrop] Moved item ' + this.item.name + ' from ' + oldIndex + ' to ' + newIndex
				);

				return false;
			}
		);
	}

	/**
	 *
	 * @param delay
	 * @private
	 */
	function _queueSearch(delay) {
		if(that.timeout) {
			clearTimeout(that.timeout);
		}

		that.timeout = setTimeout(
			function() {
				_search();
			}, delay
		);
	}

	/**
	 * TODO: Should probably be a public function and accept filters as an argument
	 * @private
	 */
	function _search() {
		if(!Object.keys(that.filters).length) {
			that.searchResults = null;
			that.render(true, 0, 50);
			return;
		}

		console.time('NoName:Backpack:_search');

		//Compute any possible optimisations
		var optimisation = (that.searchResults !== null) ? _computeSearchOptimisation(
			that.filters, that.oldFilters
			) : false,

			//Create temporary copy of current filters so we can convert the text filter to a regex
			//without breaking future searches that try to compare their text filter with this one
			filters = Object.assign({}, that.filters);

		//Store current filters for later comparison with future searches
		that.oldFilters = Object.assign({}, that.filters);

		//Convert text filter to case insensitive regex
		if(filters.text) {
			filters.text = new RegExp(filters.text, 'i');
		}

		//Handle cases that can be optimised
		switch(optimisation) {
			//Optimisation for AND filters where the new filters are a superset of the old ones
			//Also for OR filters where the new filters are a subset of the old ones
			//In these cases the new results will always be a subset of the old ones, so only the old results need to be checked
			case 'narrowing' :
				var oldResults = that.searchResults,
					newResults = [];
				console.info('[Backpack::_search] Using narrowing optimisation');

				for(var result in oldResults) {
					if(!oldResults.hasOwnProperty(result)) {
						continue;
					}

					//noinspection JSDuplicatedDeclaration
					var index = parseInt(oldResults[result], 10),
						item = that.items[oldResults[result]];

					if(item.matchesFilters(filters)) {
						newResults.push(index);
					}
				}

				that.searchResults = newResults;

				break;

			//Optimisation for OR filters where the new filters are a superset of the old ones
			//Also for AND filters where the new filters are a subset of the old ones
			//In these cases the new results will always be a superset of the old results, so no need to check the old results again
			case 'widening' :
				var results = that.searchResults;
				console.info('[Backpack::_search] Using widening optimisation');

				//noinspection JSDuplicatedDeclaration
				for(var item in that.items) {
					if(!that.items.hasOwnProperty(item)) {
						continue;
					}

					item = parseInt(item, 10);

					if(results.indexOf(item) > -1) {
						continue;
					}

					if(that.items[item].matchesFilters(filters)) {
						results.push(item);
					}
				}

				that.searchResults = results.sort(
					function(a, b) {
						return (a - b);
					}
				);

				break;

			//No optimisations
			default :
				that.searchResults = [];

				//noinspection JSDuplicatedDeclaration
				for(var item in that.items) {
					if(!that.items.hasOwnProperty(item)) {
						continue;
					}

					if(that.items[item].matchesFilters(filters)) {
						that.searchResults.push(parseInt(item, 10));
					}
				}

				break;
		}

		that.render(true, 0, 50);
		console.timeEnd('NoName:Backpack:_search');
	}

	/**
	 * Determine if the change between old and current search filters can be optimised
	 * TODO: handle multiple filter types and filters other than text properly
	 * @param newFilters
	 * @param oldFilters
	 * @returns {boolean}
	 * @private
	 */
	function _computeSearchOptimisation(newFilters, oldFilters) {
		var optimisation = false;

		//Text in old filter + no text in new filter = widening
		//Text in both filters + new text is equal to old text = nothing
		//Text in both filters + new text is superset of old text = narrowing
		//Text in both filters + new text is subset of old text = widening
		//Text in new filter + no text in old filter = narrowing
		if(oldFilters.text) {
			if(!newFilters.text) {
				optimisation = 'widening';
			} else if(oldFilters.text === newFilters.text) {
				optimisation = false;
			} else if(newFilters.text.indexOf(oldFilters.text) === 0) {
				optimisation = 'narrowing';
			} else if(oldFilters.text.indexOf(newFilters.text) === 0) {
				optimisation = 'widening';
			}
		} else if(newFilters.text) {
			optimisation = 'narrowing';
		}

		if(oldFilters.quality != newFilters.quality) {
			return false;
		}

		return optimisation;
	}

	/**
	 * Parse default item list to get levels of items that do not have a level in the steam inventory json
	 * @private
	 */
	function _getLevelData() {
		console.time('NoName:Backpack:_getLevelData');

		//Optimisation
		//Exclude decorated weapons as they never have levels
		that.$container.find('.item:not(.q15)').each(
			function() {
				//Optimisation
				//Using vanilla javascript here makes this about 10 times faster
				var defindex = this.getAttribute('iid'),
					level = this.getAttribute('ilevel'),
					quality = this.getAttribute('iqual');

				if(!level) {
					return;
				}

				that.levelData[defindex] = that.levelData[defindex] || {};
				that.levelData[defindex][quality] = that.levelData[defindex][quality] || [];
				that.levelData[defindex][quality].push(level);
			}
		);

		console.timeEnd('NoName:Backpack:_getLevelData');
	}

	/**
	 * Populate items array with item objects created from parsed data
	 * @param items
	 * @private
	 */
	function _populateItems(items) {
		for(var item in items) {
			if(!items.hasOwnProperty(item)) {
				continue;
			}

			item = items[item];

			that.items.push(new NoName.Item(item));
		}
	}

	/**
	 * Use a webworker to parse the json and clean up data
	 * Doing this on the main thread causes noticeable lag
	 * @param json
	 * @returns {*}
	 */
	this.parseJSON = function(json) {
		console.time('NoName:Backpack:parseJSON');

		var that = this,
			defer = jQuery.Deferred(),

			//Create a blob from the below workerParse function to allow its use in the worker
			work = URL.createObjectURL(
				new Blob(
					[
						'(',
						this.workerParse.toString(),
						')()'
					], {
						type: 'application/javascript'
					}
				)
			),

			//Create worker
			worker = new Worker(work);

		//Listen for worker response
		worker.addEventListener(
			'message', function(event) {
				if(event.data.success) {
					console.info('[Backpack::parseJSON] Backpack parsed');

					//Using JSON to avoid " Not allowed to define cross-origin object" error in firefox
					try {
						_populateItems(JSON.parse(event.data.items));
					} catch(e) {
						console.error('[Backpack::parseJSON] Failed to parse worker JSON response: ' + e);
						console.timeEnd('NoName:Backpack:parseJSON');

						defer.reject();
						return;
					}

					console.timeEnd('NoName:Backpack:parseJSON');
					defer.resolve();
				} else {
					console.error('[Backpack::parseJSON] Failed to parse backpack: ' + event.data.error);
					console.timeEnd('NoName:Backpack:parseJSON');

					defer.reject();
				}
			}, false
		);

		//Send the worker the json to parse
		worker.postMessage(
			{
				json: json,
				levelData: that.levelData,
				dictionary: window.dictionary,
			}
		);
		URL.revokeObjectURL(work);

		return defer;
	};

	/**
	 * Used by web worker to parse the json and then restructure the parsed data
	 */
	this.workerParse = function() {
		var levelData, //Backpack item level data scraped from new raffle page html
			dictionary, //Dictionary to map description strings to attribute ids

			//RegExps used to parse descriptions.
			//Precompiled here as they are used 1000s of times.
			regexes = {
				australium: /^[^'].* (Australium) /,
				level: /.*Level (\d+).*/,
				series: /.*Series #(\d+).*/,
				uncraftable: /^\( Not (or )?Usable in Crafting \)$/,
				specKS: /^Sheen: (.+)/,
				profKS: /^Killstreaker: (.+)/,
				ksKitTarget: /^This Killstreak Kit can be applied to a (.*)$/,
				gift: /^\nGift from: (.+)/,
				paint: /^Paint Color: (.+)/,
				crafter: /^Crafted by (.+)/,
				unusual: /^★ Unusual Effect: (.+)/,
				spell: /^Halloween: (.+) \(spell only active during event\)/,
				nameDesc: /^''(.*)''$/,
				part: /^\((.*): \d+\)$/,
				grade: /^(\w+) Grade (.*)$/,
			};

		self.addEventListener(
			'message', function(event) {
				try {
					levelData = event.data.levelData;
					dictionary = event.data.dictionary;

					var data = JSON.parse(event.data.json);

					console.time('workerParse::parseItems');
					var items = parseItems(data);
					console.timeEnd('workerParse::parseItems');

					//Using JSON to avoid " Not allowed to define cross-origin object" error in firefox
					if(items) {
						self.postMessage(
							{
								success: true,
								items: JSON.stringify(items)
							}
						);
					} else {
						throw new Error('Item parsing failed');
					}
				} catch(e) {
					console.error('[Steam::workerParse] Error while parsing JSON : ' + e);
					self.postMessage(
						{
							success: false,
							error: e.toString()
						}
					);
				}
			}
		);

		/**
		 * Checks the parsed json is a valid response
		 * Merges item and description arrays into a single item array
		 * Removes unneeded item data
		 * @param data
		 * @param data.success
		 * @param data.rgDescriptions
		 * @param data.rgInventory
		 * @param data.rgInventory.array_member.classid
		 * @param data.rgInventory.array_member.instanceid
		 * @returns {*}
		 */
		function parseItems(data) {
			var items = data.rgInventory,
				descriptions = data.rgDescriptions,
				parsedItems = [];

			if(!data.success) {
				console.error('[Backpack::workerParse] Success property is false');

				return false;
			}

			if(!items) {
				console.error('[Backpack::workerParse] Inventory array missing');

				return false;
			}

			if(!descriptions) {
				console.error('[Backpack::workerParse] Descriptions array missing');

				return false;
			}

			for(var item in items) {
				if(!items.hasOwnProperty(item)) {
					continue;
				}

				item = items[item];

				var classInstanceId = item.classid + '_' + item.instanceid,
					description = descriptions[classInstanceId];

				parsedItems.push(parseItem(item, description));
			}

			parsedItems.sort(
				function(item1, item2) {
					return item1.position - item2.position;
				}
			);

			return parsedItems;
		}

		/**
		 * Parses a single item
		 * Extracts level and series data where possible
		 * Loops over descriptions to determine which ones to item.descriptions
		 * Moved to worker as it is very slow
		 * @param item
		 * @param description
		 * @param description.name						Item name
		 * @param description.type						Item type (Level x y)
		 * @param description.icon_url					Item thumbnail
		 * @param description.tradable					Whether item is tradable
		 * @param description.app_data.def_index		Item defindex
		 * @param description.app_data.quality			Item quality
		 * @param description.market_hash_name			Item name used on community market
		 * @param description.descriptions				Item description strings
		 * @param description.tags						Item tags
		 * @returns {{id: Number, position: *, defindex: *, quality: (*|string), name, type, level: (Array|{index: number, input: string}), series: (Array|{index: number, input: string}), untradable: boolean, descriptions: Array, thumbnail: *}}
		 */
		function parseItem(item, description) {
			var level = description.type.match(regexes.level),
				series = description.name.match(regexes.series),
				matches;

			level = (level) ? parseInt(level[1], 10) : 0;
			series = (series) ? parseInt(series[1], 10) : 0;

			var parsedItem = {
				id: parseInt(item.id, 10),
				position: item.pos,
				defindex: description.app_data.def_index,
				quality: description.app_data.quality,
				name: description.name,
				type: description.type,
				level: level,
				series: series,
				untradable: !description.tradable,
				descriptions: [],
				thumbnail: description.icon_url, //Reduce image size
			};

			//Fallback to level data found in the default item list if the json api didn't give us one in the item description
			//Using this data is a guess, but it will usually be correct unless the user has multiple copies of the same strange
			//which differ in a noticeable way such as parts
			if(!level) {
				if(levelData[parsedItem.defindex] && levelData[parsedItem.defindex][parsedItem.quality]) {
					parsedItem.level = parseInt(levelData[parsedItem.defindex][parsedItem.quality], 10);
				} else {
					parsedItem.level = 1; //The site uses 1 for items that don't have a level
				}
			}

			if((matches = description.name.match(regexes.nameDesc))) {
				parsedItem.customName = matches[1];
			}

			if(description.market_hash_name.match(regexes.australium)) {
				parsedItem.australium = true;
			}

			parseDescriptions(parsedItem, description.descriptions || []);
			parseTags(parsedItem, description.tags || []);

			return parsedItem;
		}

		//Loops over the description strings for an item and returns the ones we care about
		//Moved to the worker as it is slow enough to cause noticeable ui lag
		//Now even slower since I need to parse the attribute values out of the strings so they can be saved
		function parseDescriptions(item, descriptions) {
			descriptions.forEach(
				function(description) {
					var matches;

					//Uncraftable
					if(regexes.uncraftable.test(description.value)) {
						item.descriptions.push(description);
						item.uncraftable = true;

						return;
					}

					//Basic killstreak
					if(description.value === 'Killstreaks Active') {
						item.descriptions.push(description);
						item.killstreak = (item.killstreak) ? Math.max(item.killstreak, 1) : 1;

						return;
					}

					//Specialized killstreak
					if((matches = description.value.match(regexes.specKS))) {
						item.descriptions.push(description);

						item.killstreak = (item.killstreak) ? Math.max(item.killstreak, 2) : 2;
						item.ksSheen = dictionary.killstreakSheens.indexOf(matches[1]);

						return;
					}

					//Professional killstreak
					if((matches = description.value.match(regexes.profKS))) {
						item.descriptions.push(description);

						item.killstreak = (item.killstreak) ? Math.max(item.killstreak, 3) : 3;
						item.ksEffect = dictionary.killstreakEffects.indexOf(matches[1]);

						return;
					}

					if(item.killstreak) {
						//Killstreak kit target item
						if((matches = description.value.match(regexes.ksKitTarget))) {
							item.descriptions.push(description);
							item.referencedItem = matches[1];

							return;
						}
					}

					//Gifts
					if((matches = description.value.match(regexes.gift))) {
						item.descriptions.push(description);
						item.gifter = matches[1];

						return;
					}

					//Paint
					if((matches = description.value.match(regexes.paint))) {
						item.descriptions.push(description);
						item.paint = dictionary.paintColours.indexOf(matches[1]);

						return;
					}

					//Crafted
					if((matches = description.value.match(regexes.crafter))) {
						item.descriptions.push(description);
						item.crafter = matches[1];

						return;
					}

					//Unusual effects
					if((matches = description.value.match(regexes.unusual))) {
						item.descriptions.push(description);
						item.unusualEffect = dictionary.unusualEffects.indexOf(matches[1]);

						return;
					}

					//Festivized
					if(!description.value.indexOf('Festivized')) {
						item.descriptions.push(description);
						item.festive = 2; //2 = Festivised

						return;
					}

					//Stat clocks
					if(!description.value.indexOf('Strange Stat Clock Attached')) {
						item.descriptions.push(description);
						item.statClock = true;

						return;
					}

					//Spells
					if((matches = description.value.match(regexes.spell))) {
						description.value = description.value.replace('(spell only active during event)', '');
						item.descriptions.push(description);

						item.spells = item.spells || [];
						item.spells.push(dictionary.halloweenSpells.indexOf(matches[1]));

						return;
					}

					//Custom description
					if((matches = description.value.match(regexes.nameDesc))) {
						item.descriptions.push(description);
						item.customDesc = matches[1];

						return;
					}

					//Strange parts
					if((matches = description.value.match(regexes.part)) && description.color === '756b5e') {
						var part = dictionary.strangeParts.indexOf(matches[1]);

						item.descriptions.push(description);
						item.parts = item.parts || [];
						item.parts.push(part);

						if(part === -1) {
							console.warn('Unknown Strange part: ' + matches[1]);
						}

						return;
					}

					//Collection grades
					if(regexes.grade.test(description.value) && description.color) {
						item.descriptions.push(description);
					}
				}
			);

			return item;
		}

		/**
		 * Parse item tags that we care about
		 * @todo Not yet implemented
		 * @param item
		 * @param {Object[]} tags
		 * @param tags[].category
		 * @returns {*}
		 */
		function parseTags(item, tags) {
			tags.forEach(
				function(tag) {
					switch(tag.category) {
						case 'Rarity':
							item.grade = dictionary.grades.indexOf(tag.name);
							return;
						case 'Exterior':
							item.wear = dictionary.wears.indexOf(tag.name);
							return;
					}
				}
			);

			return item;
		}
	};

	_getLevelData();
	_initElements();
	_initFilters();
	_initEvents();
	_initDragDrop();

	if(this.autoLoad) {
		this.load();
	}

	console.timeEnd("NoName:Backpack");
};

window.NoName.Backpack.prototype = {
	loadMore: function() {
		this.render(false, this.loaded, this.loaded + 300);
	},

	/**
	 * Renders backpack items, within an optional range and optionally emptying the parent element
	 * Renders search results if there are any, otherwise all items
	 * @param empty
	 * @param fromPos
	 * @param toPos
	 */
	render: function(empty, fromPos, toPos) {
		console.time('NoName:Backpack:render');

		var that = this,
			items = document.createDocumentFragment();

		if(empty) {
			this.$container.children('ol').empty();
		}

		if(this.searchResults !== null) {
			if(!toPos || toPos > this.searchResults.length) {
				this.$container.removeClass('minimised');
				toPos = this.items.length;
			} else {
				this.$container.addClass('minimised');
			}

			this.searchResults.slice(fromPos, toPos).forEach(
				function(item) {
					item = that.items[item];
					items.appendChild(that.renderItem(item));
				}
			);
		} else {
			if(!toPos || toPos > this.items.length) {
				this.$container.removeClass('minimised');
				toPos = this.items.length;
			} else {
				this.$container.addClass('minimised');
			}

			this.items.slice(fromPos, toPos).forEach(
				function(item) {
					items.appendChild(that.renderItem(item));
				}
			);
		}

		this.$container.children('ol').append(items);
		this.loaded = toPos;

		console.timeEnd('NoName:Backpack:render');
	},

	/**
	 * Renders a single backpack item, greying it out if it is selected
	 * Using standard javascript, need all the performance I can get here
	 * @param item
	 * @returns {Element}
	 */
	renderItem: function(item) {
		var element = document.createElement('li');
		element.className = item.getCSSClasses();

		if(this.selectedItems.indexOf(item) > -1) {
			element.className += ' selected';
		}

		element.item = item;
		element.style.backgroundImage = item.getBackgroundImages();

		return element;
	},

	/**
	 * Load the user's backpack
	 */
	load: function() {
		var that = this,
			jsonLoad = NoName.Steam.fetchInventoryJSON();

		this.$container.trigger('ei:backpackloading');
		this.$container.addClass('loading');

		jsonLoad.done(
			function(json) {
				that.parseJSON(json).done(
					function() {
						that.$container.trigger('ei:backpackloaded');

						if(that.tradableOnly) {
							that.items = that.items.filter(
								function(item) {
									return item.isTradable();
								}
							);
						}

						if(that.autoRender) {
							that.render(true, 0, 50);
						}
					}
				).fail(
					function() {
						that.$container.trigger('ei:backpackfailed');
					}
				).always(
					function() {
						that.$container.removeClass('loading');
					}
				);
			}
		).fail(
			function() {
				console.error('[Backpack::load] Failed to load backpack');

				that.$container.trigger('ei:backpackfailed');
				that.$container.removeClass('loading');
			}
		);
	},

	/**
	 * Select an item, adding it to the selected list
	 * @param element
	 * @returns {boolean}
	 */
	select: function(element) {
		var item = element.item;

		if($(element).parents().index(this.$container) === -1) {
			console.error('[Backpack::select] item is not a descendant of item container');

			return false;
		}

		if(this.items.indexOf(item) < 0) {
			console.error('[Backpack::select] Item does not exist in backpack');

			return false;
		}

		//Clone item element and add to selected item list
		var clone = element.cloneNode(false);
		clone.item = item;
		clone.draggable = true;

		this.selectedItems.push(item);
		this.$selectedContainer.children('ol').append(clone);

		//Update existing element to show item has been selected
		$(element).addClass('selected');

		//Show warning if this item won't be displayed correctly in the raffle
		if(this.selectableItems && !item.willDisplayCorrectly()) {
			console.warn('[Backpack::select] Selected item will not be displayed correctly');

			this.badItems.push(item);
			this.$displayWarning.show();
		}

		console.debug('[Backpack::select] Selected item ' + item.name);

		console.log(item.exportText());

		return true;
	},

	/**
	 * Deselect an item, removing it from the list of selected items and allowing it to be selected again
	 * @param element
	 * @returns {boolean}
	 */
	deselect: function(element) {
		var item = element.item,
			index = this.selectedItems.indexOf(item);

		if(index < 0) {
			console.error('[Backpack::deselect] Item does not exist in backpack');

			return false;
		}

		//Remove from selected array
		this.selectedItems.splice(index, 1);

		//If the passed element is in the selected list remove it
		//Otherwise find it and then remove it
		//Also restore the appearance of the element in the main list
		if($(element).parents().index(this.$selectedContainer) > -1) {
			//Remove element from selected list
			$(element).remove();

			//Get index of current item in item list or search results (if search results are currently being shown)
			index = this.items.indexOf(item);
			if(this.searchResults) {
				index = this.searchResults.indexOf(index);
			}

			//Use above index to restore item in the list of selectable items
			this.$container.children('ol').children().eq(index).removeClass('selected');
		} else {
			//Use above index to remove element from selected list
			this.$selectedContainer.children('ol').children().eq(index).remove();

			//Restore appearance of main element
			$(element).removeClass('selected');
		}

		//Remove from bad items list if it exists
		if(this.selectableItems && this.badItems.indexOf(item) > -1) {
			this.badItems.splice(this.badItems.indexOf(item), 1);
		}

		//If bad item list is empty remove warning
		if(this.selectableItems && !this.badItems.length) {
			this.$displayWarning.hide();
		}

		console.debug('[Backpack::deselect] Deselected item ' + item.name);

		return true;
	},

	isSelected: function(item) {
		return this.selectedItems.indexOf(item) > -1;
	},

	getSelected: function() {
		return this.selectedItems;
	}
};

//The schema is complex so cant fix warnings here
//noinspection FunctionWithMoreThanThreeNegationsJS,OverlyComplexFunctionJS,FunctionTooLongJS
/**
 * Object that represents a single item
 * @param data
 * @param useSchema
 * @constructor
 */
window.NoName.Item = function(data, useSchema) {
	//General stuff
	this.id = data.id;
	this.defindex = (!isNaN(data.defindex) && data.defindex) ? parseInt(data.defindex, 10) : null;
	this.name = data.name || '';

	this.quality = (!isNaN(data.quality) && data.quality) ? parseInt(data.quality, 10) : 0;
	this.subQuality = (!isNaN(data.subQuality) && data.subQuality) ? parseInt(data.subQuality, 10) : null;
	this.untradable = !!data.untradable;
	this.uncraftable = !!data.uncraftable;

	this.type = data.type || '';
	this.level = (!isNaN(data.level) && data.level) ? parseInt(data.level, 10) : 1;
	this.series = (!isNaN(data.series) && data.series) ? parseInt(data.series, 10) : 0;

	//Tags
	this.customName = data.customName || null;
	this.customDesc = data.customDesc || null;

	//Stranges
	this.statClock = data.statClock || false;
	this.parts = data.parts || [];

	//Gifting
	this.gifter = data.gifter || null;

	//Crafting
	this.crafter = data.crafter || null;
	this.craftNumber = data.craftNumber || null;

	//Killstreaks
	this.killstreak = data.killstreak || null;
	this.ksSheen = data.ksSheen || null;
	this.ksEffect = data.ksEffect || null;

	//Skins/Collections
	this.grade = data.grade || null;
	this.wear = data.wear || null;

	//Handle wears passed as strings
	if(!parseInt(this.wear)) {
		var index = dictionary.wears.indexOf(this.wear);

		if(index < 0) {
			this.wear = null;
		} else {
			this.wear = index;
		}
	}

	this.paint = data.paint || null;
	this.australium = data.australium || false;
	this.festive = data.festive || false;
	this.unusualEffect = data.unusualEffect || null;
	this.spells = data.spells || [];

	this.position = data.position || null;
	this.descriptions = data.descriptions || [];

	//Add item type/level as a description if there are no other descriptions
	//Saves some annoying checking in getDescriptions(), as items could have a descriptions array
	//that doesn't include the item type
	if(this.descriptions.length && (this.type || this.level)) {
		this.descriptions.splice(
			0, 0, {
				value: this.type || 'Level ' + this.level,
				color: 'ffffff',
			}
		);
	}

	if(NoName.Storage.get('other:lowresimages', false)) {
		this.thumbnail = (data.thumbnail) ? this.IMAGE_URL + data.thumbnail + '/64fx64f' : null;
	} else {
		this.thumbnail = (data.thumbnail) ? this.IMAGE_URL + data.thumbnail + '/128fx128f' : null;
	}

	//If set, retrieve name, images and other details from the schema
	//Otherwise populate from provided data if any
	if(useSchema) {
		this.definition = NoName.Item.getDefinition(this);

		if(this.definition) {
			delete this.name;
			delete this.thumbnail;

			this.defindex = this.definition.defindex || null;
			this.grade = this.definition.grade || null;
			this.name = this.getName();
			this.thumbnail = this.getThumbnail();
		} else {
			this.name = 'Unknown Item';
			this.thumbnail = this.MISSING_IMAGE;
		}
	}
};

//noinspection SpellCheckingInspection
window.NoName.Item.prototype = {
	IMAGE_URL: 'https://steamcommunity-a.akamaihd.net/economy/image/',
	SCHEMA_IMAGE_URL: 'http://media.steampowered.com/apps/440/icons/',
	UNUSUAL_IMAGE_URL: 'http://tf2.hades-underworld.com/particles/',
	MISSING_IMAGE: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAMFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABaPxwLAAAAEHRSTlMAzF8Ovno2lrEpG6NtUohEM5nYxgAAAURJREFUSMdjGIHALElJSS0Bp/SkEkEwaL2MVZrrhCAchGGTDxREApUY8sxgeQRQQFfwRRAVSBugyrMKooPNhBRIoznREUPFAVQVihgKpFAVcGAoEEVVwCaIAdD88RAi2q6kDnPOB1QFC0Fi4reALCZHrGHFBLJ2AZg5Eas3mBsFxRegBEoAWmB/FLkAczD26GDfyYBfAZcBmoIJOFMWL1heAlUQM1SFcCuApB1nnPKsGG5ECxBIoIvjNGA2xIBmXPKckJgQwenJKRADPHG6oBHiAgMCXjiA04mJYHk3FDHMhCW9AKc8M4FAZOAHK0jArYAHJC/DgBswJxWCbMALkkoOMBAABgwDC2yfv8Urz9kIKnzwABPMwgdLQXMBjwJwcnmARwE4rgrwKHCE5Hvc4CCB2GawhhVv+LKVAt6Q4lK6zDAcAQAdIEKHGzsRJwAAAABJRU5ErkJggg==',

	EXPORT_DEFINDEX: 0,
	EXPORT_CRAFTER: 1,
	EXPORT_GRADE: 2,
	EXPORT_WEAR: 3,
	EXPORT_FESTIVE: 4,
	EXPORT_UNUSUAL: 5,
	EXPORT_KS: 6,
	EXPORT_STRANGE_PARTS: 7,
	EXPORT_GIFTER: 8,
	EXPORT_PAINT: 9,
	EXPORT_AUSTRALIUM: 10,
	EXPORT_NAME: 11,
	EXPORT_DESC: 12,
	EXPORT_CRAFT_NUMBER: 13,
	EXPORT_SPELLS: 14,

	/**
	 * List of known defindexes that the site cannot display correctly
	 * - Newer taunts
	 * - Festivizers
	 * - Smissmass gifts
	 */
	badIndexes: [
		30671,
		30618,
		5838,
		5839,
		1162
	],

	/**
	 * Gets the item's defindex
	 * @returns {null|*}
	 */
	getDefIndex: function() {
		return this.defindex;
	},

	/**
	 * Retrieve item name or generate it from the attributes and schema if not set
	 * TODO: Strange filter prefixes?
	 * @returns {*}
	 */
	getName: function() {
		var name = [];

		if(this.customName) {
			return this.customName;
		}

		if(this.name) {
			return this.name;
		}

		this.definition = this.definition || NoName.Item.getDefinition(this);

		if(!this.definition) {
			if(this.defindex) {
				return 'Unknown Item ' + this.defindex;
			}

			return 'Unknown Item';
		}

		//Add "The" prefix to relevant unique items
		if(this.definition.the && this.quality == 6 && !this.killstreak) {
			name.push('The');
		}

		//Subquality name (i.e strange collector's items)
		if(this.subQuality && dictionary.qualities[this.subQuality]) {
			name.push(dictionary.qualities[this.subQuality]);
		}

		//Quality name for non-decorated/unique items
		if(this.quality != 15 && this.quality != 6 && dictionary.qualities[this.quality]) {
			name.push(dictionary.qualities[this.quality]);
		}

		//Festives and festivised skins
		if(this.festive) {
			name.push('Festive');
		}

		if(this.australium) {
			name.push('Australium');
		}

		//Killstreaks
		switch(this.killstreak) {
			case 1 :
				name.push('Killstreak');
				break;

			case 2:
				name.push('Specialized Killstreak');
				break;

			case 3:
				name.push('Professional Killstreak');
				break;
		}

		//Actual name
		name.push(this.definition.name);

		if(this.wear && dictionary.wears[this.wear]) {
			name.push('(' + dictionary.wears[this.wear] + ')');
		} else if(this.definition.hasWear) {
			name.push('(Unknown Wear)');
		}

		this.name = name.join(' ');

		return this.name;
	},

	/**
	 * Gets the item's thumbnail url
	 * Url is cached after first call
	 * @returns {*}
	 */
	getThumbnail: function() {
		var size = '';

		if(this.thumbnail) {
			return this.thumbnail;
		}

		this.definition = this.definition || NoName.Item.getDefinition(this);

		if(!this.definition) {
			return this.MISSING_IMAGE;
		}

		if(NoName.Storage.get('other:lowresimages', false)) {
			size = '/64fx64f';
		} else {
			size = '/128fx128f';
		}

		//Define these arrays to reduce boilerplate below
		this.definition.images = this.definition.images || [];
		this.definition.festives = this.definition.festives || [];

		//Items with a single image
		if(!this.definition.hasWear) {
			//Australium items
			if(this.australium && this.definition.australium) {
				this.thumbnail = this.IMAGE_URL + this.definition.australium + size;
			} else if(this.definition.image) {
				this.thumbnail = this.SCHEMA_IMAGE_URL + this.definition.image;
			}

			return this.thumbnail || this.MISSING_IMAGE;
		}

		//Items with multiple images but unknown wear (will use factory new)
		if(!this.wear) {
			//Festivised items
			if(this.festive === 2 && this.definition.festives.length) {
				this.thumbnail = this.IMAGE_URL + this.definition.festives[0] + size;
			} else if(this.definition.images.length) {
				//Normal items, or festivised items if there is no festive image
				this.thumbnail = this.IMAGE_URL + this.definition.images[0] + size;
			}

			return this.thumbnail || this.MISSING_IMAGE;
		}

		//Items with multiple images and known wear
		//Festivised items
		if(this.festive === 2 && this.definition.festives[this.wear - 1]) {
			this.thumbnail = this.IMAGE_URL + this.definition.festives[this.wear - 1] + size;
		} else if(this.definition.images[this.wear - 1]) {
			//Normal items, or festivised items if there is no festive image
			this.thumbnail = this.IMAGE_URL + this.definition.images[this.wear - 1] + size;
		}

		return this.thumbnail || this.MISSING_IMAGE;
	},

	/**
	 * Gets an array of the item's description entries
	 * Array is cached after first call
	 * @returns {*}
	 */
	getDescriptions: function() {
		var descriptions = this.descriptions || [];

		if(this.descriptions && this.descriptions.length) {
			return this.descriptions;
		}

		if(this.type || this.level) {
			descriptions.push(
				{
					value: this.type || 'Level ' + this.level,
					color: 'ffffff',
				}
			);
		}

		if(this.grade) {
			var grade = dictionary.grades[this.grade] || 'Unknown';

			descriptions.push(
				{
					value: grade + ' Grade',
					color: 'ffffff',
				}
			);
		}

		if(this.statClock) {
			descriptions.push(
				{
					value: 'Strange Stat Clock Attached',
					color: 'cf6a32',
				}
			);
		}

		if(this.parts) {
			for(var i = 0; i < this.parts.length; i++) {
				var parts = this.parts[i],
					partName = dictionary.strangeParts[parts] || 'Unknown strange part';

				descriptions.push(
					{
						value: '(' + partName + ')',
						color: '756b5e',
					}
				);
			}
		}

		if(this.paint) {
			var color = dictionary.paintColours[this.paint] || 'Unknown';

			descriptions.push(
				{
					value: 'Paint Color: ' + color,
					color: '756b5e',
				}
			);
		}

		if(this.unusualEffect) {
			var effect = dictionary.unusualEffects[this.unusualEffect] || 'Unknown';

			descriptions.push(
				{
					value: '★ Unusual Effect: ' + effect,
					color: 'ffd700',
				}
			);
		}

		if(this.spells) {
			for(var j = 0; j < this.spells.length; j++) {
				var spell = this.spells[i],
					spellName = dictionary.halloweenSpells[spell] || 'Unknown spell';

				descriptions.push(
					{
						value: 'Halloween: ' + spellName,
						color: '7ea9d1',
					}
				);
			}
		}

		if(this.killstreak === 3) {
			var killstreaker = dictionary.killstreakEffects[this.ksEffect] || 'Unknown';

			descriptions.push(
				{
					value: 'Killstreaker: ' + killstreaker,
					color: '7ea9d1',
				}
			);
		}

		if(this.killstreak >= 2) {
			var sheen = dictionary.killstreakSheens[this.ksSheen] || 'Unknown';

			descriptions.push(
				{
					value: 'Sheen: ' + sheen,
					color: '7ea9d1',
				}
			);
		}

		if(this.killstreak) {
			descriptions.push(
				{
					value: 'Killstreaks Active',
					color: '7ea9d1',
				}
			);
		}

		if(this.gifter) {
			descriptions.push(
				{
					value: 'Gift from: ' + this.gifter,
					color: '7ea9d1',
				}
			);
		}

		if(this.customDesc) {
			descriptions.push(
				{
					value: this.customDesc,
					color: 'ffffff',
				}
			);
		}

		this.descriptions = descriptions;

		return descriptions;
	},

	/**
	 * Gets a list of the item's description entries
	 * @returns {Array}
	 */
	getDescriptionList: function() {
		var $list = [],
			descriptions = this.getDescriptions();

		//Other description strings
		descriptions.forEach(
			function(description) {
				$list.push(
					$('<li></li>').text(description.value).css(
						{
							color: (description.color) ? '#' + description.color : '#ffffff',
						}
					)
				);
			}
		);

		return $list;
	},

	/**
	 * Gets the css classes required to style the item correctly
	 * @returns {string}
	 */
	getCSSClasses: function() {
		var classes = ['item'];

		classes.push('q' + this.quality);

		if(this.grade) {
			classes.push('hasgrade');
			classes.push('g' + this.grade);
		}

		if(this.uncraftable) {
			classes.push('uncraftable');
		}

		return classes.join(' ');
	},

	/**
	 * Gets the images to display behind the item image.
	 * Currently used for unusual effects
	 * @returns {string}
	 */
	getBackgroundImages: function() {
		var images = [];

		images.push('url(' + this.getThumbnail() + ')');

		if(this.unusualEffect && dictionary.unusualEffectImages[this.unusualEffect]) {
			images.push('url(' + this.UNUSUAL_IMAGE_URL + dictionary.unusualEffectImages[this.unusualEffect] + ')');
		}

		return images.join(',');
	},

	/**
	 * Gets the item's quality
	 * @returns {*}
	 */
	getQuality: function() {
		return this.quality;
	},

	/**
	 * Gets the item's grade, if it has one (items in collections)
	 * @returns {null|*}
	 */
	getGrade: function() {
		return this.grade;
	},

	/**
	 * Gets the item's level, if it has one (newer items don't)
	 * @returns {*|number}
	 */
	getLevel: function() {
		return this.level;
	},

	/**
	 * Gets the item's series, if I has one (crates etc)
	 * @returns {*}
	 */
	getSeries: function() {
		return this.series;
	},

	/**
	 * Gets the item's backpack position
	 * @returns {*|string|position|string|null}
	 */
	getPosition: function() {
		return this.position;
	},

	/**
	 * Is item tradable
	 * @returns {boolean}
	 */
	isTradable: function() {
		return !this.untradable;
	},

	/**
	 * Checks whether the current item is likely to be displayed correctly
	 * Many newer items don't appear correctly due to missing schema information:
	 * Appearing as stock weapons, having unlocalised names, or having no image and name at all
	 * Returning true is not a guarantee of correct display, but should be a good enough guess for most items
	 * @returns {boolean}
	 */
	willDisplayCorrectly: function() {
		//Skins show as stock or nothing at all
		if(this.defindex >= 15000 && this.defindex < 16000) {
			return false;
		}

		//Tough break cosmetics and anything valve adds in the future in this range
		if(this.defindex > 30742) {
			return false;
		}

		//Other known bad defindexes
		return this.badIndexes.indexOf(this.defindex) <= -1;
	},

	/**
	 * Determines if item matches search filters
	 * @param filters
	 * @returns {boolean}
	 */
	matchesFilters: function(filters) {
		if(filters.quality) {
			if(filters.quality.length) {
				if(filters.quality.indexOf(this.quality) === -1) {
					return false;
				}
			} else if(filters.quality != this.quality) {
				return false;
			}
		}

		if(filters.text) {
			if(!filters.text.test(this.name)) {
				return false;
			}
		}

		return true;
	},

	/**
	 * Exports the minimum amount of data required to reconstruct the item
	 * Data such as names, images, etc can be reconstructed using the schema and defindex
	 * @returns {{id: *, defindex: *, quality: *, level: *, series: *, uncraftable: *, customName: *, customDesc: *, australium: *, festive: *, statClock: *, unusualEffect: *, spells: *, parts: *, gifter: *, crafter: *, craftNumber: *, killstreak: *, ksSheen: *, ksEffect: *, wear: *, paint: *}}
	 */
	export: function() {
		var item = {
			id: this.id,
			defindex: this.defindex,
			quality: this.quality,
			level: this.level,
			series: this.series,
			uncraftable: this.uncraftable,
			customName: this.customName,
			customDesc: this.customDesc,
			australium: this.australium,
			festive: this.festive,
			statClock: this.statClock,
			unusualEffect: this.unusualEffect,
			spells: this.spells,
			parts: this.parts,
			gifter: this.gifter,
			crafter: this.crafter,
			craftNumber: this.craftNumber,
			killstreak: this.killstreak,
			ksSheen: this.ksSheen,
			ksEffect: this.ksEffect,
			wear: this.wear,
			paint: this.paint,
		};

		for(var key in item) {
			if(item.hasOwnProperty(key) && (!item[key] || item[key].length === 0)) {
				delete item[key];
			}
		}

		return item;
	},

	/**
	 * Exports the minimum amount of data required to reconstruct the item, in csv format
	 * Data such as names, images, etc can be reconstructed using the schema and defindex
	 * @returns {[*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*]}
	 */
	exportText: function() {
		var item = [
			this.defindex || '',
			(this.quality !== 6) ? this.quality : '',
			(this.level !== 1) ? this.level : '',
			this.series || '',
			(this.crafter) ? '"' + this.crafter + '"' : '',
			(this.gifter) ? '"' + this.gifter + '"' : '',
			this.wear || '',
			this.statClock ? 1 : '',
			this.festive || '',
			this.uncraftable || '',
			this.unusualEffect || '',
			(this.spells) ? this.spells.join(':') : '',
			(this.parts) ? this.spells.join(':') : '',
			this.killstreak || '',
			this.ksSheen || '',
			this.ksEffect || '',
			this.paint || '',
			this.australium || '',
			this.craftNumber || '',
			(this.customName) ? '"' + this.customName + '"' : '',
			(this.customDesc) ? '"' + this.customDesc + '"' : '',
		];

		item = item.join(',').replace(/,+$/, '');

		return item;
	},
};

/**
 * Retrieves an item's definition by its name
 * Uses the name dictionaries to find an item's defindex, and uses that to lookup the item itself
 * Used to identify items in raffles which are displayed incorrectly
 * @param query
 * @returns {null|object}
 */
window.NoName.Item.getDefinitionByName = function(query) {
	var defindex = null,
		qualities = /^(strange|vintage|genuine|haunted|unusual|collector's) (?!part)/,
		name,
		match;

	if(typeof query === 'object') {
		name = query.name.toLowerCase();
	} else {
		name = query;
	}

	match = name.match(qualities);

	if(match) {
		name = name.substring(match[0].length);
	}

	name = name.replace(/^the /, '');

	if(window.nameMapping && window.nameMapping[name]) {
		defindex = window.nameMapping[name];
	} else if(window.itemNameMapping && window.itemNameMapping[name]) {
		defindex = window.itemNameMapping[name];
	}

	if(!defindex || !window.schema[defindex]) {
		return null;
	}

	//Clone definition object so the below code doesn't alter the original
	return JSON.parse(JSON.stringify(window.schema[defindex]));
};

/**
 * Retrieves an item's definition by its defindex
 * Used to identify items in raffles which are displayed incorrectly
 * @param query
 * @returns {*}
 */
window.NoName.Item.getDefinition = function(query) {
	var defindex;

	if(!window.schema) {
		return null;
	}

	if(typeof query === 'object') {
		defindex = query.defindex;
	} else {
		defindex = query;
	}

	if(defindex && window.schema[defindex]) {
		//Clone definition object to avoid altering the original
		return JSON.parse(JSON.stringify(window.schema[defindex]));
	} else if(typeof query === 'object') {
		console.log(query);
		return this.getDefinitionByName(query);
	} else {
		return null;
	}
};


(function() {
	console.info(
		'---Userscript with no name for TF2r v' + GM_info.script.version + '. Made with <3 by Jim :NiGHTS:---'
	);

	window.NoName.Storage.init();
	window.NoName.DB.init();
	window.NoName.exportOverrides(); //Export override functions
	window.NoName.UI.addStyles(); //Add CSS early

	$(document).ready(
		function() {
			var $content = $('#content');

			//Nu iframes pls
			if(window.top == window.self) {
				//Export override functions again to make sure
				window.NoName.exportOverrides();

				console.time("NoName");
				//Lets get this party started
				window.NoName.init();
				console.timeEnd("NoName");

				//Unhide page content
				$content.find('.indent').css('opacity', '1');
			}
		}
	);
})();