// ==UserScript==
// @name         Lex's SG Chart Maker
// @namespace    https://www.steamgifts.com/user/lext
// @version      0.3.18
// @description  Create bundle charts for Steam Gifts.
// @author       Lex
// @match        *://store.steampowered.com/app/*
// @match        *://store.steampowered.com/sub/*
// @match        *://store.steampowered.com/bundle/*
// @require      http://code.jquery.com/jquery-3.2.1.min.js
// @require      http://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @require      https://cdn.jsdelivr.net/npm/markdown-it@11.0.0/dist/markdown-it.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      api.isthereanydeal.com
// @connect      rafaelgssa.com
// @downloadURL https://update.greasyfork.org/scripts/32567/Lex%27s%20SG%20Chart%20Maker.user.js
// @updateURL https://update.greasyfork.org/scripts/32567/Lex%27s%20SG%20Chart%20Maker.meta.js
// ==/UserScript==

/* eslint curly: "off", no-prototype-builtins: 1 */
/* eslint-env jquery */

(function() {
    'use strict';

    //GM_deleteValue("gameOrder");
    //GM_deleteValue("games");
    if ("sets" in JSON.parse(GM_getValue("cardData", "{}"))) {
        console.log("Deleting old card data");
        GM_deleteValue("cardData");
    }
    var ITAD_API_KEY = GM_getValue("ITAD_API_KEY");
    const API_KEY_REGEXP = /[0-9A-Za-z]{40}/;
    const INVALIDATION_TIME = 60*60*1000; // 60 minute cache time
    const GameID = window.location.pathname.match(/(app|sub|bundle)\/\d+/)[0];
    const NOCV_ICON = "☠";
    const CARD_ICON = "❤";
    const ADULT_ICON = "🔞";
    const LEARNING_ICON = "⚙️";
    const LIMITED_ICON = "⛔";
    const FOOTER = "Chart created with [Lex's SG Chart Maker](https://www.steamgifts.com/discussion/ed1gC/userscript-lexs-sg-chart-maker)\n";
    const ACHIEVEMENTS_URL = "https://steamhunters.com/apps/{0}/achievements";
    // other possiblities: "DailyIndieGame" "GreenMan Gaming"
    const BUNDLE_BLACKLIST = ["Chrono.GG", "Chrono.gg", "Ikoid", "Humble Mobile Bundle", "PlayInjector", "Vodo",
                              "Get Loaded", "Indie Ammo Box", "MacGameStore", "PeonBundle", "Select n'Play", "StackSocial",
                              "StoryBundle", "Bundle Central", "Cult of Mac", "GOG", "Gram.pl", "Indie Fort", "IUP Bundle", "Paddle",
                              "SavyGamer", "Shinyloot", "Sophie Houlden", "Unversala", "Indie Game Stand", "Fourth Wall Games"];

    $("head").append ('<link ' +
        'href="//ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/base/jquery-ui.min.css" ' +
        'rel="stylesheet" type="text/css">'
    );

    // From https://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
    if (!String.format) {
      String.format = function(format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function(match, number) {
          return typeof args[number] != 'undefined'
            ? args[number]
            : match
          ;
        });
      };
    }

    // Promise wrapper for GM_xmlhttpRequest
    const Request = details => new Promise((resolve, reject) => {
        details.onerror = details.ontimeout = reject;
        details.onload = resolve;
        GM_xmlhttpRequest(details);
    });

    // Adapted from https://stackoverflow.com/questions/6108819/javascript-timestamp-to-relative-time
    function timeDifference(current, previous) {
        const msPerMinute = 60 * 1000;
        const msPerHour = msPerMinute * 60;
        const msPerDay = msPerHour * 24;
        const msPerMonth = msPerDay * 30;
        const msPerYear = msPerDay * 365;
        const elapsed = current - previous;
        if (elapsed < msPerMinute*2)
            return Math.floor(elapsed/1000) + ' seconds ago';
        else if (elapsed < msPerHour*2)
            return Math.floor(elapsed/msPerMinute) + ' minutes ago';
        else if (elapsed < msPerDay*2)
            return Math.floor(elapsed/msPerHour ) + ' hours ago';
        else if (elapsed < msPerMonth*2)
            return Math.floor(elapsed/msPerDay) + ' days ago';
        else if (elapsed < msPerYear*2)
            return 12*(current.getFullYear() - previous.getFullYear()) + (current.getMonth() - previous.getMonth()) + ' months ago';
        else
            return Math.floor(elapsed/msPerYear) + ' years ago';
    }

    function getGames() { return JSON.parse(GM_getValue("games", '{}')); }
    function getGameOrder() { return JSON.parse(GM_getValue("gameOrder", '[]')); }

    function generateQuickGuid() { return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15); }

    function getCachedJSONValue(key, default_value, invalidation_time) {
        try {
            let result = JSON.parse(GM_getValue(key));
            if ((new Date()).getTime() - result.UPDATE_TIME < (invalidation_time || INVALIDATION_TIME))
                return result;
        } catch (err) { }
        return default_value;
    }

    function setCachedJSONValue(key, value) {
        value.UPDATE_TIME = (new Date()).getTime();
        GM_setValue(key, JSON.stringify(value));
    }

    async function fetchNoCV() {
        const noCVData = getCachedJSONValue("noCVData", undefined, 48*60*60*1000); // 48 hour cache time for nocv data
        if (noCVData !== undefined) {
            return noCVData;
        }
        console.log("Downloading new No CV data");
        const response = await Request({
            method: "GET",
            url: "https://esgst.rafaelgomes.xyz/api/games/ncv",
            timeout: 30000
        });
        const jresp = JSON.parse(response.responseText);
        if (jresp && jresp.error == null) {
            setCachedJSONValue("noCVData", jresp.result.found);
            return jresp.result.found;
        }
    }

    // nocv is an object { apps: { }, subs: {} }
    async function loadNoCV() {
        const nocv = await fetchNoCV();
        const games = getGames();
        for (let g of Object.values(games)) {
            if (g.subid) {
                if (g.subid in nocv.subs)
                    g.noCV = true;
            } else if (g.appid in nocv.apps)
                g.noCV = true;
        }
        GM_setValue("games", JSON.stringify(games));
        dumpListing();
    }

    async function itad_gid_by_shopid(shopIds) {
        const response = await Request({
            method: "POST",
            url: "https://api.isthereanydeal.com/lookup/id/shop/61/v1?key=" + ITAD_API_KEY,
            data: JSON.stringify(shopIds)
        });
        return JSON.parse(response.responseText);
    }

    async function itad_getbundles(itadGid) {
        const response = await Request({
            method: "GET",
            url: "https://api.isthereanydeal.com/games/bundles/v2?key=" + ITAD_API_KEY + "&expired=true&id=" + itadGid
        });
        return JSON.parse(response.responseText);
    }

    // Functions for scraping data from an app page
    const appPage = {
        rating(context = document) {
            const tooltip = $("a[itemprop='aggregateRating']", context).attr('data-tooltip-html');
            if (!tooltip) return "?";
            const rating = tooltip.replace(/(\d+)%[^\d]*([\d,]*).*/, "$1% of $2 reviews");
            if (rating.startsWith("Need more")) {
                let total = parseInt($("label[for=review_type_all]", context).text().match(/[\d,]+/)[0].replace(/,/g,''));
                let pos = parseInt($("label[for=review_type_positive]", context).text().match(/[\d,]+/)[0].replace(/,/g,''));
                return Math.round(100*pos/total) + `% of ${total} reviews`;
            } else
                return rating;
        },
        appid: () => window.location.pathname.split('/')[2],
        name: (context=document) => context.querySelector(".apphub_AppName")?.firstChild?.textContent || "",
        price: (context=document) => context.querySelector(".game_area_purchase_game .price, .game_area_purchase_game .discount_original_price")?.textContent.trim() || "",
        usCurrentPrice: (context=document) => context.querySelector('div.es-regprice:has(span.es-flag-us)')?.textContent.trim().split(" ")[0],
        euCurrentPrice: (context=document) => [...context.querySelectorAll('div.es-regprice')].find(e => e.childNodes[2]?.textContent.includes("€"))?.textContent.trim().split(" ")[0],
        discountPercent: (context=document) => context.querySelector("div.discount_pct")?.textContent,
        windows: (context=document) => context.querySelector(".platform_img.win") !== null,
        mac: (context=document) => context.querySelector(".platform_img.mac") !== null,
        linux: (context=document) => context.querySelector(".platform_img.linux") !== null,
        steamDeck: (context=document) => context.querySelector("div[data-featuretarget='deck-verified-results'] span")?.textContent ?? "",
        steamDeckSVGPath: (context=document) => context.querySelector("div[data-featuretarget='deck-verified-results'] path")?.getAttribute("d") ?? "",
        achievements: (context=document) => context.querySelector("#achievement_block") !== null,
        achievementCount: (context=document) => context.querySelector("#achievement_block .block_title")?.textContent.match(/(\d+) /)?.[1],
        cards: (context=document) => context.querySelector("img.category_icon[src$='ico_cards.png']") !== null,
        cardCount: (context=document) => context.querySelector("div.es_cards_owned")?.innerText.match(/of (\d+)/)?.[1],
        learningAbout: (context=document) => context.querySelector("img.category_icon[src$='ico_learning_about_game.png']") !== null,
        profileLimited: (context=document) => context.querySelector("img.category_icon[src$='ico_info.png']") !== null,
        adultOnly: (context=document) => context.querySelector("div.mature_content_notice") !== null,
        dlc: (context=document) => context.querySelector(".game_area_dlc_bubble") !== null,
    };

    function addToGameOrder(gameid) {
        let gameOrder = getGameOrder();
        gameOrder.push(gameid);
        GM_setValue("gameOrder", JSON.stringify(gameOrder));

        loadNoCV();
    }

    // Add the current page's App to the chart
    // Does not work for package Subs
    function addAppToChart() {
        if (getGameOrder().includes(GameID)) // Game already in chart
            return;
        var game = {
            gameid: GameID,
            appid: appPage.appid(),
            name: appPage.name(),
            rating: appPage.rating(),
            windows: appPage.windows(),
            mac: appPage.mac(),
            linux: appPage.linux(),
            steamDeck: appPage.steamDeck(),
            steamDeckSVGPath: appPage.steamDeckSVGPath(),
            achievements: appPage.achievements(),
            achievementCount: appPage.achievementCount(),
            learningAbout: appPage.learningAbout(),
            profileLimited: appPage.profileLimited(),
            adultOnly : appPage.adultOnly(),
            cards: appPage.cards(),
            card_count: appPage.cardCount(),
            price: appPage.price(),
            discountPercent: appPage.discountPercent(),
            usCurrentPrice: appPage.usCurrentPrice(),
            euCurrentPrice: appPage.euCurrentPrice(),
            url: window.location.href,
            dlc: appPage.dlc(),
            bundles: undefined,
        };
        var games = getGames();
        games[GameID] = game;
        GM_setValue("games", JSON.stringify(games));

        addToGameOrder(GameID);
    }

    // From the main app/ page (not the sub/ page!), adds a sub listed like a deluxe edition
    // elem: the div for the package listing on the main app's page
    function addPackageToChart(elem) {
        const subid = elem.querySelector("input[name=subid]").value;
        const gameid = "sub/" + subid;
        if (getGameOrder().includes(gameid))
            return;
        var game = {
            gameid,
            appid: appPage.appid(),
            subid,
            name: elem.querySelector("h1")?.firstChild.nodeValue.substring(4).trim(),
            windows: appPage.windows(elem),
            mac: appPage.mac(elem),
            linux: appPage.linux(elem),
            steamDeck: appPage.steamDeck(),
            steamDeckSVGPath: appPage.steamDeckSVGPath(),
            achievements: appPage.achievements(),
            achievementCount: appPage.achievementCount(),
            learningAbout: appPage.learningAbout(),
            profileLimited: appPage.profileLimited(),
            adultOnly : appPage.adultOnly(),
            rating: appPage.rating(),
            cards: appPage.cards(),
            card_count: appPage.cardCount(),
            price: elem.querySelector(".price,.discount_original_price")?.textContent.trim(),
            url: window.location.protocol+"//store.steampowered.com/sub/" + subid,
            dlc: appPage.dlc(),
            bundles: undefined,
        };
        var games = getGames();
        games[gameid] = game;
        GM_setValue("games", JSON.stringify(games));

        addToGameOrder(gameid);
    }

    // Loads the rating for a gameid because sub pages do not have reviews
    // gameid is the gameid on the chart, appid is the Steam App ID to get the rating for
    async function getGameRating(gameid, appid) {
        const response = await Request({
            "method": "GET",
            "url": window.location.protocol+"//store.steampowered.com/app/" + appid
        });
        const dom = $(response.responseText);
        var games = getGames();
        let game = games[gameid];
        game.rating = appPage.rating(dom);
        game.achievements = appPage.achievements(dom);
        game.achievementCount = appPage.achievementCount(dom);
        game.appid = appid;
        GM_setValue("games", JSON.stringify(games));
        dumpListing();
    }

    // elem: the div for the package listing on the sub's page
    function addSubToChart(elem) {
        const subid = elem.find("input[name=subid]").attr("value");
        const gameid = "sub/" + subid;
        if (getGameOrder().includes(gameid)) // sub id already in the chart
            return;
        var game = {
            gameid: gameid,
            // appid: subid,
            subid: subid,
            name: elem.find("h1")[0].childNodes[0].nodeValue.substring(4).trim(),
            rating: "?",
            windows: appPage.windows(),
            mac: appPage.mac(),
            linux: appPage.linux(),
            steamDeck: appPage.steamDeck(),
            steamDeckSVGPath: appPage.steamDeckSVGPath(),
            achievements: appPage.achievements(),
            achievementCount: appPage.achievementCount(),
            learningAbout: appPage.learningAbout(),
            profileLimited: appPage.profileLimited(),
            adultOnly : appPage.adultOnly(),
            cards: appPage.cards(),
            card_count: appPage.cardCount(),
            price: $.trim(elem.find(".price,.discount_original_price").text()),
            url: window.location.protocol+"//store.steampowered.com/sub/" + subid,
            dlc: appPage.dlc(),
            bundles: undefined,
        };
        var games = getGames();
        games[gameid] = game;
        GM_setValue("games", JSON.stringify(games));

        // Submit an AJAX request to get the game's rating
        const appid = $(".tab_item:first").attr("data-ds-appid");
        getGameRating(gameid, appid);

        addToGameOrder(gameid);
    }

    function addBundleToChart(elem) {
        const bundleid = elem.attr('data-ds-bundleid');
        const gameid = "bundle/" + bundleid;
        if (getGameOrder().includes(gameid)) // game id already in the chart
            return;
        var game = {
            gameid: gameid,
            appid: bundleid,
            bundleid: bundleid,
            name: $.trim(elem.find("h1")[0].childNodes[0].nodeValue.substring(4)),
            rating: "?",
            achievements: appPage.achievements(),
            achievementCount: appPage.achievementCount(),
            windows: appPage.windows(),
            mac: appPage.mac(),
            linux: appPage.linux(),
            steamDeck: appPage.steamDeck(),
            steamDeckSVGPath: appPage.steamDeckSVGPath(),
            learningAbout: appPage.learningAbout(),
            profileLimited: appPage.profileLimited(),
            adultOnly : appPage.adultOnly(),
            cards: appPage.cards(),
            card_count: appPage.cardCount(),
            price: '?',
            url: window.location.protocol+"//store.steampowered.com/" + gameid,
            dlc: appPage.dlc(),
            bundles: undefined,
        };
        var games = getGames();
        games[gameid] = game;
        GM_setValue("games", JSON.stringify(games));

        // Submit an AJAX request to get the game's rating
        let appid = $(".tab_item:first").attr("data-ds-appid");
        getGameRating(gameid, appid);

        addToGameOrder(gameid);
    }

    // Called from the Load Bundle Info button
    async function loadBundleInfo() {
        const gameids = getGameOrder().filter(g => !g.startsWith("tier"));
        const itadGidMap = await itad_gid_by_shopid(gameids);
        const bundleInfo = new Map()
        for (const steamId of gameids) {
            const itadGid = itadGidMap[steamId];
            if (itadGid === undefined) {
                console.log(`Error finding the ITAD GID for game ${steamId}`)
            }
            bundleInfo[steamId] = await itad_getbundles(itadGid)
        }
        const games = getGames();
        for (const steamId of gameids) {
            const game = games[steamId];
            game.bundles = bundleInfo[steamId]
            game.itadGid = itadGidMap[steamId]
        }
        GM_setValue("games", JSON.stringify(games));
        dumpListing();
        updateListing();
    }

    function showChartMaker() {
        if (!$("#lcm_dialog").length) {
            // Create the dialog
            GM_addStyle(".lcm_dialog { display: flex; flex-direction: column; } " +
                        "#lcm_dialog a { color: blue; text-decoration: underline; } " +
                        "#lcm_list { list-style-type: none; margin: 0 auto; padding: 0; width: 75%; }" +
                        "#lcm_dump { margin: 25px auto 0 auto; display: block; flex-grow: 1; resize: none; width: 95%; }" +
                        "#lcm_bundle_info { margin-bottom: 5px; }" +
                        "#lcm_itad { float: left; margin-bottom: 5px; }" +
                        "#lcm_center_btns { float:none; text-align: center; }");
            var d = $(`<div id="lcm_dialog" class="lcm_dialog"><div name="top-container">
<div id="lcm_itad">
  <div>
    <a href="https://isthereanydeal.com/apps/my/" target=_blank>IsThereAnyDeal API Key</a>: <input type="text"></input><button>Submit</button>
  </div>
  <a style="display:none" href="javascript:">Delete ITAD<br/>API Key?</a>
</div>
<div style="float: right"><button id="lcm_bundle_info" class="ui-button ui-widget ui-corner-all">Load Bundle Info</button></div>
<div id="lcm_center_btns">
    <div style="margin-bottom: 2px">
        <button id="lcm_add_tier" class="ui-button ui-widget ui-corner-all">🛆 Add Tier</button>
        <label for="lcm_totals">🧮 Totals</label>
        <input type="checkbox" id="lcm_totals"/>
        <button id="lcm_clear_chart" class="ui-button ui-widget ui-corner-all">🗑️ Empty</button>
        <button id="lcm_show_preview" class="ui-button ui-widget ui-corner-all">🖼️ Preview</button>
    </div>
    <div id="lcm_columns" style="margin-bottom: 2px">
      <label for="lcm_rating" title="Show or hide the Rating column">⭐</label>
      <input type="checkbox" id="lcm_rating"/>
      <label for="lcm_cards" title="Show or hide the Cards column">❤</label>
      <input type="checkbox" id="lcm_cards"/>
      <label for="lcm_achievements" title="Show or hide the Achievements column">🏆</label>
      <input type="checkbox" id="lcm_achievements"/>
      <label for="lcm_details" title="Show or hide the Details column">📃</label>
      <input type="checkbox" id="lcm_details"/>
      <label for="lcm_platforms" title="Show or hide the Platforms column">🖥️</label>
      <input type="checkbox" id="lcm_platforms"/>
      <label for="lcm_bundles" title="Show or hide the Bundled column">📦</label>
      <input type="checkbox" id="lcm_bundles"/>
      <label for="lcm_discount" title="Show or hide the Discount column">💸</label>
      <input type="checkbox" id="lcm_discount"/>
      <label for="lcm_currentprice" title="Show or hide the Current Price column">🛒</label>
      <input type="checkbox" id="lcm_currentprice"/>
  </div>
</div>
</div>
<ul id="lcm_list"></ul>
<textarea id="lcm_dump"></textarea></div>`);
            $("body").append(d);
            if (GM_getValue("ITAD_API_KEY") !== undefined)
                $("#lcm_itad div,#lcm_itad a").toggle();
            const ColumnToggles = [
                // [ HTML ID, GM value key, default value ]
                ["#lcm_rating", "addRating", true],
                ["#lcm_achievements", "addAchievements", true],
                ["#lcm_details", "addDetails", true],
                ["#lcm_platforms", "addPlatforms", true],
                ["#lcm_cards", "addCards", true],
                ["#lcm_bundles", "addBundles", true],
                ["#lcm_discount", "addDiscount", false],
                ["#lcm_currentprice", "addCurrentPrice", false]
            ]
            ColumnToggles.forEach(tgl => {
                $(tgl[0])
                    .prop('checked', GM_getValue(tgl[1], tgl[2]))
                    .button()
                    .click(function(){
                        GM_setValue(tgl[1], $(this).prop('checked'));
                        dumpListing();
                    });
            });
            /*$("#lcm_columns").sortable({
                deactivate: function (event, ui) {
                    dumpListing();
                }
            });*/
            // Add Totals button
            $("#lcm_totals").prop('checked', GM_getValue("addTotals", false))
            .button()
            .click(function(){
                GM_setValue("addTotals", $(this).prop('checked'));
                dumpListing();
            });
            // Load ITAD API key
            $("#lcm_itad button").click(function(){
                try{
                    ITAD_API_KEY = $("#lcm_itad input").val().match(API_KEY_REGEXP)[0];
                    GM_setValue("ITAD_API_KEY", ITAD_API_KEY);
                    $("#lcm_itad div,#lcm_itad a").toggle();
                }catch(err){
                    alert("Error setting API key");
                }
            });
            // Add tier button
            $("#lcm_add_tier").click(function(){
                addToGameOrder("tier-" + generateQuickGuid());
                updateListing();
                dumpListing();
            });
            // Delete API key button
            $("#lcm_itad a").click(function(){
                GM_deleteValue("ITAD_API_KEY");
                ITAD_API_KEY = undefined;
                $("#lcm_itad div,#lcm_itad a").toggle();
            });

            $("#lcm_dialog").dialog({
                modal: false,
                title: "Lex's SG Chart Maker v" + GM_info.script.version,
                position: {
                    my: "left top",
                    at: "left top",
                    of: ".page_title_area",
                    collision: "none"
                },
                width: 800,
                height: 400,
                minWidth: 300,
                minHeight: 200,
                zIndex: 3666,
            })
            .dialog("widget").draggable("option", "containment", "none");
            $("#lcm_list").sortable({
                deactivate: function (event, ui) {
                    saveGameOrder();
                    dumpListing();
                }
            });
            $("#lcm_bundle_info").click(loadBundleInfo);
            $("#lcm_show_preview").click(showPreviewWindow);
            $("#lcm_clear_chart").click(() => {
                GM_deleteValue("gameOrder");
                GM_deleteValue("games");
                updateListing();
                dumpListing();
            });
            $("#lcm_dump").bind("input propertychange", updatePreview);
        } else {
            $("#lcm_dialog").dialog();
        }
        updateListing();
        dumpListing();
    }

    function showPreviewWindow() {
        if ($("#lcm_preview").length) {
            $("#lcm_preview").dialog();
        } else {
            GM_addStyle(`.markdown h1,.markdown h2,.markdown h3,.markdown h4,.markdown h5,.markdown h6{color:#324862;padding-top:5px;margin-bottom:8px!important;line-height:1em!important}.markdown h1{font:300 28px "Open Sans",sans-serif}.markdown h2{font:700 18px "Open Sans",sans-serif}.markdown h3{font:700 14px "Open Sans",sans-serif}.markdown{word-wrap:break-word}.markdown--resize-body{font-size:13px;line-height:1.55em}.markdown table{border-collapse:collapse;border:1px solid #d2d6e0;table-layout:fixed;width:100%}.markdown thead{background-color:#e8eaef;font-weight:700;border-bottom:1px solid #d2d6e0}.markdown td,.markdown th{padding:3px 10px}.markdown td:not(:last-child),.markdown th:not(:last-child){border-right:1px solid #d2d6e0}.markdown tr:not(:last-child){border-bottom:1px solid #d2d6e0}.markdown pre{white-space:pre-wrap;background-color:#e8eef6;border:1px solid #d0dced;padding:5px 15px;border-radius:4px;text-shadow:1px 1px rgba(255,255,255,.2);color:#5c7397}.markdown code{font-family:"Droid Sans Mono",sans-serif;font-size:11px}.markdown hr{border-top:1px solid #d2d6e0;border-bottom:1px solid rgba(255,255,255,.3);border-left:none;border-right:none}.markdown .have>:not(:last-child):not(div),.markdown .want>:not(:last-child):not(div),.markdown>:not(:last-child):not(div){margin-bottom:15px}.markdown .spoiler:not(:hover){background-color:#d9dee6;color:transparent;text-shadow:none}.markdown .spoiler:not(:hover) a{color:transparent;text-decoration:none}.markdown ol,.markdown ul{margin-right:25px;margin-left:25px}.markdown ol>li{counter-increment:list}.markdown li{padding:2px 5px}.markdown ol>li:before{content:counter(list) "."}.markdown ul>li:before{content:"•"}.markdown li p:not(:last-child){margin-bottom:5px}.markdown li:before{color:#da5d88;margin-left:-60px;font-weight:700;font-size:11px;position:absolute;width:50px;text-align:right}.markdown .search_highlight{background-color:#ff0;text-shadow:none}.markdown img{max-width:500px;max-height:500px;margin-top:5px;display:inline-block}.markdown .comment__toggle-attached{font-size:11px;font-style:italic;text-decoration:underline;color:#c86848;cursor:pointer}.markdown a{color:#4b72d4;text-decoration:underline}.markdown blockquote{border-left:5px solid #d2d6e0;padding:3px 15px;font-style:italic;opacity:.8}.markdown .have,.markdown .want{border-left:5px solid;padding:10px 20px}.markdown .have:not(:last-child),.markdown .want:not(:last-child){margin-bottom:15px}.markdown .have{border-left-color:#e1868c;background-color:#efedf0}.markdown .want{border-left-color:#6bbfdb;background-color:#e8eff3}.markdown blockquote blockquote{border-left:none;padding:0;opacity:1}`);
            var d = $(`<div id="lcm_preview" class="lcm_dialog markdown" style="font-size:13px"></div>`);
            $("body").append(d);
            $("#lcm_preview").dialog({
                modal: false,
                title: "Lex's SG Chart Maker Preview",
                position: {
                    my: "right bottom",
                    at: "right-5 bottom",
                    of: window,
                    collision: "none"
                },
                width: 820, // results in a table 796px wide which is the same as SG
                height: 400,
                minWidth: 300,
                minHeight: 200,
                zIndex: 3666,
            })
            .dialog("widget").draggable("option", "containment", "none");

            updatePreview();
        }
    }

    function updatePreview() {
        const preview = document.getElementById("lcm_preview");
        if (!preview) return;
        const dump = document.getElementById("lcm_dump").value;
        preview.innerHTML = window.markdownit().render(dump);
    }

    function updateListing() {
        $("#lcm_list").empty();
        var games = getGames();
        for (let id of getGameOrder()) {
            const p = (!id.startsWith("tier") && games[id].price) ? games[id].price : "?";
            const text = id.startsWith("tier") ? "Tier" : `<a href="${games[id].url}">${games[id].name}</a> - ${id} - ${p}`;
            $(`<li class="ui-state-default" data-appid="${id}">${text}<a href="javascript:" style="float:right; color:red; margin-top:-3px">✖</a></li>`)
            .appendTo("#lcm_list")
            .find("a:last").click(function(){ // Delete button
                deleteGame($(this).parent().attr("data-appid"));
                updateListing();
                dumpListing();
            });
        }
    }

    // Read order from the sortable and saves it
    function saveGameOrder() {
        const gameOrder = $("#lcm_list li").map((i,e) => e.getAttribute("data-appid")).get();
        if (gameOrder.concat().sort().join(",") !== getGameOrder().sort().join(",")) {
            alert("Chart data is out of date! Were you editing in a different tab? Reloading data from cache...");
            updateListing();
        } else
            GM_setValue("gameOrder", JSON.stringify(gameOrder));
    }

    function convertCurrentPriceToRetailPrice(currentPrice, discountPercent) {
        if (!discountPercent || discountPercent[0] !== "-")
            discountPercent = 0;
        currentPrice = parseFloat(currentPrice.replace("$", "").replace(",", "."));
        return currentPrice / (1 + (parseFloat(discountPercent)/100));
    }

    function parseRetailUsPrice(game) {
        if (game.price?.startsWith("$"))
          return parseFloat(game.price.replace("$", ""));
        if (game.usCurrentPrice)
          return convertCurrentPriceToRetailPrice(game.usCurrentPrice, game.discountPercent);
    }

    var dumpFormatters = {
        name: [ "Game", ":-", function(g) { // Dumps the name entry for a game
            return `**[${g.name}](${g.url})**` + (g.dlc ? " (DLC)" : "");
        }],
        rating: ["Ratings", ":-:", function(g) {
            return g.rating;
        }],
        cards: ["Cards", ":-:", function(g) {
            if (!g.cards) return "-";
            let tooltip = "";
            if (g.card_count) tooltip = g.card_count + " cards";
            if (g.dlc)
                return "(Base game has cards)";
            else
                return `[**${CARD_ICON}**](http://www.steamcardexchange.net/index.php?gamepage-appid-${g.appid} "${tooltip}")`;
        }],
        achievements: ["Cheevos", ":-:", function(g) {
            if (!g.achievements)
                return "-";
            if (!g.achievementCount) {
                return `[🏆](${String.format(ACHIEVEMENTS_URL, g.appid)})`;
            } else {
                return `[🏆](${String.format(ACHIEVEMENTS_URL, g.appid)} "${g.achievementCount} achievements")`;
            }
        }],
        details: ["Details", ":-:", function(g) {
            let url = "https://www.steamgifts.com/app/" + g.appid;
            if (g.subid)
                url = "https://www.steamgifts.com/sub/" + g.subid;
            else if (g.bundleid)
                url = "https://www.steamgifts.com/giveaways/search?q=" + encodeURIComponent(g.name).replace(/%20/g,"+");
            const price = parseRetailUsPrice(g) ?? 0.0;
            let cv = price * 0.15;
            let icons = [];
            if (g.noCV || g.price == "Free" || g.price == "Free To Play") {
                icons.push(NOCV_ICON);
                cv = 0.0;
            }
            if (g.learningAbout || g.profileLimited) icons.push(LEARNING_ICON);
            if (g.adultOnly) icons.push(ADULT_ICON);
            if (icons.length) icons = " " + icons.join(""); // prepend a space

            let gameId = "app/" + g.appid;
            if (g.subid) gameId = "sub/" + g.subid;
            if (g.bundleid) gameId = "bundle/" + g.bundleid;
            const [idType, id] = gameId.split("/")
            return `[${cv.toFixed(2)} CV](${url})${icons} ${idType}/[${id}](https://steamdb.info/${gameId}/ "SteamDB link")`;
        }],
        platforms: ["Platforms", ":-:", (g) => {
            const [abbrs, fullNames] = [[], []];
            if (g.windows) {abbrs.push("W"); fullNames.push("Windows")}
            if (g.mac) {abbrs.push("M"); fullNames.push("macOS")}
            if (g.linux) {abbrs.push("L"); fullNames.push("Linux")}
            if (g.steamDeckSVGPath.endsWith("11.9222Z")) {abbrs.push('D✅'); fullNames.push("Steam Deck Verified")}
            if (g.steamDeckSVGPath.endsWith("8.05245Z")) {abbrs.push('D🟡'); fullNames.push("Steam Deck Playable")}
            if (g.steamDeckSVGPath.endsWith("10Z")) {abbrs.push('D❌'); fullNames.push("Steam Deck Unsupported")}
            if (g.steamDeckSVGPath.endsWith("10.3552Z")) {abbrs.push('D?'); fullNames.push("Steam Deck Compatibility Unknown")}
            const href = g.appid ? `https://www.protondb.com/app/${g.appid}?device=steamDeck` : "#";
            return `[${abbrs.join(" ")}](${href} "${fullNames.join(" • ")}")`;
        }],
        bundles: ["Bundled", ":-:", function(g) {
            let bundleCount = "?";
            let tooltip = "";
            if (g.bundles !== undefined) {
                // Bundles not on blacklist and at least 48 hours old
                const notBlacklisted = (b) => !BUNDLE_BLACKLIST.includes(b.page.name) && (new Date() - new Date(b.publish)) > 48*60*60*1000;
                bundleCount = g.bundles.filter(notBlacklisted).length;
                //💵📉📦🛒💸💰
                const formatBundle = function(b) {
                    let delta = timeDifference(new Date(), new Date(b.expiry));
                    if (b.publish && (b.expiry === null || new Date(b.expiry) > new Date()))
                        delta = "ongoing";
                    return "📦 " + b.title.trim() + " (" + delta + ")";
                }
                tooltip = g.bundles.length + " bundles " + g.bundles.map(formatBundle).join(" ");
            }
            return `[${bundleCount}](https://isthereanydeal.com/game/id:${g.itadGid}/info/#/a:bundles "${tooltip.trim()}")`;
        }],
        price: ["Retail Price", ":-:", (g) => {
            let price = parseRetailUsPrice(g);
            price = price ? "$" + price.toFixed(2) : g.price ?? "?";
            if (price === "Free")
                price = "🆓 Free";
            else if (price === "Free To Play")
                price = "💩 Free To Play";
            let retailEuPrice = g.euCurrentPrice;
            if (g.euCurrentPrice && g.discountPercent) {
                // try to calculate Retail EU price from shown discounted EU price
                try {
                    retailEuPrice = convertCurrentPriceToRetailPrice(g.euCurrentPrice, g.discountPercent)
                    retailEuPrice = retailEuPrice.toFixed(2).replace(".",",") + "€";
                } catch(err) {
                    retailEuPrice = "";
                }
            }
            const tooltip = retailEuPrice ? ` "${retailEuPrice}"` : "";
            const href = g.itadGid ? `https://isthereanydeal.com/game/id:${g.itadGid}/info/` : "";
            if (href || tooltip) {
                return `[${price}](${href||"#"}${tooltip})`;
            } else
                return price;
        }],
        discount: ["Discount", ":-:", function(g) {
            return g.discountPercent || "–";
        }],
        currentPrice: ["Current Price", ":-:", function(g) {
            if (g.euCurrentPrice)
                return g.usCurrentPrice + " " + g.euCurrentPrice;
            return g.usCurrentPrice;
        }],
    };

    // Post chart code to the textarea
    function dumpListing() {
        // Enable or disable columns by setting them to true or false. Defaults to true
        const colToggles = {
            name: true,
            rating: $("#lcm_rating").prop('checked'),
            cards: $("#lcm_cards").prop('checked'),
            achievements: $("#lcm_achievements").prop('checked'),
            details: $("#lcm_details").prop('checked'),
            platforms: $("#lcm_platforms").prop('checked'),
            bundles: $("#lcm_bundles").prop('checked'),
            price: true,
            discount: $("#lcm_discount").prop('checked'),
            currentPrice: $("#lcm_currentprice").prop('checked'),
        }
        // columns is a list of enabled dumpFormatter keys to dump
        const columns = Object.keys(dumpFormatters).filter(k => colToggles[k]);

        // First two rows of the table
        let header = columns.map(colKey => dumpFormatters[colKey][0]).join(" | ") + "\n";
        header += columns.map(colKey => dumpFormatters[colKey][1]).join(" | ") + "\n";

        let dump = header;
        // If at least one Tier is added, display Tier 1 at the top
        if (getGameOrder().filter(g => g.startsWith("tier")).length)
            dump = `### **Tier 1**\n` + dump;
        let totals = [0]; // total prices
        let gameOrder = getGameOrder();
        const games = getGames();
        for (let idx = 0; idx < gameOrder.length; idx++) {
            let gid = gameOrder[idx];
            if (gid.startsWith("tier")) {
                if (idx !== 0) {
                    totals.push(0);
                }
                dump = (idx===0 ? "":dump+"\n") + `### **Tier ${totals.length}**\n${header}`;
                continue;
            }
            const g = games[gid];
            if (g === undefined)
                continue;

            totals[totals.length-1] += parseRetailUsPrice(g) ?? 0;

            dump += columns.map(e => dumpFormatters[e][2](g)).join(" | ");
            dump += "\n";
        }
        // If any games have no CV
        if (Object.values(games).reduce((a,c) => a || c.noCV, false))
            dump += NOCV_ICON + " - Game was free at some time and does not grant any CV if given away.\n";
        // If any games are being learned about or profile limited
        if (Object.values(games).reduce((a,c) => a || c.learningAbout || c.profileLimited, false))
            dump += LEARNING_ICON + " - Not currently eligible to appear in certain showcases on your Steam Profile, and does not contribute to global Achievement or game collector counts.\n";
        // If any games are adult only
        if (Object.values(games).reduce((a,c) => a || c.adultOnly, false))
            dump += ADULT_ICON + " - Adult only\n";
        if (GM_getValue("addTotals")) {
            if (totals.length > 1 && totals[0] === 0)
                totals.splice(0, 1); // Cut off empty first tier
            dump += "\n**Retail:**\n";
            let cv = "\n**CV:**\n";
            for (let i = 0; i < totals.length; i++) {
                let t = totals[i];
                const cumCost = totals.slice(0, i+1).reduce((p,c) => p + c, 0);
                const prep = totals.length === 1 ? `* ` : `* Tier ${[...Array(i+2).keys()].slice(1).join(" + ")} = `;
                cv += prep + `${(cumCost*0.15).toFixed(4)}\n`;
                dump += prep + `$${cumCost.toFixed(2)}\n`;
            }
            dump += cv + "\n";
        }
        dump += FOOTER;
        document.getElementById("lcm_dump").value = dump;

        updatePreview();
    }

    function deleteGame(aid) {
        if (aid == GameID) // Unmark the + Chart button
            $("#lcm_add_btn").removeClass("queue_btn_active");

        let gameOrder = getGameOrder();
        try {
            gameOrder.splice(gameOrder.indexOf(aid), 1);
            GM_setValue("gameOrder", JSON.stringify(gameOrder));
        }catch(err) {}

        let games = getGames();
        try {
            delete games[aid];
            GM_setValue("games", JSON.stringify(games));
        }catch(err) {}
    }

    function createSubButton(callback) {
        let btn = document.createElement("button");
        btn.type = "button";
        btn.innerText = " +⊞ Chart";
        btn.addEventListener('click', function(){
            callback.call(this);
            showChartMaker();
        });
        btn.style.cssFloat = 'right';
        btn.style.fontSize = "110%";
        btn.style.marginTop = "-1px";
        return btn;
    }

    function handleAppPage() {
        // Add button to app page
        $(`<a id="lcm_add_btn" class="btnv6_blue_hoverfade btn_medium btn_steamdb"><span>+ <span style="position:relative;top:-1px">&#x229e;</span> Chart</span></a>`)
        .appendTo(`.apphub_OtherSiteInfo:first`)
        .click(function(){
            this.classList.add("queue_btn_active");
            addAppToChart();
            showChartMaker();
        })
        .toggleClass("queue_btn_active", GameID in getGames());

        $(".game_area_purchase_game:first").prepend(createSubButton(addAppToChart));

        // Find other purchase options on the page
        let subs = $(".game_area_purchase_game:not(:first)");
        // But ignore bundles
        subs = subs.filter((i,e) => !e.parentNode.matches("[data-ds-bundleid]"));
        // add chart buttons to each of them
        const callback = function(){ addPackageToChart(this.closest(".game_area_purchase_game")); };
        subs.each((i,e) => e.prepend(createSubButton(callback)));
    }

    function handleSubPage() {
        // Add buttons to the package listing
        const callback = function(){ addSubToChart($(this).closest(".game_area_purchase_game")); };
        document.querySelector(".game_area_purchase_game").prepend(createSubButton(callback));
    }

    function handleBundlePage() {
        // Add buttons to the bundle listing
        const callback = function(){ addBundleToChart($(this).closest(".game_area_purchase_game")); };
        $(".game_area_purchase_game").each((i,e) => e.prepend(createSubButton(callback)));
    }

    if (window.location.pathname.match(/app\/\d+/))
        handleAppPage();
    if (window.location.pathname.match(/sub\/\d+/))
        handleSubPage();
    if (window.location.pathname.match(/bundle\/\d+/))
        handleBundlePage();
})();