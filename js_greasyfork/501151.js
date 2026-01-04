// ==UserScript==
// @name         CineZone Trailers
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  generates 'Trailer' links that will open a video trailer for movies and TV shows, using YouTube, in a popup window
// @match        *://cinezone.to/*
// @match        *://www*.cinezone.to/*
// @match        *://www.cinezone.to/*
// @match        https://flixflare.to/*
// @require      https://code.jquery.com/jquery-3.7.0.min.js
// @license      CC-BY-NC-SA-4.0
// @icon https://www.google.com/s2/favicons?sz=64&domain=cinezone.to
// @author       drhouse
// @downloadURL https://update.greasyfork.org/scripts/501151/CineZone%20Trailers.user.js
// @updateURL https://update.greasyfork.org/scripts/501151/CineZone%20Trailers.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
jQuery(function($){

    var title = $("h1[itemprop='name']").text().trim();

    var siteLink = document.createElement('a');
    siteLink.innerHTML = '<b>[ Trailer ]</b>';
    siteLink.setAttribute('href', 'https://www.google.com/search?q=site%3Ayoutube.com+' + encodeURIComponent(title) + '+trailer&btnI=I%27m+Feeling+Lucky');
    siteLink.setAttribute('class', 'nframe');
    siteLink.style.fontSize = 'inherit';

    var insert = $("h1").first();
    // $(insert).append(siteLink).append("<br>");
     $(insert).after(siteLink).append("<br>");

    $(".nframe").click(function (e) {
        e.preventDefault();
        var url = $(this).attr("href");

        var width = screen.width * 0.75;
        var height = screen.height * 0.75;
        var left = (screen.width - width) / 2;
        var top = (screen.height - height) / 2;
        var params = 'width=' + width + ', height=' + height;
        params += ', top=' + top + ', left=' + left;
        params += ', directories=no';
        params += ', location=no';
        params += ', menubar=no';
        params += ', resizable=yes';
        params += ', scrollbars=yes';
        params += ', status=no';
        params += ', toolbar=no';
        var newwin = window.open(url, 'subpop', params);
        if (window.focus) {
            newwin.focus()
        }
        return false;
    });
});
