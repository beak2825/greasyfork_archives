// ==UserScript==
// @name        Galaxy Legion UI Improvements
// @description UI Improvements for Galaxy Legion
// @namespace   GLUI
// @include     https://galaxylegionfb.com/galaxylegion/*
// @include     https://apps.facebook.com/galaxylegion/*
// @version     0.4.9.10
// @license     MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/528314/Galaxy%20Legion%20UI%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/528314/Galaxy%20Legion%20UI%20Improvements.meta.js
// ==/UserScript==
/* Original Mirror: https://userscripts-mirror.org/scripts/review/172817 */
/* global $ */

/*
 * Please note, this script is not meant for use by those outside of our legion(s).
 * If you wish to use this script, edit the variables in "loadLegion"
 */
var GL_PLAYER = "";
var GL_LEGION_ANNOUNCEMENT = "";
var GLUI_VERSION = "0.4.9.10";

document.addEventListener("DOMContentLoaded", function() { GL_main(); });
window.addEventListener("load", function() { GL_main(); });

function GL_main()
{
    // Get the player's name
    var n = addMessages.toString();
    var b = n.indexOf("if (msender == '");
    var s = n.indexOf("'", b) +1;
    var e = n.indexOf("'", s);
    GL_PLAYER = n.substring(s, e);

    // Enable the context menu
    $(document).unbind('contextmenu');

    // Add a link to the official wiki
    $("#linkbar").append(" | <a href='https://galaxylegion.com/wiki/index.php?title=Main_Page' target='_blank'>Wiki</a>");

    // Embed everything else
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.innerHTML = "";

	var funcs =
    [
        { fun: GL_addMessages, call: false },
        { fun: GL_linkify, call: false },
        { fun: GL_tabTrade, call: true },
        { fun: GL_tabPlanets, call: true },
        { fun: GL_loadLegion, call: true },
        { fun: GL_loadArtifacts, call: true },
        { fun: GL_wikify, call: true },
        { fun: GL_showChangelog, call: true },
        { fun: GL_showLegionAnnouncement, call: true }
    ];

    var vars = [
        "var GL_PLAYER = '" + GL_PLAYER + "'",
        "var GL_LEGION_ANNOUNCEMENT = '';",
        "messlastid = 0",
        "addMessages = GL_addMessages",
        "var GLUI_VERSION = '" + GLUI_VERSION + "'",
    ];

    var src = "";
    for(let i = 0; i < funcs.length; i++)
    {
        var funText = funcs[i].fun.toString();
        var funHead = funText.split("\n")[0].split(" ")[1].split("(")[0];

        if(funcs[i].call)
            vars.push(funHead + "()");
        src += funText + "\n";
    }

    for(let i = 0; i < vars.length; i++)
        src += vars[i] + ";\n";

    script.innerHTML = src;
    document.body.appendChild(script);
}

