// ==UserScript==
// @name         Letterboxd Mouseover Film Info
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds director, star rating, synopsis and cast list of a film to mouseover tooltip on film search results.
// @author       Jekteir
// @match        http://tampermonkey.net/index.php?version=4.1.10&ext=dhdg&updated=true
// @include     http://letterboxd.com/films/*
// @include     http://letterboxd.com/directory/*
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/23229/Letterboxd%20Mouseover%20Film%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/23229/Letterboxd%20Mouseover%20Film%20Info.meta.js
// ==/UserScript==

$(document).ready( function(){ window.setTimeout(setupMouseovers, 500); });

infos = [];

function setupMouseovers()
{
    $(".poster-container").each(function(){
        var panel = $(this).find("a").first();
        var theUrl = "http://letterboxd.com" + panel.attr("href");
        var theName = panel.data("original-title").trim();

        GM_xmlhttpRequest({
            method: "GET",
            url: theUrl,
            onload: populateInfos,
            context: theName
        });
    });

    /*
    $(".poster-container").mouseover(function(){
        var panel = $(this).find("a").first();
        var theUrl = "http://letterboxd.com" + panel.attr("href");
        var theName = panel.data("original-title");

        for (i = 0; i < infos.length; i++)
        {
            if (infos[i].context == theName)
            {
                var parser = new DOMParser();
                var dom = parser.parseFromString(infos[i].response, "text/html");

                var nodes = $.parseHTML(infos[i].response);
                var res = $(nodes).find("section.section.col-10.col-main").first().find("div.review.text").first().find("div.truncate").first().html();
                var rating = $(nodes).find("span.display-rating").text().trim();
                //var synopsis = theName + "<br>" + rating + "<br>" + $(nodes).find("section.section.col-10.col-main").first().find("div.review.text").first().find("div.truncate").first().text().trim();
                var synopsis2 = theName + "\n" + rating + "\n" + $(nodes).find("section.section.col-10.col-main").first().find("div.review.text").first().find("div.truncate").first().text().trim();
                $(this).attr("title",synopsis2);
                //$("div.twipsy-inner").html(synopsis);
                //$("div.twipsy-inner").css("overflow","none");
                //$("div.twipsy-inner").css("white-space","normal");
            }
        }

        GM_xmlhttpRequest({
            method: "GET",
            url: theUrl,
            onload: populateInfos,
            context: theName
        });
    });
    */
}

counter =0;

function populateInfos()
{
    var index = infos.length;

    infos[index] = this;

    response = this.response;
    context = this.context;

    $(".poster-container").each(function() {
        var panel = $(this).find("a").first();
        if (panel.data("original-title").trim() == context)
        {
            var nodes = $.parseHTML(response);
            var res = $(nodes).find("section.section.col-10.col-main").first().find("div.review.text").first().find("div.truncate").first().html();
            var rating = $(nodes).find("span.display-rating").text().trim();
            var castlist = $(nodes).find("div.cast-list").text().trim();
            var director = $(nodes).find("a[itemprop='director']").text().trim();
            var inWatchList = $(nodes).find("span.watchlist-link-text").text().trim() == "This film is in your watchlist";

            if (inWatchList)
                $(this).addClass("film-watched");

            var synopsis = context + "\n" + director + "\n" + rating + "\n" + $(nodes).find("section.section.col-10.col-main").first().find("div.review.text").first().find("div.truncate").first().text().trim() + "\n" + castlist;

            $(this).attr("title",synopsis);
        }
    });
}


