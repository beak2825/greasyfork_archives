// ==UserScript==
// @name        MTurk OCMP67 - Identify Retailer Names in Reviews
// @namespace   http://idlewords.net
// @description %description%
// @include     https://pr1560.crowdcomputingsystems.com/mturk-web/public/HTMLRenderer*
// @version     0.1
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/12314/MTurk%20OCMP67%20-%20Identify%20Retailer%20Names%20in%20Reviews.user.js
// @updateURL https://update.greasyfork.org/scripts/12314/MTurk%20OCMP67%20-%20Identify%20Retailer%20Names%20in%20Reviews.meta.js
// ==/UserScript==

shortcutKey = 83;

j = $.noConflict(true);

j(function() {
	if (j(":contains('Identify Retailer Names in Reviews')").length) {
		j("input[type=radio][value=No]").prop('checked', true);
	}
	j(document).keydown(function(event) {
		if (event.which == shortcutKey && event.ctrlKey) {
			event.preventDefault();
			j("a.submit-btn:contains('Submit')").click();
		}
	});
	j("strong:contains('Comment')").next().removeAttr('data-mce-style').removeAttr('style');
	j("strong:contains('Headline')").next().removeAttr('data-mce-style').removeAttr('style');
});