// diediedead.user.js
//
// Written by: Michael Devore
// Released to the public domain
//
// This is a Greasemonkey script.
// See http://www.greasespot.net/ for more information on Greasemonkey.
//
// ==UserScript==
// @name			diediedead
// @namespace		http://www.devoresoftware.com/gm/dddead
// @description		killfile script, re-rebooted
// @match			https://*.metafilter.com/*
// @match			http://*.metafilter.com/*
// @grant GM_addStyle
// @grant GM_registerMenuCommand
// @grant GM_setValue 
// @grant GM_getValue 
// @run-at document-start
// @version 3.4
// @downloadURL https://update.greasyfork.org/scripts/5438/diediedead.user.js
// @updateURL https://update.greasyfork.org/scripts/5438/diediedead.meta.js
// ==/UserScript==
//

"use strict";
 
GM_addStyle('body{display:none;}');
GM_addStyle('#div_configureBox{\
	position: fixed;\
	left: 50%;\
	margin-left: -11em;\
//	top: 5px;\
	bottom: 5px;\
	color: black;\
	background-color: white;\
	border: 2px green solid;\
	padding: 2px;\
	opacity: 0.95;\
}');
GM_addStyle('.textarea_configureBox{\
	width: 20em;\
	height: 5.34em;\
	margin-left: 5px;\
	margin-right: 5px;\
	border: 2px black solid;\
	color: black;\
	background-color: white;\
	white-space: pre;\
	word-wrap: normal;\
	overflow-x: scroll;\
}');
GM_addStyle('.header_configureBox{\
	text-align: center;\
}');
GM_addStyle('.button_configureBox{\
	display:block;\
	margin: 0 auto;\
}');

var filterActionEnum =
{
	NONE:				"none",
	POSTSANDCOMMENTS:	"postsandcomments",
	POSTSONLY:			"postsonly",
	COMMENTSONLY:		"commentsonly"
};
Object.freeze(filterActionEnum);
var filterAction = filterActionEnum.POSTSANDCOMMENTS;
var noActiveSelectionText = "<no active selection>";
var showAllContextText = "Show all content";
var filterPostsAndComments = "Filter posts & comments";
var filterPostsOnly = "Filter posts only";
var filterCommentsOnly = "Filter comments only";
var configureFilters = "Configure filters";
var filterForUser = "Filter for user ";
var filterForText = "Filter for text ";
var filterForSite = "Filter for site ";
var noneText = "none";
var blockText = "block";

var userFilters = new Array();
var textFilters = new Array();
var siteFilters = new Array();

function onLoaded()
{
	buildContextMenu();
	buildConfigureBox();
	loadConfiguration();
	performFiltering();
	GM_addStyle('body{display:block;}');
}

function contextClick(e)
{
	var menuitem = e.target;
	var label = menuitem.label;
	if (label == configureFilters)
	{
		showConfigure();
		return;
	}

	var reload = false;
	if (label == showAllContextText)
	{
		filterAction = filterActionEnum.NONE;
		GM_setValue("filterAction", showAllContextText);
		var menuitem = $("#show_all_content");
		menuitem.checked = true;
		reload = true;
	}
	else if (label == filterPostsAndComments)
	{
		filterAction = filterActionEnum.POSTSANDCOMMENTS;
		GM_setValue("filterAction", filterPostsAndComments);
		menuitem = $("#filter_posts_and_comments");
		menuitem.checked = true;
		reload = true;
	}
	else if (label == filterPostsOnly)
	{
		filterAction = filterActionEnum.POSTSONLY;
		GM_setValue("filterAction", filterPostsOnly);
		menuitem = $("#filter_posts_only");
		menuitem.checked = true;
		reload = true;
	}
	else if (label == filterCommentsOnly)
	{
		filterAction = filterActionEnum.COMMENTSONLY;
		GM_setValue("filterAction", filterCommentsOnly);
		menuitem = $("#filter_comments_only");
		menuitem.checked = true;
		reload = true;
	}

	if (!reload)
	{
		var workString = label.slice(0, filterForUser.length);
		if (workString == filterForUser)
		{
			workString = label.slice(filterForUser.length)
			addUserToFilter(workString);
			var tempString = GM_getValue("filteredUsers", "");
			if (tempString.length > 0)
			{
				tempString += ",";
			}
			workString.trim();
			tempString += encodeURIComponent(workString);
			GM_setValue("filteredUsers", tempString);
			reload = true;
		}
	}

	if (!reload)
	{
		workString = label.slice(0, filterForText.length);
		if (workString == filterForText)
		{
			workString = label.slice(filterForText.length)
			addTextToFilter(workString);
			var tempString = GM_getValue("filteredText", "");
			if (tempString.length > 0)
			{
				tempString += ",";
			}
			workString.trim();
			tempString += encodeURIComponent(workString);
			GM_setValue("filteredText", tempString);
			reload = true;
		}
	}
	if (!reload)
	{
		workString = label.slice(0, filterForSite.length);
		if (workString == filterForSite)
		{
			workString = label.slice(filterForSite.length)
			addSiteToFilter(workString);
			var tempString = GM_getValue("filteredSites", "");
			if (tempString.length > 0)
			{
				tempString += ",";
			}
			workString.trim();
			tempString += encodeURIComponent(workString);
			GM_setValue("filteredSites", tempString);
			reload = true;
		}
	}

	if (reload)
	{
		location.reload();
		return;
	}
}

