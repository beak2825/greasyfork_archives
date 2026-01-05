// ==UserScript==
// @name         steamgifts rating and platforms
// @namespace    Gidden
// @version      2.2
// @description  Show rating and supported platforms on sitesteamgifts.com according information from store.steampowered.com
// @require      http://code.jquery.com/jquery.min.js
// @author       Gidden
// @match        http://www.steamgifts.com/
// @match        http://www.steamgifts.com/giveaways/search?*
// @match        https://www.steamgifts.com/
// @match        https://www.steamgifts.com/giveaways/search?*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/10478/steamgifts%20rating%20and%20platforms.user.js
// @updateURL https://update.greasyfork.org/scripts/10478/steamgifts%20rating%20and%20platforms.meta.js
// ==/UserScript==

// Storage existence test
function supports_html5_storage() {
  try {
    return 'localStorage' in window && window.localStorage !== null;
  } catch (e) {
    return false;
  }
}

// Get color according percentage (0% = Red, 100% = Green)
function getColor(value){
    //value from 0 to 1
    var hue=((value)*120).toString(10);
    return ["hsl(",hue,",100%,42%)"].join("");
}

var platforms = ["win", "mac", "linux", "steamplay"];

// Get actual configuration from storage
function getFilterCfg(myItem)
{
    if (myItem == "percentage") {
        myValue = 0;
    } else {
        myValue = 1;
    }
    if (supports_html5_storage()) {
        if (localStorage.getItem(myItem) !== null) {
            myValue = localStorage.getItem(myItem);
        }
    }
    return myValue;
}

// Store information about game
function saveGameData(url, data) {
    if (supports_html5_storage()) {
        localStorage.setItem(url,  JSON.stringify(data));
    }
}

// Get stored information about game
function loadGameData(url) {
    var myValue = null;
    if (supports_html5_storage()) {
        myValue = localStorage.getItem(url);
        if (myValue) {
            myValue = JSON.parse(myValue);
        }
    }
    return myValue;
}

// Filtering functions
var filterFunction = "" +
"var platforms = [\"win\", \"mac\", \"linux\", \"steamplay\"];" +
"function supports_html5_storage() {" +
"  try {" +
"    return 'localStorage' in window && window.localStorage !== null;" +
"  } catch (e) {" +
"    return false;" +
"  }" +
"}" +
"function saveFilterCfg()" +
"{" +
"    if (supports_html5_storage()) {" +
"        for (var x in platforms){" +
"            platform = platforms[x];" +
"            if (document.getElementById(\"filter_\" + platform).checked) {" +
"                localStorage.setItem(platform, 1);" +
"            } else {" +
"                localStorage.setItem(platform, 0);" +
"            }" +
"        }" +
"    if (document.getElementById(\"filter_level\").checked) {" +
"        localStorage.setItem(\"level\", 1);" +
"    } else {" +
"        localStorage.setItem(\"level\", 0);" +
"    }" +
"        localStorage.setItem(\"percentage\", document.getElementById(\"filter_percentage\").value);" +
"    }" +
"}" +
"function changeFilter(){" +
"" +
"    platformCheck = [];" +
"    for (var x in platforms){" +
"        platform = platforms[x];" +
"        if (document.getElementById(\"filter_\" + platform).checked) {" +
"            platformCheck.push(platform);" +
"        }" +
"    }" +
"    percCheck = document.getElementById(\"filter_percentage\").value;" +
"" +
"    var headers = $(\"div.giveaway__summary h2.giveaway__heading\");" +
"" +
"    headers.each(function() {" +
"        var header = $(this);" +
"        var showEl = true;" +
"" +
"        if (document.getElementById(\"filter_level\").checked){" +
"            if (header.parent().find(\"div.giveaway__column--contributor-level--negative\").length) {" +
"                header.parent().parent().parent().hide();" +
"                return;" +
"            }" +
"        }" +
"" +
"        percE = header.find(\"span.percentage\");" +
"" +
"        if (percE.length)" +
"        {" +
"            var perc2 = percE[0].getAttribute(\"perc\");" +
"            if (perc2 < percCheck){" +
"                showEl = false;" +
"            } else {" +
"                showEl = false;" +
"                for (var x in platformCheck){" +
"                    actPlatformCheck = platformCheck[x];" +
"                    if (header.find(\"span.\"+actPlatformCheck).length) {" +
"                       showEl = true;" +
"                    }" +
"                }" +
"            }" +
"        }" +
"" +
"        if (showEl) {" +
"            header.parent().parent().parent().show();" +
"        } else {" +
"            header.parent().parent().parent().hide();" +
"        }" +
"    });" +
"    saveFilterCfg();" +
"}";

