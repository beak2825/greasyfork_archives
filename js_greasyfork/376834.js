// ==UserScript==
// @name         JCJP Practice Settings Save
// @namespace    mog86uk-jcjp-practice-settings-save
// @version      2.20
// @description	 JCJP Practice Settings Save! - Stores your Practice settings offline and automatically loads them each new session.
// @author       mog86uk
// @match        https://japaneseclass.jp/practice
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/376834/JCJP%20Practice%20Settings%20Save.user.js
// @updateURL https://update.greasyfork.org/scripts/376834/JCJP%20Practice%20Settings%20Save.meta.js
// ==/UserScript==

(function() {
	var jQuery = window.jQuery;

	jQuery(document).ready(function($) {
		var $settingsBox = '',
			$saveButton = '',
			$settingsButton = '',
			$panicButton = '',
			panicButtonClicked = false,
			practiceSettings = [],
			savedSettingsStr = '',
			savedSettings = [],
			i = 0;

		$settingsBox = $('div#settings_box');

		$saveButton = $('button#save_settings_button');
		$saveButton.click(function() {
			if (panicButtonClicked) {
				panicButtonClicked = false;
				return;
			}

			var storedValStr = '',
				storedVal = [],
				practiceSettingChecked = 0;

			for (i = 0; i < practiceSettings.length; i++) {
				if ($('input#' + practiceSettings[i]).length > 0) {
					practiceSettingChecked = $('input#' + practiceSettings[i]).attr('checked');
					storedVal[i] = practiceSettingChecked ? 1 : 0;
				}
				else {
					storedVal[i] = 2;
				}
			}

			storedValStr = storedVal.join('');
			localStorage.setItem('Mog_SavedPracticeSettings', storedValStr);
		});

		$settingsButton = $('button#settings_button');
		$settingsButton.after('<button id="mog_panic_button" class="header-btn pull-right">パニック</button>');

		$panicButton = $('button#mog_panic_button');
		$panicButton.click(function() {
			panicButtonClicked = true;

			// Fix for display issue that occurs sometimes when the user clicks the Settings button.
			$settingsBox.css('display', 'block');

			$saveButton.click();
		});

		practiceSettings = $('div#test_settings_box > input').map(function() {
			return $(this).attr('id');
		}).get();

		savedSettingsStr = localStorage.getItem('Mog_SavedPracticeSettings');

		if (savedSettingsStr !== null) {
			if (savedSettingsStr.length == practiceSettings.length) {
				savedSettings = savedSettingsStr.split('');

				for (i = 0; i < savedSettings.length; i++) {
					if (savedSettings[i] === '0') {
						$('input#' + practiceSettings[i]).removeAttr('checked');
						$('a#fake' + practiceSettings[i]).attr('class', 'fakecheck');
					}
				}
			}

			$saveButton.click();

			// Fix for display issue that occurs sometimes when the user clicks the Settings button.
			$settingsBox.css('display', 'block');
		}
	});
})();