function addUserToFilter(user)
{
	userFilters.push(user);
}

function addTextToFilter(text)
{
	textFilters.push(text);
}

function addSiteToFilter(site)
{
	siteFilters.push(site);
}

function loadConfiguration()
{
	var workString = GM_getValue("filteredUsers", "");
	if (workString.length > 0)
	{
		var workArray = workString.split(',');
		userFilters = [];
		for (var loop = 0; loop < workArray.length; loop++)
		{
			userFilters.push(decodeURIComponent(workArray[loop]));
		}
		var userFiltersString = userFilters.join("\n");
		var textArea = $("#userTextArea");
		textArea.value = userFiltersString;
	}

	workString = GM_getValue("filteredText", "");
	if (workString.length > 0)
	{
		var workArray = workString.split(',');
		textFilters = [];
		for (var loop = 0; loop < workArray.length; loop++)
		{
			textFilters.push(decodeURIComponent(workArray[loop]));
		}
		var textFiltersString = textFilters.join("\n");
		var textArea = $("#contentTextArea");
		textArea.value = textFiltersString;
	}

	workString = GM_getValue("filteredSites", "");
	if (workString.length > 0)
	{
		var workArray = workString.split(',');
		siteFilters = [];
		for (var loop = 0; loop < workArray.length; loop++)
		{
			siteFilters.push(decodeURIComponent(workArray[loop]));
		}
		var siteFiltersString = siteFilters.join("\n");
		var textArea = $("#siteTextArea");
		textArea.value = siteFiltersString;
	}

	var menuitem = $("#show_all_content");
	menuitem.checked = false;
	menuitem = $("#filter_posts_only");
	menuitem.checked = false;
	menuitem = $("#filter_comments_only");
	menuitem.checked = false;
	menuitem = $("#filter_posts_and_comments");
	menuitem.checked = false;

	workString = GM_getValue("filterAction", filterPostsAndComments);
	if (workString == showAllContextText)
	{
		menuitem = $("#show_all_content");
		menuitem.checked = true;
		filterAction = filterActionEnum.NONE;
	}
	else if (workString == filterPostsOnly)
	{
		menuitem = $("#filter_posts_only");
		menuitem.checked = true;
		filterAction = filterActionEnum.POSTSONLY;
	}
	else if (workString == filterCommentsOnly)
	{
		menuitem = $("#filter_comments_only");
		menuitem.checked = true;
		filterAction = filterActionEnum.COMMENTSONLY;
	}
	else
	{
		menuitem = $("#filter_posts_and_comments");
		menuitem.checked = true;
		filterAction = filterActionEnum.POSTSANDCOMMENTS;
	}

	var radio = $("#radio_ShowAll");
	if (filterAction == filterActionEnum.NONE)
	{
		radio.checked = true;
	}
	else
	{
		radio.checked = false;
	}
	radio = $("#radio_CommentsAndPosts");
	if (filterAction == filterActionEnum.POSTSANDCOMMENTS)
	{
		radio.checked = true;
	}
	else
	{
		radio.checked = false;
	}
	radio = $("#radio_PostsOnly");
	if (filterAction == filterActionEnum.POSTSONLY)
	{
		radio.checked = true;
	}
	else
	{
		radio.checked = false;
	}
	radio = $("#radio_CommentsOnly");
	if (filterAction == filterActionEnum.COMMENTSONLY)
	{
		radio.checked = true;
	}
	else
	{
		radio.checked = false;
	}
}

