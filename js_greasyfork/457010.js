// ==UserScript==
// @name        Annoying Ad blocker
// @description Prevents annoying ads from displaying
// @version     2017.08.59
// @match     *://*.amazon.com/*
// @match     *://*.bing.com/*
// @match     *://*.alltrails.com/*
// @match     *://*.ebay.com/*
// @match     *://*.thepiratebay.org/*
// @match     *://*.youtube.com/*
// @match     *://*.stackoverflow.com/*
// @match     *://*.finance.yahoo.com/*
// @match     *://*.dndbeyond.com/*
// @namespace   https://openuserjs.org/users/nonedude
// @require     http://code.jquery.com/jquery-1.11.1.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457010/Annoying%20Ad%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/457010/Annoying%20Ad%20blocker.meta.js
// ==/UserScript==

String.prototype.contains = function (it) { return this.indexOf(it) !== -1; };

var ssss = location.href;


function dndbeyond()
{
	$(".header-wrapper").remove();
	$("#site-main").css("background-color", "black");
        $("html").css("background-color", "black");
	$("[id^=cookie-consent-banner]").remove();
	$("footer").remove();
}

function thepiratebay()
{
	$("iframe").remove();
}
function amazon()
{
	window.pdagSparkleClientContext = {};
	$("#pdagDesktopSparkleHeadlineContainer").remove();
	$("#sponsoredLinksCsaIframe").remove();
	$("#reports-ads-abuse").remove();
	$("#sponsoredLinksCSA").remove();
	$("#amsSparkleAdWrapper").remove();
	$("#pdagEncapsulated").remove();
	$(".slot__ad").remove();
	$("#adblk_yes").remove();
	$("#adblk_no").remove();
	$("#adblk_unk").remove();

	$("#sponsoredLinksCsaIframe").html("");
	$("#reports-ads-abuse").html("");
	$("#sponsoredLinksCSA").html("");
	$("#amsSparkleAdWrapper").html("");

	$(".s-sponsored-list-header").each(function (index, value)
	{
		$(this).parent().parent().remove();
	});

	$(".s-sponsored-info-icon").each(function (index, value)
	{
		$(this).parent().parent().parent().parent().remove();
	});

	console.log(new Date().getTime());
}

function bing()
{
	$(".b_ad").remove();
}

function ebay()
{
    $(".srp-river-answer").remove();
    $(".x-evo-btf-river").remove();
    $(".x-rx-slot").remove();
    //$(".d-vi-evo-region").remove();
	$("[id^='wrapperDiv_rtm']").remove();
	$("[id^='scandal']").remove();
	$("[id^='rtm-mb']").remove();
	$(".mfe-cards").html("");
	$("[id^='wrapperDiv_rtm']").html("");
	$(".promoted-lv").parent().remove();
	$(".merch-module").remove();
	$(".s-item__title-tag").each(function (index, value)
	{
		$(this).parent().parent().parent().parent().parent().parent().remove();
	});
	
}
function youtube()
{
	//$(".ytd-secondary-search-container-renderer").remove();
	//$("ytd-secondary-search-container-renderer").remove();
	$("#main").remove();

    //$(".yt-mealbar-promo-renderer").remove();
}
function stackoverflow()
{
	$(".js-consent-banner").remove();
}

function yahoo()
{
	$(".YDC-Overlay").remove();
	$("#dropdown-menu").remove();
}

function alltrails()
{
    console.log(new Date().getTime());
	$("#modalPortal").remove();
}






if (ssss.contains("ebay"))
{
	ebay();
	window.setInterval(function ()
	{
		ebay();
	}, 1000);

}
if (ssss.contains("bing"))
{
	bing();
	window.setInterval(function ()
	{
		bing();
	}, 1000);
}

if (ssss.contains("amazon"))
{
	amazon();
	window.setInterval(function ()
	{
		amazon();
	}, 1000);
}

if (ssss.contains("thepiratebay"))
{
	piratebay();
	window.setInterval(function ()
	{
		piratebay();
	}, 1000);
}
if (ssss.contains("youtube"))
{
	youtube();
	window.setInterval(function ()
	{
		youtube();
	}, 1000);
}
if (ssss.contains("stackoverflow"))
{
	stackoverflow();
	window.setInterval(function ()
	{
		stackoverflow();
	}, 1000);
}
if (ssss.contains("yahoo"))
{
	yahoo();
	window.setInterval(function ()
	{
		yahoo();
	}, 1000);
}
if (ssss.contains("dndbeyond"))
{
	dndbeyond();
	window.setInterval(function ()
	{
		dndbeyond();
	}, 1000);
}

if (ssss.contains("alltrails"))
{
	alltrails();
	window.setInterval(function ()
	{
		alltrails();
	}, 1000);
}





