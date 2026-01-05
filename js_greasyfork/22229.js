// ==UserScript==
// @name         SteamTrades - Have List Filter
// @icon         https://cdn.steamtrades.com/img/favicon.ico
// @namespace    Revadike
// @version      1.7
// @description  Check if you own the games from someone's have list (instant Compare2Steam)
// @support      https://www.steamgifts.com/discussion/fN8vR/
// @author       Revadike
// @match        https://www.steamtrades.com/trade/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @connect      revadike.ga
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/22229/SteamTrades%20-%20Have%20List%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/22229/SteamTrades%20-%20Have%20List%20Filter.meta.js
// ==/UserScript==

//If you want to set your/another SteamID64 manually, state it here between brackets. (For example, to check owned games from someone else)
var manual_steamID = "";

//Set your steam sync interval in hours. (Set to 0 if you want to force a sync)
var sync_interval = 6;

//Set links of game to SteamDB instead of the Steam Store? (SteamDB finds removed games from the steam store and gives better results overall)
var steamdb_instead = true;

//Use steam web integration too?
var swi = false;

//Do not touch below :)
this.$ = this.jQuery = jQuery.noConflict(true);
$(document).ready(function() {
    $(".have").parent().find(".trade_heading").first().html("I have... (<a href='javascript:void(0)' id='filter' style='text-decoration:underline;color:rgb(120,169,71)' title='Check have-list for owned games. \n" +
                                                            "Warning: It may become unresponsive for a while.'>Filter</a>)");
    $("#filter").click(function() {
        $("#filter").removeAttr("style").html("<i class='fa fa-spin fa-circle-o-notch' />");
        if (manual_steamID.length == 17) {
            syncHandler(manual_steamID);
        } else if (GM_getValue("steamID") !== undefined) {
            syncHandler(GM_getValue("steamID"));
        } else {
            if ($(".nav_avatar").length > 0) {
                var steamID = $(".nav_avatar").attr("href").split("user/")[1];
                if (steamID.length == 17) {
                    GM_setValue("steamID", steamID);
                    syncHandler(steamID);
                } else {
                    alert("[Have List Filter] ERROR: Invalid SteamID. Refresh the page to try again, or set manual SteamID");
                }
            } else {
                alert("[Have List Filter] ERROR: Could not fetch SteamID automatically. Refresh the page to try again, or set manual SteamID");
            }
        }
    });
});

function syncHandler(steamID) {
    var now = Date.now();
    var last = GM_getValue("lastsync");
    if (last === undefined) {
        GM_setValue("lastsync", now);
        syncHandler(steamID);
    } else if ((now - last) / 3600000 > sync_interval || GM_getValue("ownedSteamGames") === undefined || GM_getValue("wlSteamGames") === undefined || GM_getValue("appids") === undefined) {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://revadike.ga/steamowned/?steamid=" + steamID + "&include_played_free_games=1&include_appinfo=1",
            onload: function(data) {
                var json = JSON.parse(data.responseText);
                var ownedSteamGames = [];
                var appids = {};
                json.response.games.forEach(function(game) {
                    var ownedSteamGame = game.name.toLowerCase().replace(/\:|\-|\–|\\|\/|\™|\®| |\'|\.|\?|\!/g, "");
                    ownedSteamGames.push(ownedSteamGame);
                    appids[ownedSteamGame] = game.appid;
                });
                GM_setValue("ownedSteamGames", ownedSteamGames.join("-"));
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://revadike.ga/steamwishlist/?steamid=" + steamID,
                    onload: function(data) {
                        var json = JSON.parse(data.responseText);
                        var wlSteamGames = [];
                        for (var appid in json) {
                            var wlSteamGame = json[appid].name.toLowerCase().replace(/\:|\-|\–|\\|\/|\™|\®| |\'|\.|\?|\!/g, "");
                            wlSteamGames.push(wlSteamGame);
                            appids[wlSteamGame] = appid;
                        }
                        GM_setValue("wlSteamGames", wlSteamGames.join("-"));
                        GM_setValue("appids", JSON.stringify(appids));
                        GM_setValue("lastsync", now);
                        console.log("[Have List Filter] Synced with steam!");
                        filterHaveList(ownedSteamGames, wlSteamGames, appids);
                    }
                });
            }
        });
    } else {
        var ownedSteamGames = GM_getValue("ownedSteamGames");
        var wlSteamGames = GM_getValue("wlSteamGames");
        var appids = GM_getValue("appids");
        filterHaveList(ownedSteamGames.split("-"), wlSteamGames.split("-"), JSON.parse(appids));
    }
}

