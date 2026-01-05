// ==UserScript==
// @name        JR Christopher R. Chi Website Address
// @namespace   https://greasyfork.org/users/6406
// @version     0.2
// @description A script to with finding website addresses.
// @include     http*://*.mturkcontent.com/dynamic/*
// @include     http*://s3.amazonaws.com/mturk_bulk/*
// @require     http://code.jquery.com/jquery-2.1.4.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22195/JR%20Christopher%20R%20Chi%20Website%20Address.user.js
// @updateURL https://update.greasyfork.org/scripts/22195/JR%20Christopher%20R%20Chi%20Website%20Address.meta.js
// ==/UserScript==


function isHitPage() { return $('div.panel-body:contains("Enter the website address for the following business name")').length; }

$(function() {
	if (isHitPage()) { console.log("found Christopher R. Chi");
		var businessNameNode = $("td:contains('Business name:')").next();
		var businessName = $(businessNameNode).html();
		var citySTateNode = $("td:contains('City/State:')").next();
		var cityState = $(citySTateNode).html().replace(" , NULL","");
		var websiteAddressNode = $("#web_url");
		$(businessNameNode).html("<a href='https://www.bing.com/search?q=" + businessName.replace(" ","+").replace("'","&rsquo;") + "+" + cityState.replace(" ","+") + "' target='_new'>" + businessName + "</a>");
		$(websiteAddressNode).before($("<button>").html("Not Found").click( function(event) { $("#web_url").val("Not Found"); event.stopPropagation(); return false; }));
	}
});
