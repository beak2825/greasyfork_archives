// ==UserScript==
// @name         MyAnimeList Split PTW List
// @namespace    https://greasyfork.org/en/users/96096-purple-pinapples
// @version      2.0.4
// @description  Makes the Anime Statistics on Profiles more indicative, telling you how many haven't aired yet.
// @author       PurplePinapples
// @license      MIT License
// @run-at       document-end
// @match        https://myanimelist.net/profile/*
// @downloadURL https://update.greasyfork.org/scripts/33008/MyAnimeList%20Split%20PTW%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/33008/MyAnimeList%20Split%20PTW%20List.meta.js
// ==/UserScript==

//classic=>list-container
//modern=>list_surround

//couldnt find a nice builtin that did exactly what I wanted
function truncate(num, number_of_decimals) {
    "use strict";
    var truncated = num.toString();
    var point = truncated.split(".", 2);
    if (point.length > 1 && number_of_decimals < point[1].length) {
        truncated = point[0] + "." + point[1].substring(0, number_of_decimals);
    }
    return truncated;
}

//change graph to reflect new findings
function changeGraph(c, pt) {
    "use strict";
    if (c !== 0) {
        var ptwBlockLength = $("div.anime>.stats-graph.mt8>.plan_to_watch").width(); //get width of current PTW block
        var newPtwBlockLength = truncate(ptwBlockLength * (pt / (pt + c)), 1); //calculates reduced size of graph
        $("div.anime>.stats-graph.mt8>.plan_to_watch").css("width", newPtwBlockLength + "px"); //reduces the size of the graph
        $("div.anime>.stats-graph.mt8").css("background-color", "#404040"); //changes the background of the parent div to imitate a new 'block' being added
    }
}

var PTW = 0;
var count = 0;
var returnValue = function () {
    "use strict";
    var name = $("h1").first().find("span").text().trim().slice(0, -10);
    var externalVar = " "; //to prevent weird asynchronous javascript
    $.get("https://myanimelist.net/animelist/" + name + "?airing_status=3", function (data) {
        if (data.indexOf("list-container") === -1) {
            //this is a classic list, pull other page
            $.get("https://myanimelist.net/animelist/" + name + "?status=6&tag=", function (classicData) {
                count = (classicData.match(/not yet aired/gi) || []).length; //find number of entries
                classicData = classicData + " " + externalVar;
                PTW = $(".di-ib.fl-l.lh10.circle.anime.plan_to_watch").next().text(); //get number of entries on PTW according to MAL
                if (PTW.indexOf(",") !== -1) { //remove commas
                    PTW = PTW.replace(",", "");
                }
                if (PTW === "0") { //dont change it if there isnt anything on PTW
                    count = 0;
                } else {
                    $("<style>.stats-status { width: 180px !important; }</style>").appendTo('head'); //change width to allow text to fit
                    PTW = PTW - count;
                    $(".di-ib.fl-l.lh10.circle.anime.plan_to_watch").next().html(PTW + "(+" + count + ")"); //change text in stats
                }
                changeGraph(count, PTW);
            });
        } else { //(pageData.contains("list_surround"))
            //this is a modern list
            count = (data.match(/anime_title&quot;:&quot;/g) || []).length;
            data = data + " " + externalVar;
            var PTW = $(".di-ib.fl-l.lh10.circle.anime.plan_to_watch").next().text(); //find number of entries
            if (PTW.indexOf(",") !== -1) { //remove commas
                PTW = PTW.replace(",", "");
            }
            if (PTW === "0") { //dont change it if there isnt anything on PTW
                count = 0;
            } else {
                $("<style>.stats-status { width: 180px !important; }</style>").appendTo("head"); //change width to allow text to fit
                PTW = PTW - count;
                $(".di-ib.fl-l.lh10.circle.anime.plan_to_watch").next().html(PTW + "(+" + count + ")"); //change text in stats
            }
            changeGraph(count, PTW);
        }
    });
}();