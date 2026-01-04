// ==UserScript==
// @name        Groenteboer - NL Team Helper
// @namespace   Violentmonkey Scripts
// @match       *://www.opensubtitles.org/*/upload*
// @version     1.1
// @author      Flitskikker
// @description Makkelijker uploaden op de groenteboer voor NL Team.
// @require     http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/392520/Groenteboer%20-%20NL%20Team%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/392520/Groenteboer%20-%20NL%20Team%20Helper.meta.js
// ==/UserScript==
(function() {
	var MESSAGE = "";
	var TRANSLATOR = "";

	// ==================================================

	$('select[name="sublanguageid"]').val("dut"); // Taal: Dutch
	$('select[name="MovieFPS"]').val("23.976"); // FPS: 23.976
	$('textarea[name="SubAutorComment"]').val(MESSAGE); // Comments: MESSAGE hierboven
	$('input:text[name="SubTranslator"]').val(TRANSLATOR); // Translator: TRANSLATOR hierboven
	$('input:checkbox[name="HighDefinition"]').prop("checked", true); // HD aangevinkt

	// ==================================================

	$('input:file[name="subs[]"]').change(function() {
		// Remove older buttons
		$(".js-button-capitalize").remove();
		$(".js-button-reset").remove();
		$(".js-button-lookup").remove();

		// Get filename only
		var fileName = $(this).val().split('\\').pop();

		// Remove extension
		var releaseName = fileName.split('.').slice(0, -1).join('.');

		// Write release name & color
		$('input:text[name="MovieReleaseName"]').val(releaseName);
		$('input:text[name="MovieReleaseName"]').css("color", "#000");

		// Add buttons
		$('input:text[name="MovieReleaseName"]').after('<button type="button" class="js-button-capitalize">CAPiTALiZE</button>');
		$('.js-button-capitalize').after('<button type="button" class="js-button-reset">Reset</button>');
		$('.js-button-reset').after('<button type="button" class="js-button-lookup" onclick="window.open(\'https://rarbg.to/torrents.php?search=' + releaseName + '\');">RARBG lookup</button>');

		// Button functions
		$(".js-button-capitalize").click(function() {
			var replacerLower = function(match, offset, string) {
				return match.toLowerCase();
			}

			var replacerUpper = function(match, offset, string) {
				return match.toUpperCase();
			}

			var capitalize = function(str) {
				return str.toUpperCase().replace(/I/g, "i").replace(/RiP/g, "Rip").replace(/BLURAY/g, "BluRay").replace("-AAF", "-aAF").replace("X26", "x26").replace("-CASSTUDIO", "-CasStudio").replace("-NTB", "-NTb").replace(/(\d{3,4}(p|i))/i, replacerLower).replace(/(S)([0-9]+)(E)([0-9]+)/i, replacerUpper);
			}

			var capitalizedReleaseName = releaseName.split(/[\s\.]+/).map(w => w[0].toUpperCase() + w.substr(1).toLowerCase()).join('.').replace(".Us.", ".US.").replace(".UK.", ".UK.").replace(".Real.", ".REAL.").replace(".Repack.", ".REPACK.").replace(".Proper.", ".PROPER.").replace(".Internal.", ".iNTERNAL.").replace(".Multi.", ".MULTi.").replace(/(S)([0-9]+)(E)([0-9]+)/i, replacerUpper);

			var match = /(S)([0-9]+)(E)([0-9]+)/i.exec(capitalizedReleaseName);
			var match2 = /\d{3,4}(p|i)/i.exec(capitalizedReleaseName);
			if (match2) {
				var releaseNameSuffix = capitalizedReleaseName.substring(match2.index);
				capitalizedReleaseName = capitalizedReleaseName.replace(releaseNameSuffix, capitalize(releaseNameSuffix));
			} else if (match) {
				var releaseNameSuffix = capitalizedReleaseName.substring(match.index);
				capitalizedReleaseName = capitalizedReleaseName.replace(releaseNameSuffix, capitalize(releaseNameSuffix));
			}

			$('input:text[name="MovieReleaseName"]').val(capitalizedReleaseName);
		});

		$(".js-button-reset").click(function() {
			$('input:text[name="MovieReleaseName"]').val(releaseName);
		});
	});
})();