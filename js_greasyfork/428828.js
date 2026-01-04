// ==UserScript==
// @name         Movies7 / Flixtor Trailers
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  generates 'Trailer' links that will open a video trailer for tv shows and movies, using YouTube, in a popup window
// @include      https://movies7.to/*
// @include      https://www*.movies7.to/*
// @include      https://www.movies7.to/*
// @include      https://flixtor.video/*
// @match        *://movies7.to/*
// @match        *://www*.movies7.to/*
// @match        *://www.movies7.to/*
// @match        https://flixtor.video/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @author       drhouse
// @downloadURL https://update.greasyfork.org/scripts/428828/Movies7%20%20Flixtor%20Trailers.user.js
// @updateURL https://update.greasyfork.org/scripts/428828/Movies7%20%20Flixtor%20Trailers.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
jQuery(function($){

    $('.filmlist > .item').each(function(index, value) {

        var title = $(this).find("h3 > a").text()

        var year = $(this).find(".meta").text()
        year = year.slice(1, 5)

        if (year.startsWith("SS") === true){
            year = 'tv+show'
        } else {
            year = year + '+movie'
        }

        var finaltitle = '"' + title + '"' + ' ' + year

        var siteLink
        siteLink = document.createElement('a');
        siteLink.textContent = 'Trailer';
        siteLink.setAttribute('href', 'https://www.google.com/search?q=site%3Ayoutube.com+' + finaltitle + '+trailer&btnI=I%27m+Feeling+Lucky');
        siteLink.setAttribute('class', 'nframe');
        siteLink.style.fontSize = 'inherit';

        var insert = $(this).find(".meta > .dot ")
        $(insert).after(siteLink)

    })

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
    })

});