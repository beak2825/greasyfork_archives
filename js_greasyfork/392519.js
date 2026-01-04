// ==UserScript==
// @name        Melkboer - NL Team Helper
// @namespace   Violentmonkey Scripts
// @match       *://www.addic7ed.com/newversion.php
// @match       *://www.addic7ed.com/newsub.php
// @version     1.1
// @author      Flitskikker
// @description Makkelijker uploaden op de melkboer voor NL Team.
// @require     http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/392519/Melkboer%20-%20NL%20Team%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/392519/Melkboer%20-%20NL%20Team%20Helper.meta.js
// ==/UserScript==
(function() {
	var MESSAGE = "Vertaling: ";

	// ==================================================

	$('#lang').val("17"); // Taal: Dutch
	$('#friend').val("67"); // Team: NL Team
	$('textarea[name="comment"]').val(MESSAGE); // Comments: MESSAGE hierboven
	$('input:checkbox[name="corrected"]').prop("checked", true); // Corrected aangevinkt
	$('input:checkbox[name="is_HD"]').prop("checked", true); // 720/1080 aangevinkt

	// ==================================================

	$('input:file[name="file"]').change(function() {
		var versionNames = [];
		var versionNameIndex = 0;

		// Write version function
		var createVersionName = function() {
			return ((tags ? tags.join(".") + "." : "") + versionName);
		};

		var createVersionNameDash = function() {
			return ((tags ? tags.join(".") + "-" : "") + versionName);
		};

		var replacerLower = function(match, offset, string) {
			return match.toLowerCase();
		}

		var replacerUpper = function(match, offset, string) {
			return match.toUpperCase();
		}

		var capitalize = function(str) {
			return str.toUpperCase().replace(/I/g, "i").replace(/RIP/g, "Rip").replace(/BLURAY/g, "BluRay").replace(/AAF/g, "aAF").replace(/X26/g, "x26").replace(/CASSTUDIO/g, "CasStudio").replace(/NTB/g, "NTb").replace(/(\d{3,4}(p|i))/i, replacerLower).replace(/(S)([0-9]+)(E)([0-9]+)/i, replacerUpper);
		}

		var writeVersion = function() {
			if (versionNameIndex < versionNames.length) {
				$('input:text[name="version"]').val(versionNames[versionNameIndex]);
				versionNameIndex++;
			}
		};

		// Remove older buttons
		$(".js-button-expand").remove();
		$(".js-button-reset").remove();
		$(".js-button-capitalize").remove();
		$(".js-button-lookup").remove();
		$(".js-button-make-retail").remove();

		// Get filename only
		var fileName = $(this).val().split('\\').pop();

		// Remove extension
		var releaseName = fileName.split('.').slice(0, -1).join('.');

		// Add release name
		var versionName = releaseName;
		versionNames.unshift(createVersionName());

		console.log(versionName);

		// Save tags
		var tagsRegex = /REAL[\.\s]PROPER|PROPER|REAL[\.\s]REPACK|REPACK/i;
		var tags = releaseName.match(tagsRegex);

		console.log(tags);

		// Remove tags
		var match = tagsRegex.exec(versionName);
		if (match) {
			versionName = versionName.substring(match.index + match[0].length + 1);
		}

		console.log(versionName);

		// Remove encoding and audio crap
		var match = /AVC\.|[xh][\.\s]?(264|265)|AAC2[\.\s]0|AAC\.|AC3\.|DTS\.|DTS-HD|DD2[\.\s]0|DDP2[\.\s]0|DD5[\.\s]1|DDP5[\.\s]1/i.exec(versionName);
		if (match) {
			versionName = versionName.replace(versionName.substring(match.index - 1, versionName.lastIndexOf("-")), "");
		}

		console.log(versionName);

		// Remove episode
		var match = /(S)([0-9]+)(E)([0-9]+)/i.exec(versionName);
		if (match) {
			versionName = versionName.substring(match.index + match[0].length + 1);
		}

		console.log(versionName);

		// Before resolution
		match = /\d{3,4}(p|i)/i.exec(versionName);
		if (match) {
			versionName = versionName.substring(match.index);
		}

		console.log(versionName);

		versionNames.unshift(createVersionName());

		// Remove resolution
		match = /\d{3,4}(p|i)/i.exec(versionName);
		if (match) {
			versionName = versionName.substring(match.index + match[0].length + 1);
		}

		console.log(versionName);

		versionNames.unshift(createVersionName());

		console.log(versionName);

		// Remove source
		var match = /(AMZN|iT|STAR|AUDC|NF|HULU|DISC|CRKL)\\./i.exec(versionName);
		if (match) {
			versionName = versionName.substring(match.index + match[0].length);
		}

		console.log(versionName);

		versionNames.unshift(createVersionName());

		// Remove type
		var match = /(CAM|TS(?!C)|TELESYNC|(DVD|BD)SCR|SCR|DDC|R5[\.\s]LINE|R5|(DVD|HD|BR|BD|WEB)Rip|DVDR|(HD|PD)TV|WEB-DL|WEBDL|BluRay)\\./i.exec(versionName);
		if (match) {
			versionName = versionName.substring(match.index + match[0].length);
		}

		console.log(versionName);

		versionNames.unshift(createVersionName());

		// Only group
		versionName = versionName.split('-').pop();

		console.log(versionName);

		versionNames.unshift(createVersionNameDash());

		// Remove duplicates
		versionNames = [...new Set(versionNames)];

		console.log(versionNames);

		// Write version
		writeVersion();

		// Add buttons
		$('input:text[name="version"]').after('<button type="button" class="js-button-expand">Expand</button>');
		$('.js-button-expand').after('<button type="button" class="js-button-reset">Reset</button>');
		$('.js-button-reset').after('<button type="button" class="js-button-capitalize">CAPiTALiZE</button>');
		$('.js-button-capitalize').after('<button type="button" class="js-button-lookup" onclick="window.open(\'https://rarbg.to/torrents.php?search=' + releaseName + '\');">RARBG lookup</button>');
		$('.js-button-lookup').after('<button type="button" class="js-button-make-retail">Make retail</button>');

		// Button functions
		$(".js-button-expand").click(function() {
			writeVersion();
		});

		$(".js-button-reset").click(function() {
			versionNameIndex = 0;
			writeVersion();
		});

		$(".js-button-make-retail").click(function() {
			if (!$('input:text[name="version"]').val().includes("(RETAIL)")) {
				$('input:text[name="version"]').val($('input:text[name="version"]').val() + "(RETAIL)");
			}
		});

		$(".js-button-capitalize").click(function() {
			$('input:text[name="version"]').val(capitalize($('input:text[name="version"]').val()));
		});
	});
})();