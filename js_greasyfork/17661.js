// ==UserScript==

// @name         Thimbleweed Park™ Blog fixes
// @namespace    NorTreblig
// @version      0.20
// @description  Fixes time format and timezone; Highlights new comments since last visit; Pre-fills comment input form; User settings can be changed via menu command
// @author       Nor Treblig

// @match        http://blog.thimbleweedpark.com/*
// @match        https://blog.thimbleweedpark.com/*

// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.11.2/moment-with-locales.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.1/moment-timezone-with-data-2010-2020.min.js
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.min.js
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_registerMenuCommand

// @downloadURL https://update.greasyfork.org/scripts/17661/Thimbleweed%20Park%E2%84%A2%20Blog%20fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/17661/Thimbleweed%20Park%E2%84%A2%20Blog%20fixes.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';


var localUserSettings = { };
var remoteUserSettings = { };
var scriptSettings =
	{
		serverTimeZone:			"America/New_York",
		serverDateFormat:		"MMM D, YYYY",	// example: "Mar 28, 2016"
		serverDateTimeFormat:	"MMM D, YYYY [at] h:m",	// example: "Mar 29, 2016 at 02:02"

		newCommentIndicator:	"<span class=\"newComment commentdate\"><a id=\"{0}\" name=\"{0}\" href=\"{1}\" title=\"click to go to next new comment\">new comment</a></span><div style=\"clear: right; margin-bottom: 0px;\" />",
		newCommentsIndicator:	"<span class=\"newComment date\"><a href=\"{3}\">{1} new comment(s)</a> since {2} (total: {0})</span><div style=\"clear: right; margin-bottom: 0px;\" />",
		noNewCommentsIndicator:	"<span class=\"noNewComments date\">no new comments since {2} (total: {0})</span><div style=\"clear: right; margin-bottom: 0px;\" />",
		archiveListHeader:		"<span class=\"date\"> - <span class=\"{2}\">{0} new comment(s)</span> (total: {1})</span>",
		archiveListMarkRead:	"<a href=\"#\" class=\"markRead\">[mark comments of all new blog posts as read]</a>",

		countdownSnippet:		"<center style=\"height: 300px; position: relative;\"><iframe width=\"545\" height=\"280\" src=\"https://w2.countingdownto.com/1759791\" frameborder=\"0\" style=\"background-color: #090B22;\" /><div style=\"position: relative; width: 90px; height: 90px; left: 227px; top: -280px; background-color: #090B22; z-index: 10;\">&nbsp;</div><div style=\"position: absolute; top: 0; left: 0; width: 100%; height: 280px; z-index: 15;\"><a style=\"display: inline-block; width: 545px; height: 280px;\" href=\"http://www.cinemapioxi.it/zak/twp/ThimbleweedParkITA.html\" /></div></div>",
	};

var settingsLoaded = false;
var referenceTime = null;
var currentVisit = moment().utc();


