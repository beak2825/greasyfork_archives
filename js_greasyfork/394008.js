// ==UserScript==
// @name         Simkl TV Next Episode Date
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Replaces "Airing" column with "Next Episode Date" column
// @author       jessequentin
// @match        https://simkl.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/394008/Simkl%20TV%20Next%20Episode%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/394008/Simkl%20TV%20Next%20Episode%20Date.meta.js
// ==/UserScript==
(function() {
    'use strict';
    window.jQuery310 = $.noConflict(true);
    function addNextEpisodeDate () {
        $("img[alt='Airing']").closest("a").text("Next Episode Date");

        $(".SimklTVMyTableTRTitle").each(function() {
            var showlink = $(this).find("a").attr('href');
            $(this).siblings(".SimklTVMyTableTRAiring").load( showlink + " .SimklTVAboutBlockBottomEpisodes > table", function () {
                $(this).find('.SimklTVAboutBlockEpisodeWhich:contains("Previous")').closest("table").replaceWith("<div class=TBD>TBD</div>");
                var infotab=$(this).find('.SimklTVAboutBlockEpisodeWhich').first().closest("table").find("table.ajLinkInside").first();
                var eplink=$(infotab).find("a").first().attr("href");
                var infostring=$(infotab).text();
                var infodate=infostring.match(/[0-9]+\-[0-9]+\-[0-9]+/g);
                infodate=infodate?String(infodate).replace(/\-/g,"/"):"TBD";
                var airdate = (infodate&&infodate!="TBD")?Date.parse(infodate):14399999996400;
                if(!eplink) eplink=showlink;
                $(this).replaceWith('<td class="SimklTVMyTableTRAiring SimklTVMyTableTRTitle" width="155"><a href="'+eplink+'"><span>'+airdate+"</span>"+infodate+"</a></td>");

            })
        });
    }


    // store url on load
    var currentPage = location.href;
    var patt = /^http[s]?:\/\/simkl\.com\/\S+\/\S+\/watching\/$/gm;

    if(patt.test(currentPage)) {
        addNextEpisodeDate();
    }

    // listen for changes
    setInterval(function() {
        if (currentPage != location.href && patt.test(location.href)) {
            window.location.reload() ;
        }
    }, 500);

    $("#refreshList").on("click",function() { window.location.reload(); });
})();