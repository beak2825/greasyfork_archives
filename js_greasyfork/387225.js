// ==UserScript==
// @name       Neopets - Sidebar Dailies
// @author     diceroll123
// @description     test
// @grant      GM_getValue
// @grant      GM_setValue
// @require    http://code.jquery.com/jquery-latest.js
// @match      http://www.neopets.com/*
// @version 0.0.1.20190706065936
// @namespace https://greasyfork.org/users/315820
// @downloadURL https://update.greasyfork.org/scripts/387225/Neopets%20-%20Sidebar%20Dailies.user.js
// @updateURL https://update.greasyfork.org/scripts/387225/Neopets%20-%20Sidebar%20Dailies.meta.js
// ==/UserScript==

if(!$(".sidebar").length) {
    return;
}

function isNST(this_hour, this_ampm) {
    nh = unsafeWindow.nh;
    na = unsafeWindow.na;
    return (this_hour == nh && this_ampm == na);
}

if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

function timestamp() {
    return new Date().getTime();
}

maincollapsed = GM_getValue("maincollapsed", false);

// premium styles
$("<style type='text/css'>.sidebarModule .dailiesdrop ul#btn_list{list-style:none;margin:auto;padding:0;}.dailiesdrop ul#btn_list li{float:left;outline:2px grey solid;height:28px;width:54px;margin:4px 8px;padding:0;position:static;z-index:auto}</style>").appendTo("head");

$("<style type='text/css'>div.dailies_bg_map{background-image:url(http://images.neopets.com/premium/2012/bar/daily-icons-1408.png) !important;display:block;width:54px;height:28px}div.councilchamber { background-position: 0px 0px; } div.wheelofknowledge { background-position: -54px 0px; } div.wiseoldking { background-position: -108px 0px; } div.grundo { background-position: -162px 0px; } div.caverns { background-position: -216px 0px; } div.crossword { background-position: -270px 0px; } div.healing { background-position: 0px -28px; } div.jhudora { background-position: -54px -28px; } div.wheelofexcitement { background-position: -108px -28px; } div.applebobbing { background-position: -162px -28px; } div.braintree { background-position: -216px -28px; } div.desertedfariground { background-position: -270px -28px; } div.esophagor { background-position: 0px -56px; } div.testyourstrength { background-position: -54px -56px; } div.wheelofmisfortune { background-position: -108px -56px; } div.withstower { background-position: -162px -56px; } div.anchormanagement { background-position: -216px -56px; } div.forgottenshore { background-position: -270px -56px; } div.treasureblackpawkeet { background-position: 0px -84px; } div.meteorcrash { background-position: -54px -84px; } div.coltzanshrine { background-position: -108px -84px; } div.fruitmachine { background-position: -162px -84px; } div.qasalanexpellibox { background-position: -216px -84px; } div.desertscratchcardkiosk { background-position: -270px -84px; } div.wheelofextravagance { background-position: 0px -112px; } div.yeoldefishingvortex { background-position: -54px -112px; } div.grumpyoldking { background-position: -108px -112px; } div.illusensglade { background-position: -162px -112px; } div.mysterioussymolhole { background-position: -216px -112px; } div.pickyourown { background-position: -270px -112px; } div.turdleracing { background-position: 0px -140px; } div.turmaculus { background-position: -54px -140px; } div.darkcave { background-position: -108px -140px; } div.obsidianquarry { background-position: -162px -140px; } div.desertedtomb { background-position: -216px -140px; } div.mysteryislandkitchen { background-position: -270px -140px; } div.tikitacktombola { background-position: 0px -168px; } div.dailypuzzle { background-position: -54px -168px; } div.giantjelly { background-position: -108px -168px; } div.thelaboratory { background-position: -162px -168px; } div.monthlyfreebies { background-position: -216px -168px; } div.theneopianlottery { background-position: -270px -168px; } div.thepetpetlaboratory { background-position: 0px -196px; } div.thesoupkitchen { background-position: -54px -196px; } div.thewishingwell { background-position: -108px -196px; } div.deadlydice { background-position: -162px -196px; } div.lunartemple { background-position: -216px -196px; } div.adventcalendar { background-position: -270px -196px; } div.tmscratchcardkiosk { background-position: 0px -224px; } div.thesnowfaeriesquests { background-position: -54px -224px; } div.thesnowager { background-position: -108px -224px; } div.giantomlette { background-position: -162px -224px; } div.wheelofmediocrity { background-position: -216px -224px; } div.wheelofmonotony { background-position: -270px -224px; } div.leverofdoom { background-position: 0px -252px; } div.mysteriousnegg { background-position: 0px -280px; } div.gravedanger { background-position: -54px -280px; } div.coincidence { background-position: -108px -280px; } div.kikopop { background-position: -162px -280px; }</style>").appendTo("head");

