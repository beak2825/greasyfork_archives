// ==UserScript==
// @name			Gazelle Tag Colors
// @author			newstarshipsmell
// @namespace		https://greasyfork.org/en/scripts/37047-gazelle-tag-colors
// @description		Colorizes tags on Gazelle trackers. Site-specific settings. Shift + Wheel Up/Down on tags to cycle colors. GM/TM menu or Linkbox link to open settings panel / define colors.

// @version			2.0.5
// @date			2018/01/17
// @since			2017/02/20

// @include			https://apollo.rip/*
// @include			https://www.deepbassnine.com/*
// @include			https://efectodoppler.pw/*
// @include			https://gazellegames.net/*
// @include			https://www.indietorrents.com/*
// @include			https://jpopsuki.eu/*
// @include			https://libble.me/*
// @include			https://notwhat.cd/*
// @include			https://passthepopcorn.me/*
// @include			https://redacted.ch/*
// @include			https://tv-vault.me/*

// @require			https://greasyfork.org/libraries/GM_config/20131122/GM_config.js

// @grant			GM_addStyle
// @grant			GM.addStyle
// @grant			GM_openInTab
// @grant			GM.openInTab
// @grant			GM_registerMenuCommand
// @grant			GM.registerMenuCommand

// @downloadURL https://update.greasyfork.org/scripts/37047/Gazelle%20Tag%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/37047/Gazelle%20Tag%20Colors.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var website = location.hostname.replace(/www\./, '').split('.')[0];
	var websitePath = window.location.href.replace(window.location.protocol + '//' + window.location.hostname + '/', '');

	var fields = {
		'linkbox_link': {
			'type': 'checkbox', 'label': '<b>Add Linkbox settings link</b>', 'default': true,
			'title': 'Add a [Tag colors] link in the Linkbox to open this Gazelle Tag Colors settings panel.\n\nThis link will not be displayed on all pages (i.e. those lacking a linkbox of bracketed links.)'
		},
		'tag_colors': {
			'label': '<b>Tag Colors:</b> ', 'type': 'textarea', 'rows': 4, 'cols': 24, 'default': '#00ff00\n#ffff00\n#ff0000',
			'title': 'Enter a list of colors, with each color entered on a separate line.\n\nColors can be specified by Color Name, HEX, RGB, HSL or HWB.\n\nSelect a specification below and click Get Info for details.\n\nColors entered here will be parsed sequentially (i.e. the first row is color 1, second is 2, etc.) and the tags entered below are assigned a color based on the numbers following them matching a line from this field.\n\nInvalid color specification lines will be ignored, but will be included in the count (otherwise, a typo in an edited color would shift all the tags assigned a color after it up one row.)'
		},
		'color_spec': {
			'label': '<b>Color Value Specification:</b> ', 'type': 'select', 'options': ['Names', 'HEX', 'RGB', 'HSL', 'HWB'], 'size': 8, 'default': 'Names', 'save': false,
			'title': 'Select the type of color value specification to get information about, and click Get Info below.'
		},
		'open_color_spec': {
			'label': 'Get Info', 'type': 'button', 'click': function() {
				var selected = GM_config.fields.color_spec.toValue();
				var url = 'https://www.w3schools.com/colors/colors_' + (selected == 'HEX' ? 'hexadecimal' : selected.toLowerCase()) + '.asp';
				try {
					GM_openInTab(url, false);
				} catch(e) {
					GM.openInTab(url, false);
				}
			},
			'title': 'Open a page (in a new tab) on W3Schools explaining the selected color value specification.'
		},
		'tag_assignments': {
			'label': '<b>Tag Assignments:</b> ', 'type': 'textarea', 'rows': 10, 'cols': 32, 'default': '',
			'title': 'Enter a list of tags, with each tag entered on a separate line.\n\nPeriods (.) may be omitted from the tag name (they will be stripped by the script anyways.)\n\nAppend ": " + the color number for each tag, where 1-N correspond to the lines entered in the Tag Colors field above, and 0 corresponds to undefined (no colorization.)\n\nMalformed lines will be ignored, including tag names containing non-alphanumeric characters (excepting periods, which are removed.)'
		},
		'populate_tags': {
			'type': 'checkbox', 'label': ' <b>Populate tags</b>', 'default': false,
			'title': 'If enabled, the tag list will be populated with tags set to 0, parsed from all pages browsed with uncolorized tags present, and retain tags cycled to color 0.\n\nOtherwise, such tags will not be added, and pruned from the list if cycled off.'
		},
		'ctrl_key': {
			'section': '<b>Color cycling hotkeys:</b> ', 'type': 'checkbox', 'label': '<b>Ctrl</b>', 'default': false,
			'title': 'Select which hotkeys to be held while rolling the mouse wheel over tags to cycle through the selected colors.\n\nIt is stronly recommended that at least one hotkey be selected, else scrolling through a page with tags on in will cause the user to inadvertently change associated colors for tags that scroll under the mouse cursor!'
		},
		'alt_key': {
			'type': 'checkbox', 'label': '<b>Alt</b>', 'default': false,
			'title': 'Select which hotkeys to be held while rolling the mouse wheel over tags to cycle through the selected colors.\n\nIt is stronly recommended that at least one hotkey be selected, else scrolling through a page with tags on in will cause the user to inadvertently change associated colors for tags that scroll under the mouse cursor!'
		},
		'shift_key': {
			'type': 'checkbox', 'label': '<b>Shift</b>', 'default': true,
			'title': 'Select which hotkeys to be held while rolling the mouse wheel over tags to cycle through the selected colors.\n\nIt is stronly recommended that at least one hotkey be selected, else scrolling through a page with tags on in will cause the user to inadvertently change associated colors for tags that scroll under the mouse cursor!'
		},
		'tag_css_selectors': {
			'label': '<b>Tag CSS Selectors:</b> ', 'type': 'textarea', 'rows': 4, 'cols': 48,
			'default': '.tags > a\n.box_tags li > a\n.basic-movie-list__movie__tags > a\n.cover-movie-list__movie__tags > a\n.panel > .panel__body > .list--unstyled > li > a',
			'title': 'CSS Selectors for selecting tags.\n\nDo not change this setting unless you know what you are doing.\n\nClick the Reset button below to restore the CSS fields to default (and then click Save to apply it.)'
		},
		'tag_topten_css_selectors': {
			'label': '<b>Top 10 Tag CSS Selectors:</b> ', 'type': 'textarea', 'rows': 1, 'cols': 48, 'default': 'tbody > tr > td > a',
			'title': 'CSS Selectors for selecting tags on the Top 10 Tags pages.\n\nDo not change this setting unless you know what you are doing.\n\nClick the Reset button below to restore the CSS fields to default (and then click Save to apply it.)'
		},
		'reset_css': {
			'label': 'Reset CSS', 'type': 'button', 'click': function() {
				GM_config.set('tag_css_selectors', '.tags > a\n.box_tags li > a\n.basic-movie-list__movie__tags > a\n.cover-movie-list__movie__tags > a\n.panel > .panel__body > .list--unstyled > li > a');
				GM_config.set('tag_topten_css_selectors', 'tbody > tr > td > a');
				GM_config.close();
				GM_config.open();
			},
			'title': 'Reset the CSS Selector fields to their default values.\n\nClick Save after resetting to apply the changes.'
		},
	};

	GM_config.init({
		'id': 'GazelleTagColors', 'title': 'Gazelle Tag Colors', 'fields': fields,
		'css': '.section_header { background: white !important; color: black !important; border: 0px !important; text-align: left !important;} .field_label { font-weight: normal !important;}',
		'events':
		{
			'save': function(values) {
				if (GM_config.isOpen) location.reload();
			}
		}
	});

	try {
		GM_registerMenuCommand('Gazelle Tag Colors', function() {GM_config.open();});
	} catch(e) {
		GM.registerMenuCommand('Gazelle Tag Colors', function() {GM_config.open();});
	}

	var colorList = GM_config.get('tag_colors').split('\n');

	var validColorNames = [
		'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque', 'black', 'blanchedalmond', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue',
		'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen', 'darkgrey',
		'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray', 'darkslategrey',
		'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey', 'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro',
		'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'greenyellow', 'grey', 'honeydew', 'hotpink', 'indianred ', 'indigo ', 'ivory', 'khaki', 'lavender',
		'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow', 'lightgray', 'lightgreen', 'lightgrey', 'lightpink',
		'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray', 'lightslategrey', 'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen', 'magenta', 'maroon',
		'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred',
		'midnightblue', 'mintcream', 'mistyrose', 'moccasin', 'navajowhite', 'navy', 'oldlace', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod',
		'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'purple', 'rebeccapurple', 'red', 'rosybrown',
		'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'silver', 'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow',
		'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'wheat', 'white', 'whitesmoke', 'yellow', 'yellowgreen'
	];

	for (var i = 0, len = colorList.length; i < len; i++) {
		if (validColorNames.indexOf(colorList[i].toLowerCase()) == -1 &&
			/^(rgb\((1?\d{1,2}|2([0-4]\d|5[0-5])), ?(1?\d{1,2}|2([0-4]\d|5[0-5])), ?(1?\d{1,2}|2([0-4]\d|5[0-5]))\)|#[0-9a-fA-F]{6}|h(sl|wb)\(([12]?\d{1,2}|3([0-5]\d|60)), ?(\d{1,2}|100)%, ?(\d{1,2}|100)%\))$/.test(colorList[i]) ===
			false)
			colorList[i] = "";
	}

	var tagAssignments = GM_config.get('tag_assignments').replace(/\./g, '').toLowerCase().split('\n');
	tagAssignments.sort();

	var tagList = {};

	for (i = 0, len = tagAssignments.length; i < len; i++) {
		if (/^[a-z0-9\.]+\s*:\s*\d+/.test(tagAssignments[i]) === true)
			tagList[tagAssignments[i].split(/\s*:\s*/)[0]] = parseInt(tagAssignments[i].split(/\s*:\s*/)[1]);
	}

	var linkboxLink = Boolean(GM_config.get('linkbox_link'));
	var populateTaglist = Boolean(GM_config.get('populate_tags'));
	var cycleCtrlKey = Boolean(GM_config.get('ctrl_key'));
	var cycleAltKey = Boolean(GM_config.get('alt_key'));
	var cycleShiftKey = Boolean(GM_config.get('shift_key'));
	var tagCSSSelectors = GM_config.get('tag_css_selectors').replace(/\n/g, ', ');
	var tagTopTenCSSSelectors = GM_config.get('tag_topten_css_selectors').replace(/\n/g, ', ');

	var style = '';

	for (i = 0, len = colorList.length; i < len; i++) {
		if (colorList[i] !== '')
			style += [
				'a.tagcolor_', i + 1, ' { color: ', colorList[i], ' !important; }',
				'a.tagcolor_', i + 1, ':hover { color: ', colorList[i], ' !important; opacity: 0.8; }'
			].join('');
	}

	try {
		GM_addStyle(style);
	} catch(e) {
		GM.addStyle(style);
	}

	var links = document.querySelectorAll(/^top10\.php\?type=tags.*$/.test(websitePath) ? tagTopTenCSSSelectors : tagCSSSelectors);

	for (i = links.length; i--; ) {
		var tag = links[i].textContent.trim().replace(/\./g, '');
		if (tagList[tag] === undefined) {
			if (populateTaglist) tagList[tag] = 0;
			links[i].classList.add('tagcolor_0');
			continue;
		}

		if (!Number.isInteger(tagList[tag]) || tagList[tag] <= 0 || tagList[tag] > colorList.length) {
			tagList[tag] = 0;
			links[i].classList.add('tagcolor_0');
			continue;
		}
		links[i].classList.add('tagcolor_' + tagList[tag]);
	}

	if (populateTaglist) {
		tagAssignments = [];

		for (var j in tagList) {
			if (!tagList.hasOwnProperty(j)) continue;
			tagAssignments.push(j + ": " + tagList[j].toString());
		}
		tagAssignments.sort();

		GM_config.set('tag_assignments', tagAssignments.join('\n'));
		GM_config.save();
	}

	if (linkboxLink) {
		if (/^((artist|torrents)\.php\?(page=\d+&|)(id=\d+|action=notify).*|(bookmarks|collages?|requests|top10|trumpable)\.php.*|collections\.php\?(page=\d+&|)id=\d+|better\.php.+|user\.php\?id=\d+|userhistory\.php\?action=subscribed_collages.*)$/.test(websitePath)) {
			var tagColorsLink = '<a href="#" id="tag_colors_linkbox" class="brackets">' + (website == 'passthepopcorn' || website == 'tv-vault' ? '[Tag colors]' : 'Tag colors') + '</a> ';

			document.getElementsByClassName("linkbox")[0].insertAdjacentHTML(/^collages?\.php(|\?(page=\d+&|)(?!id=\d+)$)/.test(websitePath) ?
																			 'afterbegin' :
																			 'beforeend', tagColorsLink);

			document.getElementById('tag_colors_linkbox').addEventListener('click', function(e){
				e.preventDefault();
				GM_config.open();
			});
		}
	}

	document.getElementById('content').addEventListener('wheel', function (e) {
		if (/tagcolor_\d+/.test(e.target.className) && e.ctrlKey == cycleCtrlKey && e.altKey == cycleAltKey && e.shiftKey == cycleShiftKey) {
			e.preventDefault();

			var tagAdjustment = e.deltaY < 0 ? -1 : 1;
			var tagAdjusted = e.target.textContent.trim().replace(/\./g, '').toLowerCase();
			var previousNum = tagList[tagAdjusted] === undefined ? 0 : tagList[tagAdjusted];

			tagList[tagAdjusted] = previousNum + tagAdjustment;

			if (tagList[tagAdjusted] == -1) {
				tagList[tagAdjusted] = colorList.length;
			} else if (tagList[tagAdjusted] > colorList.length) {
				tagList[tagAdjusted] = populateTaglist ? 0 : undefined;
			}

			var currentNum = tagList[tagAdjusted] === undefined ? 0 : tagList[tagAdjusted];

			var links = document.querySelectorAll(/^top10\.php\?type=tags.*$/.test(websitePath) ? tagTopTenCSSSelectors : tagCSSSelectors);

			for (i = links.length; i--; ) {
				var tag = links[i].textContent.trim().replace(/\./g, '');

				if (tag == tagAdjusted) {
					links[i].classList.remove('tagcolor_' + previousNum);
					links[i].classList.add('tagcolor_' + currentNum);
				}
			}

			tagAssignments = [];

			for (var j in tagList) {
				if (!tagList.hasOwnProperty(j)) continue;
				if (!Number.isInteger(tagList[j])) continue;
				if (tagList[j] === 0 && !populateTaglist) continue;
				tagAssignments.push(j + ": " + tagList[j].toString());
			}
			tagAssignments.sort();

			GM_config.set('tag_assignments', tagAssignments.join('\n'));
			GM_config.save();
		}
	}, false);

})();