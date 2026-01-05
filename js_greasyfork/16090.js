// ==UserScript==
// @name                deviantART DeviationWatch Load All
// @namespace           bingyuxq
// @version             1.0.2
// @description         Loads all deviations in Inbox DeviantWatch
// @icon                https://i.imgur.com/1KiUR7g.png
// @author              bingyuxq
// @homepageURL         https://gist.github.com/bingyuxq
// @copyright           © 2015 bingyuxq, All Rights Reserved.
// @license             GNU
// @include             http://www.deviantart.com/notifications/*

// @downloadURL https://update.greasyfork.org/scripts/16090/deviantART%20DeviationWatch%20Load%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/16090/deviantART%20DeviationWatch%20Load%20All.meta.js
// ==/UserScript==
var deviationCount = 0;
var gmi = document.getElementById("gmi-ResourceStream");
var table = document.createElement("div");
table.setAttribute("class", "mczone-inner");

document.addEventListener("DOMSubtreeModified", CheckURL, true);


CheckURL();
function CheckURL()
{
	ButtonDiv = document.getElementsByClassName("mcviews")[0];
	gmi = document.getElementById("gmi-ResourceStream");
	if(!gmi)
	{
		gmi = document.getElementById("gmi-ResourceStream");
	}
	else
	{
		if (document.getElementsByClassName("mczone-title").length > 0 && document.URL.includes("http://www.deviantart.com/notifications/"))
		{
			if (!document.getElementById("deviantScriptButton"))
			{
				button = document.createElement("button");
				button.id = "deviantScriptButton";
				button.setAttribute("style", "width: 200px; height: 25px;");
				button.textContent = "Display all Deviations";
				button.onclick = LoadTable;
				//gmi = document.getElementById("bubbleview-messages");
				ButtonDiv.appendChild(button);
				table.innerHTML = "";
				////gmi.parentNode.insertBefore(button, gmi);
				//table.style.height = 0;
			}
		}
		else if (document.getElementById("deviantScriptButton"))
		{
			document.getElementById("deviantScriptButton").parentElement.removeChild(document.getElementById("deviantScriptButton"));
		}
	}
}

function LoadTable()
{
	gmi.parentNode.insertBefore(table, gmi);
	deviationCount = 0;
	pageCount = 0;
    intervalIDCheck = setInterval(CheckIfImagesAreLoaded, 200);
	document.getElementById("deviantScriptButton").onclick = null;
}


function CheckIfImagesAreLoaded()
{
    var nav = document.getElementsByClassName("alink nav2");
    if (nav && nav.length == 1)
    {
        thumbnails = gmi.getElementsByClassName("mcbox ch mcbox-thumb mcbox-thumb-deviation");
        images = gmi.getElementsByTagName("img");
        if (thumbnails.length <= images.length)	//防止载入速度过快图片没通过jQuery读出来就被复制
        {
            GetThumbnails();
            if (!GetNextPage())
			{	
				clearInterval(intervalIDCheck);
				document.getElementsByClassName("f full mczone-footer")[0].remove();
				gmi.remove();
			}
        }
    }
	else
	{
		clearInterval(intervalIDCheck);
	}
}

/*
=========================================================================================================
    Places thumbnail into table
=========================================================================================================*/
function GetThumbnail(thumbnail)
{
        var d = document.createElement("div");
        d.innerHTML = thumbnail.innerHTML.replace(new RegExp("<a ","gm"),"<a target='_blank'");
		d.setAttribute("style", "float: left; clear: none; width: 210px; margin-right: 5px !important;");
        table.appendChild(d);
		UpdateSummaryBar();
}

/*
=========================================================================================================
    Parses through the thumbnails after display deviations button is pressed
=========================================================================================================*/
function GetThumbnails()
{
    var thumbnails = document.querySelectorAll("div.mcbox-thumb-deviation, div.mcbox-thumb-orphaned");
    var errorCount = 0;
    pageCount++;
    for (var i = 0; i < thumbnails.length; i++)
    {
        try
        {
            GetThumbnail(thumbnails[i]);
        }
        catch (err) { errorCount++; console.error(errorCount); }
    }
    if (errorCount > 0) console.error("Failed to add " + errorCount + " thumbnails from page " + pageCount);
}


/*
=========================================================================================================
    Gets next page if any otherwise returns false
=========================================================================================================*/
function GetNextPage()
{
    var next = document.getElementsByClassName("r page");
    if (next.length > 0)
    {
        next = next[0];
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true, document.defaultView, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        next.dispatchEvent(evt);
        return true;
    }
    return false;
}


/*
=========================================================================================================
    Gets deviation count from title div
=========================================================================================================*/
function DeviationsCount()
{
    var titles = document.body.getElementsByClassName("mczone-title");
    for (var i = 0; title = titles[i].textContent, i < titles.length; i++)
    {
        if (title.indexOf("Deviations") > 0)
        {
            return title.replace(",", "").match(/^\d+/)[0];
        }
    }
    return -1;
}


function UpdateSummaryBar()
{
	deviationCount++;
    document.getElementById("deviantScriptButton").textContent = "Got " + deviationCount + " out of " + DeviationsCount();
}