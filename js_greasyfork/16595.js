// ==UserScript==
// @name        OSU Paste 365
// @name:zh-CN  OSU Paste 365
// @license     MIT License
// @version     4
// @namespace   dev.renoseven.net/scripts/osu-paste-365
// @homepageURL https://github.com/renoseven/OSU-Paste-365/
// @author      RenoSeven
// @description Allows cut, copy, paste and drop in OSU Write 365.
// @description:zh-cn 解除OSU Write 365中剪切，复制，粘贴以及拖拽限制。
// @grant       none
// @include     http://write365.tac.oregonstate.edu/node/add/writing365
// @include     http://write365.tac.oregonstate.edu/node/*/edit
// @downloadURL https://update.greasyfork.org/scripts/16595/OSU%20Paste%20365.user.js
// @updateURL https://update.greasyfork.org/scripts/16595/OSU%20Paste%20365.meta.js
// ==/UserScript==
(function($) {
	$(document).ready(function() {
		var journal_area = $('#edit-body-und-0-value');
		journal_area.unbind('blur focus click keyup keypress change copy paste cut drop');
		var wpm = Math.round(40 + Math.random() * 40, 0);
		$('[name="hidden_words_per_minute"]').val(wpm);
		journal_area.bind('keyup', function() {
			var total_words = Drupal.behaviors.writing365Wordcounter.str_word_count(journal_area.val());
			$('#wordcount').text(total_words);
			$('[name="hidden_wordcount"]').val(total_words);
			var total_time = (total_words / wpm) * 60 * 1000 + $.now() - $.now();
			$('[name="hidden_time_start"]').val($.now() - total_time);
			$('[name="hidden_time_writing"]').val((total_time / 1000).toFixed(3));
		});
		journal_area.bind('blur focus', function() {
			$(this).keyup();
		});
		journal_area.bind('blur change click keyup', function() {
			$(this).trigger('formUpdated');
		});
		console.log('[OSU Paste 365] Enjoy your happy time!');
	});
})(jQuery);