function GL_showChangelog() {
    const changelog = [
        "Version " + GLUI_VERSION + " (Current)",
        "Removed: (Research tab) Auto update script",
         "",
        "Version 0.4.9.9",
        "Added: script autorun on page open",
        "Fixed: multi-rewards in mission linking",
        "Fixed: system messages not appearing in comm",
        "",
        "Version 0.4.9.8",
        "Fixed: leadership crowns",
        "Overhaul: changelog",
        "Overhaul: legion announcement",
        "Removed: chat emoticons (extremely buggy)",
        "",
        "Version 0.4.9.7",
        "Fixed: chat links",
        "Fixed: chat links security",
        "Fixed: code indentation",
        "",
        "Version 0.4.9.5 (Last Official)",
        "Reduced the delay of the duplicate Sell All button",
        "Reduced the delay of the research tab push",
        "The legion announcement should now be more visible upon page load.",
        "Artifact highlight reads from gdoc for categories."
    ];

    //var log = "<div class='darkbox'><h3 style='text-align: center;'> GLUI Changelog " + "- v" + GLUI_VERSION*/ + "</h3>\n<hr /><ul style='margin-left:15px;list-style-type: circle; font-weight: 400;'>";
    var log = "<div class='darkbox'><h3 style='text-align: center;'> GLUI Changelog </h3>\n<hr /><br /><ul style='margin-left:15px;list-style-type: circle; font-weight: 400;'>";

    for (let i = 0; i < changelog.length; i++) {
        // If the log is empty or is a version header, remove the bullet points
        // If empty, fix spacing. If header, make it bold and underlined.
        if (changelog[i] === "" || changelog[i].startsWith("Version"))
        {
            if (changelog[i] === "")
                log += "\n\t <li style='list-style-type: none; margin-top: 10px;'>&nbsp;</li>";
            else
                log += "\n\t <li style='list-style-type: none; font-weight: bold; text-decoration: underline; text-align: center;'>" + changelog[i] + "</li>";
        }
        else
            log += "\n\t <li style='font-size: 11px;'>" + changelog[i] + "</li>";
    }

    log += "</ul><br /><hr>";

    if (GLUI_VERSION >= "0.4.9.5")
        log += "<br /><span style='font-size: 12px; font-color: #ff000000;'>GLUI is running later than the latest official supported version (0.4.9.5). Please contact current script editor with any issues.</span><br />&nbsp;<br />";
    else
        log += "<br /><span style='font-size: 12px; font-color: #ff000000;'>GLUI failed to check for an updated version. Click <a href='https://userscripts-mirror.org/scripts/show/172817' target='_blank'>here</a> to check manually.</span><br />&nbsp;<br />";

    /*
     * Update checker functionality removed - can potentially be reimplemented using:
     * 1. AJAX request to metadata file
     * 2. Parse @version from metadata
     * 3. Compare with GLUI_VERSION
     * 4. Show update notification if newer version exists
     */

    // Display log
    log += "</div>";
    $.jGrowl(log, { life: 20000 });
}

function GL_showLegionAnnouncement() {
    var annLocation = $("#legionnews tbody tr td.infobox2");
    annLocation.html(GL_linkify(annLocation.html()));

    window.GL_LEGION_ANNOUNCEMENT = "<div class='darkbox'><h3 style='text-align: center;'>Legion Announcement</h3><hr /><br />" + annLocation.html() + "<br />&nbsp;<br /></div>";

    $("#menu_Legion").bind("click", function () { });

    $.jGrowl(window.GL_LEGION_ANNOUNCEMENT, { life: 10000 });
}

/*
 * This will intercept comm messages, allowing for things like formatting and clickable links in chat.
 */
