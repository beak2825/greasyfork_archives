// ==UserScript==
// @name         Project Free Tv - Smaller links 
// @version      0.01
// @description  Converts table of tv show links to show only the letter selected by users
// @author       razorBlaid
// @match        *://projectfreetv.so/watch-tv-series/*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @run-at document-body
// @namespace https://greasyfork.org/users/33669
// @downloadURL https://update.greasyfork.org/scripts/18008/Project%20Free%20Tv%20-%20Smaller%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/18008/Project%20Free%20Tv%20-%20Smaller%20links.meta.js
// ==/UserScript==

document.addEventListener("DOMContentLoaded", replaceLinks, false );
var links = [];
var groups = [];
if( document.readyState === "complete" ) {
    replaceLinks();
}

function getNavLinks(){
  groups = $('#mcTagMapNav').find('a');
  groups.each( function(){
    var x = $(this).text; // get the text of the link
	$(this).on( "click", function() {
		showLinks( $( this ).text() );
	});
  });
}

function showLinks( aStartingLetter ){
    var aa = new Date().getMilliseconds();
	var newLinks = [];
	for( i = 0; i < links.length; ++i ){
		var a=links[i];
		if(a.title[0].toUpperCase() == aStartingLetter ){
			newLinks.push( a );
		};
	}
	$("#loslinks").remove();
	$("#mcTagMapNav").append( "<div id='loslinks'/>" );
	for( i = 0; i < newLinks.length; ++i ){
		var d = document.createElement("div");
		d.appendChild( newLinks[i] );
		$("#loslinks").append( d );
	}
    var bb = new Date().getMilliseconds();
    var t1 = bb-aa;
    console.log("showtime! " + t1);
}	

function getLinks(){
  var theLinks = $('.tagindex').find('a');
  for( i = 0; i < theLinks.length; ++i ){
    var theTitle = theLinks[i].title;
	if( theTitle != undefined ){
		if( theTitle[0].toUpperCase() == "T" && theTitle.substr( 0, 3 ).toUpperCase() == "THE" ){
		  theLinks[i].title = theTitle.substr( 4, theTitle.length );
		}else if( theTitle[0].toUpperCase() == "A" && theTitle.substr( 0, 2 ).toUpperCase() == "A" ){
		  theLinks[i].title = theTitle.substr( 3, theTitle.length );
		}
	}
  }
  theLinks.sort( function(a,b){
	  var maxLen = Math.min( a.title.length, b.title.length );
	  var ret = 0;
	  var place = 0;
	  while( ret == 0 && place < maxLen ){
		  ret = comp( a.title[place], b.title[place] );
		  ++place;
	  } 
	  return ret;
  });
	  
  links = theLinks;
}

function comp( a, b ){
	if(a > b){
		return 1;
	}else if(a < b){
		return -1;
	}else{
		return 0;
	}
}

function replaceLinks() {
    var a = new Date().getMilliseconds();
	getLinks();var b = new Date().getMilliseconds();
	getNavLinks();var c = new Date().getMilliseconds();
	$("#mcTagMap").replaceWith( $("#mcTagMapNav") );
    showLinks("A");
    var t1 = b-a;
    var t2 = c-b;
    console.log("time 1 " + t1);
    console.log("time 2 " + t2);
}