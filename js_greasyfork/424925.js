// ==UserScript==
// @name         CSS Define
// @namespace    Haremheroes
// @version      1.7.0
// @description  *NEW* adding JavaScript for CSS here and there in the ♥Hentai Heroes game♥
// @author       KominoStyle
// @match        http*://nutaku.haremheroes.com/*
// @match        http*://*.hentaiheroes.com/*
// @match        http*://*.pornstarharem.com/*
// @run-at	     document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/424925/CSS%20Define.user.js
// @updateURL https://update.greasyfork.org/scripts/424925/CSS%20Define.meta.js
// ==/UserScript==

/*==========================================================*
CSS-Addon:
Stylus: https://add0n.com/stylus.html
*-----------------------------------------------------------*
£-*-
 +
CSS-Script:
https://userstyles.world/style/960/hentai-heroes-css-define
*==========================================================*/
/* =========
	GENERAL
   ========= */

// Define jQuery
const $ = window.jQuery

// no eslint because window. is not used
/* global membersList */

// Define CSS
const sheet = (function() {
    const style = document.createElement('style');
    document.head.appendChild(style);
    return style.sheet;
})();

const CurrentPage = window.location.pathname;
const CurrentHref = window.location.href;
//let iframePage = $('iframe').contents().find('body').attr('page') // works because tampermonkey adds script in iframe too
const realPage = $('body').attr('page')
const page = CurrentPage.split("/").pop(); //console.log(page) window.location.pathname.split("/").pop();
const pageQuest = CurrentHref.split("/")[3]; //console.log(page) window.location.pathname.split("/").shift();
const CurrentSearch = window.location.search;
const pagesearch = page+CurrentSearch;

//localstorage
const Clubmember_deserialized = JSON.parse(localStorage.getItem("CMID"));
const ClubMember_deserialized = JSON.parse(localStorage.getItem("CMNL"));
const CSSCurrentQuest_deserialized = JSON.parse(localStorage.getItem("QuestID"));