$("<style type='text/css'> .dailydisabled { -webkit-filter: grayscale(100%); -webkit-transition: all 500ms; filter: grayscale(100%); transition: all 500ms; }</style>").appendTo("head");
$("<style type='text/css'> .dailyheader { padding: 1px; cursor: pointer; }</style>").appendTo("head");
$("<style type='text/css'> .sidebar #btn_list { width:140px !important; }</style>").appendTo("head");

$('<style type="text/css"> .arrow { width: 13px; height: 13px; background-image: url("data:image/png;base64,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"); }</style>').appendTo("head");
$('<style type="text/css"> .arrow.down {-moz-transform: scaleY(-1); -webkit-transform: scaleY(-1); transform: scaleY(-1); }</style>').appendTo("head");

names = {"cap_adventcalendar": "Advent Calendar", "cap_anchormanagement": "Anchor Management", "cap_applebobbing": "Apple Bobbing", "cap_braintree": "Brain Tree", "cap_caverns": "Faerie Caverns", "cap_coincidence": "Coincidence", "cap_coltzanshrine": "Coltzan's Shrine", "cap_councilchamber": "Council Chamber", "cap_crossword": "Faerie Crossword", "cap_dailypuzzle": "Daily Puzzle", "cap_darkcave": "Dark Cave", "cap_deadlydice": "Deadly Dice", "cap_desertedfariground": "Deserted Fairground Scratchcards", "cap_desertedtomb": "Deserted Tomb", "cap_desertscratchcardkiosk": "Lost Desert Scratchcards", "cap_esophagor": "Esophagor", "cap_forgottenshore": "Forgotten Shore", "cap_fruitmachine": "Fruit Machine", "cap_giantjelly": "Giant Jelly", "cap_giantomlette": "Giant Omelette", "cap_gravedanger": "Grave Danger", "cap_grumpyoldking": "Grumpy Old King", "cap_grundo": "The Discarded Magical Blue Grundo Plushie of Prosperity", "cap_healing": "Healing Springs", "cap_illusensglade": "Illusen's Quest", "cap_jhudora": "Jhudora's Quest", "cap_kikopop": "Kiko Pop", "cap_slorg": "Rich Slorg", "cap_leverofdoom": "Lever of Doom", "cap_lunartemple": "Lunar Temple", "cap_meteorcrash": "Meteor Crash Site725-XZ", "cap_monthlyfreebies": "Monthly Freebies", "cap_mysteriousnegg": "Negg Cave", "cap_mysterioussymolhole": "Mysterious Symol Hole", "cap_mysteryislandkitchen": "Kitchen Quest", "cap_obsidianquarry": "Obsidian Quarry", "cap_pickyourown": "Pick Your Own", "cap_qasalanexpellibox": "Qasalan Expellibox", "cap_testyourstrength": "Test Your Strength", "cap_thelaboratory": "Lab Ray", "cap_theneopianlottery": "The Neopian Lottery", "cap_thepetpetlaboratory": "Petpet Lab Ray", "cap_thesnowager": "Snowager", "cap_thesnowfaeriesquests": "Snow Faerie Quests", "cap_thesoupkitchen": "Soup Kitchen", "cap_thewishingwell": "The Wishing Well", "cap_tikitacktombola": "Tombola", "cap_tmscratchcardkiosk": "Scratchcard Kiosk", "cap_treasureblackpawkeet": "Buried Treasure", "cap_turdleracing": "Turdle Racing", "cap_turmaculus": "Turmaculus", "cap_wheelofexcitement": "Wheel of Excitement", "cap_wheelofextravagance": "The Wheel of Extravagance", "cap_wheelofknowledge": "Wheel of Knowledge", "cap_wheelofmediocrity": "Wheel of Mediocrity", "cap_wheelofmisfortune": "Wheel of Misfortune", "cap_wheelofmonotony": "Wheel of Monotony", "cap_wiseoldking": "Wise Old King", "cap_withstower": "The Witch's Tower", "cap_yeoldefishingvortex": "Underwater Fishing"};