function renderPluginGame(header, gameData) {

    if ((header === null) || (gameData === null) || ("error" in gameData)){
        return;
    }

    // Remove old informations
    header.find("a.giveaway__icon span").remove();
    header.find("h2.giveaway__heading span").remove();

    var a_tag = header.find( "a.giveaway__icon" );
    var i_tag = header.find( "i.giveaway__icon" );
    if (! i_tag.length) {
        i_tag = a_tag;
    }
    a_tag.attr("style", "opacity:1");
    a_tag.find("i.fa-steam").attr("style", "opacity:.35");

    // Render perc + ppl
    if ("perc" in gameData) {
        var rating = gameData.perc + '% (' + gameData.ppl + ') ';
        a_tag.append(" <span style=\"color:" + getColor(gameData.perc /100.0) + "\" class=\"percentage\" perc=\"" + gameData.perc + "\">" + rating + "</span>");
    }

    // Render platforms
    if ("platforms" in gameData)
    {
        //a_tag.append(" <span>" + platform.html() + "</span>");
    }
    var platformsHtml = "<span>";
    for (var platf in gameData.platforms) {
        platformsHtml = platformsHtml + "<span class=\"platform_img " + platf + "\"></span>";
    }
    a_tag.append(platformsHtml + "</span>");

    // Render cards
    if (("cards" in gameData) && (gameData.cards)) {
        i_tag.after("<span class=\"platform_img right_allign\"><img src=\"http://store.akamai.steamstatic.com/public/images/v6/ico/ico_cards.png\"></span>");
    }

    if ((gameData.perc < getFilterCfg("percentage"))) {
        header.parent().parent().parent().hide();
    }

    hide = true;
    for (var x in platforms) {
        platformCheck = platforms[x];
        if ((gameData.platforms[platformCheck] || false) && (getFilterCfg(platformCheck) == 1)) {
            hide = false;
        }
    }
    if (hide) {
        header.parent().parent().parent().hide();
    }
}

function exportDataFromPage(steamURL, responseText, callFunction) {
    var gameData = {};
    gameData.ppl = false;
    gameData.perc = false;
    gameData.platforms = {};
    gameData.cards = false;
    gameData.fetchTime = new Date().getTime();

    var ratingFull = responseText.find("div.glance_ctn div[itemprop=aggregateRating]");

    if (!ratingFull.length) {
        gameData.error = true;
        saveGameData(steamURL, gameData);
    } else {
        ratingFull = ratingFull.attr("data-store-tooltip");

        // extract percentare review (perc) and peoples reviewed (ppl) variables.
        if (ratingFull.length > 0) {
            var ratingFullString = ratingFull.trim();
            var perc = ratingFullString.match("[0-9]+ ?%");
            if (perc === null) {
                perc = ratingFullString.match("% ?[0-9]+");
            }
            gameData.perc = perc[0].replace("%", "").replace(" ", "");
            ppl = ratingFullString.match(/[0-9,]+/g);
            if (ppl[0] == gameData.perc) {
                ppl = ppl[1];
            } else {
                ppl = ppl[0];
            }
            gameData.ppl = ppl.replace(",", ".");
        }

        // extract platforms
        var platform = responseText.find("div.game_area_purchase_platform");
        if (platform.length) {
            for (var x in platforms){
                var actPlatformCheck = platforms[x];
                if (platform.find("span."+actPlatformCheck).length) {
                    gameData.platforms[actPlatformCheck] = true;
                }
            }
        }

        // extract support of gaming cards
        var cards;
        if (platform.length) {
            cards = responseText.find("a[href*='http://store.steampowered.com/search/?category2=29']");
            gameData.cards = cards.length > 0;
        }


        // Save
        saveGameData(steamURL, gameData);

        //renderPluginGame(header, gameData);
        if (callFunction !== null) {
            callFunction(steamURL, gameData);
        }
    }
    return gameData;
}

