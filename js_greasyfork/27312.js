// ==UserScript==
// @name         Steam Community - Wishlist Recommended
// @icon         http://steamcommunity.com/favicon.ico
// @namespace    Royalgamer06
// @author       Royalgamer06
// @version      1.1.1
// @description  Adds an option to anyone's steam wishlist to show recommended apps similar to the wishlist games
// @include      /^https?:\/\/steamcommunity.com\/(id\/+[A-Za-z0-9$-_.+!*'(),]+|profiles\/7656119[0-9]{10})\/wishlist\/?((\?|#).*)?$/
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @connect      store.steampowered.com
// @connect      api.steampowered.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/27312/Steam%20Community%20-%20Wishlist%20Recommended.user.js
// @updateURL https://update.greasyfork.org/scripts/27312/Steam%20Community%20-%20Wishlist%20Recommended.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
var applist, ownedGames;
$(document).ready(function() {
    $("#mainContents").append('<div class="btn_darkblue_white_innerfade" id="showsimilar" style="clear: both; color: rgb(164, 215, 245); cursor: pointer; display: inline-block; height: 36px; text-align: left; width: 936px; column-rule-color: rgb(164, 215, 245); perspective-origin: 468px 18px; transform-origin: 468px 18px; border: 0px none rgb(164, 215, 245); font: normal normal normal normal 14px / normal Arial, Helvetica, Verdana, sans-serif; margin: 20px 0px 0px; outline: rgb(164, 215, 245) none 0px;"><span style="color: rgb(164, 215, 245); cursor: pointer; display: block; height: 16px; text-align: center; width: 916px; column-rule-color: rgb(164, 215, 245); perspective-origin: 468px 18px; transform-origin: 468px 18px; background: rgb(33, 101, 138) none repeat scroll 0% 0% / auto padding-box border-box; border: 0px none rgb(164, 215, 245); font: normal normal normal normal 14px / normal Arial, Helvetica, Verdana, sans-serif; outline: rgb(164, 215, 245) none 0px; padding: 10px;">Show Similar Games<span></span></span></div>');
    $("#showsimilar").click(showSimilar);
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://api.steampowered.com/ISteamApps/GetAppList/v2/",
        onload: function(response) {
            applist = JSON.parse(response.responseText).applist.apps;
        }
    });
    $.get("//" + $(".profile_small_header_name .whiteLink").attr("href").split("://")[1] + "/games/?xml=1", function(data) {
        ownedGames = [];
        $("appID", data).each(function() {
            ownedGames.push($(this).text());
        });
        console.log("Owned Games: ", ownedGames);
    });
});

function showSimilar() {
    $("#showsimilar").replaceWith('<div id="similargames" style="clear: both; color: rgb(143, 152, 160); display: inline-block; text-align: left; width: 936px; column-rule-color: rgb(143, 152, 160); perspective-origin: 468px 374.5px; transform-origin: 468px 374.5px; border: 0px none rgb(143, 152, 160); font: normal normal normal normal 14px / normal Arial, Helvetica, Verdana, sans-serif; margin: 20px 0px 0px; outline: rgb(143, 152, 160) none 0px;"> <div style="bottom: 0px; color: rgb(137, 138, 140); left: 0px; position: relative; right: 0px; text-align: left; top: 0px; width: 904px; z-index: 1; column-rule-color: rgb(137, 138, 140); perspective-origin: 468px 360.5px; transform-origin: 468px 360.5px; background: rgba(0, 0, 0, 0) linear-gradient(135deg, rgba(97, 100, 101, 0.298039) 0%, rgba(226, 244, 255, 0.298039) 100%) repeat scroll 0% 0% / auto padding-box border-box; border: 0px none rgb(137, 138, 140); font: normal normal normal normal 12px / normal Arial, Helvetica, Verdana, sans-serif; margin: 0px 0px 28px; outline: rgb(137, 138, 140) none 0px; padding: 16px 16px 26px;"> <h1 style="color: rgb(255, 255, 255); height: 25px; text-align: left; width: 904px; column-rule-color: rgb(255, 255, 255); perspective-origin: 452px 12.5px; transform-origin: 452px 12.5px; border: 0px none rgb(255, 255, 255); font: normal normal normal normal 21px / normal \'Motiva Sans\', arial, tahoma; margin: 0px; outline: rgb(255, 255, 255) none 0px;"> Similar Wishlist Items </h1> <p id="similargameslist" style="color: rgb(143, 152, 160); text-align: left; width: 904px; column-rule-color: rgb(143, 152, 160); perspective-origin: 452px 315px; transform-origin: 452px 315px; border: 0px none rgb(143, 152, 160); font: normal normal normal normal 12px / normal Arial, Helvetica, Verdana, sans-serif; outline: rgb(143, 152, 160) none 0px;"> <b style="color: rgb(139, 197, 63); text-align: left; column-rule-color: rgb(139, 197, 63); border: 0px none rgb(139, 197, 63); font: normal normal normal normal 12px / normal Arial, Helvetica, Verdana, sans-serif; outline: rgb(139, 197, 63) none 0px;">Includes <count id="similargamescount">0</count> items:</b> </p> </div> </div>');
    var added = [];
    var wApps = [];
    $("[id*=game_]").each(function(index) {
        wApps.push($(this).attr("id").replace("game_", ""));
    });
    var ownedGamesChecker = setInterval(function() {
        if (ownedGames.length > 0) {
            clearInterval(ownedGamesChecker);
            $("[id*=game_]").each(function(index) {
                let wAppID = $(this).attr("id").replace("game_", "");
                let wName = $(this).find("h4").text();
                setTimeout(function() {
                    console.log("wAppID: http://store.steampowered.com/recommended/morelike/app/" + wAppID);
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: "https://store.steampowered.com/recommended/morelike/app/" + wAppID,
                        headers: {
                            "User-Agent": "Mozilla/5.0"
                        },
                        onload: function(response) {
                            var data = response.responseText;
                            console.log("# Found similar apps: " + $(".similar_grid_item", data).length);
                            var html = "<br><b><a href='http://store.steampowered.com/app/" + wAppID + "/'>" + wName + "</a></b>: ";
                            var count = 0;
                            $(".similar_grid_item", data).each(function() {
                                let appID = $(this).find("[data-ds-appid]").attr("data-ds-appid");
                                console.log("appID: " + appID);
                                if ($.inArray(appID, added) == -1 && $.inArray(appID, ownedGames) == -1 && $.inArray(appID, wApps) == -1) {
                                    added.push(appID);
                                    var obj = applist.filter(function(v) { return v.appid == appID; })[0];
                                    var title = "Unknown App";
                                    if (obj !== undefined) { title = obj.name; }
                                    console.log("title: " + title);
                                    count++;
                                    html += "<a href='http://store.steampowered.com/app/" + appID + "/'>" + title + "</a>, ";
                                }
                            });
                            $("#similargamescount").html(parseInt($("#similargamescount").html()) + count);
                            $("#similargameslist").html($("#similargameslist").html() + html.slice(0, -2));
                        }
                    });
                }, index * 1000);
            });
        }
    }, 100);
}