function Main()
{
	// initialize settings
	InitSettings();

	// load settings
	LoadSettings();

	// add styles
	GM_addStyle(".commentform input { max-width: 100%; }");	// fix width of textboxes in narrow browser windows
	GM_addStyle("span.newComment { margin-left: 10px !important; float: right; }");
	GM_addStyle("span.newComment.commentdate { margin-top: 2px; }");
	GM_addStyle("span.newComment.date { margin-top: 8px; }");
	GM_addStyle("span.newComment a { padding: 2 5 2 5; background: yellow; text-decoration: none; }");
	GM_addStyle("span.newComment a:focus { background: orange; }");
	GM_addStyle("span.noNewComments { margin-left: 10px !important; margin-top: 8px; float: right; padding: 2 5 2 5; }");
	GM_addStyle(".archiveBody span.newComment.date, .mainCommentLink span.newComment.date { margin-top: 0px; }");
	GM_addStyle(".archiveBody span.noNewComments, .mainCommentLink span.noNewComments { margin-top: 0px; }");
	GM_addStyle(".archiveBody span.newComments, .mainCommentLink span.newComments { padding: 2 5 2 5; background: yellow; }");
	GM_addStyle(".archiveBody .markRead { margin-left: 5px; padding: 2 5 2 5; color: gray !important; background: yellow; font-size: 60%; text-decoration: none !important; }");


	// add coundown
	if (localUserSettings.showCountdown && false)
		ShowCountdown();

	// process reply links
	ProcessReplyLinks();

	// pre-fill comment form
	ProcessCommentForm();

	// add indicators to blog entries of archive list
	ProcessArchiveList();

	// get reference time of blog post and fix its format
	referenceTime = GetBlogPostReferenceTime(true);

	// fix time format and time zone on comments
	// example: "Mar 29, 2016 at 02:02" -> "Tue 2016-03-29 08:02"
	jQuery.each(jQuery(".commentdate"),
		function(i, e)
		{
			var element = $(e);

			var timeText = element.text();
			var serverTime = ParseServerTime(timeText);
			if (serverTime.isValid())
			{
				var utcTime = serverTime.clone().utc();
				var localTime = utcTime.clone().local();

				// set element attributes
				element.attr("data-utcvalue", utcTime.format());
				element.attr("title", timeText);

				element.text(localTime.locale(localUserSettings.displayLocale).format(localUserSettings.displayDateTimeFormat));
			}
			else
				console.warn("Couldn't parse time: \"" + timeText + "\"");
		});

	// mark new comments and add indicator to blog title
	ProcessBlogPosts();

	// use jQuery to scroll to anchors with scroll offset
	jQuery("a[href^='#newComment']").click(
		function(e)
		{
			var anchorID = $(e.target).attr("href");
			var anchor = jQuery(anchorID);
			if (anchor.length)
			{
				// scroll and set focus
				jQuery('html, body').scrollTop(anchor.offset().top + localUserSettings.scrollOffset);
				anchor.focus();
			}
			e.preventDefault();
		});
}

function InitSettings()
{
	GM_config.init(
		{
			id: "UserSettings",
			title: "Thimbleweed Park™ Blog fixes - Settings",
			fields:
				{
					"settingsVersion":
						{
							"type": "hidden",
							"default": "0",
						},

					"displayDateFormat":
						{
							"section": [ GM_config.create("Date/Time Format"), "override display format for dates and times" ],
							"label": "Display date format",
							"labelPos": "left",
							"type": "text",
							"default": "ddd YYYY-MM-DD",
						},
					"displayDateTimeFormat":
						{
							"label": "Display datetime format",
							"labelPos": "left",
							"type": "text",
							"default": "ddd YYYY-MM-DD HH:mm",
						},
					"displayLocale":
						{
							"label": "Override browser locale (e.g. en-UK)",
							"labelPos": "left",
							"type": "text",
							"default": null,
						},

					"scrollOffset":
						{
							"section": [ GM_config.create("Highlight New Comments"), "settings related to highlighting comments" ],
							"label": "Scroll offset in pixels",
							"labelPos": "left",
							"type": "int",
							"default": -125
						},

					"replyInNewTab":
						{
							"section": [ GM_config.create("Reply Links"), "change behaviour of reply links" ],
							"label": "Open reply in new tab",
							"labelPos": "right",
							"type": "checkbox",
							"default": false,
						},
					"invertReplyLinkBehaviour":
						{
							"label": "Invert reply link behaviour (Click vs. Ctrl + Click)",
							"labelPos": "right",
							"type": "checkbox",
							"default": false,
						},

					"userName":
						{
							"section": [ GM_config.create("Create Comment"), "allows pre-filling of comment input form" ],
							"label": "Name",
							"labelPos": "left",
							"type": "text",
							"default": null,
						},
					"userEmail":
						{
							"label": "Email",
							"labelPos": "left",
							"type": "text",
							"default": null,
						},
					"userWebsite":
						{
							"label": "Website",
							"labelPos": "left",
							"type": "text",
							"default": null,
						},
					"tmtsotsomi":
						{
							"label": "Tell me the secret of The Secret of Monkey Island",
							"labelPos": "right",
							"type": "checkbox",
							"default": false,
						},

					"showCountdown":
						{
							"section": [ GM_config.create("Miscellaneous"), "stuff related to miscellaneousness" ],
							"label": "Show Final Countdown (da da DAA daa, da da DA da daa) [DISABLED]",
							"labelPos": "right",
							//"type": "checkbox",
							"type": "hidden",
							"default": true,
						},

					"importExportData":
						{
							"section": [ GM_config.create("Import/Export"), null ],
							"label": "Data:",
							"labelPos": "left",
							"type": "textarea",
							"default": null,
							"save": false,
						},
					"importButton":
						{
							"label": "Import",
							"type": "button",
							"click": ImportData,
						},
					"exportButton":
						{
							"label": "Export",
							"type": "button",
							"click": ExportData,
						},
				},
			events:
				{
					save:
						function(values)
						{
							if (settingsLoaded)
							{
								// reload page
								//document.location.reload();
								alert("Note: Refresh page to see changes.");
							}
						},
				},
		});
}

