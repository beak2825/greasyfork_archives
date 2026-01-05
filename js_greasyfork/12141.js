// ==UserScript==
// @name         PutLinker
// @namespace    http://your.homepage/
// @version      0.4
// @description  Adds a link to Putlocker on the single show or unwatched pages.
// @author       Speedlink
// @match        http://episodecalendar.com/en/show/*
// @match        http://episodecalendar.com/en/unwatched*
// @match        http://www.imdb.com/title/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12141/PutLinker.user.js
// @updateURL https://update.greasyfork.org/scripts/12141/PutLinker.meta.js
// ==/UserScript==

$.noConflict(true);
var DEBUG = false;

// This bit of code is from stackoverflow by user Canavar
// http://stackoverflow.com/questions/1137436/what-are-useful-javascript-methods-that-extends-built-in-objects/1137579#1137579
String.prototype.replaceAll = function(search, replace)
{
    //if replace is not sent, return original string otherwise it will
    //replace search string with 'undefined'.
    if (replace === undefined) {
        return this.toString();
    }

    return this.replace(new RegExp('[' + search + ']', 'g'), replace);
};

var correctNames = [];
correctNames["csi-cyber-1"] = "csi-cyber";
correctNames["archer-2009"] = "archer";
correctNames["once-upon-a-time-2011"] = "once-upon-a-time";
correctNames["marvel's agent carter"] = "agent-carter";

$(document).ready(function() {
    /*var title = $("title").text();
    title = title.split(" - TV Episode Calendar")[0];
    
    var searchterm = title.replaceAll(" ", "+");
    $(".links.pull-right").prepend("<a class=\"awesome small grey external\" target=_blank href=http://putlocker.is/search/advanced_search.php?section=0&q=" + searchterm + "&director=&actor=&year_from=Year&year_to=Year&genre%5B%5D=All><strong>Putlocker<span class=\"icon icon-16 icons-arrow-up-right\"></span></strong></a>");
    */
    
    /*if(DEBUG) {
        alert("Current search is: " + searchterm);
    }*/
    
    var loc = String(document.location);
    if(loc.indexOf("episodecalendar.com/en/unwatched/") > -1) {
        //unwatchedShows();
        setInterval(unwatchedShows, 500);
        //setTimeout(unwatchedShows, 500);
    }
    else if(loc.indexOf("episodecalendar.com/en/show/") > -1) {
        tvepisodeShows();
    }
    else if(loc.indexOf("http://www.imdb.com/title/") > -1) {
        imdbTitlePage();
    }
});

// *********************************************************************************************************************************************************************************************************
// episodecalendar.com stuff
// *********************************************************************************************************************************************************************************************************

function unwatchedShows() {
    var name = $("li.selected > a").attr("href").split("/unwatched/")[1]
    var showname;
    
    /*if(DEBUG) {
        alert("Current search is: " + name);
    }*/
    
    if(name in correctNames) {
        showname = correctNames[name];
        //alert("correcting name to: " + showname);
    }
    else {
        showname = name.replaceAll("-", " ");
        //alert("name is fine");
    }

    //showname = name.replaceAll("-", " ");
    //alert(showname);
    var show2 = $(".season > h2 > a").attr("href").split("/")[2].replaceAll("-", " ");
    //alert(show2);
    var searchterm = showname.replaceAll(" ", "+");
    
    if($($("a[href^='/show/" + name + "']")[1]).parent().children().length == 1) {
        //alert("we can add items");
        $($("a[href^='/show/" + name + "']")[1]).parent().append("<span style=\"margin-left: 5px; margin-right: 5px\"> --- </span>");
        $($("a[href^='/show/" + name + "']")[1]).parent().append("<a class=\"awesome small grey external\" target=_blank href=http://putlocker.is/search/advanced_search.php?section=0&q=" +
                                                                 searchterm + "&director=&actor=&year_from=Year&year_to=Year&genre%5B%5D=All><strong>Putlocker</strong></a>");
    }
}

function tvepisodeShows() {
    var name = $("title").text();
    name = name.split(" - TV Episode Calendar")[0];
    name = name.toLowerCase();
    var showname;
    
    if(DEBUG) {
        alert("Current search is: " + name);
    }
    
    if(name in correctNames) {
        showname = correctNames[name];
        //alert("correcting name to: " + showname);
    }
    else {
        //showname = name.replaceAll("-", " ");
        //alert("name is fine");
        showname = name;
    }
    
    var searchterm = showname.replaceAll(" ", "+");
    $(".links.pull-right").prepend("<a class=\"awesome small grey external\" target=_blank href=http://putlocker.is/search/advanced_search.php?section=0&q=" +
                                   searchterm + "&director=&actor=&year_from=Year&year_to=Year&genre%5B%5D=All><strong>Putlocker<span class=\"icon icon-16 icons-arrow-up-right\"></span></strong></a>");
}

// *********************************************************************************************************************************************************************************************************
// imdb stuff
// *********************************************************************************************************************************************************************************************************

function stripTitle(title) {
    var i = title.indexOf("(");
    
    return title.substring(0, i);
}

function imdbTitlePage() {
    var name = document.title;
    var searchterm = stripTitle(name);

    $("td > span.btn2_wrapper").append('<span class="btn2_wrapper"><a style="margin-top: 6px" href="http://putlocker.is/search/advanced_search.php?section=0&q=' +
                                       searchterm + '&director=&actor=&year_from=Year&year_to=Year&genre%5B%5D=All" class="btn2 large btn2_text_on><span class="btn2_text">PL</span></span>');
}