style = maincollapsed === true ? "display: none;" : "";

container = '\
<table border="0" cellpadding="0" cellspacing="0" class="sidebarTable {0}container">\
                        <tr>\
                            <td style="background-color: rgb(239, 239, 239);" width="140" class="activePet sf dailyheader" id="{0}">\
                                <b>{1}</b>\
                            </td>\
                        </tr>\
                        <tr>\
                            <td class="activePet sf" align="center" valign="center" height="18" style="border-bottom-color: transparent;">\
                                <div class="dailies dailiesdrop">\
                                    <ul id="btn_list" class="{0}">\
                                    </ul>\
                                </div>\
                            </td>\
                        </tr>\
                    </table>\
                    <p class="{0}container"/>';

module = '\
<div class="sidebarModule" style="margin-bottom: 7px;">\
  <table width="158" cellpadding="2" cellspacing="0" border="0" class="sidebarTable">\
    <tbody>\
      <tr>\
          <td valign="middle" class="sidebarHeader medText dailiesheader"><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" class="arrow" style="float: right; cursor: pointer; margin-right: 3px;" border="0"> <img src="http://images.neopets.com/help/question_mark.png" id="sidebar_dailies_options" title="Options" style="float: right; cursor: pointer; margin-right: 3px;" border="0" height="13" width="13">Dailies</td>\
      </tr>\
            <tr id="dailiesoptions" style="display:none;">\
                <td class="activePet" style="padding:5px;">\
                    <table border="0" cellpadding="0" cellspacing="0" class="sidebarTable">\
                        <tr>\
                            <td style="background-color: rgb(239, 239, 239);" width="140" class="activePet sf">\
                                <b>Settings</b>\
                            </td>\
                        </tr>\
                        <tr>\
                            <td class="activePet sf" align="center" valign="center" height="18" style="border-bottom-color: transparent;">\
                                <button style="margin: 3px;" id="dailiesreset">Reset Timers</button>\
                            </td>\
                        </tr>\
                    </table>\
                </td>\
            </tr>\
\
            <tr id="dailiescollapse" style="' + style + '">\
                <td class="activePet dailiesOrganizer" style="padding:5px; border-bottom: transparent; max-width: 154px;"></td>\
            </tr>\
    </tbody>\
  </table>\
</div>';

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

categories = { // rearrange, delete as you please to sort categories in sidebar!
    'multiple': 'Multiple Per Day',
    'dailies': 'Dailies',
    'others': 'Others',
};

// optional "bg" object, mostly for custom buttons, will override the css. optional "cover" boolean parameter in bg, else contain
// "title", string. pretty necessary for custom ones.

buttons = {}; // feel free to remove, or rearrange

buttons['qasalanexpellibox']      = {url: "http://ncmall.neopets.com/mall/shop.phtml?page=giveaway", delay: 480, cat: 'multiple'};
buttons['healing']                = {url: "/faerieland/springs.phtml", delay: 30, cat: 'multiple'};

buttons['fruitmachine']           = {url: "/desert/fruit/index.phtml", delay: 1440, cat: 'dailies'};
buttons['slorg']                  = {url: "/shop_of_offers.phtml?slorg_payout=yes", delay: 1440, cat: 'dailies', bg: {img: 'https://i.imgur.com/1MfZ2Kk.png'}};
buttons['coltzanshrine']          = {url: "/desert/shrine.phtml", delay: 720, cat: 'dailies', reset_at_new_day: true};
buttons['tikitacktombola']        = {url: "/island/tombola.phtml", delay: 1440, cat: 'dailies'};
buttons['anchormanagement']       = {url: "/pirates/anchormanagement.phtml", delay: 1440, cat: 'dailies'};
buttons['forgottenshore']         = {url: "/pirates/forgottenshore.phtml", delay: 1440, cat: 'dailies'};
buttons['grundo']                 = {url: "/faerieland/tdmbgpop.phtml", delay: 1440, cat: 'dailies'};
buttons['mysterioussymolhole']    = {url: "/medieval/symolhole.phtml", delay: 1440, cat: 'dailies'};
buttons['wiseoldking']            = {url: "/medieval/wiseking.phtml", delay: 1440, cat: 'dailies'};
buttons['grumpyoldking']          = {url: "/medieval/grumpyking.phtml", delay: 1440, cat: 'dailies'};
buttons['caverns']                = {url: "/faerieland/caverns/index.phtml", delay: 1440, cat: 'dailies'};
buttons['wheelofknowledge']       = {url: "/medieval/knowledge.phtml", delay: 1440, cat: 'dailies'};


