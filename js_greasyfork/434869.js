// ==UserScript==
// @name         GGn site links
// @namespace    https://orbitalzero.ovh/scripts
// @version      0.96
// @include      *
// @description  Helps users to easily retrieve info on a game from various sites
// @author       NeutronNoir (minor fixes by ZeDoCaixao and KSS)
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/434869/GGn%20site%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/434869/GGn%20site%20links.meta.js
// ==/UserScript==
/* globals jQuery, $ */



(function() {
    var links = GM_getValue("links", "{}");

    if (window.location.hostname == "gazellegames.net") {
        links.active = false;
        links.ratings_active = false;
        if (document.URL.indexOf("/torrents.php?action=editgroup") != -1) add_search_buttons();
    }
    else {
        if (typeof links.active != "undefined" && links.active === true) add_validate_button();
        if (typeof links.ratings_active != "undefined" && links.ratings_active === true) add_ratings_validate_button();
    }
    GM_addStyle(button_css());
})();

function add_search_buttons() {

    $("#reviews_table>tbody").after('<tr><td><input id="search_ratings" type="button" value="Search Ratings"/><input id="validate_ratings" type="button" value="Validate Ratings"/></td></tr>');

    $("#search_ratings").click(function () {
        var title = encodeURIComponent($("h2>a").text());
//        if (typeof console.log !== "undefined" && typeof console.log != "undefined") console.log(title);

        var links = {};
        links.websites = [];
        links.ratings = {};
        links.ratings_active = true;
        GM_setValue("links", links);

        window.open("http://www.metacritic.com/search/game/="+title+"/results", '_blank');
        window.open("http://www.ign.com/search?q=" + title + "&type=object&objectType=game&filter=games", '_blank');
        window.open("http://www.gamespot.com/search/?q="+title, '_blank');
    });

    $("#validate_ratings").click(function () {
        var links = GM_getValue("links", "{}");
        links.websites.forEach( function (link) {
            if (link.indexOf("metacritic.com") != -1) $("#metauri").val(link);
            else if (link.indexOf("ign.com") != -1) $("#ignuri").val(link);
            else if (link.indexOf("gamespot.com") != -1) $("#gamespotscoreuri").val(link);
        });

        if (typeof links.ratings.metacritic !== "undefined") $("#meta").val(links.ratings.metacritic);
        if (typeof links.ratings.ign !== "undefined") $("#ignscore").val(links.ratings.ign);
        if (typeof links.ratings.gamespot !== "undefined") $("#gamespotscore").val(links.ratings.gamespot);

        links = {};
        GM_deleteValue("links");
    });



    $("#gameswebsiteuri").after('<input id="search_weblinks" type="button" value="Search WebLinks"/><input id="validate_weblinks" type="button" value="Validate WebLinks"/>');

    $("#search_weblinks").click(function() {
        var title = encodeURIComponent($("h2>a").text());
//        if (typeof console.log !== "undefined" && typeof console.log != "undefined") console.log(title);
        var links = {};
        links.websites = [];
        links.active = true;
        GM_setValue("links", links);

        for (let row of $("#weblinks_edit")[0].rows) {window.open(row.children[0].children[0].href)};

    });

    $("#validate_weblinks").click( function () {
        var links = GM_getValue("links", "{}");
//        console.log(links);
        var links_official = [];
        links.websites.forEach( function (link) {
            if (link.indexOf("wikipedia.org") != -1) $("#wikipediauri").val(link);    //All
            else if (link.indexOf("giantbomb.com") != -1) $("#giantbomburi").val(link);
            else if (link.indexOf("howlongtobeat.com") != -1) $("#howlongtobeaturi").val(link);
            else if (link.indexOf("amazon.com") != -1) $("#amazonuri").val(link);
            else if (link.indexOf("gamefaqs.gamespot.com") != -1) $("#gamefaqsuri").val(link);

            else if (link.indexOf("vndb.org") != -1) $("#vndburi").val(link);    //PC
            else if (link.indexOf("store.steampowered.com") != -1) $("#steamuri").val(link);
            else if (link.indexOf("gog.com") != -1) $("#goguri").val(link);
            else if (link.indexOf("humblebundle.com") != -1) $("#humbleuri").val(link);
            else if (link.indexOf("itch.io") != -1) $("#itchuri").val(link);
            else if (link.indexOf("origin.com") != -1) $("#originuri").val(link);
            else if (link.indexOf("pcgamingwiki.com") != -1) $("#pcwikiuri").val(link);
            else if (link.indexOf("nexusmods.com") != -1) $("#nexusmodsuri").val(link);
            else if (link.indexOf("epicgames.com") != -1) $("#epicgamesuri").val(link);

            else if (link.indexOf("playstation.com") != -1) $("#psnuri").val(link);    //PS3-4

            else if (link.indexOf("marketplace.xbox.com") != -1) $("#xboxuri").val(link);    //XBox 360-One

            else if (link.indexOf("itunes.apple.com") != -1) $("#itunesuri").val(link);    //Mac/iOS

            else if (link.indexOf("rpggeek.com") != -1) $("#rpggeekuri").val(link);    //Pen and paper
            else if (link.indexOf("index.rpg.net") != -1) $("#rpgneturi").val(link);
            else if (link.indexOf("drivethrurpg.com") != -1) $("#drivethrurpguri").val(link);

            else if (link.indexOf("play.google.com") != -1) $("#googleplayuri").val(link);    //Android

            else if (link.indexOf("mobygames.com") != -1) $("#mobygamesuri").val(link);    //Retro

            else links_official.push(link);
        });

        if (links_official.length > 0) $("#gameswebsiteuri").val(links_official[0]);

        links = {}
        GM_deleteValue("links");
    });
}


function add_ratings_validate_button() {
//    if (typeof console != "undefined" && typeof console.log != "undefined") console.log("Adding button to window");
    $("body").prepend('<input type="button" id="save_link" value="Save  external  link"/>');
    $("#save_link").click( function() {
        var links = GM_getValue("links", "{}");
        links.websites.push(document.URL.replace(/\?.*/, ""));
        if (window.location.hostname.indexOf("metacritic.com") != -1) links.ratings.metacritic = $(document.getElementsByClassName('metascore_anchor')).first().text().trim();
        else if (window.location.hostname.indexOf("ign.com") != -1) links.ratings.ign = $(document.getElementsByClassName('jsx-2972926274 hexagon-content')).first().text().trim();
        else if (window.location.hostname.indexOf("gamespot.com") != -1)links.ratings.gamespot = $(document.getElementsByClassName('review-ring-score__score text-bold')).first().text().trim();
        GM_setValue("links", links);
        window.close();
    });
}


function add_validate_button() {
//    if (typeof console != "undefined" && typeof console.log != "undefined") console.log("Adding button to window");
    $("body").prepend('<input type="button" id="save_link" value="Save  external  link"/>');
    $("#save_link").click( function() {
        var links = GM_getValue("links", "{}");
        links.websites.push(document.URL);
        GM_setValue("links", links);
        window.close();
    });
}

function button_css () {
    return "\
        #save_link {\
            position: fixed;\
            left: 0;\
            top: 0;\
            z-index: 9999999;\
            cursor: pointer;\
            height: 5vh;\
            width: 10vh;\
            background-color: lightblue;\
        }\
    ";
}
