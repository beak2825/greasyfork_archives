// ==UserScript==
// @name                VBB Show new posts
// @namespace	        http://www.schuerkamp.de/greasemonkeyhacks/
// @description	        Adds a "whats new" search link and some shortcuts to vbb forum pages
// @description         Download URL: https://zif.gplrank.info/hoover/vbb_whatsnew.user.js
// @include		http*://*dev.imagespaceinc.com/*
// @include             http*://forum.wmdportal.com/*
// @include             http*://*isiforums.net/*
// @include             http*://*www.bmsforum.org/*
// @include             http*://*benchmarksims.org/*
// @include             http*://*49th.de/*
// 
// @version 0.0.1.20220107095159
// @downloadURL https://update.greasyfork.org/scripts/438149/VBB%20Show%20new%20posts.user.js
// @updateURL https://update.greasyfork.org/scripts/438149/VBB%20Show%20new%20posts.meta.js
// ==/UserScript==

var EuropeanDateFormat=1; 
var newlink = document.createElement('a');
var todays_posts = document.createElement('a');
newlink.href = 'search.php?do=getnew&contenttype=vBForum_Post';
todays_posts.href = 'search.php?do=getdaily&contenttype=vBForum_Post';
tn = document.createTextNode(' Show new posts ');
newlink.appendChild(tn);
tn2 = document.createTextNode(' Show todays posts');
todays_posts.appendChild(tn2);

var footer = document.getElementById('footer_links');

if (footer) {
    footer.appendChild(newlink);
    footer.appendChild(todays_posts); 
}

// quick hack to set a default email address
from = document.getElementById('it_from_3');
if (from) {
    from.value="beta-applications@imagespaceinc.com"; 
}

if (EuropeanDateFormat == 1) {
    var dates = document.getElementsByClassName('date');
    for (var i = 0  ; i < dates.length ; i++) {
	var post_date = dates[i].innerText;
	// check if there's a year string in the -2012 notation (will stop working in 2100 ;-) 
	if (post_date.indexOf("-20") != -1 ) {
	    year = post_date.substring(6, 10);
	    month = post_date.substring(0, 2);
	    day = post_date.substring(3, 5);
	    var new_date = ""; 
	    dates[i].innerText = year + "/" + month + "/" + day; 
	    }
    } 
}

// stolen shamelessly from userscript.org's facebook key navigation
// Thanks to Droll Troll

function OnKeyUp(e)
{
    var anchors = document.getElementsByTagName('a');
    for (var i = 0  ; i < anchors.length ; i++) {
       var href = anchors[i].getAttribute('href'); 
       if (href) {
          if(href.match(/goto=newpost/)) {
             break ; 
             }
          }
       } 

    // do a search if we cannot find the "next page" link
    next_page_or_new ="search.php?do=getnew&contenttype=vBForum_Post"
    for (var i = 0  ; i < anchors.length ; i++) {
       var next_page_href = anchors[i].getAttribute('href'); 
       var title01 = anchors[i].getAttribute('title'); 
       if (title01) {
          if(title01.match(/Next Page/)) {
	      next_page_or_new = next_page_href
             break ; 
             }
          }
       } 

    prev_page_or_new ="search.php?do=getnew&contenttype=vBForum_Post"
    for (var i = 0  ; i < anchors.length ; i++) {
       var prev_page_href = anchors[i].getAttribute('href'); 
       var title01 = anchors[i].getAttribute('title'); 
       if (title01) {
          if(title01.match(/Prev Page/)) {
	      prev_page_or_new = prev_page_href
              break ; 
          }
       }
    } 

    key_map = {
	"N" : "search.php?do=getnew&contenttype=vBForum_Post",
        "G" : href,
	"K" : next_page_or_new, 
	"J" : prev_page_or_new, 
	"T" : 'search.php?do=getdaily&contenttype=vBForum_Post'
    }

    if (String.fromCharCode(e.keyCode) in key_map && 	
	(typeof e.target.type == "undefined" || (e.target.type != "text" && e.target.type != "textarea")) && 
	!e.altKey && !e.ctrlKey && e.keyCode <= 90)
	{
	    window.location.replace(key_map[String.fromCharCode(e.keyCode)])
		}
}

window.addEventListener("keyup",function(event) { OnKeyUp(event); },false)