//shortcut var
const CSSsClubChampion = '<a class="CSSDefine_round_button CSSDefine_button_blue" href="/club-champion.html" generic-tooltip="Club Champion" tooltip="Club Champion"><div class="ClubChampionIcn CSSDefineIcn"></div></a>'
const CSSsChampion = '<a class="CSSDefine_round_button CSSDefine_button_blue" href="/champions-map.html" generic-tooltip="Champion" tooltip="Champion"><div class="ChampionIcn CSSDefineIcn"></div></a>'
const CSSsEpicPachinko = '<a class="CSSDefine_round_button CSSDefine_button_red Pachinkohidden" href="" generic-tooltip="Epic Pachinko" tooltip="Epic Pachinko"><div class="PachinkoIcn CSSDefineIcn"></div></a>'
const CSSsMythicPachinko = '<a class="CSSDefine_round_button CSSDefine_button_orange Pachinkohidden" href="" generic-tooltip="Mythic Pachinko" tooltip="Mythic Pachinko"><div class="PachinkoIcn CSSDefineIcn"></div></a>'
const CSSsGreatPachinko = '<a class="CSSDefine_round_button CSSDefine_button_green Pachinkohidden" href="" generic-tooltip="Great Pachinko" tooltip="Great Pachinko"><div class="PachinkoIcn CSSDefineIcn"></div></a>'
const CSSsLvLGirl = '<a class="CSSDefine_round_button CSSDefine_button_blue" href="/shop.html?type=potion" generic-tooltip="Leveling Girl" tooltip="Leveling Girl"><div class="LvLGirlIcn CSSDefineIcn"></div></a>'
const CSSsAwakenGirl = '<a class="CSSDefine_round_button CSSDefine_button_blue" href="/shop.html?type=potion" generic-tooltip="Awakening Girl" tooltip="Awakening Girl"><div class="AwakenGirlIcn CSSDefineIcn"></div></a>'
const CSSsUpgradeGirl = '<a class="CSSDefine_round_button CSSDefine_button_blue" href="/shop.html?type=gift" generic-tooltip="Upgrading Girl" tooltip="Upgrading Girl"><div class="UpgradGirlIcn CSSDefineIcn"></div></a>'
const CSSsMarket = '<a class="CSSDefine_round_button CSSDefine_button_blue" href="/shop.html" generic-tooltip="Market" tooltip="Market"><div class="MarketIcn CSSDefineIcn"></div></a>'
const CSSsVillain = '<a class="CSSDefine_round_button CSSDefine_button_blue Villainhidden" href="/map.html" generic-tooltip="Villain" tooltip="Villain"><div class="VillainIcn CSSDefineIcn"></div></a>'
const CSSsQuest = '<a class="CSSDefine_round_button CSSDefine_button_blue" href="'+CSSCurrentQuest_deserialized+'" generic-tooltip="Current Quest" tooltip="Current Quest"><div class="QuestIcn CSSDefineIcn"></div></a>'
const CSSsSideQuest = '<a class="CSSDefine_round_button CSSDefine_button_blue" href="/side-quests.html" generic-tooltip="Side Quest" tooltip="Side Quest"><div class="SideQuestIcn CSSDefineIcn"></div></a>'
const CSSsLeague = '<a class="CSSDefine_round_button CSSDefine_button_blue Leagueshidden" href="/tower-of-fame.html" generic-tooltip="Leagues" tooltip="Leagues"><div class="LeaguesIcn CSSDefineIcn"></div></a>'
const CSSsPhanteon = '<a class="CSSDefine_round_button CSSDefine_button_blue Phanteonhidden" href="/pantheon.html" generic-tooltip="Phanteon" tooltip="Phanteon"><div class="PhanteonIcn CSSDefineIcn"></div></a>'
const CSSsDailyGoal = '<a class="CSSDefine_round_button CSSDefine_button_orange" href="/activities.html?tab=daily_goals" generic-tooltip="Daily Goals" tooltip="Daily Goals"><div class="ActivitiesIcn CSSDefineIcn"></div></a>'
const CSSsMission = '<a class="CSSDefine_round_button CSSDefine_button_blue" href="/activities.html?tab=missions" generic-tooltip="Mission" tooltip="Mission"><div class="ActivitiesIcn CSSDefineIcn"></div></a>'
const CSSsContests = '<a class="CSSDefine_round_button CSSDefine_button_green" href="/activities.html?tab=contests" generic-tooltip="Contests" tooltip="Contests"><div class="ActivitiesIcn CSSDefineIcn"></div></a>'


//Get Club Member-ID
if (realPage == 'clubs') { // membersList is missing
	const CMemberID = membersList.map(({id_member}) => id_member)
	//const CMemberID = $('#members tr').map(function () {return $(this).attr('sorting_id')}).toArray(); old Code

	let Clubmember_serialized = JSON.stringify(CMemberID);

	localStorage.setItem("CMID", Clubmember_serialized);

	const CMemberNick = membersList.map(({nickname}) => nickname)
	const CMemberLvL = membersList.map(({level}) => level)

	let ClubMember_serialized = JSON.stringify(CMemberNick && CMemberLvL);

	localStorage.setItem("CMNL", ClubMember_serialized);
}

/*if (page == 'clubs.html') {
const CMemberID = $('#members tr').map(function () {return $(this).attr('sorting_id')}).toArray();

let Clubmember_serialized = JSON.stringify(CMemberID);

localStorage.setItem("CMID", Clubmember_serialized);
}*/

//Leagues ID check
if (realPage == 'leaderboard') {
    Clubmember_deserialized.forEach(Member => { //console.log(Member)
        $('tr[sorting_id='+Member+']').addClass('IsMember')
    })
}

//Contest ID check
if (realPage == 'activities') {
    Clubmember_deserialized.forEach(Member => { //console.log(Member)
        $('tr[sorting_id='+Member+']').addClass('IsMember')
    })
}