function GL_addMessages(xml)
{
	mstatus = $('status',xml).text();
	if (mstatus == '2') return; // no new messages
	else if (mstatus == '1') timestamp = $('time',xml).text();
	var currentts = Math.round((new Date()).getTime() / 1000);

	$('message',xml).each(function(id)
	{
		message = $('message',xml).get(id);
		msender = $('author',message).text();
		messtime = parseInt($('sendtime',message).text()) * 1000;
		messperm = parseInt($('perm',message).text());
		currid = parseInt($('id',message).text());
		instatus = parseInt($('instatus',message).text());

		if (messtime > 0)
		{
			md = new Date(messtime);
			messhours = ( md.getHours() < 10 ? '0' : '' ) + md.getHours();
			messminutes = ( md.getMinutes() < 10 ? '0' : '' ) + md.getMinutes();
			messtimestamp = '[' + messhours + ':' + messminutes + ']';
		}
		else { messtimestamp = ''; }

		if(currid > 0)
			messlastid = currid;

		if (mstatus == '0')
			msgcolor = '#ff0000';
		else if (msender)
			msgcolor = '#ffffff';
		else
			msgcolor = '#999999';

		if (messperm < 3)
		{
			msgcolor = '#ffff00';
			messheader = ' > Officers';
		}
		else
			messheader = '';

		if (msender == GL_PLAYER) fromcolor = '#99ff99';
		else fromcolor = '#9999ff';

		if (instatus == 3)
		{
			msgcolor = '#ff0000';
			if ((currentts - (messtime / 1000)) < 300)
			{
				//window.GL_LEGION_ANNOUNCEMENT = "<div class='darkbox message'><span style='font-size: 14pt; font-weight: 700; font-style: italic;'>Legion Announcement</span><hr />" + $('text',message).text() + "</div>";
				$.jGrowl($('text',message).text(), {life: 10000});
			}
		}

		var mtext = $('text',message).text();
		mtext = GL_linkify(mtext);

		// Display messages with sender or system messages
		if (msender || mtext)
		{
			var img = "";

			if (msender) {
				var img_leader = "<img alt='Leader' width='16' height='16' src='https://galaxylegion1-1faae.kxcdn.com/images/icons/legion-1.png' />";
				var img_officer = "<img alt='Officer' width='16' height='16' src='https://galaxylegion1-1faae.kxcdn.com/images/icons/legion-2.png' />";

				var position = window.GL_LEADERSHIP_CACHE[msender];
				if (position) {
					switch(position) {
						case "Leader":
							img = img_leader;
							break;
						case "Officer":
							img = img_officer;
							break;
						default:
							// No image for other positions
					}
				}
			}

			var senderPart = msender ? img + ' <span style="color: ' + fromcolor + '; font: 10pt Arial; font-weight: 700;">' + msender + messheader + ':</span> ' : ' ';
			mapi.getContentPane().prepend('<div>' + messtimestamp + senderPart + '<span style="color: ' + msgcolor + '; font: 11pt; font-weight: 100; line-height:15px">' + mtext + '</span></div>');
		}

		// Apply crowns to existing messages
		setTimeout(function() {
			mapi.getContentPane().find('div').each(function() {
				var $div = $(this);
				var text = $div.text();
				var match = text.match(/\[\d{2}:\d{2}\](.+?):/);
				if (match && !$div.find('img').length) {
					var sender = match[1].trim();
					var position = window.GL_LEADERSHIP_CACHE[sender];
					if (position) {
						var img = '';
						if (position === 'Leader') img = '<img alt="Leader" width="16" height="16" src="https://galaxylegion1-1faae.kxcdn.com/images/icons/legion-1.png" />';
						else if (position === 'Officer') img = '<img alt="Officer" width="16" height="16" src="https://galaxylegion1-1faae.kxcdn.com/images/icons/legion-2.png" />';
						if (img) $div.html($div.html().replace(match[0], match[0].replace(match[1], img + ' ' + match[1])));
					}
				}
			});
		}, 500);

		if (cmessagecount > 100)
			mapi.getContentPane().find('div:last').remove();

		cmessagecount = cmessagecount + 1;
	});

	if ((mstatus == 1) && (commtoggled == 0))
		$('#commalert').show();

	if (mstatus == 0)
		commenabled = 0;

	$('#messagewindow').jScrollPane({showArrows:true});
}

/*
 * Turns a plaintext string as input returns it with HTML anchor tags effectively turning into hyperlinks
 */
function GL_linkify(text)
{
    // Guard against empty/null/undefined URLs
    if (!text) return text;

    // Match URLs starting with http(s)/ftp/file
    const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

    // Encode URLs to handle special characters then return URLs with HTML anchor tags and security attributes
    return text.replace(urlRegex, function(url){
        const sanitizedUrl = encodeURI(url);
        return `<a class='GLUI_link' target='_blank' rel='noopener noreferrer' href='${sanitizedUrl}'>${url}</a>`;
    });
}

/*
 * Wiki Links added to the mission tab
 */
