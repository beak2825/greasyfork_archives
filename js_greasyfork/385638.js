
// ==UserScript==
// @name         SteamtradesEasierMatch
// @namespace    http://tampermonkey.net/
// @icon https://cdn.steamtrades.com/img/favicon.ico
// @version      0.1
// @description  Easy search for steamtrades!
// @author       Puzzlovaski
// @license GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @match        https://www.steamtrades.com/trades*
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/385638/SteamtradesEasierMatch.user.js
// @updateURL https://update.greasyfork.org/scripts/385638/SteamtradesEasierMatch.meta.js
// ==/UserScript==

// ----------------------------------------Setting here---------------------------------------------
var autoMatch = false;      // If true, start matching after page loaded.
// -------------------------------------------------------------------------------------------------

// ========================================Coding section===========================================
// list box html
const easyHtml = "<a id='easyOpen' href='javascript:void(0)' style='margin-bottom:5px; text-decoration:underline; color:rgb(120,169,71)'>Easy search</a>\
<div class='search_trades' id='easyBox'>\
<textarea id='haveList' type='text' placeholder='I have\n.\n.\n.' value></textarea>\
<textarea id='wantList' type='text' placeholder='I want\n.\n.\n.' value></textarea>\
<div class='btn_action red'  id='easySearch'><i class='fa fa-search'></i></div>\
</div>"
$(document).ready(function(){

    // Add search box
    $(".search_trades").before(easyHtml);

    // Add div for output on each trade
    $(".row_inner_wrap").not(".is_faded").parent().append("<div class='match'></div>");

    // get list from GM
    $("#haveList").val(GM_getValue("HL"));
    $("#wantList").val(GM_getValue("WL"));

    // setting button and hide box
    $("#easyBox").hide();
    $("#easySearch").click(easySearch);
    $("#easyOpen").click(function(){
        $("#easyBox").slideToggle();
    });

    if(autoMatch){
        easySearch();
    }
});

function easySearch(){

    // do matching
    resolve();

    // store list to GM
    GM_setValue("HL", $("#haveList").val());
    GM_setValue("WL", $("#wantList").val());
}

function resolve(){

    // get input and clean falsy values.
    var iH = $("#haveList").val().replace(/^\s*$(?:\r\n?|\n)/gm, '').split("\n").filter(Boolean);
    var iW = $("#wantList").val().replace(/^\s*$(?:\r\n?|\n)/gm, '').split("\n").filter(Boolean);

    // resolving each trade
    $(".row_inner_wrap").not(".is_faded").each(async function(){
        var href = $(this).find(".column_flex > h3 a").attr('href');
        var hL = [];
        var wL = [];

        // get each trade page
        await $.get(href, function(res){
            var uH = $(res).find(".have").text();
            var uW = $(res).find(".want").text();

            // matching
            iH.forEach(function(e){
                if (uW.toLowerCase().indexOf(e.toLowerCase()) != -1){
                    hL.push(e);
                }
            });
            iW.forEach(function(e){
                if (uH.toLowerCase().indexOf(e.toLowerCase()) != -1){
                    wL.push(e);
                }
            });
        });

        // post to each trade
        $(this).siblings("div.match").html("<p><b>[H]:</b> " + hL.toString() + "</p><p><b>[W]:</b> " + wL.toString() +"</p>");

	// change background of tag that match both lists to green
	if(hL.length > 0 && wL.length >0){
            $(this).parent().css("background-color", "#bfff00");
        }
	});
}