if (realPage == 'home') {
    const CSSCurrentQuest = $('#homepage .continue_quest_home').map(function () {return $(this).attr('href')}).toArray();

    let CSSCurrentQuest_serialized = JSON.stringify(CSSCurrentQuest);

    localStorage.setItem("QuestID", CSSCurrentQuest_serialized);
}

//Hide button "buy with kobans" for Bookshop & Giftshop
if (realPage == 'shop') {
    //Hide button "buy with kobans" for Bookshop & Giftshop
    if(pagesearch == 'shop.html?type=potion' || pagesearch == 'shop.html?type=gift') {
        $('#shops button[rel=buy]').addClass('DONTbuy')
    }
    //Hide button "sell your Items" for Boostershop & Bookshop & Giftshop
    if(pagesearch == 'shop.html?type=booster' || pagesearch == 'shop.html?type=potion' || pagesearch == 'shop.html?type=gift') {
        $('#shops button[rel=sell]').addClass('DONTsell')
    }
    document.querySelector("#tabs-switcher > div[type=armor].market-menu-switch-tab").onclick = function() {delDontBuy() + delDontSell()};
    document.querySelector("#tabs-switcher > div[type=booster].market-menu-switch-tab").onclick = function() {delDontBuy() + addDontSell()};
    document.querySelector("#tabs-switcher > div[type=potion].market-menu-switch-tab").onclick = function() {addDontBuy() + addDontSell()};
    document.querySelector("#tabs-switcher > div[type=gift].market-menu-switch-tab").onclick = function() {addDontBuy() + addDontSell()};


    //Show button "Buy with Kobans" if the User wants to buy with Kobans
    $('#shops .left-container .bottom-container').append('<label type="button" id="GiveMeThisItem"><span id="show_terminal"><img title="Activate button" src="https://hh.hh-content.com/quest/ic_eyeopen.svg"></span></label>')
    document.querySelector("#GiveMeThisItem").onclick = function() {delDontBuy()}

    //Show button "Sell Item" if the User wants to sell his Item
    $('#shops .right-container .bottom-container').append('<label type="button" id="SellThisItem"><span id="show_terminal"><img title="Activate button" src="https://hh.hh-content.com/quest/ic_eyeopen.svg"></span></label>')
    document.querySelector("#SellThisItem").onclick = function() {delDontSell()}


    //function for buy and sell button
    function addDontBuy() {
        $('#shops button[rel=buy]').addClass('DONTbuy')
    }
    function delDontBuy() {
        $('#shops button[rel=buy]').removeClass('DONTbuy')
    }
    function addDontSell() {
        $('#shops button[rel=sell]').addClass('DONTsell')
    }
    function delDontSell() {
        $('#shops button[rel=sell]').removeClass('DONTsell')
    }
}

//Hide button "sell your Items" for Boostershop & Bookshop & Giftshop


//Side-Quest
if (realPage == 'side-quests') {
    $('.side-quest').has('.Read').addClass('complete')
    $('.side-quest').each(function() {
        $('.side-quest:not(:has(".slot.slot_xp"))').not('.complete').addClass('rewards').find('.Continue').removeClass('blue_button_L').addClass('purple_button_L').text('➥ Reward')
    })
    $('.side-quests-list').prepend($(".side-quest:has('.slot.slot_xp')"))
/* Normales JavaScript
    document.querySelectorAll('.side-quest .slot.slot_xp').forEach(function(hasXP) {
    document.querySelector('.side-quests-list').prepend(hasXP.parentElement.parentElement)
    })
    */
}

//document.querySelector('.side-quests-list').prepend(document.querySelectorAll('.side-quest .slot.slot_xp'))