function LoadSettings()
{
	var currentVersion = 1;

	// upgrade settings if necessary
	var version = parseInt(GM_config.get("settingsVersion"));
	if (version <= 0)
	{
		// backward compatibilty: try to load individual settings from persistent storage
		if (GM_getValue("UserSetting_DisplayDateFormat") != null)		GM_config.set("displayDateFormat", GM_getValue("UserSetting_DisplayDateFormat"));
		if (GM_getValue("UserSetting_DisplayDateTimeFormat") != null)	GM_config.set("displayDateTimeFormat", GM_getValue("UserSetting_DisplayDateTimeFormat"));
		if (GM_getValue("UserSetting_DisplayLocale") != null)			GM_config.set("displayLocale", GM_getValue("UserSetting_DisplayLocale"));
		if (GM_getValue("UserSetting_ScrollOffset") != null)			GM_config.set("scrollOffset", GM_getValue("UserSetting_ScrollOffset"));
		if (GM_getValue("UserSetting_UserName") != null)				GM_config.set("userName", GM_getValue("UserSetting_UserName"));
		if (GM_getValue("UserSetting_UserEmail") != null)				GM_config.set("userEmail", GM_getValue("UserSetting_UserEmail"));
		if (GM_getValue("UserSetting_UserWebsite") != null)				GM_config.set("userWebsite", GM_getValue("UserSetting_UserWebsite"));
		if (GM_getValue("UserSetting_TMTSOTSOMI") != null)				GM_config.set("tmtsotsomi", GM_getValue("UserSetting_TMTSOTSOMI"));
	}
	if (version < currentVersion)
	{
		// update version
		GM_config.set("settingsVersion", currentVersion.toString());
		GM_config.save();
		console.log("upgraded settings from version " + version.toString() + " to " + currentVersion.toString());
	}

	// load local user settings
	localUserSettings.displayDateFormat			= GM_config.get("displayDateFormat");
	localUserSettings.displayDateTimeFormat		= GM_config.get("displayDateTimeFormat");
	localUserSettings.displayLocale				= GM_config.get("displayLocale");

	localUserSettings.scrollOffset				= GM_config.get("scrollOffset");

	localUserSettings.replyInNewTab				= GM_config.get("replyInNewTab");
	localUserSettings.invertReplyLinkBehaviour	= GM_config.get("invertReplyLinkBehaviour");

	localUserSettings.userName					= GM_config.get("userName");
	localUserSettings.userEmail					= GM_config.get("userEmail");
	localUserSettings.userWebsite				= GM_config.get("userWebsite");
	localUserSettings.tmtsotsomi				= GM_config.get("tmtsotsomi");

	localUserSettings.showCountdown				= GM_config.get("showCountdown");

	// TODO load remote user settings

	// setup locale: use browser setting as default
	if (!localUserSettings.displayLocale)
		localUserSettings.displayLocale = window.navigator.userLanguage || window.navigator.language;

	settingsLoaded = true;
}

function ShowSettings()
{
	// show settings
	GM_config.open();
}

