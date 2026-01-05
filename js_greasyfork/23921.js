// ==UserScript==
// @name        Redmine category links
// @namespace   https://github.com/JanisE
// @description Project URL: https://github.com/JanisE/greasemonkey-redmine-category_links
// @include     /redmine.*\..{2,3}\/.*/
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/23921/Redmine%20category%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/23921/Redmine%20category%20links.meta.js
// ==/UserScript==

function exec (fn)
{
	var script = document.createElement('script');
	script.setAttribute("type", "application/javascript");
	script.textContent = '(' + fn + ')();';
	document.body.appendChild(script); // run the script
	document.body.removeChild(script); // clean up
}

exec(function ()
{
	var sCategory = $('.category .value').text();
	var iCategory = false;
	$('#issue_category_id option').each(function ()
	{
		var jqOption = $(this);
		if (jqOption.text() == sCategory) {
			iCategory = jqOption.prop('value');
		}
	});

	if (iCategory) {
		$('a.issues').prop('href');
		$('.category .value')
			.empty()
			.append(
				$('<a></a>')
				.text(sCategory)
				.prop('href', $('a.issues').prop('href') + '?set_filter=1&f[]=category_id&op[category_id]=%3D&v[category_id][]=' + iCategory)
			);
	}
});