//PoA changes
if (realPage == 'event') {
    //Give girls more space if all Mission done
    $('#poa-content:not(:has(".selected"))').each(function() {
        $('#events #poa-content .animated-girl-display').addClass('MoreSpace')
        $('#events #poa-content .girl-avatar').addClass('MoreSpace')
    })
    //If "PoA reward Container" get clicked, remove more space for girls
    $("#nc-poa-tape-rewards .nc-poa-reward-container").click(function() {
        $('#events #poa-content .animated-girl-display').removeClass('MoreSpace')
        $('#events #poa-content .girl-avatar').removeClass('MoreSpace')
    })
    //Add Club Champion if "Go to Champion"
    $('#poa-content .buttons:has(button[data-href="/champions-map.html"])').append('<button data-href="club-champion.html" class="blue_button_L">Go to Club Champions</button>')

    //"Go to" change to "➥"
    $('#poa-content .buttons button').each(function() {
        const Goto = $(this).text().replace('Go to','➥').replace('Defeat','➥')
        $(this).text(Goto)
    })

    $('#events .nc-events-prize-locations-buttons-container a').each(function() {
        const Goto = $(this).text().replace('Go to','➥').replace('Defeat','➥')
        $(this).text(Goto)
    })

}

//Bang Event changes
if (realPage == 'event') {
    $('#boss_bang .boss-bang-center-section').append($('#start-bang-button'))
}

//PlaceOfPower /addons
if (realPage == 'activities') {
    $('#pop_info .pop_thumb_title > span').each(function() {
        const HCCHKH = $(this).text().replace(/ *\([^)]*\) */g, "")
        $(this).text(HCCHKH)
    })
    $('#pop_info .pop_thumb_level > span').each(function() {
        const LVL = $(this).text().replace("Lvl", "LvL")
        $(this).text(LVL)
    })
    //just adding display: none; always (not like market)
    $('#pop .pop_list .pop-action-btn').addClass('hiddenPoP')

    //Hide PoP-button /class=hiddenPoP = eye-button
    $('#pop_info').append('<label type="button" id="ShowPoP" class="hiddenPoP"><span id="show_PoP_terminal"><img title="Activate button" src="https://hh2.hh-content.com/quest/ic_eyeclosed.svg"></span></label>')
    document.querySelector("#ShowPoP").onclick = function() {addHiddenPoP()};
    //Show PoP-Button if the User wants to use them
    $('#pop_info').append('<label type="button" id="HiddenPoP" class=""><span id="show_PoP_terminal"><img title="Activate button" src="https://hh.hh-content.com/quest/ic_eyeopen.svg"></span></label>')
    document.querySelector("#HiddenPoP").onclick = function() {delHiddenPoP()};

    //function for faster PoP button#pop #pop_info label#HiddenPoP
    function addHiddenPoP() {
        $('#pop .pop_list .pop-action-btn').addClass('hiddenPoP')
        $('#pop_info label#ShowPoP').addClass('hiddenPoP')//only for eye-button
        $('#pop_info label#HiddenPoP').removeClass('hiddenPoP')//only for eye-button
    }
    function delHiddenPoP() {
        $('#pop .pop_list .pop-action-btn').removeClass('hiddenPoP')
        $('#pop_info label#ShowPoP').removeClass('hiddenPoP')//only for eye-button
        $('#pop_info label#HiddenPoP').addClass('hiddenPoP')//only for eye-button
    }
}