function saveConfiguration()
{
	var div = $("#div_configureBox");
	div.style.display = noneText;

	var textArea = $("#userTextArea");
	var text;
	if (!textArea || !textArea.value)
	{
		text = "";
	}
	else
	{
		text = textArea.value.trim();
	}
	var userFiltersArray = text.split("\n");

	textArea = $("#contentTextArea");
	if (!textArea || !textArea.value)
	{
		text = "";
	}
	else
	{
		text = textArea.value.trim();
	}
	var textFiltersArray = text.split("\n");

	textArea = $("#siteTextArea");
	if (!textArea || !textArea.value)
	{
		text = "";
	}
	else
	{
		text = textArea.value.trim();
	}
	var siteFiltersArray = text.split("\n");

	userFilters = [];
	var tempArray = [];
	for (var loop = 0; loop < userFiltersArray.length; loop++)
	{
		userFilters.push(userFiltersArray[loop]);
		tempArray.push(encodeURIComponent(userFiltersArray[loop]));
	}
	var tempString = tempArray.join(",");
	GM_setValue("filteredUsers", tempString);

	textFilters = [];
	tempArray = [];
	for (var loop = 0; loop < textFiltersArray.length; loop++)
	{
		textFilters.push(textFiltersArray[loop]);
		tempArray.push(encodeURIComponent(textFiltersArray[loop]));
	}
	var tempString = tempArray.join(",");
	GM_setValue("filteredText", tempString);

	siteFilters = [];
	tempArray = [];
	for (var loop = 0; loop < siteFiltersArray.length; loop++)
	{
		siteFilters.push(siteFiltersArray[loop]);
		tempArray.push(encodeURIComponent(siteFiltersArray[loop]));
	}
	var tempString = tempArray.join(",");
	GM_setValue("filteredSites", tempString);

	var menuitem1 = $("#radio_ShowAll");
	var menuitem2 = $("#radio_PostsOnly");
	var menuitem3 = $("#radio_CommentsOnly");
	if (menuitem1.checked)
	{
		filterAction = filterActionEnum.NONE;
		GM_setValue("filterAction", showAllContextText);
	}
	else if (menuitem2.checked)
	{
		filterAction = filterActionEnum.POSTSONLY;
		GM_setValue("filterAction", filterPostsOnly);
	}
	else if (menuitem3.checked)
	{
		filterAction = filterActionEnum.COMMENTSONLY;
		GM_setValue("filterAction", filterCommentsOnly);
	}
	else
	{
		filterAction = filterActionEnum.POSTSANDCOMMENTS;
		GM_setValue("filterAction", filterPostsAndComments);
	}
	location.reload();
}

