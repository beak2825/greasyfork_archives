// ==UserScript==
// @name        Searx - Number Results
// @namespace   r-a-y/searx/search
// @description Number search results on select Searx instances.
// @version     1.0.5
// @grant       none
// @match       https://searx.be/*
// @match       https://search.tuxcloud.net/*
// @match       https://searx.hlfh.space/*
// @match       https://search.stinpriza.org/*
// @match       https://searx.win/*
// @match       https://search.snopyta.org/*
// @match       https://searx.prvcy.eu/*
// @license     GPL v3
// @downloadURL https://update.greasyfork.org/scripts/26584/Searx%20-%20Number%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/26584/Searx%20-%20Number%20Results.meta.js
// ==/UserScript==

var currPage = document.querySelector( '.pull-left input[name="pageno"]' ).getAttribute('value'),
    results = document.getElementById("main_results").getElementsByTagName("h4"),
    searxVersion = document.querySelector( 'meta[name="generator"]' ).getAttribute( 'content' ).replace( 'searx/', '' );

currPage = currPage - 1;

for ( i = 0, len = results.length; i < len; ++i ) {
  newSpan    = document.createElement( "span" );
  newSpan.setAttribute( "style", "float:left; font-weight:600; font-size:.9em !important; display:inline-block; margin-top:2px; margin-right:5px;" );

  newContent = document.createTextNode( ( currPage * len + i + 1 ) + ". ");
  newSpan.appendChild( newContent );

  results[i].insertBefore( newSpan, results[i].firstChild );
}