buttons['monthlyfreebies']        = {url: "/freebies/", delay: -1, cat: 'once'}; // once per month!
buttons['adventcalendar']         = {url: "/winter/adventcalendar.phtml", delay: 1440, cat: 'once'}; // all month!

buttons['battledome']             = {url: "/dome/fight.phtml", delay: 1140, cat: 'others', title: "Battledome", bg: {img: 'https://i.imgur.com/2RmnjI1.png'}};
buttons['treasureblackpawkeet']   = {url: "/pirates/buriedtreasure/buriedtreasure.phtml?307,108", delay: 180, cat: 'others'};
buttons['rubbishdump']            = {url: "/medieval/rubbishdump.phtml", delay: 0, cat: 'others', title: "Rubbish Dump", bg: {img: 'https://i.imgur.com/0fkCXEB.png'}};
buttons['testyourstrength']       = {url: "/halloween/strtest/index.phtml", delay: 360, cat: 'others'};
buttons['desertedtomb']           = {url: "/worlds/geraptiku/tomb.phtml", delay: 1440, cat: 'others', bg: {img: 'https://i.imgur.com/UMrohe5.png'}};
buttons['gravedanger']            = {url: "/halloween/gravedanger/index.phtml", delay: 0, cat: 'others'};
buttons['coconutshy']             = {url: "/halloween/coconutshy.phtml", delay: 1440, cat: 'others', title: "Coconut Shy", bg: {img: "http://images.neopets.com/games/clicktoplay/ctp_490.gif", cover: true}};
buttons['wheelofextravagance']    = {url: "/desert/extravagance.phtml", delay: 1440, cat: 'others'};

buttons['MItraining']             = {url: "/island/fight_training.phtml?type=status", delay: 240, cat: 'teste', title: "Secret Ninja Training School", bg: {'img': 'http://images.neopets.com/neopedia/4_training.gif', cover: true}};
buttons['thelaboratory']          = {url: "/lab.phtml", delay: 1440, cat: 'teste'};
buttons['withstower']             = {url: "/halloween/witchtower.phtml", delay: 0, cat: 'teste'};
buttons['godori']                = {url: "/games/godori/godori.phtml", delay: 0, cat: 'teste', title: "Godori", bg: {img: 'https://i.imgur.com/zPE3QQm.png'}};
buttons['obelisk']                = {url: "/prehistoric/battleground/", delay: 1440, cat: 'teste', title: "Battleground of the Obelisk", bg: {img: 'https://i.imgur.com/92eoOr5.jpg'}};
buttons['kikopop']                = {url: "/worlds/kiko/kpop/", delay: 1440, cat: 'teste'};
buttons['thepet-petlaboratory']    = {url: "/petpetlab.phtml", delay: 1440, cat: 'teste'};
buttons['kadoatery']              = {url: "/games/kadoatery/index.phtml", delay: 0, cat: 'teste', title: "Kadoatery", bg: {img: 'https://i.imgur.com/oEOofHs.png'}};
buttons['thesnowager']            = {url: "/winter/snowager.phtml", delay: -1, cat: 'timed-'};


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(module).insertAfter(".sidebarModule:first");

$.each(categories, function(k, v) {
    $(".dailiesOrganizer").append(container.format(k, v));
});

$(".dailiesOrganizer").find("p:last-child").remove(); // so there's less wasted space...