//DailyGoals /addons
if (realPage == 'activities') {
    $('#daily_goals .daily-goals-objective-status > p').each(function() {
        const NoMatter = $(this).text().replace(/ *\([^)]*\) */g, "")
        $(this).text(NoMatter)
    })

    $('#daily_goals .daily-goals-objectives-container').append(`<div class="daily-goals-objective">
		<div class="daily-goals-shortcut">
			<a class="CSSDefine_round_button CSSDefine_button_blue" href="/club-champion.html" generic-tooltip="Club Champion"><div class="ClubChampionIcn CSSDefineIcn"></div></a>
			<a class="CSSDefine_round_button CSSDefine_button_blue" href="/champions-map.html" generic-tooltip="Champion"><div class="ChampionIcn CSSDefineIcn"></div></a>
			<a class="CSSDefine_round_button CSSDefine_button_red Pachinkohidden" href="" generic-tooltip="Epic Pachinko"><div class="PachinkoIcn CSSDefineIcn"></div></a>
			<a class="CSSDefine_round_button CSSDefine_button_orange Pachinkohidden" href="" generic-tooltip="Mythic Pachinko"><div class="PachinkoIcn CSSDefineIcn"></div></a>
			<a class="CSSDefine_round_button CSSDefine_button_green Pachinkohidden" href="" generic-tooltip="Great Pachinko"><div class="PachinkoIcn CSSDefineIcn"></div></a>
			<a class="CSSDefine_round_button CSSDefine_button_blue" href="/shop.html?type=potion" generic-tooltip="Leveling Girl"><div class="LvLGirlIcn CSSDefineIcn"></div></a>
			<a class="CSSDefine_round_button CSSDefine_button_blue" href="/shop.html?type=potion" generic-tooltip="Awakening Girl"><div class="AwakenGirlIcn CSSDefineIcn"></div></a>
			<a class="CSSDefine_round_button CSSDefine_button_blue" href="/shop.html?type=gift" generic-tooltip="Upgrading Girl"><div class="UpgradGirlIcn CSSDefineIcn"></div></a>
			<a class="CSSDefine_round_button CSSDefine_button_blue" href="/shop.html" generic-tooltip="Market"><div class="MarketIcn CSSDefineIcn"></div></a>
			<a class="CSSDefine_round_button CSSDefine_button_blue Villainhidden" href="/map.html" generic-tooltip="Villain"><div class="VillainIcn CSSDefineIcn"></div></a>
			<a class="CSSDefine_round_button CSSDefine_button_blue" href="`+CSSCurrentQuest_deserialized+`" generic-tooltip="Current Quest"><div class="QuestIcn CSSDefineIcn"></div></a>
			<a class="CSSDefine_round_button CSSDefine_button_blue" href="/side-quests.html" generic-tooltip="Side Quest"><div class="SideQuestIcn CSSDefineIcn"></div></a>
			<a class="CSSDefine_round_button CSSDefine_button_blue Leagueshidden" href="/tower-of-fame.html" generic-tooltip="Leagues"><div class="LeaguesIcn CSSDefineIcn"></div></a>
			<a class="CSSDefine_round_button CSSDefine_button_blue Phanteonhidden" href="/pantheon.html" generic-tooltip="Phanteon"><div class="PhanteonIcn CSSDefineIcn"></div></a>
		</div>
    </div>`)

    $('#daily_goals .potions-total p').attr('id', 'Potion-Points')
    $("#daily_goals div.daily-goals-right-part img").attr('id', 'DailyGirlRewards')
    const PotionsTotal = document.getElementById('Potion-Points').innerHTML


    const DailyGirl = "https://hh2.hh-content.com/pictures/girls/354002053/"
    const DailyGirl0 = "ava0-1200x.webp"
    const DailyGirl1 = "ava1-1200x.webp"
    const DailyGirl2 = "ava2-1200x.webp"
    const DailyGirl3 = "ava3-1200x.webp"

    if (PotionsTotal > 99) {
        $("#DailyGirlRewards").attr('src', DailyGirl + DailyGirl3)
    } else if (PotionsTotal > 59) {
        $("#DailyGirlRewards").attr('src', DailyGirl + DailyGirl2)
    } else if (PotionsTotal > 19) {
        $("#DailyGirlRewards").attr('src', DailyGirl + DailyGirl1)
    } else if (PotionsTotal > 0) {
        $("#DailyGirlRewards").attr('src', DailyGirl + DailyGirl0)
    }

    document.querySelector("#Potion-Points").onclick = function() {previewDailyGirl0()};
    document.querySelector("#daily_goals .daily-goals-left-part div.progress-bar-rewards-container > div:nth-child(1) > p").onclick = function() {previewDailyGirl1()};
    document.querySelector("#daily_goals .daily-goals-left-part div.progress-bar-rewards-container > div:nth-child(3) > p").onclick = function() {previewDailyGirl2()};
    document.querySelector("#daily_goals .daily-goals-left-part div.progress-bar-rewards-container > div:nth-child(5) > p").onclick = function() {previewDailyGirl3()};

    function previewDailyGirl0(){
        $("#DailyGirlRewards").attr('src', DailyGirl + DailyGirl0)
    }
    function previewDailyGirl1(){
        $("#DailyGirlRewards").attr('src', DailyGirl + DailyGirl1)
    }
    function previewDailyGirl2(){
        $("#DailyGirlRewards").attr('src', DailyGirl + DailyGirl2)
    }
    function previewDailyGirl3(){
        $("#DailyGirlRewards").attr('src', DailyGirl + DailyGirl3)
    }
}