function performFiltering()
{
	if (filterAction == filterActionEnum.NONE)
	{
		// don't filter
		return;
	}
	if (userFilters.length < 1 && textFilters.length < 1 && siteFilters.length < 1)
	{
		// no filters
		return;
	}

//	var xpath = "//DIV/SPAN[starts-with(text(),'posted by') and (@class='smallcopy' or @class='smallcopy byline')]";
	var xpath = "//DIV/SPAN[starts-with(text(),'posted by') and contains(@class, 'smallcopy')]";
	var postNodes = document.evaluate(
		xpath,
		document,
		null,
		XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
		null
	);
	var total = postNodes.snapshotLength;
	for (var i = 0; i < total; i++)
	{
		// not much validation here, cuts performance overhead by avoiding extra tests against the nodes
		// tighten it down later if it conflicts with other add-ons or Metafilter bling
		var userSpan = postNodes.snapshotItem(i);
		var copyDiv = userSpan.parentNode;
		var titleDiv = copyDiv.previousSibling.previousSibling;
		// music uses H1 instead of DIV, whatever
		if (titleDiv.nodeName != "DIV" && titleDiv.nodeName != "H1" && titleDiv.nodeName != "H2")
		{
			titleDiv = null;
		}
		if (!titleDiv && filterAction == filterActionEnum.POSTSONLY)
		{
			// not a post (assumed comment), and only filtering posts
			continue;
		}
		if (titleDiv && filterAction == filterActionEnum.COMMENTSONLY)
		{
			// post, and only filtering comments
			continue;
		}
		var currentNode = userSpan.firstChild;
		var found = false;
		var userName;
		while (currentNode && !found)
		{
			if (currentNode.nodeName === "A")
			{
				var href_value = currentNode.getAttribute('href');
				if (href_value.match(/\/user\/\d/))
				{
					var childNode = currentNode.firstChild;
					while (childNode)
					{
						if (childNode.nodeName === '#text')
						{
							userName = childNode.nodeValue;
							found = true;
							break;
						}
						childNode = childNode.nextSibling;
					}
				}
			}
			currentNode = currentNode.nextSibling;
		}
		if (!userName)
		{
			// even if we're not filtering by user name, if there isn't one associated with a post, it's not a good target
			continue;
		}

		var postHidden = false;
		// check user name, applies to posts and comments
		for (var j = 0; j < userFilters.length; j++)
		{
			if (userName == userFilters[j])
			{
				postHidden = true;
				break;
			}
		}

		if (filterAction == filterActionEnum.POSTSONLY || (filterAction == filterActionEnum.POSTSANDCOMMENTS && titleDiv)) 
		{
			// we know this is a post title, not a comment, and it should be subject to filtering
			// check for link
			currentNode = titleDiv.firstChild;
			found = false;
			var link = null;
			while (currentNode && !found)
			{
				if (currentNode.nodeName === "A")
				{
					link = currentNode.getAttribute('href');
					found = true;
					break;
				}
				currentNode = currentNode.nextSibling;
			}
			for (var j = 0; link && j < siteFilters.length; j++)
			{
				var sitePattern = new RegExp("^(https?://)?"+siteFilters[j]);
				if (link.match(sitePattern))
				{
					postHidden = true;
					break;
				}
			}
			if (!postHidden)
			{
				// check for text
				var text = titleDiv.textContent;
				for (var j = 0; j < textFilters.length; j++)
				{
					var textPattern = new RegExp("\\b"+textFilters[j]+"\\b","i");
					if (text.match(textPattern))
					{
						postHidden = true;
						break;
					}
				}
			}
		}

		if (!postHidden && (filterAction == filterActionEnum.COMMENTSONLY || filterAction == filterActionEnum.POSTSANDCOMMENTS))
		{
			// this is a comment or post copy and it should be subject to filtering
			// check for matching links
			currentNode = copyDiv.firstChild;
			var link = null;
			while (currentNode)
			{
				if (currentNode.nodeName === "A")
				{
					link = currentNode.getAttribute('href');
					for (var j = 0; link && j < siteFilters.length; j++)
					{
						var sitePattern = new RegExp("^(https?://)?"+siteFilters[j]);
						if (link.match(sitePattern))
						{
							postHidden = true;
							break;
						}
					}
				}
				currentNode = currentNode.nextSibling;
			}
			if (!postHidden)
			{
				// check for text
				var text = copyDiv.textContent;
				for (var j = 0; j < textFilters.length; j++)
				{
					var textPattern = new RegExp("\\b"+textFilters[j]+"\\b","i");
					if (text.match(textPattern))
					{
						postHidden = true;
						break;
					}
				}
			}
		}
		if (postHidden)
		{
			if (titleDiv)
			{
				titleDiv.style.display = noneText;
			}
			copyDiv.style.display = noneText;

			// try and squash the trailing BR, or 2
			var sibling = copyDiv.nextSibling;
			while (sibling)
			{
				if (sibling.nodeName === 'BR')
				{
					// found it
					sibling.style.display = noneText;
				}
				else if (sibling.nodeName !== '#text')
				{
					// apparently shot past the post/comment entry, bail
					break;
				}
				sibling = sibling.nextSibling;
			}
		}
	}
}