$.each(buttons, function(k, v) {
    if(categories[v.cat]) {
        if(v.bg) {
            $(".dailies ul." + v.cat).append('<li id="' + k + '" class="daily"><a href="' + v.url + '"><div class="dailies_bg_map" style="background-image: url(' + v.bg.img + ') !important;background-size:' + (v.bg.cover === true ? 'cover' : 'contain') + ';background-repeat:no-repeat;background-position:center;"></div></a></li>');
        } else {
            $(".dailies ul." + v.cat).append('<li id="' + k + '" class="daily"><a href="' + v.url + '"><div class="dailies_bg_map ' + k + '"></div></a></li>');
        }
    }
});

dailiescache = GM_getValue("dailiescache", {});

function refresh() {
    dailiescache = GM_getValue("dailiescache", {});
    snowager = true;
    $('.dailies ul > li').each(function(k,v) {

        id = $(this).attr("id");

        if(dailiescache[id] !== undefined && dailiescache[id] > timestamp()) {
            $(this).addClass("dailydisabled");
        } else {
            $(this).removeClass("dailydisabled").removeClass("lock");
        }

        diff_day_and_hour_last = new Date(dailiescache[id]).getHours() !== new Date().getHours() || new Date(dailiescache[id]).getDay() !== new Date().getDay();

        if(id == "monthlyfreebies") { // monthly freebies!
            var last_time_month = new Date(dailiescache[id]).getMonth();

            if(last_time_month == new Date().getMonth()) {
                $(this).hide(); // already got it this month!
            } else {
                $(this).show();
            }
        }

        if(id == "adventcalendar") { // december only!
            var this_month = new Date().getMonth();

            if(this_month != 11) {
                $(this).hide();
            } else {
                $(this).show();
            }
        }

        if(id == "thesnowager") { // the snowager
            snowager = (isNST("6", "am") || isNST("2", "pm") || isNST("10", "pm"));
            if(diff_day_and_hour_last && snowager) {
                $(this).removeClass("dailydisabled");
            } else {
                $(this).addClass("dailydisabled");
            }
        }

        if(id == "tmscratchcardkiosk") { // Terror Mountain Kiosk
            if(isNST("9", "am") || isNST("1", "pm")) {
                $(this).addClass("dailydisabled");
            } else {
                if(dailiescache[id] < timestamp()) {
                    $(this).removeClass("dailydisabled");
                }
            }
        }

        if(id == "desertscratchcardkiosk") { // Lost Desert Kiosk
            if(isNST("10", "am") || isNST("2", "pm")) {
                $(this).addClass("dailydisabled");
            } else {
                if(dailiescache[id] < timestamp()) {
                    $(this).removeClass("dailydisabled");
                }
            }
        }

        if(id == "grumpyoldking" || $(this).attr("id") == "wiseoldking") { // Kings
            if(isNST("8", "am") || isNST("1", "pm") || isNST("7", "pm")) {
                $(this).addClass("dailydisabled");
            } else {
                if(dailiescache[id] < timestamp()) {
                    $(this).removeClass("dailydisabled");
                }
            }
        }

        if(id == "tikitacktombola") { // Tombola
            if(isNST("3", "am") || isNST("1", "pm") || isNST("9", "pm") || isNST("10", "pm") || isNST("11", "pm")) {
                $(this).addClass("dailydisabled");
            } else {
                if(dailiescache[id] < timestamp()) {
                    $(this).removeClass("dailydisabled");
                }
            }
        }
    });

    if(snowager === false) {
        // only show if (at least) one of them is available
        $(".timedcontainer").hide();
    } else {
        $(".timedcontainer").show();
    }
    visiblestuff();
}
setInterval(refresh, 10000);
refresh();
visiblestuff();

function get_name(id) {
    if(names['cap_' + id] !== undefined) {
        return names['cap_' + id];
    }

    if(buttons[id].title !== undefined) {
        return buttons[id].title;
    }
    return "Un-named Button";
}

$('.sidebarModule ul#btn_list li').each(function (index,item) {
    id = $(this).attr('id');

    $(this).find("a").attr("title", get_name(id));
    $('.sidebarModule ul#btn_list li#'+id).hover(function() {
        $('.sidebarModule ul#btn_list li').css('outline','2px grey solid');
        id = $(this).attr('id');
        $('.sidebarModule ul#btn_list li#'+id).css('outline','2px yellow solid');
    },function() {
        $('.sidebarModule ul#btn_list li#'+id).css('outline','2px grey solid');
    });
});