//Pantheon /addons

if (realPage == 'pantheon') {
    $('#pantheon_tab_container .temple-name-bgr .text-container > div').each(function() {
        const LVL = $(this).text().replace("Lvl", "LvL")
        $(this).text(LVL)
    })
}

//Harem /addons
if (realPage == 'harem') {
    $('#harem_left .right .g_infos .lvl > span').each(function() {
        const LVL = $(this).text().replace("Lvl", "LvL")
        $(this).text(LVL)
    })
}

//HH++ script
/*if (page = 'home.html') {


    $('#contains_all .hh-plus-plus-config-panel').each(function() {
        //just adding display: none; always (not like market)
        $('.hh-plus-plus-config-panel .config-setting:is([rel="core_marketHideSellButton"])').addClass('hiddenHHConfig')
        //Hide Config that can conflict with this script
        $('#contains_all .hh-plus-plus-config-panel').append('<label type="button" id="ShowHHConfig" class="hiddenHHConfig"><span id="show_HHConfig_terminal"><img title="Show Hidden Config" src="https://hh2.hh-content.com/quest/ic_eyeclosed.svg"></span></label>')
        //Show Config that can conflict with this script
        $('#contains_all .hh-plus-plus-config-panel').append('<label type="button" id="HideHHConfig" class=""><span id="show_HHConfig_terminal"><img title="Hide red Config" src="https://hh.hh-content.com/quest/ic_eyeopen.svg"></span></label>')
    })
    document.querySelector("#ShowHHConfig").onclick = function() {addHiddenHHConfig()};
    document.querySelector("#HideHHConfig").onclick = function() {delHiddenHHConfig()};

    //function for faster PoP button#pop #pop_info label#HiddenPoP
    function addHiddenHHConfig() {
        $('#contains_all .hh-plus-plus-config-panel .config-setting:is([rel="core_marketHideSellButton"])').addClass('hiddenHHConfig')
        $('#pop_info label#ShowHHConfig').addClass('hiddenHHConfig')//only for eye-button
        $('#pop_info label#HideHHConfig').removeClass('hiddenHHConfig')//only for eye-button
    }
    function delHiddenHHConfig() {
        $('#contains_all .hh-plus-plus-config-panel.config-setting:is([rel="core_marketHideSellButton"])').removeClass('hiddenHHConfig')
        $('#pop_info label#ShowHHConfig').removeClass('hiddenHHConfig')//only for eye-button
        $('#pop_info label#HideHHConfig').addClass('hiddenHHConfig')//only for eye-button
    }
}*/

