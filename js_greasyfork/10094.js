// ==UserScript==
// @name        tabtouch.mobi
// @namespace   tabtouch.mobi.override
// @include     https://*tabtouch.mobi/*
// @version     2
// @grant       none
// @description Automatically updates race info every 15 seconds and moves to the next race once the current one has ended.
// @downloadURL https://update.greasyfork.org/scripts/10094/tabtouchmobi.user.js
// @updateURL https://update.greasyfork.org/scripts/10094/tabtouchmobi.meta.js
// ==/UserScript==

function checkHash()
{
	var patt = /#tote\/meetings\/[^\/]*\/[0-9]*/i;
	return patt.test(location.hash);
}

function checkOpen()
{
	var details = $("#race-details");
	return details.length == 1 && !details.hasClass('closed');
}

var previousHash;
var previousOpen = false;

function hashChanged()
{
	if (previousHash != location.hash)
	{
		previousHash = location.hash;
		return true;
	}
	return false;
}

function clickLink(link)
{
    var cancelled = false;

    if (document.createEvent)
		{
        var event = document.createEvent("MouseEvents");
        event.initMouseEvent("click", true, true, window,
            0, 0, 0, 0, 0,
            false, false, false, false,
            0, null);
        cancelled = !link.dispatchEvent(event);
    }
    else if (link.fireEvent)
		{
        cancelled = !link.fireEvent("onclick");
    }

    if (!cancelled)
		{
        window.location = link.href;
    }
}

function autoRefreshInterval()
{
	if (!checkHash()) { return; }

	var newPage = hashChanged();
	var open = checkOpen();
	
	console.log("newPage: " + newPage + " - open: " + open + " - previousOpen: " + previousOpen);
	
	if (open)
	{
		var button = $(".refresh-button");
		if (button.length < 1) { return; }
		clickLink(button[0]);
		//button.click();
	}
	else if (!newPage && previousOpen)
	{
		console.log("Next Page");
		var button = $(".next-race-button");
		if (button.length < 1) { return; }
		clickLink(button[0]);
		//button.click();
	}
	
	previousOpen = open;
}

function autoRefreshInstall(interval)
{
	console.log("Installing Race Refresher (" + (interval / 1000.0) + "sec)");
	
	if (window.intervalVar)
	{
		clearInterval(window.intervalVar);
		window.intervalVar = undefined;
	}
	
	window.intervalVar = setInterval(autoRefreshInterval, interval);
}

autoRefreshInstall(15000);



$('head').append(
	
	"<style id='style_hideScratched'>" +
		"#betting-form #startersfield > li.scratched { display: none !important; }" +
	"</style>" +
	
	"<style id='style_hideSorting'>" +
		".sort-group { display: none !important; }" +
	"</style>"
	
);



function showScratched(bool)
{
	$('#style_hideScratched').prop('disabled', bool);
}

function showSorting(bool)
{
	$('#style_hideSorting').prop('disabled', bool);
}


showScratched(true);
showSorting(true);
