// ==UserScript==
// @name         SG Arise Group Giveaway Script
// @namespace    https://steamcommunity.com/id/Ruphine/
// @version      1.2.5
// @description  Show point value when giveaway created for Arise Giveaway Group, adds button to search the game with mabako, adds Arise Giveaway Group User Status at SG user profile, adds easy setting to make giveaway exclusive for Arise, adds all feature of SG Game Tags.
// @author       Ruphine
// @include      *://www.steamgifts.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min.js
// @require      https://greasyfork.org/scripts/18047-sg-game-tags/code/SG%20Game%20Tags.user.js?v=1
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      justarchi.net
// @connect      steampowered.com
// @connect      ruphine.esy.es
// @downloadURL https://update.greasyfork.org/scripts/19514/SG%20Arise%20Group%20Giveaway%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/19514/SG%20Arise%20Group%20Giveaway%20Script.meta.js
// ==/UserScript==

/*jshint multistr: true */



var AriseCSS = '\
	<style type="text/css"> \
		.giveaway__column--arise_point, .featured__column--arise_point \
		{ \
			border-color: #E6C05B #D09F2F #AB7C12 #DCB040 !important; \
			color: #A56B21 !important; \
			text-shadow: none; \
			background-image: linear-gradient(#F0EC67 0%, #E0AC4A 100%) !important; \
			background-image: -moz-linear-gradient(#F0EC67 0%, #E0AC4A 100%) !important; \
			background-image: -webkit-linear-gradient(#F0EC67 0%, #E0AC4A 100%) !important; \
		} \
		.giveaway__column--arise_owned_checker, .featured__column--arise_owned_checker \
		{ \
			border: 0 !important; \
			color: #FFFFFF !important; \
			text-shadow: none; \
			background-image: linear-gradient(#305AC9 0%, #1D38C7 100%) !important; \
			background-image: -moz-linear-gradient(#305AC9 0%, #1D38C7 100%) !important; \
			background-image: -webkit-linear-gradient(#305AC9 0%, #1D38C7 100%) !important; \
		} \
		.featured__table__row li { \
			display: inline-block; \
			margin-right: 25px; \
		} \
		.featured__table__row li span { \
			color: rgba(255,255,255,0.4); \
			font-weight: normal; \
		} \
		.featured__table__row__right .last_sent { \
			font-weight: bold; \
			color: rgba(255,255,255,0.6); \
		} \
		.sggt_shortcut{ display: none; } \
	</style>';
$("head").append(AriseCSS);

const linkAPIAllGiveaway = "https://arise.justarchi.net/api.php?module=getGiveaways&fields=giveaway_id,value,type";
const linkAPIActiveGiveaway = "https://arise.justarchi.net/api.php?module=getGiveaways&active=1&fields=giveaway_id,value,type";
const linkAPIUsers = "https://arise.justarchi.net/api.php?module=getUsers&active=1&fields=user_id,giveaways_done,giveaways_won,points_spent,points_awarded,last_sent";
const linkAPIFailedGames = "https://arise.justarchi.net/api.php?module=getGamesFailed&fields=game_id";

const linkMabako = "http://swl.mabako.net/AriseGG/";
const linkUserCreated = "https://arise.justarchi.net/giveaways.php?creatorID=";
const linkUserWon = "https://arise.justarchi.net/giveaways.php?winnerID=";

const CURRENT_URL = window.location.href;
const ARISE_DURATION = 2 * 24 * 60 * 60 * 1000; // 2 days recommended

var GIVEAWAYS_DATA_ACTIVE = GM_getValue("GIVEAWAYS_DATA_ACTIVE", "[0]");
var GIVEAWAYS_DATA_ALL = GM_getValue("GIVEAWAYS_DATA_ALL", "[0]");
var GIVEAWAYS_FAILED = GM_getValue("GIVEAWAYS_FAILED", "[0]");
var LAST_UPDATED_GIVEAWAYS_ACTIVE = GM_getValue("LAST_UPDATED_GIVEAWAYS_ACTIVE", 0);
var LAST_UPDATED_GIVEAWAYS_ALL = GM_getValue("LAST_UPDATED_GIVEAWAYS_ALL", 0);
var LAST_UPDATED_GIVEAWAYS_FAILED = GM_getValue("LAST_UPDATED_GIVEAWAYS_FAILED", 0);
var USERS_DATA = GM_getValue("USERS_DATA", "");
var LAST_UPDATED_USERS = GM_getValue("LAST_UPDATED_USERS", 0);
var LOCATION_MABAKO = GM_getValue("LOCATION_MABAKO", 2);