function GL_wikify() {
    $('#menu_Missions').bind('click', function() {
        setTimeout(function() {
            // Cache the base wiki URL to avoid string concatenation in loops
            const wikiBaseUrl = "https://galaxylegion.com/wiki/index.php?title=";

            // Process missions and materials in one pass
            function createWikiLink(text)
            {
                return '<a class="GLUI_link" href="' + wikiBaseUrl + text.split(" ").join("_") + '" target="_blank">' + text + '</a>';
            }

            // Cache jQuery selectors
            const $mats = $("span[class^='material']");
            // Missions + Dailies + Legion Missions
            const $missions = $('#missions tbody tr td:has(br):not(:has(a.GLUI_link)),' + '#fmissionhead tbody tr td:has(br):first:not(:has(a.GLUI_link)),' + '#lmissionhead tbody tr td div.darkbox b:not(:has(a.GLUI_link))');
            // Process missions
            $missions.each(function() {
                const $this = $(this);
                const content = $this.html();

                // Check if it's a legion mission (doesn't have <br>)
                if ($this.is('b')) {
                    const missionName = $this.text();
                    if (missionName)
                        $this.html(createWikiLink(missionName));
                } else {
                    // Skip mission processing for cells with material spans - let materials section handle them
                    if (!content.includes('span class="material')) {
                        const missionParts = content.split("<br>");
                        const missionName = $("<div>").html(missionParts[0]).text().trim();
                        const description = missionParts[1] || "";

                        if (missionName)
                            $this.html(createWikiLink(missionName) + '<br />' + description);
                    }
                }
            });

            // Process materials
            $mats.each(function() {
                const $mat = $(this);

                // Only process if not already wrapped in link
                if (!$mat.parent().is('a'))
                {
                    try {
                        const tooltipText = $mat[0].tooltipText;
                        if (tooltipText) {
                            const matName = tooltipText.split("<br")[0].trim();
                            if (matName) {
                                $mat.wrap('<a class="GLUI_link" href="' + wikiBaseUrl + matName.split(" ").join("_") + '" target="_blank"></a>');
                            }
                        }
                    } catch (e) {
                        // Skip materials without tooltip
                    }
                }
            });

            // Handle mission buttons and lightbox once
            const $missionButtons = $("td:has(button.blue), td:has(button.red)");
            $missionButtons.one('click', function() {
                setTimeout(function() {
                    $("#TB_overlay, #TB_window .dialog-close").one('click', function() {
                        setTimeout(function() {
                            $('#menu_Missions').click();
                        }, 1000);
                    });
                }, 1000);
            });
        }, 1000);
    });
}

/*
 * Loads and processes legion member data from a CSV file
 */
function GL_loadLegion() {
    var GL_LEGION_LIST = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR935-F8ynmx6RlyaUcEwwPZIuiE5F5i3myY82qq_fhFj_K-kQLHJIqTmroEnkFLBbaoEL0IL6A4K7k/pub?gid=607680429&single=true&output=csv"; // SSA
    //var GL_LEGION_LIST = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR935-F8ynmx6RlyaUcEwwPZIuiE5F5i3myY82qq_fhFj_K-kQLHJIqTmroEnkFLBbaoEL0IL6A4K7k/pub?output=csv"; // IC

    // Column indices for member data in the CSV
    var GL_MEMBER_SHIP = 0;
    var GL_LEADER_POS = 1;

    // Initialize global arrays to store member data
    window.GL_LEGION_MEMBERS = [];
    window.GL_LEADERSHIP_CACHE = {};
    window.GL_LEGION_LOADED = false;

    // Fetch and process the CSV data
    $.get(GL_LEGION_LIST, function(data){
        var rows = data.split("\n");

        // Process each row starting from index 1 (skipping header)
        for(let i = 1; i < rows.length; i++) {
            var info = rows[i].split(",");

            // Create member object for each row
            var member = {};
            member.ShipName = info[GL_MEMBER_SHIP];

            // Set position based on leadership role
            switch(info[GL_LEADER_POS]) {
                case "Leader":
                    member.Position = "Leader";
                    window.GL_LEADERSHIP_CACHE[member.ShipName] = "Leader";
                break;
                case "Officer":
                    member.Position = "Officer";
                    window.GL_LEADERSHIP_CACHE[member.ShipName] = "Officer";
                break;
                case "Trainee":
                    member.Position = "Trainee";
                    window.GL_LEADERSHIP_CACHE[member.ShipName] = "Trainee";
                    break;
                default:
                    member.Position = "Member";
                    window.GL_LEADERSHIP_CACHE[member.ShipName] = "Member";
            }
            // Add member to global array
            window.GL_LEGION_MEMBERS.push(member);
        }
        // Mark data as loaded and update UI
        window.GL_LEGION_LOADED = true;
    });
}