function fetchSteamDate(steamURL, callFunction) {
    var gameData = {};

    GM_xmlhttpRequest({
        method: "GET",
        url: steamURL,
        context: steamURL,
//        synchronous: true,
        onload: function(response) {
            var responseText = $(response.responseText);
            var ageCheck = responseText.find("div#agegate_box");
            if (ageCheck.length) {
                GM_xmlhttpRequest({
                    method: "POST",
                    data: "snr=1_agecheck_agecheck__age-gate&ageDay=1&ageMonth=January&ageYear=1980",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    url: steamURL.replace("/app/","/agecheck/app/"),
                    context: steamURL,
                    onload: function(response) {
                        var responseText = $(response.responseText);
                        exportDataFromPage(steamURL, responseText, callFunction);
                    }
                });
            } else {
                exportDataFromPage(steamURL, responseText, callFunction);
            }
        }
    });

    return gameData;
}

// Generate html string for checkboxes
var checkboxes = "";
for (var x in platforms){
    platform = platforms[x];
    var checked = "";
    if (getFilterCfg(platform) == 1) {
        checked = "checked";
    }
    checkboxes += "<input class=\"filter_checkboxes\" type=\"checkbox\" name=\"filter_" + platform + "\" id=\"filter_" + platform + "\" onclick=\"changeFilter();\" " + checked + "><label class=\"checkboxes\" for=\"filter_" + platform + "\"><span class=\"platform_img " + platform + "\"></span></label>";
}

// New headers. Mainly css styles
$("head link:last")
.before("<link rel=stylesheet type=text/css href=https://steamstore-a.akamaihd.net/public/css/v6/store.css>")
.after("<style>span.platform_img {background-color: black; height:20px; display: inline-block; opacity: 0.35;} input.filter_checkboxes {height:15px; width:20px;} input.filter_percentage {height:18px; width:40px; margin:5px; padding:0px 10px;} label.checkboxes {margin-right:5px;}</style>")
.after("<style>span.percentage {font-size: medium; font-weight: bold;} h2.giveaway__heading {position:relative;} span img {width: 20px; height: 16px;} span.right_allign {position:absolute; right: 0; top: 0;}</style>")
.after("<script type=\"text/javascript\">" + filterFunction + "</script>");

var checkedLevel = "";
if (getFilterCfg("level") == 1) {
    checkedLevel = "checked";
}

// Appending left filter panel
filterPanel = "<h3 class=\"sidebar__heading\">Filter</h3><div style=\"margin-left:10px;\">" +
    " <span style=\"font-weight: bold;\">Game</span> &gt;= <input type=\"text\" class=\"filter_percentage\" id=\"filter_percentage\" value=\"" + getFilterCfg("percentage") + "\" onchange=\"changeFilter()\" onkeyup=\"changeFilter()\">% <br>" +
    checkboxes + "</br>" +
    "<input type=\"checkbox\" class=\"filter_checkboxes\" id=\"filter_level\" onclick=\"changeFilter();\" " + checkedLevel + "><label class=\"checkboxes\" for=\"filter_level\"><span style=\"font-weight: bold;\">Hide higher level</span></label>" +
    "</div>";

$("div.sidebar__search-container").after(filterPanel);

// Fetching steam for games information
var needFetch = {};
var headers = $("div.giveaway__summary h2.giveaway__heading");
var actTime = new Date().getTime();
headers.each(function() {
    var header = $(this);
    var iconElement = header.find("a.giveaway__icon");
    if (iconElement.length) {
        var steamURL = iconElement.attr("href").trim();

        if ((getFilterCfg("level") == 1) && (header.parent().find("div.giveaway__column--contributor-level--negative").length)) {
            header.parent().parent().parent().hide();
        }

        var gameData = loadGameData(steamURL);

        if (gameData === null) {
            needFetch[steamURL] = true;
        } else {
            renderPluginGame(header, gameData);

            // If game info are older than one day then fetch new info.
            if ((actTime - gameData.fetchTime) > 24*60*60*1000) {
                needFetch[steamURL] = true;
            }
        }
    }
});

function afterFetch(steamURL, gameData) {
    var headers = $("a[href=\"" + steamURL + "\"]");
    headers.each(function() {
        var header = $(this).parent();
        renderPluginGame(header, gameData);
    });
}

for(var steamURL in needFetch) {
    var gameData = fetchSteamDate(steamURL, afterFetch);
}