// ==UserScript==
// @name         Redacted :: Custom Sort User Details
// @namespace    https://greasyfork.org/en/scripts/375036-redacted-custom-sort-user-details
// @version      1.1
// @description  On the User Details page, sets which sections are displayed or hidden/collapsed by default, as well as what order sections are displayed in.
// @author       newstarshipsmell
// @include      /https://redacted\.ch/user\.php\?id=\d+/
// @require      https://greasyfork.org/libraries/GM_config/20131122/GM_config.js
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/375036/Redacted%20%3A%3A%20Custom%20Sort%20User%20Details.user.js
// @updateURL https://update.greasyfork.org/scripts/375036/Redacted%20%3A%3A%20Custom%20Sort%20User%20Details.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var redCustomSortUserDetailsSettingsFields = {
		'hide_profile_info': {
			'type': 'checkbox', 'label': 'Hide <b>Profile Info</b>', 'default': false,
			'title': 'Checking this option will toggle the Show/Hide state to Hidden for the Profile Info section(s).'
		},
		'hide_recent_badges': {
			'type': 'checkbox', 'label': 'Hide <b>Recent Badges</b>', 'default': false,
			'title': 'Checking this option will toggle the Show/Hide state to Hidden for the Recent Badges section.'
		},
		'hide_first_collage': {
			'type': 'checkbox', 'label': 'Hide 1st <b>Personal Collage</b>', 'default': false,
			'title': 'Checking this option will toggle the Show/Hide state to Hidden for the first Personal Collage section.'
		},
		'show_all_collages': {
			'type': 'checkbox', 'label': 'Show all <b>Personal Collages</b>', 'default': false,
			'title': 'Checking this option will toggle the Show/Hide state to Shown for all Personal Collage sections. Enabling this will override the previous setting.'
		},
		'show_requests': {
			'type': 'checkbox', 'label': 'Show all <b>Requests</b>', 'default': false,
			'title': 'Checking this option will toggle the Show/Hide state to Shown for Requests.'
		},
		'custom_sort': {
			'type': 'checkbox', 'label': 'Use custom <b>Sort Order:</b>', 'default': false,
			'title': 'Checking this option will re-sort the sections per the list of sections below.'
		},
		'section_order': {
			'type': 'textarea', 'rows': 8, 'cols': 32, 'default': 'ProfileInfo\nRecentBadges\nRecentSnatches\nRecentUploads\nPersonalCollages\nRequests',
			'title': 'Cut/paste the sectional names onto separate lines to change the order they appear in.'
		},
		'linkbox_position': {
			'label': 'Linkbox settings link position:', 'labelPos': 'left', 'type': 'radio', 'options': ['beginning', 'end'],
			'default': 'end', 'title': 'Determines whether the [Section order] settings link should be inserted at the beginning or end of the Linkbox.'
		}
	};

	GM_config.init({
		'id': 'RedactedCustomSortUserDetails', 'title': 'Redacted :: Custom Sort User Details', 'fields': redCustomSortUserDetailsSettingsFields,
		'css': '.section_header { background: white !important; color: black !important; border: 0px !important; text-align: left !important;} .field_label { font-weight: normal !important;}',
		'events':
		{
			'save': function() { location.reload(); }
		}
	});

	GM_registerMenuCommand('Redacted :: Custom Sort User Details Settings', function() {GM_config.open();});

	var layoutRecent, personalCollages;
	var hideProfileInfo = GM_config.get('hide_profile_info');
	var hideRecentBadges = GM_config.get('hide_recent_badges');
	var hideFirstCollage = GM_config.get('hide_first_collage');
	var showAllCollages = GM_config.get('show_all_collages');
	var showRequests = GM_config.get('show_requests');
	var customSort = GM_config.get('custom_sort');
	var sectionOrderSet = GM_config.get('section_order').split('\n');
	var sectionOrder = sectionOrderSet.filter(function(x){
		return /(ProfileInfo|RecentBadges|RecentSnatches|RecentUploads|PersonalCollages|Requests)/.test(x);
	});
	var linkboxPosition = GM_config.get('linkbox_position');

	var settings = document.createElement('a');
	settings.href = 'javascript:void(0);';
	settings.classList.add('brackets');
	settings.innerHTML = 'Section order';
	settings.title = 'Click to open settings menu for "Redacted :: Custom Sort User Details" userscript';

	var linkbox = document.querySelector('div.linkbox');
	if (linkboxPosition == 'beginning') {
		linkbox.insertBefore(settings, linkbox.firstChild);
	} else {
		linkbox.appendChild(settings);
	}
	settings.addEventListener('click', function() {GM_config.open();});

	if (hideProfileInfo) {
		var profileInfos = document.querySelectorAll('div.profileinfo');
		for (var i = 0, len = profileInfos.length; i < len; i++) {
			profileInfos[i].classList.add('hidden');
		}
	}

	if (hideRecentBadges) document.getElementById('badgesdiv').classList.add('hidden');

	if (hideFirstCollage && !showAllCollages) {
		layoutRecent = document.querySelectorAll('table.layout.recent');
		for (i = 0, len = layoutRecent.length; i < len; i++) {
			if (layoutRecent[i].id.split('_')[0] == 'recent') continue;
			layoutRecent[i].querySelector('tbody > tr.colhead > td > span[style="float: right;"] > a').click();
			break;
		}
	}

	if (showAllCollages) {
		layoutRecent = document.querySelectorAll('table.layout.recent');
		personalCollages = 0;
		for (i = 0, len = layoutRecent.length; i < len; i++) {
			if (layoutRecent[i].id.split('_')[0] == 'recent') continue;
			personalCollages++;
			if (personalCollages > 1) layoutRecent[i].querySelector('tbody > tr.colhead > td > span[style="float: right;"] > a').click();
		}
	}

	if (showRequests) document.getElementById('requests').classList.remove('hidden');

	if (customSort) {
		var oldMainColumn = document.querySelector('div.main_column');
		var newMainColumn = document.createElement('div');
		newMainColumn.classList.add('main_column');
		oldMainColumn.classList.add('hidden');
		oldMainColumn.parentNode.insertBefore(newMainColumn, oldMainColumn);
		var mainColumnSections = oldMainColumn.children;
		var leng = mainColumnSections.length;

		for (i = 0, len = sectionOrder.length; i < len; i++) {
			for (var j = 0; j < leng; j++) {
				if (j >= mainColumnSections.length) break;
				var shouldResort = false;
				switch (sectionOrder[i]) {
					case 'ProfileInfo':
						try {
							if (/profilediv/.test(mainColumnSections[j].querySelector('div.pad').id)) shouldResort = true;
						} catch(e) {}
						break;
					case 'RecentBadges':
						try {
							if (mainColumnSections[j].querySelector('div.pad').classList.contains('profilebadges')) shouldResort = true;
						} catch(e) {}
						break;
					case 'RecentSnatches':
						try {
							if (mainColumnSections[j].id == 'recent_snatches') shouldResort = true;
						} catch(e) {}
						break;
					case 'RecentUploads':
						try {
							if (mainColumnSections[j].id == 'recent_uploads') shouldResort = true;
						} catch(e) {}
						break;
					case 'PersonalCollages':
						try {
							if (/collage\d+_box/.test(mainColumnSections[j].id)) shouldResort = true;
						} catch(e) {}
						break;
					case 'Requests':
						try {
							if (mainColumnSections[j].id == 'requests_box') shouldResort = true;
						} catch(e) {}
						break;
					default:
				}
				try {
					if (!/profilediv/.test(mainColumnSections[j].querySelector('div.pad').id) &&
						!mainColumnSections[j].querySelector('div.pad').classList.contains('profilebadges') &&
						mainColumnSections[j].id != 'recent_snatches' &&
						mainColumnSections[j].id != 'recent_uploads' &&
						!/collage\d+_box/.test(mainColumnSections[j].id) &&
						mainColumnSections[j].id != 'requests_box') {
						shouldResort = true;
					}
				} catch(e) {}

				if (shouldResort) {
					newMainColumn.appendChild(mainColumnSections[j]);
					j--;
				}
			}
		}
	}
})();