function filterHaveList(ownedSteamGames, wlSteamGames, appids) {
    var have;
    if (!document.getElementsByClassName("have")[0].getElementsByTagName('table').length) {
        have = document.getElementsByClassName("have")[0].innerText.split("\n");
    } else {
        have = $('.have tr td:first-child').map(function(a,b){return $(b).text(); }).toArray();
    }
    var have_unowned = "";
    var have_unowned_raw = "";
    have.forEach(function(g) {
        let game = g;
        setTimeout(function() {
            if (game.length > 1 && game.length < 80) {
                // Ignoring everything between and including brackets, and also these symbols: :, -, –, \, /, ™, ®,  , ', ., ? and ! (Better suggestions? Please contact me)
                var comparable = game.toLowerCase().replace(/( *\[[^)]*\] *)|( *\([^)]*\) *)|\=.*|\:|\-|\–|\\|\/|\™|\®| |\'|\.|\?|\!/g, "");
                if ($.inArray(comparable, ownedSteamGames) > -1) { //Game is owned
                    //console.log (game + ": owned");
                    $(".have").html($(".have").html().replace(game, "<i class='fa icon-green fa-check-circle' style='color:green;' title='You own this game on steam'></i> <a href=\"https://" +
                    (steamdb_instead ? "steamdb.info" : "store.steampowered.com") + "/app/" + appids[comparable] + "/\" target=\"_blank\">" + game + "</a>"));
                } else { //Game is not owned or unknown game
                    //console.log (game + ": not owned");
                    if ($.inArray(comparable, wlSteamGames) > -1) { //Game is wishlisted
                        //console.log (game + ": wishlisted");
                        $(".have").html($(".have").html().replace(game, "<i class='fa icon-purple fa-heart' style='color:purple;' title='You have this game wishlisted on steam'></i> <a href=\"https://" +
                         (steamdb_instead ? "steamdb.info" : "store.steampowered.com") + "/app/" + appids[comparable] + "/\" target=\"_blank\">" + game + "</a>"));
                    } else {
                        $(".have").html($(".have").html().replace(game.replace(/( *\[[^)]*\] *)|( *\([^)]*\) *)|\=.*/g,""),
                                                                  "<i class='fa icon-red fa-times-circle' style='color:red;' title='You do not own this game on steam, or unknown game: \nPlease check manually'></i> " +
                                                                  game.replace(/( *\[[^)]*\] *)|( *\([^)]*\) *)|\=.*/g,"") + " <a href='" +
                                                                  (steamdb_instead ? "https://steamdb.info/search/?a=app&q=" : "https://store.steampowered.com/search/?term=") +
                                                                  encodeURIComponent(game.replace(/( *\([^)]*\) *)/g,"")) +
                                                                  "' target='_blank'><i class='fa icon-grey fa-external-link' title='Search game on " +
                                                                  (steamdb_instead ? "SteamDB" : "Steam") +
                                                                  "'></i></a> "));
                        have_unowned += game.replace(/(\"|\')|\=.*/g, '') + "&#013;";
                        have_unowned_raw += game + "\n";
                    }
                }
            }
        }, 0);
    });
    $(".trade_heading").first().html("<i id='clip' data-clipboard-text='" + have_unowned + "' class='icon_to_clipboard fa fa-fw fa-copy' style='cursor: pointer' title='Copy unowned/unknown games to clipboard'></i> I have...");
    $("#clip").click(function() {
        GM_setClipboard(have_unowned_raw);
        alert("Successfully copied unowned have-list games to clipboard!");
    });
    if (swi) $(".have a:not(.swi)").each(function() { $(this).toggleClass(); });
}