/*
 * Loads and processes artifact data from a CSV file
 */
function GL_loadArtifacts()
{
    var GL_ARTIFACT_LIST = "";
    var GL_ARTIFACT_NAME = 0;
    var GL_ARTIFACT_CATEGORY = 1;

    window.GL_ARTIFACT_LIST = []; // Initialize empty array to store artifact objects globally
    window.GL_ARTIFACT_LOADED = false; // Flag to track if artifacts have been loaded

    $.get(GL_ARTIFACT_LIST, function(data)
    {
        // Split CSV data into rows
        var rows = data.split("\n");

        // Process each row starting from index 1 (skip header)
        for(let i = 1; i < rows.length; i++)
        {
            // Split row into columns
            var info = rows[i].split(",");

            // Create new artifact object
            var artifact = {};

            // Set artifact name from first column
            artifact.Name = info[GL_ARTIFACT_NAME];
            // Set artifact category from second column
            artifact.Category = info[GL_ARTIFACT_CATEGORY];

            // Add artifact object to global list
            window.GL_ARTIFACT_LIST.push(artifact);
        }
        // Mark artifacts as loaded
        window.GL_ARTIFACT_LOADED = true;
    });
}

function GL_tabNews(){ $("#menu_News").bind('click', function(){ }); }

function GL_tabShip()
{
    //The PVP damage cap formula is the LARGER of the following two possible formulas: Decks / 2 , (Rank + 19) / 2
    var decks = parseInt($("#shipsummary table tbody:first tr:nth-child(2) td:last").text().split(" / ")[1]);
    var rank = parseInt($("#level-title").text().split(" ")[1]);
    var dmgCap = ((decks/2)>((rank+19)/2))?(decks/2):((rank+19)/2);
}

/*
 * When the research tab is loaded, automatically focus on the highest available research tier.
 */
function GL_tabResearch()
{

    // Auto move to latest unlock script: Removed as official functionality was introduced 21st Oct 2025
    /*$("#menu_Research").bind('click', function(){
        var researchPush = function()
        {
            if($(".nextPage").length > 0)
            {
                for(let i = 0; i < 5; i++)
                    $(".nextPage").click();
            }
        };
        clearInterval(window.GL_TAB_RESEARCH_PUSH);
        window.GL_TAB_RESEARCH_PUSH = setInterval(function(){ researchPush(); }, 100);
    });*/
}

/*
 * When the Trade tab is loaded, destroy the pagination
 * Severely outdated libraries make this a problem
 */
function GL_tabTrade()
{
    $("#menu_Trade").bind('click', function(){
        // Duplicate the Sell All minerals button, and move the copy to the top of the page.
        var cloneButton = function()
        {
            if($("#tradearea").length > 0 && $("#tradearea table.display tbody tr:first td:last #tradesellallms").length <= 0)
                $("#tradesellallm").clone().attr("id", "tradesellallms").appendTo("#tradearea table.display tbody tr:first td:last");
        };
        clearInterval(window.GL_TAB_TRADE_CLONE);
        window.GL_TAB_TRADE_CLONE = setInterval(function(){ cloneButton(); }, 100);

        /*clearInterval(window.GL_TAB_TRADE_HILITE);
        window.GL_TAB_TRADE_HILITE = setInterval(function(){ hiliteArtifacts(); }, 100);*/
    });
}

function GL_tabPlanets(){ $("#menu_Planets").bind('click', function(){ }); }

function GL_tabBattle(){ $("#menu_Battle").bind('click', function(){ }); }