function ImportData()
{
	var data = GM_config.fields["importExportData"].node.value;
	try
	{
		data = JSON.parse(data);
	}
	catch (ex)
	{
		alert("Invalid data format.");
		return;
	}

	if (!confirm("Import data?"))
		return;
	var deleteMissingValues = !confirm("Add and update only (no delete)?");

	var valueNames = GM_listValues().reduce(function(map, valueName)
		{
			if (valueName.startsWith("LastVisit_"))
				map[valueName] = null;
			return map;
		}, {});

	for (var valueName in data)
	{
		if (valueName.startsWith("LastVisit_"))
		{
			GM_setValue(valueName, data[valueName]);
			delete valueNames[valueName];
		}
	}

	if (deleteMissingValues)
	{
		for (var valueName in valueNames)
			GM_deleteValue(valueName);
	}

	// import done
	alert("Note: Refresh page to see changes.");
}

function ExportData()
{
	var data = {};
	var valueNames = GM_listValues();
	jQuery.each(valueNames,
		function(i, valueName)
		{
			if (valueName.startsWith("LastVisit_"))
				data[valueName] = GM_getValue(valueName);
		});
	GM_config.fields["importExportData"].node.value = JSON.stringify(data);
}

function TextToNumber(text)
{
	switch (text)
	{
		case "zero": return 0;
		case "one": return 1;
		case "two": return 2;
		case "three": return 3;
		case "four": return 4;
		case "five": return 5;
		case "six": return 6;
		case "seven": return 7;
		case "eight": return 8;
		case "nine": return 9;
		case "ten": return 10;
		case "eleven": return 11;
		case "twelve": return 12;
	}
}

