// ==UserScript==
// @name        Convert HTML select to Select2
// @namespace   HTML Combobox to Select2
// @description It's often hard to select data from combobox where it has huge data. This script will make easy to use comboxbox(select tag)
// @include     *
// @version     1
// @grant       none
// @require		https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require		https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.full.js
// @downloadURL https://update.greasyfork.org/scripts/32265/Convert%20HTML%20select%20to%20Select2.user.js
// @updateURL https://update.greasyfork.org/scripts/32265/Convert%20HTML%20select%20to%20Select2.meta.js
// ==/UserScript==

$(function()
{
	$("body").append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.css" integrity="sha256-xqxV4FDj5tslOz6MV13pdnXgf63lJwViadn//ciKmIs=" crossorigin="anonymous" />');
	setTimeout(function()
	{
		$("select").each(function()
		{
			$(this).select2();
		});
	},1000);
});