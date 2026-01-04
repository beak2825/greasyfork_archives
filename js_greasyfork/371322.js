// ==UserScript==
// @name			Redacted :: Clean Upload Page
// @namespace		https://greasyfork.org/en/scripts/371322-redacted-clean-upload-page
// @version			2.5
// @description		Removes clutter, adds defaults plus other options to the upload page.
// @author			newstarshipsmell
// @include			https://redacted.ch/upload.php*
// @require			https://greasyfork.org/libraries/GM_config/20131122/GM_config.js
// @grant			GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/371322/Redacted%20%3A%3A%20Clean%20Upload%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/371322/Redacted%20%3A%3A%20Clean%20Upload%20Page.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var fields = {
		'hide_header': {
			'type': 'checkbox', 'label': 'Hide <b>Header</b>', 'default': false,
			'title': 'Hides the Header section.\nThis will hide everything above the Do Not Upload List, including the logo, user info, menu, searchbars and alerts (e.g. "You have X new torrent notifications".)\nError messages for attempted but failed uploads will still be displayed above the upload form upon page reload.',
			'section': ['<br><b><u>Sections/options to hide:</u></b>']
		},
		'hide_dnul': {
			'type': 'checkbox',
			'label': 'Hide <b>Do Not Upload List</b></br><b>It is <i>your</i> responsibility to remain aware of the current content of the DNUL.</br>Usage of this userscript to hide it <i>will not</i> excuse you from any consequences imposed by staff for uploading torrents which have been added to the DNUL.</b>',
			'default': false,
			'title': 'Hides the Do Not Upload List.\nThe "Last updated:" line will still be displayed, and a "Show" button will be added to unhide the DNUL list.'
		},
		'hide_announce': {
			'type': 'checkbox', 'label': 'Hide <b>Announce URL</b>', 'default': false,
			'title': 'Hides your personal Announce URL.'
		},
		'hide_categories': {
			'type': 'checkbox', 'label': 'Hide <b>Categories</b>', 'default': false,
			'title': 'Hides the Categories dropdown menu.\nThe default selection for the "Music" category will be unaffected; uploading with this menu hidden, but set to the default Music category, will result in a normal Music torrent upload.\nUnhide this option if you wish to upload to another category.\nSwitching Categories will reload the upload form; the userscript will only execute once upon initial page load, so changing the selection from and back to Music will reload all the previously hidden explanatory text.'
		},
		'hide_scene': {
			'type': 'checkbox', 'label': 'Hide <b>Scene</b>', 'default': false,
			'title': 'Hides the Scene checkbox/section.'
		},
		'hide_log_files': {
			'type': 'checkbox', 'label': 'Hide <b>Log files</b>', 'default': false,
			'title': 'Hides the Log files section when the Format/Bitrate/Media selections are not set to FLAC/Lossless/CD.'
		},
		'hide_tag_dropdown': {
			'type': 'checkbox', 'label': 'Hide <b>Tags dropdown</b>', 'default': false,
			'title': 'Hides the Tags dropdown menu.\nYou can also replace the list of tags with the "Replace Tag Dropdown List" setting below. Enabling that setting will override this one.'
		},
		'hide_footer': {
			'type': 'checkbox', 'label': 'Hide <b>Footer</b>', 'default': false,
			'title': 'Hides the Footer section.\nThis will hide everything below the "Upload torrent" button.\nUse the Footer Padding setting to add extra space below the button, if you do not want it to appear at the very bottom of the page.'
		},
		'default_year': {
			'label': 'Default Initial <b>Year:</b>', 'type': 'text', 'size': 4, 'default': '',
			'title': 'Enter the default text you wish to appear in the Initial Year field upon page load.\ne.g. "2019"',
			'section': ['<br><b><u>Default Selections:</u></b>']
		},
		'default_edition_year': {
			'label': 'Default Edition <b>Year:</b>', 'type': 'text', 'size': 4, 'default': '',
			'title': 'Enter the default text you wish to appear in the Edition Year field upon page load.\ne.g. "2019"'
		},
		'default_edition_label': {
			'label': 'Default <b>Record label:</b>', 'type': 'text', 'size': 48, 'default': '',
			'title': 'Enter the default text you wish to appear in the Edition Label field upon page load.\ne.g. "Self-Released"'
		},
		'default_release_type': {
			'label': 'Default <b>Release type:</b> ', 'type': 'select',
			'options': ['---', 'Album', 'Soundtrack', 'EP', 'Anthology', 'Compilation', 'Single', 'Live album',
						'Remix', 'Bootleg', 'Interview', 'Mixtape', 'Demo', 'Concert Recording', 'DJ Mix', 'Unknown'],
			'default': '---', 'title': 'Select the Release type to preselect upon page load.\nSelect "---" to leave unselected.'
		},
		'default_format': {
			'label': 'Default <b>Format:</b> ', 'type': 'select', 'options': ['---', 'MP3', 'FLAC', 'AAC', 'AC3', 'DTS'], 'default': '---',
			'title': 'Select the Format to preselect upon page load.\nSelect "---" to leave unselected.'
		},
		'default_bitrate': {
			'label': 'Default <b>Bitrate:</b> ', 'type': 'select',
			'options': ['---', '192', 'APS (VBR)', 'V2 (VBR)', 'V1 (VBR)', '256', 'APX (VBR)', 'V0 (VBR)', '320', 'Lossless', '24bit Lossless', 'Other'],
			'default': '---', 'title': 'Select the Bitrate to preselect upon page load.\nSelect "---" to leave unselected.'
		},
		'default_media': {
			'label': 'Default <b>Media:</b> ', 'type': 'select', 'options': ['---', 'CD', 'DVD', 'Vinyl', 'Soundboard', 'SACD', 'DAT', 'Cassette', 'WEB', 'Blu-Ray'],
			'default': '---', 'title': 'Select the Media to preselect upon page load.\nSelect "---" to leave unselected.'
		},
		'default_rel_desc': {
			'label': 'Default <b>Release description:</b> ', 'type': 'textarea', 'rows': '4', 'cols': '48', 'default': '',
			'title': 'Enter the default text you wish to be placed in the Release description field upon page load.\ne.g. "Encoded with FLAC 1.3.2 -8"'
		},
		'resize_album': {
			'type': 'unsigned int', 'label': ' <b>Album title</b>', 'size' : 1, 'min': 1, 'default': 60,
			'title': 'Resizes the width of the Album title field to the specified value.\nDefault is 60.',
			'section': ['<br><b><u>Text input box sizes:</u></b>']
		},
		'resize_title': {
			'type': 'unsigned int', 'label': ' <b>Edition title</b>', 'size' : 1, 'min': 1, 'default': 50,
			'title': 'Resizes the width of the Edition title field to the specified value.\nDefault is 50.'
		},
		'resize_label': {
			'type': 'unsigned int', 'label': ' <b>Record label</b> (edition)', 'size' : 1, 'min': 1, 'default': 50,
			'title': 'Resizes the width of the Record label (edition) field to the specified value.\nDefault is 50.'
		},
		'resize_cat': {
			'type': 'unsigned int', 'label': ' <b>Catalog number</b> (edition)', 'size' : 1, 'min': 1, 'default': 50,
			'title': 'Resizes the width of the Catalog number (edition) field to the specified value.\nDefault is 50.'
		},
		'resize_tags': {
			'type': 'unsigned int', 'label': ' <b>Tags</b>', 'size' : 1, 'min': 1, 'default': 40,
			'title': 'Resizes the width of the Tags field to the specified value.\nDefault is 40.'
		},
		'resize_image': {
			'type': 'unsigned int', 'label': ' <b>Image</b>', 'size' : 1, 'min': 1, 'default': 60,
			'title': 'Resizes the width of the Image field to the specified value.\nDefault is 60.'
		},
		'resize_desc': {
			'type': 'unsigned int', 'label': ' <b>Album description</b> width', 'size' : 1, 'min': 1, 'default': 60,
			'title': 'Resizes the width of the Album description field to the specified value.\nDefault is 60.'
		},
		'resize_desc_rows': {
			'type': 'unsigned int', 'label': ' <b>Album description</b> height (rows)', 'size' : 1, 'min': 1, 'default': 8,
			'title': 'Resizes the height of the Album description field to the specified value.\nDefault is 8.'
		},
		'resize_reldesc': {
			'type': 'unsigned int', 'label': ' <b>Release description</b> width', 'size' : 1, 'min': 1, 'default': 60,
			'title': 'Resizes the width of the Release description field to the specified value.\nDefault is 60.'
		},
		'resize_reldesc_rows': {
			'type': 'unsigned int', 'label': ' <b>Release description</b> height (rows)', 'size' : 1, 'min': 1, 'default': 8,
			'title': 'Resizes the height of the Release description field to the specified value.\nDefault is 8.'
		},
		'resize_extra_reldesc': {
			'type': 'unsigned int', 'label': ' Extra format <b>Release description</b> width', 'size' : 1, 'min': 1, 'default': 60,
			'title': 'Resizes the width of the Extra format Release description field to the specified value.\nDefault is 60.'
		},
		'resize_extra_reldesc_rows': {
			'type': 'unsigned int', 'label': ' Extra format <b>Release description</b> height (rows)', 'size' : 1, 'min': 1, 'default': 4,
			'title': 'Resizes the height of the Extra format Release description field to the specified value.\nDefault is 4.'
		},
		'show_settings': {
			'type': 'checkbox', 'label': 'Show <b>Settings</b> button', 'default': true,
			'title': 'Adds a Settings button to open the userscript settings, placed below the Album title field.\nSettings for this userscript can always be opened by clicking the Tampermonkey button and clicking on "Clean Upload Page settings" in the dropdown menu, so this option can safely be disabled without preventing access to this settings menu.',
			'section': ['<br><b><u>Miscellaneous:</u></b>']
		},
		'feat_to_guest_button': {
			'type': 'checkbox', 'label': 'Add <b>feat►Guest</b> button', 'default': false,
			'title': 'Adds a button beside the album title to remove " (feat. artist)" and add the artist as a Guest.'
		},
		'feat_to_guest_text': {
			'label': '<b>feat►Guest</b> text:', 'type': 'text', 'size': 48, 'default': 'feat►Guest',
			'title': 'Enter the text you wish to display on the feat►Guest button.'
		},
		'subtitle_to_edition_button': {
			'type': 'checkbox', 'label': 'Add <b>Subtitle►Edition</b> button', 'default': false,
			'title': 'Adds a button beside the album title to remove " (subtitle)" and add the subtitle to the Edition title field.'
		},
		'subtitle_to_edition_text': {
			'label': '<b>Subtitle►Edition</b> text:', 'type': 'text', 'size': 48, 'default': 'Subtitle►Edition',
			'title': 'Enter the text you wish to display on the Subtitle►Edition button.'
		},
		'copy_year_buttons': {
			'type': 'checkbox', 'label': 'Add <b>Copy From Edition/Initial Year</b> buttons', 'default': false,
			'title': 'Adds buttons to copy the year from the Edition Year field to the Initial Year field, and vice versa.\nBehavior can be inverted by selecting "Paste into" option below.'
		},
		'copy_year_action': {
			'label': 'Copy button behavior:', 'labelPos': 'left', 'type': 'radio', 'options': ['Copy from', '   Paste into'], 'default': 'Copy from',
			'title': 'Determines whether the button copies the year from the other field to the adjacent field (Copy from), or pastes it from the adjacent field into the other field (Paste into.)'
		},
		'self_released_button': {
			'type': 'checkbox', 'label': 'Add <b>Self-Released</b> button', 'default': false,
			'title': 'Adds a button to replace the Record label field with the string specified below.\nThis button will be labeled with that string.'
		},
		'self_released_text': {
			'label': '<b>Self-Released</b> text:', 'type': 'text', 'size': 48, 'default': 'Self-Released',
			'title': 'Enter the text you wish to replace the Record label field when clicking the Self-Released button.'
		},
		'replace_taglist': {
			'type': 'checkbox', 'label': 'Replace Tag Dropdown List', 'default': false,
			'title': 'Replaces the list of tags in the Tag dropdown menu with the list in the following text input box.\nIf checked, this option will override the "Hide Tags dropdown" checkbox.'
		},
		'taglist_replacements': {
			'type': 'textarea', 'rows': '8', 'cols': '24', 'default': '',
			'title': 'Enter a list of tags, with each tag on a separate line, e.g.\nalternative\nelectronic\nindie\npop\nrock\nThis list will replace the list of tags in the tag dropdown menu.'
		},
		'parse_feat_remixer_button': {
			'type': 'checkbox', 'label': 'Add <b>Parse Guest/Remixer Artists</b> button', 'default': false,
			'title': 'Adds a button to parse the featured (Guest) and Remixer artists from the tracklist in the album description, based upon the patterns/settings below, which adds them to the Artists.'
		},
		'parse_feat_pattern': {
			'label': '<b>Featured Artist</b> pattern:', 'type': 'text', 'size': 48, 'default': '/.+[\\(\\[]feat(|\\.|uring) ([^\\)\\]]+).*/i',
			'title': 'Enter the regex pattern to match against the tracklisting to parse featured/Guest artists.'
		},
		'parse_feat_pattern_group': {
			'label': '<b>Featured Artist</b> pattern group number: ', 'type': 'unsigned int', 'size' : 1, 'min': 1, 'default': 2,
			'title': 'Enter the regex pattern group number to match against the tracklisting to parse featured/Guest artists.'
		},
		'parse_feat_split_string': {
			'label': '<b>Featured Artist</b> splitting string:', 'type': 'text', 'size': 48, 'default': '%SPLITHERE%',
			'title': 'Enter a unique string to subsequently split featured artist strings into separate artists with, to replace any strings specified below.'
		},
		'parse_feat_split_replace': {
			'label': '<b>Featured Artist</b> replacement strings:', 'type': 'textarea', 'rows': '4', 'cols': '24', 'default': '", "\n" & "',
			'title': 'Enter a list of newline-separated, doublequote-enclosed strings to be replaced with the splitting string specified above.'
		},
		'parse_remixer_pattern': {
			'label': '<b>Remixer Artist</b> pattern:', 'type': 'text', 'size': 48, 'default': '/.+[\\(\\[]([^\\)\\]]+) (dub|edit|mix|remix|rework|version)[\\)\\]].*/i',
			'title': 'Enter the regex pattern to match against the tracklisting to parse Remixer artists.'
		},
		'parse_remixer_pattern_group': {
			'label': '<b>Remixer Artist</b> pattern group number: ', 'type': 'unsigned int', 'size' : 1, 'min': 1, 'default': 1,
			'title': 'Enter the regex pattern group number to match against the tracklisting to parse Remixer artists.'
		},
		'parse_remixer_blacklist': {
			'label': '<b>Remixer Artist</b> blacklist:', 'type': 'textarea', 'rows': '4', 'cols': '24', 'default': 'single\nacoustic',
			'title': 'Enter a list of terms to exclude as Remixer artists.'
		},
		'prevent_upload': {
			'type': 'checkbox', 'label': 'Prevent upload if cover != ptpimg', 'default': false,
			'title': 'Prevents clicking the Upload button from uploading the torrent if the cover image URL is not a ptpimg URL.\nAdds a checkbox below the button which, when unchecked, will allow the upload regardless of the cover image URL - unchecked by default for existing group uploads via [Add format].'
		},
		'footer_padding': {
			'label': 'Footer padding:', 'type': 'select', 'options': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'],
			'default': '0',
			'title': 'Adds a number of line breaks (up to 25) below the "Upload torrent" button.\nThis prevents the button from appearing at the very bottom of the page, if the Hide Footer option is checked.'
		},
		'move_yadg_to_top': {
			'type': 'checkbox', 'label': 'Move YADG to top', 'default': false,
			'title': 'Moves the YADG row up to the top, between the torrent button and the artist field(s)'
		},
		'move_yadg_to_top_delay': {
			'label': 'Move YADG to top delay: ', 'type': 'unsigned int', 'size' : 2, 'min': 1, 'default': 1000,
			'title': 'Delay (in ms) to move the YADG row (as it will not appear instantly upon page load)',
		},
		'default_extraformats': {
			'label': 'Default <b>ExtraFormats:</b> ', 'type': 'select', 'options': ['0', '1', '2', '3', '4'], 'default': '0',
			'title': 'Select the number of Extra formats to apply default selections to (0-4)',
			'section': ['<br><b><u>Default ExtraFormats:</u></b>']
		},
		'default_extraformat1_format': {
			'label': 'Default Extra format 1 <b>Format:</b> ', 'type': 'select', 'options': ['---', 'MP3', 'FLAC', 'AAC', 'AC3', 'DTS'], 'default': '---',
			'title': 'Select the Extra format Format to preselect upon clicking the + button the first time.\nSelect "---" to leave unselected.'
		},
		'default_extraformat1_bitrate': {
			'label': 'Default Extra format 1 <b>Bitrate:</b> ', 'type': 'select',
			'options': ['---', '192', 'APS (VBR)', 'V2 (VBR)', 'V1 (VBR)', '256', 'APX (VBR)', 'V0 (VBR)', '320', 'Lossless', '24bit Lossless', 'Other'],
			'default': '---', 'title': 'Select the Extra format Bitrate to preselect upon clicking the + button the first time.\nSelect "---" to leave unselected.'
		},
		'default_extraformat1_rel_desc': {
			'label': 'Default Extra format 1 <b>Release description:</b> ', 'type': 'textarea', 'rows': '4', 'cols': '48', 'default': '',
			'title': 'Enter the default text you wish to be placed in the new Extra format Release description field upon clicking the + button the first time.'
		},
		'default_extraformat2_format': {
			'label': 'Default Extra format 2 <b>Format:</b> ', 'type': 'select', 'options': ['---', 'MP3', 'FLAC', 'AAC', 'AC3', 'DTS'], 'default': '---',
			'title': 'Select the Extra format Format to preselect upon clicking the + button the second time.\nSelect "---" to leave unselected.'
		},
		'default_extraformat2_bitrate': {
			'label': 'Default Extra format 2 <b>Bitrate:</b> ', 'type': 'select',
			'options': ['---', '192', 'APS (VBR)', 'V2 (VBR)', 'V1 (VBR)', '256', 'APX (VBR)', 'V0 (VBR)', '320', 'Lossless', '24bit Lossless', 'Other'],
			'default': '---', 'title': 'Select the Extra format Bitrate to preselect upon clicking the + button the second time.\nSelect "---" to leave unselected.'
		},
		'default_extraformat2_rel_desc': {
			'label': 'Default Extra format 2 <b>Release description:</b> ', 'type': 'textarea', 'rows': '4', 'cols': '48', 'default': '',
			'title': 'Enter the default text you wish to be placed in the new Extra format Release description field upon clicking the + button the second time.'
		},
		'default_extraformat3_format': {
			'label': 'Default Extra format 3 <b>Format:</b> ', 'type': 'select', 'options': ['---', 'MP3', 'FLAC', 'AAC', 'AC3', 'DTS'], 'default': '---',
			'title': 'Select the Extra format Format to preselect upon clicking the + button the third time.\nSelect "---" to leave unselected.'
		},
		'default_extraformat3_bitrate': {
			'label': 'Default Extra format 3 <b>Bitrate:</b> ', 'type': 'select',
			'options': ['---', '192', 'APS (VBR)', 'V2 (VBR)', 'V1 (VBR)', '256', 'APX (VBR)', 'V0 (VBR)', '320', 'Lossless', '24bit Lossless', 'Other'],
			'default': '---', 'title': 'Select the Extra format Bitrate to preselect upon clicking the + button the third time.\nSelect "---" to leave unselected.'
		},
		'default_extraformat3_rel_desc': {
			'label': 'Default Extra format 3 <b>Release description:</b> ', 'type': 'textarea', 'rows': '4', 'cols': '48', 'default': '',
			'title': 'Enter the default text you wish to be placed in the new Extra format Release description field upon clicking the + button the third time.'
		},
		'default_extraformat4_format': {
			'label': 'Default Extra format 4 <b>Format:</b> ', 'type': 'select', 'options': ['---', 'MP3', 'FLAC', 'AAC', 'AC3', 'DTS'], 'default': '---',
			'title': 'Select the Extra format Format to preselect upon clicking the + button the fourth time.\nSelect "---" to leave unselected.'
		},
		'default_extraformat4_bitrate': {
			'label': 'Default Extra format 4 <b>Bitrate:</b> ', 'type': 'select',
			'options': ['---', '192', 'APS (VBR)', 'V2 (VBR)', 'V1 (VBR)', '256', 'APX (VBR)', 'V0 (VBR)', '320', 'Lossless', '24bit Lossless', 'Other'],
			'default': '---', 'title': 'Select the Extra format Bitrate to preselect upon clicking the + button the fourth time.\nSelect "---" to leave unselected.'
		},
		'default_extraformat4_rel_desc': {
			'label': 'Default Extra format 4 <b>Release description:</b> ', 'type': 'textarea', 'rows': '4', 'cols': '48', 'default': '',
			'title': 'Enter the default text you wish to be placed in the new Extra format Release description field upon clicking the + button the fourth time.'
		}
	};

	GM_config.init({
		'id': 'CleanUploadPage', 'title': 'Redacted :: Clean Upload Page', 'fields': fields,
		'css': '.section_header { background: white !important; color: black !important; border: 0px !important; text-align: left !important;} .field_label { font-weight: normal !important;}',
		'events':
		{
			'save': function(values) {
				if (GM_config.isOpen) location.reload();
			}
		}
	});

	try { GM_registerMenuCommand('Clean Upload Page settings', function() {GM_config.open();}); } catch(e) {}

	var i, j, k, len, leng;
	var settings = {
		'hideHeader': {'gmConfig': 'hide_header', 'default': false},
		'hideDNUL': {'gmConfig': 'hide_dnul', 'default': false},
		'hideAnnounce': {'gmConfig': 'hide_announce', 'default': false},
		'hideCategories': {'gmConfig': 'hide_categories', 'default': false},
		'hideScene': {'gmConfig': 'hide_scene', 'default': false},
		'hideLogFiles': {'gmConfig': 'hide_log_files', 'default': false},
		'hideTagDropdown': {'gmConfig': 'hide_tag_dropdown', 'default': false},
		'hideFooter': {'gmConfig': 'hide_footer', 'default': false},
		'albumSize': {'gmConfig': 'resize_album', 'default': 60},
		'titleSize': {'gmConfig': 'resize_title', 'default': 50},
		'labelSize': {'gmConfig': 'resize_label', 'default': 50},
		'catalogSize': {'gmConfig': 'resize_cat', 'default': 50},
		'tagsSize': {'gmConfig': 'resize_tags', 'default': 40},
		'imageSize': {'gmConfig': 'resize_image', 'default': 60},
		'descriptionSize': {'gmConfig': 'resize_desc', 'default': 60},
		'descriptionRows': {'gmConfig': 'resize_desc_rows', 'default': 8},
		'releaseDescriptionSize': {'gmConfig': 'resize_reldesc', 'default': 60},
		'releaseDescriptionRows': {'gmConfig': 'resize_reldesc_rows', 'default': 8},
		'extraFormatSize': {'gmConfig': 'resize_extra_reldesc', 'default': 60},
		'extraFormatRows': {'gmConfig': 'resize_extra_reldesc_rows', 'default': 4},
		'defaultYear': {'gmConfig': 'default_year', 'default': ''},
		'defaultEditionYear': {'gmConfig': 'default_edition_year', 'default': ''},
		'defaultEditionLabel': {'gmConfig': 'default_edition_label', 'default': ''},
		'defaultReleaseType': {'gmConfig': 'default_release_type', 'default': '---', 'select': true,
							   'options': ['---', 'Album', 'Soundtrack', 'EP', 'Anthology', 'Compilation', 'Single', 'Live album',
										   'Remix', 'Bootleg', 'Interview', 'Mixtape', 'Demo', 'Concert Recording', 'DJ Mix', 'Unknown']},
		'defaultFormat': {'gmConfig': 'default_format', 'default': '---'},
		'defaultBitrate': {'gmConfig': 'default_bitrate', 'default': '---'},
		'defaultMedia': {'gmConfig': 'default_media', 'default': '---'},
		'defaultReleaseDesc': {'gmConfig': 'default_rel_desc', 'default': ''},
		'showSettingsButton': {'gmConfig': 'show_settings', 'default': true},
		'featToGuestButton': {'gmConfig': 'feat_to_guest_button', 'default': false},
		'featToGuestText': {'gmConfig': 'feat_to_guest_text', 'default': 'feat►Guest'},
		'subtitleToEditionButton': {'gmConfig': 'subtitle_to_edition_button', 'default': false},
		'subtitleToEditionText': {'gmConfig': 'subtitle_to_edition_text', 'default': 'Subtitle►Edition'},
		'showCopyYearButtons': {'gmConfig': 'copy_year_buttons', 'default': false},
		'copyYearAction': {'gmConfig': 'copy_year_action', 'default': 'Copy from'},
		'addSelfReleasedButton': {'gmConfig': 'self_released_button', 'default': false},
		'selfReleasedText': {'gmConfig': 'self_released_text', 'default': 'Self-Released'},
		'replaceTagDropdownList': {'gmConfig': 'replace_taglist', 'default': false},
		'tagDropdownReplacement': {'gmConfig': 'taglist_replacements', 'default': ''},
		'addParseFeatRemixerButton': {'gmConfig': 'parse_feat_remixer_button', 'default': false},
		'parseFeatPattern': {'gmConfig': 'parse_feat_pattern', 'default': '/.+[\\(\\[]feat(|\\.|uring) ([^\\)\\]]+).*/i', 'regex': true},
		'parseFeatPatternGroup': {'gmConfig': 'parse_feat_pattern_group', 'default': 2},
		'parseFeatSplitString': {'gmConfig': 'parse_feat_split_string', 'default': '%SPLITHERE%'},
		'parseFeatSplitReplace': {'gmConfig': 'parse_feat_split_replace', 'default': '", "\n" & "'},
		'parseRemixerPattern': {'gmConfig': 'parse_remixer_pattern', 'default': '/.+[\\(\\[]([^\\)\\]]+) (dub|edit|mix|remix|rework|version)[\\)\\]].*/i',
								'regex': true},
		'parseRemixerPatternGroup': {'gmConfig': 'parse_remixer_pattern_group', 'default': 1},
		'parseRemixerPatternBlacklist': {'gmConfig': 'parse_remixer_blacklist', 'default': 'single\nacoustic'},
		'preventUpload': {'gmConfig': 'prevent_upload', 'default': false},
		'footerPadding': {'gmConfig': 'footer_padding', 'default': '0'},//needs to be string to match select/options!
		'moveYadgToTop': {'gmConfig': 'move_yadg_to_top', 'default': false},
		'moveYadgToTopDelay': {'gmConfig': 'move_yadg_to_top_delay', 'default': 1000},
		'extraFormatDefaults': {'gmConfig': 'default_extraformats', 'default': '0'},//needs to be string to match select/options!
		'defaultExtraFormats': {'gmConfig': 'default_extraformat%N%_format', 'default': '', 'extraFormat': true},
		'defaultExtraFormatBitrates': {'gmConfig': 'default_extraformat%N%_bitrate', 'default': '', 'extraFormat': true},
		'defaultExtraFormatRelDescs': {'gmConfig': 'default_extraformat%N%_rel_desc', 'default': '', 'extraFormat': true},
	};
	var tarsh = false;

	for (k in settings) {
		if (!settings.hasOwnProperty(k)) continue;
		if (settings[k].select) {
			settings[k].name = GM_config.get(settings[k].gmConfig);
			settings[k].name = settings[k].name === undefined ? settings[k].default : settings[k].name;
			settings[k].value = settings[k].options.indexOf(settings[k].name);
		} else if (settings[k].extraFormat) {
			settings[k].value = [];
			for (i = 1; i < 5; i++) {
				settings[k].value.push(GM_config.get(settings[k].gmConfig.replace(/%N%/, i)));
				settings[k][i - 1] = settings[k][i - 1] === undefined ? settings[k].default : settings[k][i - 1];
			}
		} else if (settings[k].regex) {
			settings[k].string = GM_config.get(settings[k].gmConfig);
			settings[k].string = settings[k].string === undefined ? settings[k].default : settings[k].string;
			;
			settings[k].pattern = new RegExp(settings[k].string.replace(/^\//, '').replace(/\/[gim]*$/, ''),
											 settings[k].string.replace(/.*\/([gim]*)$/, '$1'));
		} else {
			settings[k].value = GM_config.get(settings[k].gmConfig);
			settings[k].value = settings[k].value === undefined ? settings[k].default : settings[k].value;
		}
	}

	if (settings.preventUpload.value) {
		var uploadBtn = document.getElementById('post')
		uploadBtn.parentNode.appendChild(document.createElement('br'));
		uploadBtn.parentNode.appendChild(document.createElement('br'));
		var uploadBox = document.createElement('input');
		uploadBox.type = 'checkbox';
		uploadBox.checked = location.href.indexOf('upload.php?groupid') < 0 ? true : false;
		uploadBtn.parentNode.appendChild(uploadBox);
		uploadBtn.parentNode.appendChild(document.createTextNode(' Disable if !ptpimg'));

		uploadBtn.addEventListener('click', function(e){
			if (document.getElementById('image').value.indexOf('ptpimg.me') < 0 && uploadBox.checked) e.preventDefault();
		});
	}

	if (settings.hideHeader.value) document.getElementById('header').classList.add('hidden');

	if (settings.hideDNUL.value) {
		var dnul = document.querySelector('h3').parentNode;
		dnul.childNodes[5].innerHTML = '';
		document.getElementById('dnulist').classList.add('hidden');

		var showDNULButton = document.createElement('input');
		showDNULButton.setAttribute('type', 'button');
		showDNULButton.setAttribute('id', 'show_dnul');
		showDNULButton.setAttribute('value', 'Show');
		showDNULButton.setAttribute('title', 'Displays the contents of the Do Not Upload List\nReload the page to rehide it');

		dnul.appendChild(showDNULButton);
		document.getElementById('show_dnul').addEventListener("click", function(){
			document.getElementById('show_dnul').value == 'Hide';
			document.getElementById('dnulist').classList.remove('hidden');
			dnul.removeChild(dnul.lastChild);
		});
	}

	var uploadTable = document.querySelector('div#dynamic_form > table.layout > tbody');

	if (settings.showSettingsButton.value) {
		var settingsTR = document.createElement('tr');
		settingsTR.id = 'settings_tr';

		var settingsLabelTD = document.createElement('td');
		settingsLabelTD.classList.add('label');
		var settingsLabelTDText = document.createTextNode('Clean Upload Page:');
		settingsLabelTD.appendChild(settingsLabelTDText);
		settingsTR.appendChild(settingsLabelTD);

		var settingsButtonTD = document.createElement('td');
		settingsButtonTD.id = 'settings_button';

		var openSettings = document.createElement('input');
		openSettings.setAttribute('type', 'button');
		openSettings.setAttribute('id', 'open_settings');
		openSettings.setAttribute('value', 'Settings');
		openSettings.setAttribute('title', 'Opens the settings for the Clean Upload Page userscript');
		settingsButtonTD.appendChild(openSettings);

		settingsTR.appendChild(settingsButtonTD);

		var originalYearTR = document.getElementById('year_tr');
		uploadTable.insertBefore(settingsTR, originalYearTR);

		document.getElementById('open_settings').addEventListener("click", function(){
			GM_config.open();
		});
	}

	if (settings.hideAnnounce.value) document.querySelector('p > input[readonly=readonly]').parentNode.classList.add('hidden');

	if (settings.hideCategories.value) document.getElementById('categories').parentNode.parentNode.classList.add('hidden');

	var albumTitle = document.getElementById('title');
	albumTitle.setAttribute('size', settings.albumSize.value);
	albumTitle.parentNode.removeChild(document.getElementById('title').parentNode.childNodes[3]);

	if (settings.featToGuestButton.value) {
		var featToGuestButton = document.createElement('input');
		featToGuestButton.type = 'button';
		featToGuestButton.id = 'feat_to_guest';
		featToGuestButton.value = settings.featToGuestText.value;
		featToGuestButton.title = 'Click this button to remove " (feat. artist)" from the Album title field and add a Guest artist.';
		albumTitle.parentNode.appendChild(document.createTextNode(' '));
		albumTitle.parentNode.appendChild(featToGuestButton);

		featToGuestButton.addEventListener('click', function(e) {
			if (!/.+ \(feat\. .+\)/.test(albumTitle.value)) return;
			var guestToAdd = albumTitle.value.replace(/.+ \(feat\. (.+)\)/, '$1');
			albumTitle.value = albumTitle.value.replace(/(.+) \(feat\. .+\)/, '$1');
			document.querySelector('a.brackets.icon_add[onclick^="AddArtistField();"]').click();
			document.querySelector('input[type="text"][name="artists[]"]:last-of-type').value = guestToAdd;
			document.querySelector('select[name="importance[]"]:last-of-type').selectedIndex = 1;
			this.parentNode.removeChild(this);
		});
	}

	var originalYear = document.getElementById('year').parentNode;
	originalYear.removeChild(originalYear.lastChild);

	var releaseType = document.getElementById('releasetype');
	for (i = 0; i < 5; i++) releaseType.parentNode.removeChild(releaseType.parentNode.lastChild);
	releaseType.selectedIndex = location.href.indexOf('groupid=') > -1 ? releaseType.selectedIndex : settings.defaultReleaseType.value;

	var editionYear = document.getElementById('remaster_year');
	editionYear.parentNode.removeChild(editionYear.parentNode.lastChild);

	var editionTitle = document.getElementById('remaster_title');
	for (i = 0; i < 3; i++) editionTitle.parentNode.removeChild(editionTitle.parentNode.lastChild);

	if (settings.subtitleToEditionButton.value) {
		var subtitleToEditionButton = document.createElement('input');
		subtitleToEditionButton.type = 'button';
		subtitleToEditionButton.id = 'subtitle_to_edition';
		subtitleToEditionButton.value = settings.subtitleToEditionText.value;
		subtitleToEditionButton.title = 'Click this button to remove " (subtitle)" from the Album title field and add the subtitle to the Edition title field.';
		albumTitle.parentNode.appendChild(document.createTextNode(' '));
		albumTitle.parentNode.appendChild(subtitleToEditionButton);

		subtitleToEditionButton.addEventListener('click', function(e) {
			if (!/.+ \(.+\)/.test(albumTitle.value)) return;
			var editionTitleToAdd = albumTitle.value.replace(/.+ \((.+)\)/, '$1');
			albumTitle.value = albumTitle.value.replace(/(.+) \(.+\)/, '$1');
			editionTitle.value = editionTitleToAdd;
			this.parentNode.removeChild(this);
		});
	}

	var editionLabel = document.getElementById('remaster_record_label');
	for (i = 0; i < 3; i++) editionLabel.parentNode.removeChild(editionLabel.parentNode.lastChild);

	if (settings.addSelfReleasedButton.value) {
		var selfReleasedButtonClicked = false;
		var selfReleasedButton = document.createElement('input');
		selfReleasedButton.type = 'button';
		selfReleasedButton.id = 'self_released';
		selfReleasedButton.value = settings.selfReleasedText.value;
		selfReleasedButton.title = 'Click this button to replace the Record label field with "' + settings.selfReleasedText.value + '".\nClick it again to revert to the previous text.';
		editionLabel.parentNode.appendChild(document.createTextNode(' '));
		editionLabel.parentNode.appendChild(selfReleasedButton);
		var oldLabelText = '';
		selfReleasedButton.addEventListener('click', function(e) {
			oldLabelText = selfReleasedButtonClicked ? oldLabelText : editionLabel.value;
			editionLabel.value = selfReleasedButtonClicked ? oldLabelText : settings.selfReleasedText.value;
			selfReleasedButtonClicked = selfReleasedButtonClicked ? false : true;
		});
	}

	var editionCatalog = document.getElementById('remaster_catalogue_number');
	for (i = 0; i < 3; i++) editionCatalog.parentNode.removeChild(editionCatalog.parentNode.lastChild);

	document.getElementById('remaster_year').value = settings.defaultEditionYear.value;
	document.getElementById('remaster_record_label').value = settings.defaultEditionLabel.value;
	document.getElementById('remaster_title').setAttribute('size', settings.titleSize.value);
	document.getElementById('remaster_record_label').setAttribute('size', settings.labelSize.value);
	document.getElementById('remaster_catalogue_number').setAttribute('size', settings.catalogSize.value);

	if (settings.showCopyYearButtons.value) {
		var copyEditionToInitialYearButton = document.createElement('input');
		copyEditionToInitialYearButton.setAttribute('type', 'button');
		copyEditionToInitialYearButton.setAttribute('id', 'copy_edition_year');
		copyEditionToInitialYearButton.setAttribute('value', '▼ ' + (settings.copyYearAction.value == 'Copy from' ? 'Copy' : 'Paste'));
		copyEditionToInitialYearButton.setAttribute('title', (settings.copyYearAction.value == 'Copy from' ?
															  'Copies the Edition Year into the Initial Year field' :
															  'Pastes the Initial Year into the Edition Year field'));

		originalYear.appendChild(document.createTextNode(' '));
		originalYear.appendChild(copyEditionToInitialYearButton);
		document.getElementById('copy_edition_year').addEventListener("click", function(){
			if (settings.copyYearAction.value == 'Copy from') {
				var remasterYear = document.getElementById('remaster_year').value;
				document.getElementById('year').value = document.getElementById('remaster_year').value;
			} else {
				var initialYear = document.getElementById('year').value;
				document.getElementById('remaster_year').value = document.getElementById('year').value;
			}
		});

		var copyInitialToEditionYearButton = document.createElement('input');
		copyInitialToEditionYearButton.setAttribute('type', 'button');
		copyInitialToEditionYearButton.setAttribute('id', 'copy_initial_year');
		copyInitialToEditionYearButton.setAttribute('value', '▲ ' + (settings.copyYearAction.value == 'Copy from' ? 'Copy' : 'Paste'));
		copyInitialToEditionYearButton.setAttribute('title', (settings.copyYearAction.value == 'Copy from' ?
															  'Copies the Initial Year into the Edition Year field' :
															  'Pastes the Edition Year into the Initial Year field'));

		editionYear.parentNode.appendChild(document.createTextNode(' '));
		editionYear.parentNode.appendChild(copyInitialToEditionYearButton);
		document.getElementById('copy_initial_year').addEventListener("click", function(){
			if (settings.copyYearAction.value == 'Copy from') {
				var initialYear = document.getElementById('year').value;
				document.getElementById('remaster_year').value = document.getElementById('year').value;
			} else {
				var remasterYear = document.getElementById('remaster_year').value;
				document.getElementById('year').value = document.getElementById('remaster_year').value;
			}
		});
	}

	if (settings.hideScene.value) {
		document.getElementById('scene').parentNode.parentNode.classList.add('hidden');
	} else {
		document.getElementById('scene').parentNode.querySelector('label').classList.add('hidden');
	}

	if (settings.hideTagDropdown.value && !settings.replaceTagDropdownList.value) {
		document.getElementById('genre_tags').classList.add('hidden');
	}

	if (settings.replaceTagDropdownList.value) {
		var tagDropdown = document.getElementById('genre_tags');
		var tagsToRemove = tagDropdown.options.length - 1;
		for (i = tagsToRemove; i--; ) tagDropdown.remove(i + 1)
		var newOptions = [];
		var tagDropdownReplacements = settings.tagDropdownReplacement.value.split('\n');
		for (i = 0; i < tagDropdownReplacements.length; i++) {
			newOptions.push(document.createElement('option'));
			newOptions[i].text = tagDropdownReplacements[i];
			tagDropdown.add(newOptions[i]);
		}
	}
	document.getElementById('tags').setAttribute('size', settings.tagsSize.value);

	var tagPanel = document.getElementById('tags').parentNode;
	for (i = 0; i < 2; i++) {
		tagPanel.removeChild(tagPanel.lastChild);
	}

	document.getElementById('image').setAttribute('size', settings.imageSize.value);

	var albumDescInput = document.getElementById('album_desc');
	albumDescInput.setAttribute('cols', settings.descriptionSize.value);
	albumDescInput.setAttribute('rows', settings.descriptionRows.value);
	var albumDescriptionText = document.getElementById('textarea_wrap_0').parentNode;
	for (i = 0; i < 3; i++) albumDescriptionText.removeChild(albumDescriptionText.lastChild);

	if (settings.addParseFeatRemixerButton.value) {
		var albumDescPreviewEditBtn = document.querySelector('input.button_preview_0');
		var parseFeatRemixerBtn = document.createElement('input');
		parseFeatRemixerBtn.type = 'button';
		parseFeatRemixerBtn.value = 'Parse Guests/Remixers';
		parseFeatRemixerBtn.title = 'Parse the featured (Guest) and Remixer artists from the tracklist in the album description, and add them to the list of Artists.';
		albumDescPreviewEditBtn.parentNode.appendChild(document.createTextNode(' '));
		albumDescPreviewEditBtn.parentNode.appendChild(parseFeatRemixerBtn);
		parseFeatRemixerBtn.addEventListener('click', function(e){
			var artistsAdded = document.querySelectorAll('input[type="text"][name="artists[]"]');
			var artistsAddedRoles = document.querySelectorAll('select[name="importance[]"]');
			var guestsAdded = [];
			var remixersAdded = [];

			for (i = 0, len = artistsAdded.length; i < len; i++) {
				if (artistsAddedRoles[i].selectedIndex == 1) guestsAdded.push(artistsAdded[i].value);
				if (artistsAddedRoles[i].selectedIndex == 5) remixersAdded.push(artistsAdded[i].value);
			}

			var albumDescLines = albumDescInput.value.replace(/\[\/?artist\]/g, '').split('\n');
			var featArtistToAdd, featArtistsToAdd, remixerToAdd;
			var guestsToAdd = [];
			var remixersToAdd = [];
			var parseFeatSplitReplace = settings.parseFeatSplitReplace.value.replace(/^"/gm, '').replace(/"$/gm, '').split('\n');
			var parseRemixerPatternBlacklist = settings.parseRemixerPatternBlacklist.value.toLowerCase().split('\n');

			for (i = 0, len = albumDescLines.length; i < len; i++) {
				if (settings.parseRemixerPattern.pattern.test(albumDescLines[i])) {
					remixerToAdd = albumDescLines[i].replace(settings.parseRemixerPattern.pattern, '$' + settings.parseRemixerPatternGroup.value);
					if (remixersAdded.indexOf(remixerToAdd) == -1 &&
						remixersToAdd.indexOf(remixerToAdd) == -1 &&
						parseRemixerPatternBlacklist.indexOf(remixerToAdd.toLowerCase()) == -1) {
						remixersToAdd.push(remixerToAdd);
						document.querySelector('a.brackets.icon_add[onclick^="AddArtistField();"]').click();
						document.querySelector('input[type="text"][name="artists[]"]:last-of-type').value = remixerToAdd;
						document.querySelector('select[name="importance[]"]:last-of-type').selectedIndex = 5;
					}
				}

				if (settings.parseFeatPattern.pattern.test(albumDescLines[i])) {
					featArtistToAdd = albumDescLines[i].replace(settings.parseFeatPattern.pattern, '$' + settings.parseFeatPatternGroup.value);
					if (featArtistToAdd == remixerToAdd) continue;
					for (j = 0, leng = parseFeatSplitReplace.length; j < leng; j++) {
						featArtistToAdd = featArtistToAdd.replace(new RegExp(parseFeatSplitReplace[j], 'g'), settings.parseFeatSplitString.value);
					}
					featArtistsToAdd = featArtistToAdd.split(settings.parseFeatSplitString.value);
					for (j = 0, leng = featArtistsToAdd.length; j < leng; j++) {
						if (guestsAdded.indexOf(featArtistsToAdd[j]) == -1 &&
							guestsToAdd.indexOf(featArtistsToAdd[j]) == -1) {
							guestsToAdd.push(featArtistsToAdd[j]);
							document.querySelector('a.brackets.icon_add[onclick^="AddArtistField();"]').click();
							document.querySelector('input[type="text"][name="artists[]"]:last-of-type').value = featArtistsToAdd[j];
							document.querySelector('select[name="importance[]"]:last-of-type').selectedIndex = 1;
						}
					}
				}
			}
		});
	}

	var releaseDescInput = document.getElementById('release_desc');
	releaseDescInput.setAttribute('cols', settings.releaseDescriptionSize.value);
	releaseDescInput.setAttribute('rows', settings.releaseDescriptionRows.value);
	releaseDescInput.innerHTML = settings.defaultReleaseDesc.value;
	var releaseDescriptionText = document.getElementById('textarea_wrap_1').parentNode;
	for (i = 0; i < 3; i++) releaseDescriptionText.removeChild(releaseDescriptionText.lastChild);

	var initialYear = document.getElementById('year')
	initialYear.value = location.href.indexOf('groupid=') > -1 ? initialYear.value : settings.defaultYear.value;

	var uploadLogs = document.getElementById('upload_logs');
	var logFields = document.getElementById('logfields');
	for (i = 0; i < 10; i++) logFields.removeChild(logFields.firstChild);

	var format = document.getElementById('format')
	format.value = settings.defaultFormat.value;

	var bitrate = document.getElementById('bitrate');
	bitrate.value = settings.defaultBitrate.value;

	var media = document.getElementById('media');
	media.value = settings.defaultMedia.value;

	if (format.value == 'FLAC' && (media.value == 'CD' || media.value == '---' || media.value == ''))
		uploadLogs.classList.remove('hidden');
	else if (settings.hideLogFiles)
		uploadLogs.classList.add('hidden');

	format.onchange = function(){
		if (!settings.hideLogFiles) return;
		if (format.value !== 'FLAC') {
			uploadLogs.classList.add('hidden');
		} else if (bitrate.value == 'Lossless' && media.value == 'CD') uploadLogs.classList.remove('hidden');
	};

	bitrate.onchange = function(){
		if (!settings.hideLogFiles) return;
		if (bitrate.value !== 'Lossless') {
			uploadLogs.classList.add('hidden');
		} else if (format.value == 'FLAC' && media.value == 'CD') uploadLogs.classList.remove('hidden');
	};

	media.onchange = function(){
		if (!settings.hideLogFiles) return;
		if (media.value !== 'CD') {
			uploadLogs.classList.add('hidden');
		} else if (format.value == 'FLAC' && bitrate.value == 'Lossless') uploadLogs.classList.remove('hidden');
	};

	var extraformatsadded = 0;
	var extraformatsremoved = 0;
	var extraformatvalues = {
		"format": settings.defaultExtraFormats.value,
		"bitrate": settings.defaultExtraFormatBitrates.value,
		"reldesc": settings.defaultExtraFormatRelDescs.value
	};

	var submitButton = document.querySelector('input#post');
	for (i = 0; i < 4; i++) submitButton.parentNode.removeChild(submitButton.previousSibling);

	var footerDiv = document.querySelector('div#footer');

	if (settings.hideFooter.value) for (i = 0, len = footerDiv.childNodes.length; i < len; i++) footerDiv.childNodes[i].innerHTML = '';

	var bottomSpace = [];
	for (i = 0; i < settings.footerPadding.value; i++) {
		bottomSpace.push(document.createElement('br'));
		footerDiv.appendChild(bottomSpace[i]);
	}

	document.querySelector('input#add_format').addEventListener('click', function(){
		extraformatsadded++;
		if (tarsh && !extraformatsremoved) copyDescBtn.classList.remove('hidden');
		var whichformatnumber = extraformatsadded - extraformatsremoved;
		var whichformattype = whichformatnumber + extraformatsremoved - 1;

		if (whichformatnumber > settings.extraFormatDefaults.value - extraformatsremoved) return;

		document.querySelector('select#format_' + whichformatnumber).value = extraformatvalues.format[whichformattype];
		document.querySelector('select#bitrate_' + whichformatnumber).value = extraformatvalues.bitrate[whichformattype];
		document.querySelectorAll('tr#desc_row')[whichformatnumber - 1].firstChild.click();
		document.querySelector('textarea#extra_release_desc_' + whichformatnumber).innerHTML = extraformatvalues.reldesc[whichformattype];
		document.querySelector('textarea#extra_release_desc_' + whichformatnumber).setAttribute('cols', settings.extraFormatSize.value);
		document.querySelector('textarea#extra_release_desc_' + whichformatnumber).setAttribute('rows', settings.extraFormatRows.value);
	});

	document.querySelector('input#remove_format').addEventListener('click', function(){
		extraformatsremoved++;
		if (tarsh && extraformatsremoved >= extraformatsadded) copyDescBtn.classList.add('hidden');
	});

	if (settings.moveYadgToTop.value) {
		var artistTR = document.querySelector('tr#artist_tr');
		setTimeout(function() {
			var yadgTR = document.querySelector('tr.yadg_tr');
			if (yadgTR === null) return;
			artistTR.parentNode.insertBefore(yadgTR, artistTR);
		}, settings.moveYadgToTopDelay.value);
	}

	if (tarsh) {
		var previewDivTwo = document.querySelectorAll('div.preview_submit')[1];
		var copyDescBtn = document.createElement('input');
		copyDescBtn.type = 'button';
		copyDescBtn.value = 'Copy ▲ 24bit';
		copyDescBtn.classList.add('hidden');
		previewDivTwo.appendChild(document.createTextNode('\u00A0'));
		previewDivTwo.appendChild(copyDescBtn);
		copyDescBtn.addEventListener('click', function(e){
			if (extraformatsadded == 0 || extraformatsremoved > 1) return;
			var extraFormatRelDescInput = document.querySelector('textarea#extra_release_desc_1');
			extraFormatRelDescInput.value = extraFormatRelDescInput.value.replace(/(.+)/, releaseDescInput.value.split('FLAC 1.3.2 -8')[0] +
																				  '$1' + releaseDescInput.value.split('FLAC 1.3.2 -8')[1])
		});
	}
})();