function buildContextMenu()
{
	var menu = document.body.appendChild(document.createElement("menu"));
	menu.outerHTML =	'<menu id="userscript-context-menu" type="context">\
							<menu label="diediedead!">\
								<menuitem id="filter_user_or_content" label="'+noActiveSelectionText+'">\
								</menuitem>\
								<menuitem label="\u2014">\
								</menuitem>\
								<menuitem id="show_all_content" type="checkbox" label="'+showAllContextText+'">\
								</menuitem>\
								<menuitem id="filter_posts_and_comments" type="checkbox" label="'+filterPostsAndComments+'">\
								</menuitem>\
								<menuitem id="filter_posts_only" type="checkbox" label="'+filterPostsOnly+'">\
								</menuitem>\
								<menuitem id="filter_comments_only" type="checkbox" label="'+filterCommentsOnly+'">\
								</menuitem>\
								<menuitem label="\u2014">\
								</menuitem>\
								<menuitem id="configure_filters" label="'+configureFilters+'">\
								</menuitem>\
							</menu>\
						 </menu>';

	var html = document.documentElement;
	html.setAttribute("contextmenu", "userscript-context-menu");
	if ("contextMenu" in html && "HTMLMenuItemElement" in window)
	{
	  $("#userscript-context-menu menu").addEventListener("click", contextClick, false);
	  html.addEventListener("contextmenu", initMenu, false);
	}
}

function buildConfigureBox()
{
	var mainDiv = document.createElement('div');
	mainDiv.id = "div_configureBox";
	var userTextArea = document.createElement('textarea');
	userTextArea.id = "userTextArea";
	userTextArea.className = "textarea_configureBox";
	var contentTextArea = document.createElement('textarea');
	contentTextArea.id = "contentTextArea";
	contentTextArea.className = "textarea_configureBox";
	var siteTextArea = document.createElement('textarea');
	siteTextArea.id = "siteTextArea";
	siteTextArea.className = "textarea_configureBox";

	var h2 = document.createElement('h2');
	h2.className = "header_configureBox";
	h2.appendChild(document.createTextNode('Configure diediedead'));
	mainDiv.appendChild(h2);

	mainDiv.appendChild(document.createTextNode('Filter users (one per line)'));
	mainDiv.appendChild(document.createElement('br'));
	mainDiv.appendChild(userTextArea);
	mainDiv.appendChild(document.createElement('br'));
	mainDiv.appendChild(document.createElement('br'));
	mainDiv.appendChild(document.createTextNode('Filter if contains text (1 entry/line)'));
	mainDiv.appendChild(document.createElement('br'));
	mainDiv.appendChild(contentTextArea);
	mainDiv.appendChild(document.createElement('br'));
	mainDiv.appendChild(document.createElement('br'));
	mainDiv.appendChild(document.createTextNode('Filter if contains site (1 site/line)'));
	mainDiv.appendChild(document.createElement('br'));
	mainDiv.appendChild(siteTextArea);
	mainDiv.appendChild(document.createElement('br'));

	var radio = document.createElement("input");
	radio.id = "radio_ShowAll";
	radio.type = "radio";
	radio.name = "showWhich";
	if (filterAction == filterActionEnum.NONE)
	{
		radio.checked = true;
	}
	mainDiv.appendChild(document.createElement('br'));
	mainDiv.appendChild(radio);
	mainDiv.appendChild(document.createTextNode(showAllContextText));

	radio = document.createElement("input");
	radio.id = "radio_CommentsAndPosts";
	radio.type = "radio";
	radio.name = "showWhich";
	if (filterAction == filterActionEnum.POSTSANDCOMMENTS)
	{
		radio.checked = true;
	}
	mainDiv.appendChild(document.createElement('br'));
	mainDiv.appendChild(radio);
	mainDiv.appendChild(document.createTextNode(filterPostsAndComments));

	radio = document.createElement("input");
	radio.id = "radio_PostsOnly";
	radio.type = "radio";
	radio.name = "showWhich";
	if (filterAction == filterActionEnum.POSTSONLY)
	{
		radio.checked = true;
	}
	mainDiv.appendChild(document.createElement('br'));
	mainDiv.appendChild(radio);
	mainDiv.appendChild(document.createTextNode(filterPostsOnly));

	radio = document.createElement("input");
	radio.id = "radio_CommentsOnly";
	radio.type = "radio";
	radio.name = "showWhich";
	if (filterAction == filterActionEnum.COMMENTSONLY)
	{
		radio.checked = true;
	}
	mainDiv.appendChild(document.createElement('br'));
	mainDiv.appendChild(radio);
	mainDiv.appendChild(document.createTextNode(filterCommentsOnly));
	mainDiv.appendChild(document.createElement('br'));

	mainDiv.appendChild(document.createElement('br'));
	var saveNode = document.createElement("button");
	saveNode.appendChild(document.createTextNode("Save"));
	saveNode.className = "button_configureBox";
	saveNode.addEventListener("click", saveConfiguration, true);
	mainDiv.appendChild(saveNode);

	mainDiv.style.display = noneText;
	document.getElementsByTagName('body')[0].appendChild(mainDiv);
}