if(/user\/\w+$|user\/\w+\/giveaways\/won|user\/\w+\/search/.test(CURRENT_URL)) //only request data if user opens someone profile page, excluding feedback
{
	if(LAST_UPDATED_USERS < (Date.now() - (15 * 60 * 1000))) // 15 mins because ArchiBoT updates every 15 mins, get all active group member stat
		GetAriseUsersData();
	else
		ProcessAriseUserProfilePage();

	if(LAST_UPDATED_GIVEAWAYS_ALL < (Date.now() - (60 * 60 * 1000))) // 1 hour because shortest giveaway time is 1 hour.
		GetAriseGiveawaysData(linkAPIAllGiveaway);
	else
		ProcessAriseGiveawayListPage($(".giveaway__row-inner-wrap"));
}
else if(/www.steamgifts.com\/($|giveaways$|giveaways\/search)/.test(CURRENT_URL)) // only request active giveaway when open this page
{
	if(LAST_UPDATED_GIVEAWAYS_ALL < (Date.now() - (60 * 60 * 1000)) && LAST_UPDATED_GIVEAWAYS_ACTIVE < (Date.now() - (15 * 60 * 1000))) // request if only both all giveaways and active giveaways expired
		GetAriseGiveawaysData(linkAPIActiveGiveaway);
	else
	{
		ProcessAriseGiveawayListPage($(".giveaway__row-inner-wrap"));
		ProcessAriseFeaturedGiveaway();
	}
}
else if(/www.steamgifts.com\/giveaway\//.test(CURRENT_URL)) // inside giveaway page
{
	if(LAST_UPDATED_GIVEAWAYS_ALL < (Date.now() - (60 * 60 * 1000)) && LAST_UPDATED_GIVEAWAYS_ACTIVE < (Date.now() - (15 * 60 * 1000))) // request if only both all giveaways and active giveaways expired
		GetAriseGiveawaysData(linkAPIActiveGiveaway);
	else
		ProcessAriseFeaturedGiveaway();
}
else if(/R5iTi\/arisegg$|R5iTi\/arisegg\/search\?/.test(CURRENT_URL)) // request all giveaway if user opens arise group page
{
	if(LAST_UPDATED_GIVEAWAYS_ALL < (Date.now() - (60 * 60 * 1000))) // 1 hour because shortest giveaway time is 1 hour.
		GetAriseGiveawaysData(linkAPIAllGiveaway);
	else
		ProcessAriseGiveawayListPage($(".giveaway__row-inner-wrap"));
}
else if(/www.steamgifts.com\/giveaways\/new/.test(CURRENT_URL)) // process giveaway creation page
	ProcessAriseGiveawayCreationPage();
else if(/www.steamgifts.com\/sg-game-tags/.test(THIS_URL)) // process sg game tags setting page
	ProcessAriseSettingPage();

// Giveaway Page (supports endless scroll) handles element added later by endless scroll
$(document).on("DOMNodeInserted", ".widget-container", function(e) {
	ProcessAriseGiveawayListPage($(e.target).find(".giveaway__row-inner-wrap"));
});

CreateAriseShortcut();

function CreateAriseShortcut()
{
	var shortcut = '\
		<a class="nav__row" href="/sg-game-tags"> \
			<i class="icon-yellow fa fa-fw fa-tag"></i> \
			<div class="nav__row__summary"> \
				<p class="nav__row__summary__name">Arise Userscript Setting</p> \
				<p class="nav__row__summary__description">Arise and SG Game Tags setting page</span>.</p> \
			</div> \
		</a>';
	var $dropdown = $(".nav__right-container .nav__absolute-dropdown .nav__row");
	$($dropdown[2]).before(shortcut); // just before logout button
}

function ProcessAriseGiveawayListPage(scope)
{
	$(scope).each(function(index, element)
	{
		var isAriseGiveaway = false;
		var target = $(element).find(".giveaway__column--width-fill.text-right"); //get location to put the button & point
		if($(element).find(".giveaway__column--group").length > 0) // check if there is group icon
		{
			var tag = createArisePointTag(target, "giveaway__column--contributor-level giveaway__column--arise_point");
			var giveaway_id = $(element).find("a.giveaway__heading__name")[0].href.split("/")[4];

			var Array_giveaway_all = JSON.parse(GIVEAWAYS_DATA_ALL);
			var giveaway_all = $.grep(Array_giveaway_all, function(e){ return e.giveaway_id == giveaway_id; });
			
			var Array_giveaway_active = JSON.parse(GIVEAWAYS_DATA_ACTIVE);
			var giveaway_active = $.grep(Array_giveaway_active, function(e){ return e.giveaway_id == giveaway_id; });

			if(giveaway_all.length > 0) // check all giveaway
				DisplayArisePoint(giveaway_all[0], tag);
			else if(giveaway_active.length > 0) // newly added giveaway, must be running right now
				DisplayArisePoint(giveaway_active[0], tag);

			isAriseGiveaway = giveaway_all.length > 0 || giveaway_active.length > 0;
		}

		if(LOCATION_MABAKO == 1 || ((LOCATION_MABAKO == 2 || LOCATION_MABAKO == 3) && isAriseGiveaway))
		{
			var url = $(element).find("a.giveaway__icon").attr("href"); //get steam store url
			if(url != null) //if steam store url is found
			{
				var ID = getAppIDfromLink(url); //get appID
				var btnOwnedChecker = createButtonMabako(target, ID, "giveaway__column--contributor-level giveaway__column--arise_owned_checker");
			}
		}
	});
}

function ProcessAriseFeaturedGiveaway() // icon point & mabako button at featured giveaway
{
	var isAriseGiveaway = false;
	var target = $(".featured__column--width-fill.text-right"); //get location to put the button & point
	if($(".featured__column--group").length > 0) // check featured giveaway
	{
		var tag = createArisePointTag(target, "featured__column featured__column--arise_point");

		var giveaway_id = "";
		if(/www.steamgifts.com\/giveaway\//.test(CURRENT_URL)) //inside giveaway page
			giveaway_id = CURRENT_URL.split("/")[4];
		else
			giveaway_id = $(".featured__inner-wrap a")[0].href;

		var Array_giveaway_all = JSON.parse(GIVEAWAYS_DATA_ALL);
		var giveaway_all = $.grep(Array_giveaway_all, function(e){ return e.giveaway_id == giveaway_id; });

		var Array_giveaway_active = JSON.parse(GIVEAWAYS_DATA_ACTIVE);
		var giveaway_active = $.grep(Array_giveaway_active, function(e){ return e.giveaway_id == giveaway_id; });

		if(giveaway_all.length > 0) // check all giveaway
			DisplayArisePoint(giveaway_all[0], tag);
		else if(giveaway_active.length > 0) // newly added giveaway, must be running right now
			DisplayArisePoint(giveaway_active[0], tag);

		isAriseGiveaway = giveaway_all.length > 0 || giveaway_active.length > 0;
	}

	if(LOCATION_MABAKO == 1 || ((LOCATION_MABAKO == 2 || LOCATION_MABAKO == 3) && isAriseGiveaway))
	{
		var url="";
		if(/www.steamgifts.com\/giveaway\//.test(CURRENT_URL)) //giveaway page
			url = $(".featured__inner-wrap a")[0].href;
		else if((/steamgifts.com\/$|giveaways\/search/.test(CURRENT_URL)) && ($(".featured__inner-wrap .global__image-outer-wrap--missing-image").length == 0) && $(".featured__inner-wrap a img").length > 0) //homepage
			url = $(".featured__inner-wrap a img")[0].src;

		if (url != "") //for game without appID e.g Humble Indie Bundle
		{
			var ID = getAppIDfromLink(url); //get appID
			var btnOwnedChecker = createButtonMabako(target, ID, "featured__column featured__column--arise_owned_checker");
		}
	}
}

function ProcessAriseUserProfilePage()
{
	var steamIcon = $(".sidebar__shortcut-inner-wrap a");
	if(steamIcon.length > 0)
	{
		var steamID = steamIcon[0].href.split("/");
		steamID = steamID[steamID.length-1];

	// {"user_id":"76561197961879324","nickname":"nightmoist","access":"1","points_awarded":"129","points_spent":"86","giveaways_done":"113","giveaways_won":"70","last_activity":"2016-05-07 18:43:29"},
		var myArray = JSON.parse(USERS_DATA);
		var user = $.grep(myArray, function(e){ return e.user_id == steamID; });
		if(user.length > 0) // user is member of Arise Group
		{
			var giveaways_done = user[0].giveaways_done;
			var giveaways_won = user[0].giveaways_won;
			var points_spent = user[0].points_spent;
			var points_awarded = user[0].points_awarded;
			var ratio = (points_spent > 0) ? RoundDecimal((points_awarded / points_spent), 3) : 1; //set ratio to 1 if point_spent = 0
			var last_sent = user[0].last_sent;
			createAriseUserStat(giveaways_done, giveaways_won, points_spent, points_awarded, ratio, last_sent);

			// add created & won link to sidebar
			var Sidebar_Heading = document.createElement("h3");
			Sidebar_Heading.setAttribute("class", "sidebar__heading");
			Sidebar_Heading.innerHTML = "Arise Group Giveaway";

			var Sidebar_ul = document.createElement("ul");
			Sidebar_ul.setAttribute("class", "sidebar__navigation");

				var Sidebar_li_created = createAriseSidebarItem("Created", linkUserCreated+steamID, giveaways_done);
				var Sidebar_li_won = createAriseSidebarItem("Won", linkUserWon+steamID, giveaways_won);

				$(Sidebar_ul).append(Sidebar_li_created).append(Sidebar_li_won);

			if($(".SGPP__scrollingSidebar").length > 0)
				$(".SGPP__scrollingSidebar").append(Sidebar_Heading).append(Sidebar_ul);
			else
				$(".sidebar").append(Sidebar_Heading).append(Sidebar_ul);
		}
	}
}

function createAriseUserStat(giveaways_done, giveaways_won, points_spent, points_awarded, ratio, last_sent)
{
	var last_sent_detail = "Never";
	if(giveaways_done > 0)
	{
		last_sent = ProcessDate(last_sent);
		if(last_sent.tempDate < Date.now() - (60 * 24 * 60 * 60 * 1000))
			last_sent_detail = "<span title='" + last_sent.actualTime + "' style='color: Red;'>" + last_sent.displayText + "</span>";
		else
			last_sent_detail = "<span title='" + last_sent.actualTime + "' style='color: #96BC69;'>" + last_sent.displayText + "</span>";
	}

	var featured__table__row_1 = '\
		<div class="featured__table__row"> \
			<div class="featured__table__row__left">Arise</div> \
			<div class="featured__table__row__right"> \
				<span class="last_sent">Last Sent: </span>' + last_sent_detail + '\
			</div> \
		</div>';

	var featured__table__row_2 = '\
		<div class="featured__table__row"> \
			<div class="featured__table__row__left"> \
				<ul> \
					<li>Created: <span>' + points_awarded + '</span></li> \
					<li>Won: <span>' + points_spent + '</span></li> \
					<li>Wins Allowed: <span>' + points_spent + '/' + (points_awarded*2) + '</span></li> \
					<li>Ratio: <span>' + ratio + '</span></li> \
				</ul>\
			</div> \
		</div>';

	$($(".featured__table__column")[0]).append(featured__table__row_1);
	$($(".featured__table__column")[1]).append(featured__table__row_2);
}

function createAriseSidebarItem(Name, Href, Count)
{
	var sidebar_item = '\
		<li class="sidebar__navigation__item"> \
			<a class="sidebar__navigation__item__link" href="' + Href + '"> \
				<div class="sidebar__navigation__item__name">' + Name + '</div> \
				<div class="sidebar__navigation__item__underline"></div> \
				<div class="sidebar__navigation__item__count">' + Count + '</div> \
			</a> \
		</li>';
	return sidebar_item;
}

function GetAriseGiveawaysData(link)
{
	console.log("[SG Arise Group Giveaway Script] requesting " + link);
	GM_xmlhttpRequest({
		method: "GET",
		timeout: 10000,
		url: link,
		onload: function(response)
		{
			if(link == linkAPIAllGiveaway)
			{
				GIVEAWAYS_DATA_ALL = response.responseText;
				GM_setValue("GIVEAWAYS_DATA_ALL", GIVEAWAYS_DATA_ALL);
				GM_setValue("LAST_UPDATED_GIVEAWAYS_ALL", Date.now());
			}
			else
			{
				GIVEAWAYS_DATA_ACTIVE = response.responseText;
				GM_setValue("GIVEAWAYS_DATA_ACTIVE", GIVEAWAYS_DATA_ACTIVE);
				GM_setValue("LAST_UPDATED_GIVEAWAYS_ACTIVE", Date.now());
			}
			ProcessAriseGiveawayListPage($(".giveaway__row-inner-wrap"));
			ProcessAriseFeaturedGiveaway();
		}
	});
}

function GetAriseUsersData()
{
	console.log("[SG Arise Group Giveaway Script] requesting " + linkAPIUsers);
	GM_xmlhttpRequest({
		method: "GET",
		timeout: 10000,
		url: linkAPIUsers,
		onload: function(response)
		{
			USERS_DATA = response.responseText;
			GM_setValue("USERS_DATA", USERS_DATA);
			GM_setValue("LAST_UPDATED_USERS", Date.now());
			ProcessAriseUserProfilePage();
		}
	});
}

function createArisePointTag(target, _class)
{
	var tag = document.createElement("div");
	tag.setAttribute("class", _class);
	$(target).after(tag);
	$(tag).css("display", "none");
	return tag;
}

function createButtonMabako(target, ID, _class)
{
	var elems = document.createElement("a");
	elems.setAttribute("class", _class);
	elems.setAttribute("href", linkMabako+ID);
	elems.setAttribute("target", "_blank");
	elems.setAttribute("title", "Check the game with Mabako group checker");
	elems.innerHTML = "<i class='fa fa-maxcdn'></i>";
	$(target).after(elems);
	return elems;
}

function createButtonMabakoNew(Target, ID, dropdown)
{
	var giveaway__column = document.createElement("div");
	giveaway__column.setAttribute("class", "giveaway__columns");

		var btnOwnedChecker = document.createElement("a");
		btnOwnedChecker.setAttribute("class", "giveaway__column--contributor-level giveaway__column--arise_owned_checker");
		btnOwnedChecker.setAttribute("href", linkMabako+ID);
		btnOwnedChecker.innerHTML = "<i class='fa fa-maxcdn'></i>";
		$(btnOwnedChecker).css("line-height", "30px");
		$(giveaway__column).append(btnOwnedChecker);

	$(giveaway__column).css("float", "right");
	$(Target).after(giveaway__column);

	if(!dropdown) //css for mabako button beside textbox
		$(giveaway__column).css("position", "relative").css("min-height", "30px");
}

function DisplayArisePoint(obj, tag)
{
	var value = obj.value;
	tag.innerHTML = value + "P";
	$(tag).css("display", "block");

	var type = obj.type;
	var title = "";
	if(type == 0)
		title += "Unknown";
	else if(type == 1)
	{
		title += "Exclusive";
		if(value == 1)
			title += "\nBundled";
		else if(value == 3)
			title += "\nNon-bundled";
	}
	else if(type == 2)
		title += "Shared";

	tag.setAttribute("title", title);
}

function ProcessAriseGiveawayCreationPage()
{
	var btnArise = document.createElement("div");
	btnArise.innerHTML = "<i class='fa fa-fast-forward'></i> Use Arise default setting";
	btnArise.setAttribute("title", "Duration: 2 days + 5 minutes\nRegion Restrictions: None\nWho Can Enter: Arise Group only\nContributor Level: 0");
	$(btnArise).addClass("form__submit-button").css("margin-bottom", "20px").on("click", AriseGiveawaySetting);
	$($(".form__row")[3]).after(btnArise);

	if (LAST_UPDATED_GIVEAWAYS_FAILED < (Date.now() - (60 * 60 * 1000)))
	{
		console.log("[SG Arise Group Giveaway Script] requesting " + linkAPIFailedGames);
		GM_xmlhttpRequest({
			method: "GET",
			timeout: 10000,
			url: linkAPIFailedGames,
			onload: function(response)
			{
				GIVEAWAYS_FAILED = response.responseText;
				GM_setValue("GIVEAWAYS_FAILED", GIVEAWAYS_FAILED);
				GM_setValue("LAST_UPDATED_GIVEAWAYS_FAILED", Date.now());
			}
		});
	}

	if($(".js__autocomplete-data").length > 0) //first page
	{
		if(LOCATION_MABAKO != 0 && LOCATION_MABAKO != 3)
		{
			$("head").append("\
				<style> \
					.js__autocomplete-name { max-width: 785px; min-height: 30px; } \
					.mt-more-like-this.sidebar__entry-loading { display: none !important; } \
				</style>"
			);
			var observer = new MutationObserver(function(mutations)
			{
				$(".giveaway__columns").remove(); //remove previously mabako
				var table = $(mutations[0].addedNodes).find(".table__row-inner-wrap");
				$(table).each(function(index, element)
				{
					var url = $(element).find("a.table__column__secondary-link").text();
					var ID = getAppIDfromLink(url);
					var Target = $(element).find(".table__column--width-fill");
					var BundledTag = $(element).find(".tags");
					if($(BundledTag).length > 0) //check if SG Game Tags installed, then target = bundled tag
						Target = BundledTag;
					createButtonMabakoNew(Target, ID, true);
				});
				$(".giveaway__column").css("float", "right");
				$(table).on("click", function(event)
				{
					var url = $(this).find("a.table__column__secondary-link").text();
					var ID = getAppIDfromLink(url);
					var Target = $(".js__autocomplete-name")[0];
					createButtonMabakoNew(Target, ID, false);

					GM_setValue("createApp", ID);
				});
			});
			var config = {childList: true, attributes: false, characterData: false};
			observer.observe($(".js__autocomplete-data")[0], config);
		}
	}
	else //second page (preview giveaway)
	{
		var ID = GM_getValue("createApp", -1);
		var array_giveaway_failed = JSON.parse(GIVEAWAYS_FAILED);
		var failed = $.grep(array_giveaway_failed, function(e){ return e.game_id == ID; });
		
		//check if giveaway is exclusive for Arise group
		var cond1 = $("input[name='who_can_enter'").val() == "groups"; //group giveaway
		var cond2 = $("input[name='group_string']").val() == " 45340410" //only have Arise ID
		var cond3 = $("input[name='whitelist'").val() == "" || $("input[name='whitelist'").val() == 0; //not whitelist
		if(cond1 && cond2 && cond3)
		{
			if(failed.length > 0)
			{
				var arise_warning = "<div style='color: darkorange;'>There was a giveaway for this game that ended with 0 entries.</div>";
				$(".featured__summary").append(arise_warning);
			}
		}

		$(".form__submit-button.js__submit-form").click(function(e){
			GM_deleteValue("createApp");
		});
	}
}

function AriseGiveawaySetting()
{
	// Set Start and Finish Date
	var startingDate = new Date();
	var endingDate = new Date(startingDate.getTime() + ARISE_DURATION + (5 * 60 * 1000));
	$("input[name='start_time']").val(formatGiveawayDate(startingDate));
	$("input[name='end_time']").val(formatGiveawayDate(endingDate));

	// Set Region Restrictions
	$($($(".form__row--who-can-enter")[0]).find(".form__checkbox")[0]).trigger('click'); // Check none region lock

	// Set Who Can Enter
	$($($(".form__row--who-can-enter")[1]).find(".form__checkbox")[2]).trigger('click'); // Check Whitelist / Steam Groups
	// changed to .form__row--who-can-enter because touhou script adds additional form__row
	
	//uncheck all other group
	$(".form__group.is-selected").each(function(event, element){
		$(element).trigger("click");
	});
	//re-check Arise group
	$($(".form__group--steam[data-group-id='45340410']")[0]).trigger('click'); // Check Arise group
}

function formatGiveawayDate(date)
{
	// May 18, 2016 10:46 am (SG output)
	// Wed May 18 2016 10:46:10 GMT+0700 (SE Asia Standard Time)  (new date() output)
	var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var month = monthNames[date.getMonth()];

	var hours = date.getHours();
	var ampm = "am";
	if(hours > 12)
	{
		ampm = "pm";
		hours %= 12;
	}
	else if(hours == 12)
		ampm = "pm";
	else if(hours == 0)
		hours = 12;

	if(hours < 10) hours = "0" + hours;

	var minutes = date.getMinutes();
	if(minutes < 10) minutes = "0" + minutes;

	var Result = month + " " + date.getDate() + ", " + date.getFullYear() + " " + hours + ":" + minutes + " " + ampm;

	return Result;
}

function ProcessAriseSettingPage()
{
	setTimeout(function() {
		var n = $(".form__heading").length + 1;
		createMabakoSetting(n);
	},3000);
}

function createMabakoSetting(n)
{
	var CheckIcon = '<i class="form__checkbox__default fa fa-circle-o"></i><i class="form__checkbox__hover fa fa-circle"></i><i class="form__checkbox__selected fa fa-check-circle"></i>';
	var form__row = document.createElement("div");
	form__row.setAttribute("class", "form__row");

		var form__heading = '\
		<div class="form__heading"> \
			<div class="form__heading__number">' + n + '.</div> \
			<div class="form__heading__text">[Arise Group] Where do you want to see Mabako button?</div> \
		</div>';

		var form__row__indent = document.createElement("div");
		form__row__indent.setAttribute("class", "form__row__indent");

			var form__checkbox_1 = createAriseCheckBox(CheckIcon + "All giveaways", (LOCATION_MABAKO == 1));
			var form__checkbox_2 = createAriseCheckBox(CheckIcon + "Arise Group giveaways + giveaway creation page", (LOCATION_MABAKO == 2));
			var form__checkbox_3 = createAriseCheckBox(CheckIcon + "Arise Group giveaways only", (LOCATION_MABAKO == 3));
			var form__checkbox_4 = createAriseCheckBox(CheckIcon + "Giveaway creation page only", (LOCATION_MABAKO == 4));
			var form__checkbox_5 = createAriseCheckBox(CheckIcon + "Off", (LOCATION_MABAKO == 0));

			$(form__checkbox_1).click(function(){toggleAriseCheckBox(form__checkbox_1, 1, "LOCATION_MABAKO");});
			$(form__checkbox_2).click(function(){toggleAriseCheckBox(form__checkbox_2, 2, "LOCATION_MABAKO");});
			$(form__checkbox_3).click(function(){toggleAriseCheckBox(form__checkbox_3, 3, "LOCATION_MABAKO");});
			$(form__checkbox_4).click(function(){toggleAriseCheckBox(form__checkbox_4, 4, "LOCATION_MABAKO");});
			$(form__checkbox_5).click(function(){toggleAriseCheckBox(form__checkbox_5, 0, "LOCATION_MABAKO");});

			$(form__checkbox_1).addClass("LOCATION_MABAKO");
			$(form__checkbox_2).addClass("LOCATION_MABAKO");
			$(form__checkbox_3).addClass("LOCATION_MABAKO");
			$(form__checkbox_4).addClass("LOCATION_MABAKO");
			$(form__checkbox_5).addClass("LOCATION_MABAKO");

		$(form__row__indent)
			.append(form__checkbox_1)
			.append(form__checkbox_2)
			.append(form__checkbox_3)
			.append(form__checkbox_4)
			.append(form__checkbox_5);

	$(form__row).append(form__heading).append(form__row__indent);

	// $(".js__submit-form").before(form__row);
	$(".form__rows").append(form__row);

	// var desc = '<div class="form__input-description">No need to press Save Changes button. It is automatically saved when the value changed.</div>';
	// $(form__row__indent).append(desc);
}

function createAriseCheckBox(innerHTML, cbValue)
{
	var cb = document.createElement("div");
	cb.setAttribute("class", "form__checkbox arise__checkbox");
	cb.innerHTML = innerHTML;
	if(cbValue)
		$(cb).addClass("is-selected");
	else
		$(cb).addClass("is-disabled");

	return cb;
}

function toggleAriseCheckBox(checkbox, value, type)
{
	$("."+type).addClass("is-disabled").removeClass("is-selected"); // unselect all radio buttons
	$(checkbox).removeClass("is-disabled").addClass("is-selected"); // select clicked radio button
	GM_setValue(type, value);
}

function RoundDecimal(num, places) { return +(Math.round(num + "e+" + places)  + "e-" + places); }

function ProcessDate(_date)
{
	//_date = new Date(_date); doesn't work in Firefox
	_date = _date.split(" ");
	var tgl = _date[0];
	var jam = _date[1].split(":");

	var tempDate = new Date(tgl);

	var y = tempDate.getFullYear();
	var M = tempDate.getMonth();
	var d = tempDate.getDate();

	var h = jam[0];
	var m = jam[1];
	var s = jam[2];

	var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var month = monthNames[M];

	var ampm = (h < 12) ? "am" : "pm";
	h %= 12;

	var actualTime = month + " " + d + ", " + y + ", " + h + ":" + m + ampm;

	var now = Date.now();
	var displayText = "";
	if(tempDate > now - (24 * 60 * 60 * 1000))
		displayText = "Today";
	else if(tempDate > now - (2 * 24 * 60 * 60 * 1000))
		displayText = "Yesterday";
	else
		displayText = Math.floor((now - tempDate) / (24 * 60 * 60 * 1000)).toLocaleString("en-US") + " days ago";

	var result = {displayText: displayText, actualTime: actualTime, tempDate: tempDate};
	return result;
}