function AnswerSecretQuestion()
{
	var input = $("input[name='seckrit_question']");

	// get question
	var contents = input.parent().contents();
	contents = contents.slice(contents.index(input) + 1, contents.index(input.next()));
	var question = contents.text();

	// evaluate question
	var answer = 0;
	var regex = /((\+|-)\s+)?(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b/gi;
	var match;
	while (match = regex.exec(question))
	{
		var operand = match[2];
		var number = TextToNumber(match[3]);
		if (number)
		{
			if (operand == "-")
				number = -number;
			answer += number;
		}
	}

	// set answer
	input.attr("value", answer.toString());
}

function GetLastVisitSettings(blogID)
{
	var lastVisitSettingsText = GM_getValue("LastVisit_" + blogID);
	lastVisitSettingsText = lastVisitSettingsText != null ? lastVisitSettingsText.split("|") : [];

	var lastVisitSettings = { blogID: blogID };

	var index = 0;
	lastVisitSettings.lastVisitText		= lastVisitSettingsText.length >= index ? lastVisitSettingsText[index] : null; index++;
	lastVisitSettings.lastCommentText	= lastVisitSettingsText.length >= index ? lastVisitSettingsText[index] : null; index++;
	lastVisitSettings.lastCommentCount	= lastVisitSettingsText.length >= index ? lastVisitSettingsText[index] : null; index++;
	lastVisitSettings.totalCommentCount	= lastVisitSettingsText.length >= index ? lastVisitSettingsText[index] : null; index++;

	lastVisitSettings.lastVisit			= lastVisitSettings.lastVisitText		? moment(lastVisitSettings.lastVisitText).utc() : null;
	lastVisitSettings.lastComment		= lastVisitSettings.lastCommentText		? moment(lastVisitSettings.lastCommentText).utc() : null;
	lastVisitSettings.lastCommentCount	= lastVisitSettings.lastCommentCount	? parseInt(lastVisitSettings.lastCommentCount) : 0;
	lastVisitSettings.totalCommentCount	= lastVisitSettings.totalCommentCount	? parseInt(lastVisitSettings.totalCommentCount) : 0;

	// validate datetimes
	if (lastVisitSettings.lastVisit && !lastVisitSettings.lastVisit.isValid())
	{
		lastVisitSettings.lastVisit = null;
		lastVisitSettings.lastVisitText = null;
	}
	if (lastVisitSettings.lastComment && !lastVisitSettings.lastComment.isValid())
	{
		lastVisitSettings.lastComment = null;
		lastVisitSettings.lastCommentText = null;
	}

	return lastVisitSettings;
}

function SetLastVisitSettings(blogID, lastVisitText, lastCommentText, lastCommentCount, totalCommentCount)
{
	var lastVisitSettingsText = (lastVisitText ? lastVisitText : "") + "|" + (lastCommentText ? lastCommentText : "") + "|" + lastCommentCount.toString() + "|" + totalCommentCount.toString();
	//console.log("setValue: " + blogID + ": " + lastVisitSettingsText);
	GM_setValue("LastVisit_" + blogID, lastVisitSettingsText);
}

function ParseServerTime(text)
{
	// parse server time (includes year since 2016-04-03!)
	var serverTime = moment.tz(text, scriptSettings.serverDateTimeFormat, scriptSettings.serverTimeZone);
	return serverTime;

	/* obsolete
	// parse server time (which doesn't include year)
	var dateTimeText = referenceTime.format("YYYY ") + text;
	var serverTime = moment.tz(dateTimeText, "YYYY " + scriptSettings.serverDateTimeFormat, scriptSettings.serverTimeZone);
	// try to fix year
	if (!serverTime.isValid())
	{
		// possible special case: wrong year and date is leap day
		dateTimeText = referenceTime.clone().add(1, "y").format("YYYY ") + text;
		serverTime = moment.tz(dateTimeText, "YYYY " + scriptSettings.serverDateTimeFormat, scriptSettings.serverTimeZone);
	}
	if (serverTime.format() < referenceTime.format())
		serverTime.add(1, "y");
	return serverTime;
	*/
}

function GetBlogPostNewCommentsIndicator(commentCount, newCommentCount, lastVisit, url)
{
	var indicator = newCommentCount !== 0 ? scriptSettings.newCommentsIndicator : scriptSettings.noNewCommentsIndicator;
	indicator = indicator
		.replace("{0}", commentCount)
		.replace("{1}", newCommentCount)
		.replace("{2}", lastVisit ? lastVisit.clone().local().locale(localUserSettings.displayLocale).format(localUserSettings.displayDateTimeFormat) : "ever")
		.replace("{3}", url ? url : "#newComment0");
	return indicator;
}

function ProcessReplyLinks()
{
	if (localUserSettings.replyInNewTab || localUserSettings.invertReplyLinkBehaviour)
	{
		// add target _blank
		$("div.reply>a[target!='_blank']").attr("target", "_blank");
	}
	else
	{
		// remove target _blank
		$("div.reply>a[target='_blank']").removeAttr("target");
	}

	$("div.reply>a").click(
		function(e)
		{
			if (localUserSettings.invertReplyLinkBehaviour && e.ctrlKey)
			{
				// open link in same window
				var href = $(this).attr("href");;
				document.location.href = href;
				e.preventDefault();
			}
		});
}

function ProcessCommentForm()
{
	if (localUserSettings.userName)
		$("input[name='comment_name']").attr("value", localUserSettings.userName);
	if (localUserSettings.userEmail)
		$("input[name='comment_email']").attr("value", localUserSettings.userEmail);
	if (localUserSettings.userWebsite)
		$("input[name='comment_website']").attr("value", localUserSettings.userWebsite);

	if (localUserSettings.tmtsotsomi)
		AnswerSecretQuestion();
}

function ProcessArchiveList()
{
	var newCommentCountSum = 0;
	var totalCommentCountSum = 0;
	var newBlogPostWithCommentsCount = 0;

	// add new comment indicators to archive list
	jQuery.each(jQuery(".archiveBody h3"),
		function(i, e)
		{
			var element = $(e);

			var blogTitle = element.children("a");
			var dateElement = element.children("span.date");
			if (blogTitle && dateElement)
			{
				// get blog ID
				blogTitle = $(blogTitle[0]);
				var blogID = blogTitle.attr("href");

				// get last visit settings from persistent storage
				var lastVisit = GetLastVisitSettings(blogID);

				// parse comment count and date
				dateElement = $(dateElement[0]);
				var dateElementText = dateElement.text();
				var dateElementTextSplit = dateElementText.split("-");
				if (dateElementTextSplit.length >= 3 && dateElementTextSplit[1].indexOf("comments") >= 0)
				{
					var index = dateElementTextSplit[1].indexOf("comments");
					var commentCount = parseInt(dateElementTextSplit[1].substring(0, index).trim());
					if (isNaN(commentCount))
						commentCount = 0;
					var dateText = dateElementTextSplit[2].trim();
					var date = moment.tz(dateText, scriptSettings.serverDateFormat, scriptSettings.serverTimeZone);

					// set element attributes
					dateElement.attr("data-utcvalue", date.format());
					dateElement.attr("data-commentCount", commentCount);

					if (date.isValid())
					{
						// fix time format
						dateElement.text(" - " + date.clone().locale(localUserSettings.displayLocale).format(localUserSettings.displayDateFormat));
						dateElement.attr("title", dateElementText);
					}

					// add new comment indicator
					var newCommentCount = commentCount - lastVisit.totalCommentCount;
					if (newCommentCount < 0)
						// note: archive list is cached serverside and may have out-dated comment counts
						newCommentCount = 0;
					var indicator = GetBlogPostNewCommentsIndicator(commentCount, newCommentCount, lastVisit.lastVisit, blogID);
					$(indicator).insertAfter(dateElement);

					newCommentCountSum += newCommentCount;
					totalCommentCountSum += commentCount;
					if (!lastVisit.lastVisit && commentCount > 0)
						newBlogPostWithCommentsCount++;
				}
			}
		});

	// add comment counts to archive list header
	var header = scriptSettings.archiveListHeader
		.replace("{0}", newCommentCountSum)
		.replace("{1}", totalCommentCountSum)
		.replace("{2}", newCommentCountSum !== 0 ? "newComments" : "");
	jQuery(".archiveBody h1").append(header);

	if (newBlogPostWithCommentsCount >= 2)
	{
		var markRead = $(scriptSettings.archiveListMarkRead);
		markRead.click(
			function (e)
			{
				e.stopPropagation();
				e.preventDefault();

				if (confirm("Do you really want to mark all comments of all new blog posts as read?"))
				{
					// mark comments as read
					jQuery.each(jQuery(".archiveBody h3"),
						function(i, e)
						{
							var element = $(e);

							var blogTitle = element.children("a");
							var dateElement = element.children("span.date");
							if (blogTitle && dateElement)
							{
								// get blog ID
								blogTitle = $(blogTitle[0]);
								var blogID = blogTitle.attr("href");

								// get last visit settings from persistent storage
								var lastVisit = GetLastVisitSettings(blogID);
								if (!lastVisit.lastVisit)
								{
									// update last visit settings
									var nowText = moment().utc().format();
									var commentCount = parseInt(dateElement.attr("data-commentCount"));
									SetLastVisitSettings(blogID, nowText, nowText, 0, commentCount);
								}
							}
						});

					// reload page
					document.location.reload();
				}
			});
		jQuery(".archiveBody h1").append(markRead);
	}
}

function GetBlogPostReferenceTime(fixTimeFormat)
{
	var referenceTime;

	var dateElement = jQuery(".date").first();
	if (dateElement.length > 0)
	{
		// try to use date of blog post as reference
		dateElement = $(dateElement[0]);
		var htmlText = dateElement.html();
		var index = htmlText.indexOf("<br>");
		var timeText = index < 0 ? htmlText : htmlText.substring(index + 4);
		referenceTime = moment.tz(timeText, scriptSettings.serverDateFormat, scriptSettings.serverTimeZone);

		if (referenceTime.isValid() && fixTimeFormat)
		{
			// fix time format
			htmlText = index < 0 ? "" : htmlText.substring(0, index + 4);
			htmlText += referenceTime.clone().locale(localUserSettings.displayLocale).format(localUserSettings.displayDateFormat);
			dateElement.html(htmlText);
			dateElement.attr("title", timeText);
		}
	}

	if (referenceTime == null || !referenceTime.isValid())
	{
		// use first of january of current year as reference
		var currentServerYear = moment().tz(scriptSettings.serverTimeZone).year();
		referenceTime = moment.tz(currentServerYear, "YYYY", scriptSettings.serverTimeZone);
	}

	return referenceTime;
}

function ProcessBlogPosts()
{
	var regexCommentLinkCommentCount = /(\d+)\s+comment(s)?/i;

	// detect blog post with comments (note: multiple posts means blog main page -> skip)
	var blogTitles = jQuery(".entryBody .title a[href]");
	var isSingleBlogPost = blogTitles.length == 1;
	jQuery.each(blogTitles,
		function(i, e)
		{
			// get blog ID
			var blogTitle = $(e);
			var blogID = blogTitle.attr("href");

			// get body of blog post
			var blogBody = $(blogTitle.closest(".entryBody"));

			// get comment link (blog posts on main page)
			var commentLink = blogBody.find(".mainCommentLink a[href]")
			commentLink = commentLink.length == 1 ? $(commentLink[0]) : null;

			// get last visit settings from persistent storage
			var lastVisit = GetLastVisitSettings(blogID);

			if (isSingleBlogPost)
			{
				// count comments with same time as last comment and get (new) last comment
				var currentLastCommentCount = 0;
				var newLastCommentText = null;
				jQuery.each(blogBody.find(".commentdate[data-utcvalue]"),
					function(i, e)
					{
						var element = $(e);

						var utcTime = moment(element.attr("data-utcvalue")).utc();
						var utcTimeText = utcTime.format();
						// check if comment has same time then last comment
						if (lastVisit.lastCommentText && utcTimeText == lastVisit.lastCommentText)
							currentLastCommentCount++;
						// get (new) last comment
						if (newLastCommentText == null || newLastCommentText < utcTimeText)
							newLastCommentText = utcTimeText;
					});
				if (!lastVisit.lastCommentText)
					currentLastCommentCount = -1;

				// mark new comments
				var commentCount = 0;
				var newCommentCount = 0;
				var newLastCommentCount = 0;
				jQuery.each(blogBody.find(".commentdate"),
					function(i, e)
					{
						var element = $(e);
						commentCount++;

						var utcTime = moment(element.attr("data-utcvalue")).utc();
						var utcTimeText = utcTime.format();
						// check if comment is new
						if (lastVisit.lastCommentText == null || utcTimeText > lastVisit.lastCommentText || currentLastCommentCount != lastVisit.lastCommentCount && utcTimeText >= lastVisit.lastCommentText)
						{
							var indicator = scriptSettings.newCommentIndicator.replace("{0}", "newComment" + newCommentCount).replace("{1}", "#newComment" + (newCommentCount + 1));
							$(indicator).insertAfter(element);
							newCommentCount++;
						}
						// count last comments
						if (newLastCommentText == utcTimeText)
							newLastCommentCount++;
					});

				// only add indicator to title if commenting is/was possible
				if (commentCount > 0 || jQuery(".commentform").length > 0)
				{
					// add indicator to title of blog post
					var indicator = GetBlogPostNewCommentsIndicator(commentCount, newCommentCount, lastVisit.lastVisit, null);
					$(indicator).insertAfter(blogTitle);
				}

				// remember last visit
				var lastVisitText = currentVisit.format();
				SetLastVisitSettings(blogID, lastVisitText, newLastCommentText, newLastCommentCount, commentCount);
			}
			else if (commentLink !== null)
			{
				// process blog post on main page
				var match = regexCommentLinkCommentCount.exec(commentLink.text());
				if (match)
				{
					var commentCount = parseInt(match[1]);

					// add new comment indicators
					var newCommentCount = commentCount - lastVisit.totalCommentCount;
					if (newCommentCount < 0)
						// note: archive list is cached serverside and may have out-dated comment counts
						newCommentCount = 0;
					var indicator = GetBlogPostNewCommentsIndicator(commentCount, newCommentCount, lastVisit.lastVisit, blogID);
					$(indicator).insertAfter(blogTitle);
					$(indicator).insertAfter(commentLink);
				}
			}
		});
}

function ShowCountdown()
{
	// show on main page and archive page only for now
	//if (document.location.pathname != "/" && !document.location.pathname.startsWith("/archive"))
	var archiveBody = jQuery(".archiveBody h3")
	if (archiveBody.length <= 0)
		return;

	var snippet = scriptSettings.countdownSnippet;
	var menuElement = jQuery("div.title>div.menu")
	$(snippet).insertAfter(menuElement.parent());
}


// try to register menu entry for config dialog
try
{
	GM_registerMenuCommand("Thimbleweed Park™ Blog fixes - Settings", ShowSettings);
}
catch (ex)
{
	console.log(ex);
}

jQuery(document).ready(Main);