/*New Homescreen*/
/*if (page == 'home.html' || page == 'homepage.html') {*/
if (realPage == 'home') {
	const questContainer = '<div class="quest-container"></div>'
	const noWaifuDisplay = $('#homepage .main-container .left-side-container .quest-container')
	if (!$('#homepage .main-container .waifu-container > img').length && !$('#homepage .main-container .waifu-container > canvas').length) {
		noWaifuDisplay.addClass('NoWaifuSelected')
	}
	$('#homepage .main-container .middle-container .waifu-and-right-side-container .right-side-container .event-widget-container .bundles').addClass('Fucking-Bundles')

	if (!$("#homepage .main-container .left-side-container .quest-container:has('a[rel=sex-god-path]')").length) {
		$('#homepage .main-container .left-side-container a[rel=sex-god-path]').wrap(questContainer) // must be created befor adding CSS-Define Button
	}
	if (!$("#homepage .main-container .left-side-container .quest-container:has('a[rel=clubs]')").length) {
		$('#homepage .main-container .left-side-container a[rel=clubs]').wrap(questContainer) // must be created befor adding CSS-Define Button
	}
	if (!$("#homepage .main-container .left-side-container .quest-container:has('a[rel=activities]')").length) {
		$('#homepage .main-container .left-side-container a[rel=activities]').wrap(questContainer) // must be created befor adding CSS-Define Button
	} // must be created befor adding CSS-Define Button
	$("#homepage .main-container .left-side-container .quest-container:has('a[rel=sex-god-path]')").append(`<div class="CSS-Container CSS-Container-sex-god-path">`+CSSsChampion+``+CSSsPhanteon+`</div>`)
	$("#homepage .main-container .left-side-container .quest-container:has('a[rel=clubs]')").append(`<div class="CSS-Container CSS-Container-clubs">`+CSSsClubChampion+`</div>`)
	$("#homepage .main-container .left-side-container .quest-container:has('a[rel=activities]')").append(`<div class="CSS-Container CSS-Container-activities">`+CSSsDailyGoal+``+CSSsMission+``+CSSsContests+`</div>`)
	$("div.script-home-shortcut-container:has('.script-home-shortcut-club-champ')").remove()
	$("div.script-home-shortcut-container:has('.script-home-shortcut-pantheon')").remove()
}



/*if (realPage == 'shop') {
	const CSSDefine_GirlsListNav = '<div class="CSSDefine_GirlsListNav"></div>'
	const CSSDefine_ArrowLeft = '<span nav="left"></span>'
	const CSSDefine_ArrowRight = '<span nav="right"></span>'
	$('#shops #girls_list').prepend(CSSDefine_GirlsListNav)
	$('#shops #girls_list .CSSDefine_GirlsListNav').prepend(CSSDefine_ArrowLeft)
	$('#shops #girls_list .CSSDefine_GirlsListNav').prepend(CSSDefine_ArrowRight)
	//$('#shops #girls_list .CSSDefine_GirlsListNav').prepend($('#shops #girls_list span[nav=left]'))
	//$('#shops #girls_list .CSSDefine_GirlsListNav').prepend($('#shops #girls_list span[nav=right]'))
	$('#shops #girls_list span[nav][nav=left]').attr('generic-tooltip', '\"A\" or  \"ArrowLeft\"')
	$('#shops #girls_list span[nav][nav=right]').attr('generic-tooltip', '\"D\" or  \"ArrowRight\"')
	//event for GirlListNav
	document.addEventListener('keydown', shop_GirlListNav)
}*/

if (realPage == 'event') {
	document.addEventListener('keydown', bossBang)
}

/*if (realPage == 'shop') {
		if ($('#shops_left #shop .potion.selected')) {
		$('#shops_left #shop .potion.selected:first-child').attr('lol', '\"A\" or  \"ArrowLeft\"')
		document.addEventListener('keydown', shop_GirlListNav)
	}
}*/


/*!♥Koͨmͧiͭnͥoͤ Style♥!*/


function shop_GirlListNav(e) {
	//this adds A & LeftArrow
	if (e.key == 'a' || e.key == 'ArrowLeft') {
		$('#shops #girls_list span[nav][nav=left]').click()
	}
	if (e.key == 'd' || e.key == 'ArrowRight') {
		$('#shops #girls_list span[nav][nav=right]').click()
	}
}










