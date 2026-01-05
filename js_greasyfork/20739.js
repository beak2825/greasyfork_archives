// ==UserScript==
// @name         Spoiler Free HLTV
// @namespace    http://hltv.org/*
// @version      0.1
// @description  Removes Scores from HLTV
// @author       You
// @match        http://www.hltv.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20739/Spoiler%20Free%20HLTV.user.js
// @updateURL https://update.greasyfork.org/scripts/20739/Spoiler%20Free%20HLTV.meta.js
// ==/UserScript==

var spoilerShown = false;
function toggleSpoilers(){
    if (spoilerShown){
        //hide
        hideSpoilers();

    }else{
        //show
        showSpoilers();
    }
    spoilerShown = !spoilerShown;
}
function hideSpoilers(){
    var onStartPage = window.location.pathname == "/";
    var onResultsPage = window.location.pathname == "/results/";
    var onMatchPage = window.location.pathname.includes("/match/");
    
    if(onMatchPage){
        jQuery(".matchScore").hide();
        jQuery("img ").css('opacity', '1');
        jQuery(jQuery(".hotmatchbox.hotmatchbox")[0]).find(".hotmatchbox").hide();
        jQuery("#statsContainer").hide();
        jQuery(".tab_group2 > .tab_group3 > .tab_content").hide();
    }else if(onStartPage){
        $("div.teams > div:nth-child(2n)").hide();
    }else if(onResultsPage){
        jQuery(".resultLoser, .resultWinner, .resultDraw").hide();
    }
}
function showSpoilers(){
    var onStartPage = window.location.pathname == "/" ;
    var onResultsPage = window.location.pathname == "/results/";
    var onMatchPage = window.location.pathname.includes("/match/");

    if (onStartPage){
       $("div.teams > div:nth-child(2n)").show();
    }else if(onResultsPage){
        jQuery(".resultLoser, .resultWinner, .resultDraw").show();
    }else if(onMatchPage){
         jQuery(".matchScore").show();
        //cant fix the opacity with this implementation
        jQuery(".hotmatchbox").show();
        jQuery("#statsContainer").show();
        jQuery(".tab_content").show();
    }
}

hideSpoilers();
jQuery("<div id='toggle_spoiler' style='display:inline;cursor:pointer;padding-left:25px; color:red'>Toggle Spoilers</div>").insertAfter("#loginButton");
jQuery("#toggle_spoiler").click(toggleSpoilers);