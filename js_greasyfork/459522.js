// ==UserScript==
// @name         [PSA] Quick Search
// @author       nht.ctn
// @namespace    https://github.com/nhtctn
// @version      1.3
// @description  It adds PSA quick search buttons for IMDB and Subscene
// @icon         https://images2.imgbox.com/26/c1/2OXmz3tN_o.png
// @license      MIT

// @include      *://psa.*/tv-show/*
// @include      *://psa.*/movie/*
// @match        *://subscene.com/subtitles/title?q=*

// @run-at       document-end

// @require	     https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://greasyfork.org/scripts/427315-url-based-search-for-some-websites/code/URL%20Based%20Search%20for%20Some%20Websites.js?version=936416
// @downloadURL https://update.greasyfork.org/scripts/459522/%5BPSA%5D%20Quick%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/459522/%5BPSA%5D%20Quick%20Search.meta.js
// ==/UserScript==
/*jshint esversion: 6 */
/* global $ */
(function() {

	'use strict';

	var PlanetDP =
	[
		{psa: '1', movie: '1', tv: '0', name: 'Letterboxd', url_title: 'https://letterboxd.com/search/films/%title%',},
		{psa: '1', movie: '1', tv: '1', name: 'Subscene',   url_title: 'http://subscene.com/subtitles/title?q=%title%',},
		{psa: '1', movie: '1', tv: '1', name: 'IMDb',       url_title: 'https://www.imdb.com/find/?q=%title%',},
	];

	// Common Used Vars
    var pageUrl = window.location.href;
    var titleArea;
    var title;
    var year = "";

	if (pageUrl.search(/psa\..+\/(tv-show|movie)\//) >= 0 && PlanetDP[0].psa == 1 ) //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    {
	    const html = () => {
		   var h = '';
		   for( var i = 0, len = PlanetDP.length; i < len; i++ ) {
		    	var p = PlanetDP[i];
                if ( p.psa == 1 && (p.movie == pageUrl.search(/psa\..+\/movie\//) >= 0 || p.tv == pageUrl.search(/psa\..+\/tv-show\//) >= 0) ) {
                    h += '<li class="648search" style="float: right;"><a target="_blank" href="' + url( p.url_title ) + '">' + p.name + '</a></li>';
                }
		    }
		    return h;
	    };

        // Vars
        title = titleEdit( $('article h1.entry-title').text().replace(/ \((\d{4})\)/, "") );
        year = '';
        titleArea = $('div.page-title li.comments');
        titleArea.after( html() );
    }

	function url( site ) {
        if ( site.indexOf( "%title%" ) >= 0) {site = site.replace( /%title%/, title );}
        if ( site.indexOf( "%year%" ) >= 0) {site = site.replace( /%year%/, year );}

		return site;
    }
    function titleEdit( e_title ) {
        e_title = e_title
            .replace( ":", " " )
            .replace( "-", " " )
            .replace("&amp;","&") //replace & with code
            .replace("&nbsp;","") //delete nobreak space
            .replace(/[\/\\#+()$~%"*?<>{}]/g, " ") //remove bad chars
            .replace( /\s{2,}/g, " " )
            .trim()
        ;
        return e_title;
    }
})();