function showConfigure()
{
	loadConfiguration();
	var div = $("#div_configureBox");
	div.style.display = blockText;
}

function initMenu(e)
{
	var menuitem = $("#show_all_content");
	menuitem.checked = false;
	menuitem = $("#filter_posts_and_comments");
	menuitem.checked = false;
	menuitem = $("#filter_posts_only");
	menuitem.checked = false;
	menuitem = $("#filter_comments_only");
	menuitem.checked = false;

	menuitem = $("#filter_user_or_content")
	menuitem.label = noActiveSelectionText;

	switch(filterAction)
	{
		case filterActionEnum.POSTSANDCOMMENTS:
			menuitem = $("#filter_posts_and_comments");
			menuitem.checked = true;
			break;
		case filterActionEnum.POSTSONLY:
			menuitem = $("#filter_posts_only");
			menuitem.checked = true;
			break;
		case filterActionEnum.COMMENTSONLY:
			menuitem = $("#filter_comments_only");
			menuitem.checked = true;
			break;
		case filterActionEnum.NONE:
		default:
			menuitem = $("#show_all_content");
			menuitem.checked = true;
			break;
	}

	var node = e.target;

	var pNode = node;
	// fanfare does a user link of //www.metafilter.com, don't ask me
	if (pNode.nodeName == 'A' &&
		pNode.target && pNode.target == "_self" &&
		pNode.getAttribute("href").match(/^((https?:\/\/)|(\/\/))?(www.metafilter.com)?\/user\/\d+$/))
	{
		// right click on user link
		menuitem = $("#filter_user_or_content")
		menuitem.label = filterForUser + pNode.innerHTML;
		return;
	}

	while (pNode && pNode.nodeName != "A")
	{
		pNode = pNode.parentNode;
	}

	if (pNode && pNode.hasAttribute("href"))
	{
		// right click on a site link
		var result = pNode.getAttribute("href").match(/^(https?:\/\/)?([^\/\?]{3,})/);
		if (!result || !result[2])
		{
			return;
		}
		menuitem = $("#filter_user_or_content")
		menuitem.label = filterForSite + result[2];
	}
	else
	{
		// right click on text, see if selected
		var text = document.getSelection().toString();
		if (text)
		{
			text.trim();
		}
		if (text.length < 1)
		{
			return;
		}
		menuitem = $("#filter_user_or_content");
		menuitem.label = filterForText + text;
	}

	return;
}

function $(aSelector, aNode)
{
	return (aNode || document).querySelector(aSelector);
}


document.addEventListener('DOMContentLoaded',onLoaded,true);
GM_registerMenuCommand(configureFilters, showConfigure, "c");