function visiblestuff() {
    if(GM_getValue("maincollapsed", false)) {
        $("#dailiescollapse").hide();
        $(".arrow").addClass("down");
        $(".arrow").attr("title", "Expand");
    } else {
        $("#dailiescollapse").show();
        $(".arrow").removeClass("down");
        $(".arrow").attr("title", "Contract");
    }

    if($("#dailiesoptions, #dailiescollapse").is(":visible")) {
        $(".dailiesheader").css("border-bottom-width", "2px");
    } else {
        $(".dailiesheader").css("border-bottom-width", "0px");
    }

    $.each(categories, function(k,v) {
        if(GM_getValue(k + "collapsed", false)) {
            $("ul." + k).parent().parent().parent().hide();
            $(".dailyheader#" + k).css("border-bottom-width", "0px");
        } else {
            $("ul." + k).parent().parent().parent().show();
            $(".dailyheader#" + k).css("border-bottom-width", "2px");
        }
    });
}

function reset() {
    if(confirm("Are you sure you want to reset your timers?") === true) {
        GM_setValue("dailiescache", {});
        refresh();
    }
}

$("#dailiesreset").on("click", reset);

$("#sidebar_dailies_options").on("click", function(e) {
    $("#dailiesoptions").toggle();
    visiblestuff();
});

$(".arrow").on("click", function() {
    GM_setValue("maincollapsed", !GM_getValue("maincollapsed", false));
    visiblestuff();
});

$(".dailyheader").on("click", function(e) {
    GM_setValue($(this).attr("id") + "collapsed", !GM_getValue($(this).attr("id") + "collapsed", false));
    visiblestuff();
});

function getTomorrow() {
    nh = unsafeWindow.nh;
    nm = unsafeWindow.nm;
    na = unsafeWindow.na;
    ns = unsafeWindow.ns;
    // this is way easier than doing math with different timezones.
    var hrs = (23 - (na == "pm" ? (nh == 12 ? 12 : nh + 12) : (nh == 12 ? 0 : nh))) * 3600 * 1000;
    var mins = (59 - nm) * 60 * 1000;
    var secs = (59 - ns) * 1000;

    var today = new Date();
    today.setTime(today.getTime() + hrs + mins + secs);
    return today.getTime();
}

$(".daily").on("click", function(e) {
    if($(this).hasClass("lock")) {
        e.preventDefault();
    }
});

$(".daily").on("mouseup", function(e) {
    id = $(this).attr("id");

    thisdaily = buttons[id];

    if($(this).hasClass("dailydisabled")) {
        if (dailiescache[id] !== undefined) { // if it's undefined, the daily is down for an hour or something... out to lunch etc
            totalseconds = (dailiescache[id] - timestamp()) / 1000;

            var hours   = Math.floor(totalseconds / 3600);
            var minutes = Math.floor((totalseconds - (hours * 3600)) / 60);
            var seconds = Math.floor(totalseconds - (hours * 3600) - (minutes * 60));

            message = (((hours > 0) ? "{0}hr" + ((hours > 1) ? "s" : "") + ", " : "") + "{1}m, {2}s").format(hours, minutes, seconds);

            do_the_thing = confirm(get_name(id) + " time remaining: " + message + "\n\nClicking OK will take you there without resetting your timer!");

            if(do_the_thing === false) {
                $(this).addClass("lock");
            } else {
                $(this).removeClass("lock");
            }
        } else {
            $(this).addClass("lock");
        }
    } else {
        if(thisdaily.delay !== 0 && thisdaily.delay !== -1) {
            $(this).addClass("dailydisabled");
        }

        tomorrow = getTomorrow();
        would_be = timestamp() + thisdaily.delay * 60000;

        if(thisdaily.delay == 1440 || (thisdaily.reset_at_new_day !== undefined && thisdaily.reset_at_new_day === true && tomorrow < would_be)) {
            dailiescache[id] = tomorrow;
        } else if (thisdaily.delay !== 0) {
            dailiescache[id] = would_be;
        }

        GM_setValue("dailiescache", dailiescache);
    }
});
