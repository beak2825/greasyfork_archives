// ==UserScript==
// @name        CH MTurk Page Titles
// @author      clickhappier
// @namespace   clickhappier
// @description Change MTurk page titles to be more specific, instead of most just saying "Amazon Mechanical Turk".
// @version     2.2c
// @match       http://www.mturk.com/*
// @match       https://www.mturk.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/2969/CH%20MTurk%20Page%20Titles.user.js
// @updateURL https://update.greasyfork.org/scripts/2969/CH%20MTurk%20Page%20Titles.meta.js
// ==/UserScript==


var original_title = document.title;

// avoid redundancy from what will be appended
if (original_title == "Amazon Mechanical Turk - All HITs")
{
    original_title = "Amazon Mechanical Turk";
}
else if (original_title == "Amazon Mechanical Turk - HITs Available to You")
{
    original_title = "Amazon Mechanical Turk";
}
else if (original_title == "Amazon Mechanical Turk - All Qualifications")
{
    original_title = "Amazon Mechanical Turk";
}
else if (original_title == "Amazon Mechanical Turk-Your Pending Qualification Requests")
{
    original_title = "Amazon Mechanical Turk";
}
else if (original_title == "Amazon Mechanical Turk - Transfer Earnings")
{
    original_title = "Amazon Mechanical Turk";
}
else if (original_title == "Mechanical Turk")  // avoid inconsistency
{
    original_title = "Amazon Mechanical Turk";
}


// get URL variable - from http://css-tricks.com/snippets/javascript/get-url-variables/
function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for ( var i=0; i<vars.length; i++ ) 
    {
        var pair = vars[i].split("=");
        if ( pair[0] == variable )
            { return pair[1]; }
    }
    return(false);
}


// append heading-esque text from page content:

// for URL used by https://greasyfork.org/scripts/2002-hit-scraper-with-export
if ( document.location.href.indexOf('hit_scraper') > -1 )  
{
	document.title = original_title + " - " + "HIT Scraper";
}
// search results pages with some kind of results
else if ( $('td.title_orange_text_bold').text().trim() != "" )  
{
    // if redirected to 'all HITs' search results from preview/panda link with no more HITs available;
    // if not already included in the URL from accepting a previous HIT in the group, can make a note
    // of the requester name by adding a prevRequester value to the URL yourself; use + signs for spaces
    if ( (document.location.href.indexOf('prevRequester=') > -1) && ($('td.title_orange_text_bold').text().trim().indexOf('HITs Created by') < 0) )  
    {
        document.title = original_title + " - was " + decodeURIComponent( getQueryVariable("prevRequester").replace(/\+/g, " ") ) + " - " + $('td.title_orange_text_bold').text().trim().replace("Created by","by") + " - " + $('td.title_orange_text').text().trim();
    }
    // on a requester search results page with results, with prevRequester value available, no keyword
    // (add a hash/pound sign to indicate it's been prevRequester-ed already)
    else if ( (document.location.href.indexOf('prevRequester=') > -1) && ($('td.title_orange_text_bold').text().trim().indexOf('HITs Created by') > -1) && (document.getElementById('searchbox').value == "") )  
    {
	    document.title = original_title + " - " + $('td.title_orange_text_bold').text().trim().replace("Created by","by") + " # - " + $('td.title_orange_text').text().trim();
	}
    // requester results with keyword and prevRequester available
    // (add a hash/pound sign to indicate it's been prevRequester-ed already)
    else if ( (document.location.href.indexOf('prevRequester=') > -1) && (document.getElementById('searchbox').value != "") && ($('td.title_orange_text_bold').text().trim().indexOf('HITs Created by') > -1) )  
    {
	    document.title = original_title + " - " + $('td.title_orange_text_bold').text().trim().replace("Created by","by") + " containing '" + document.getElementById('searchbox').value + "' # - " + $('td.title_orange_text').text().trim();
	}
    // requester results with keyword, prevRequester not available
    else if ( (document.location.href.indexOf('prevRequester=') < 0) && (document.getElementById('searchbox').value != "") && ($('td.title_orange_text_bold').text().trim().indexOf('HITs Created by') > -1) )  
    {
	    document.title = original_title + " - " + $('td.title_orange_text_bold').text().trim().replace("Created by","by") + " containing '" + document.getElementById('searchbox').value + "' - " + $('td.title_orange_text').text().trim();
	}
	// requester results without keyword and without prevRequester available, or 'all HITs'-type/keyword-only search results
    else
    {
	    document.title = original_title + " - " + $('td.title_orange_text_bold').text().trim().replace("Created by","by") + " - " + $('td.title_orange_text').text().trim();
	    // if on pages of 'All HITs Available To You' past the first, which lose that distinguishment from the general 'All HITs'
	    if ( (document.location.href.indexOf('viewhits') > -1) && ($('a.nonboldsubnavclass').first().text().trim() == "HITs Available To You") )
	    {
	       document.title = document.title.replace("All HITs -", "All HITs Available To You -");
	    }
	}
}
// individual HIT/qual pages
else if ( $('td.capsulelink_bold').text().trim() != "" )  
{
    if ( $('td.capsule_field_text').first().text().trim() != "" )
    {
        // qual page
        if ( document.location.href.indexOf('qualification') > -1 )  
        {
            document.title = original_title + " - Qual by " + $('td.capsule_field_text').first().text().trim() + " - " + $('td.capsulelink_bold').text().trim();
        }
        // HIT page
        else  
        {
            // captcha-ed HIT
            if ( $('a[class="whatis"][href*="whatAreCaptchas"]').text().trim() != "" )
            {
                document.title = original_title + " - Captcha on HIT by " + $('td.capsule_field_text').first().text().trim() + " - " + $('td.capsulelink_bold').text().trim();
            }
            // accepted HIT
            else if ( $('a[href*="mturk/return"]').length > 0 )
            {
                document.title = original_title + " - *Accepted HIT by " + $('td.capsule_field_text').first().text().trim() + " - " + $('td.capsulelink_bold').text().trim();
            }
            // regular preview page
            else
            {
                document.title = original_title + " - HIT by " + $('td.capsule_field_text').first().text().trim() + " - " + $('td.capsulelink_bold').text().trim();
            }
        }
    }
    else
    {
	    document.title = original_title + " - " + $('td.capsulelink_bold').text().trim();
	}
}
// contact pages
else if ( $('div.contactus form p').first().text().trim() != "" )  
{
    // contact requester pages
	if ( document.location.href.indexOf('requesterId=') > -1 )  
	{
	    document.title = original_title + " - " + $('div.contactus form p').first().text().trim() + " (" + getQueryVariable("requesterId") + ")";
	    // add requester ID to in-page heading text too
	    if ( getQueryVariable("requesterName") )
	    {
	       $('div.contactus form p').first().text("Contact Requester: " + decodeURIComponent( getQueryVariable("requesterName").replace(/\+/g, " ") ) + " (" + getQueryVariable("requesterId") + ")" );
	    }
	    // replace confusing 'Contact Requester "" ' line with a statement of the ID when there's no name provided in the URL to use
	    else
	    {
	       $('div.contactus form p').first().text("Contact Requester ID: " + getQueryVariable("requesterId") );
	    }
	}
	// contact mturk page
	else  
	{
	    document.title = original_title + " - " + $('div.contactus form p').first().text().trim();
	}
}
// dashboard/status/earnings pages
else if ( $('td.white_text_14_bold').text().trim() != "" )  
{
	document.title = original_title + " - " + $('td.white_text_14_bold').contents().filter(function(){return this.nodeType == 3;})[0].nodeValue.trim();  // exclude text inside another layer of nested tags such as 'a' or 'span'
}
// no search results pages, other error pages
else if ( $('td.error_title').text().trim() != "" )  
{
    // requester id search with added keyword filter, with no results
    if ( (document.getElementById('searchbox').value != "") && (document.location.href.indexOf('requesterId=') > -1) )
    {
        document.title = original_title + " - was HITs by '" + decodeURIComponent( getQueryVariable("prevRequester").replace(/\+/g, " ") ) + "' containing '" + document.getElementById('searchbox').value + "' - " + $('td.error_title').text().trim() + " - "  + getQueryVariable("requesterId").replace(/\+/g, " ");
    }
    // keyword search for HITs with no results
    else if ( (document.getElementById('searchbox').value != "") && (document.location.href.indexOf('selectedSearchType=quals') < 0) )  
    {
        document.title = original_title + " - was HITs containing '" + document.getElementById('searchbox').value + "' - " + $('td.error_title').text().trim();
    }
    // keyword search for quals with no results
    else if ( (document.getElementById('searchbox').value != "") && (document.location.href.indexOf('selectedSearchType=quals') > -1) )  
    {
        document.title = original_title + " - was Quals containing '" + document.getElementById('searchbox').value + "' - " + $('td.error_title').text().trim();
    }
    // requester id search with no results
    else if ( document.location.href.indexOf('requesterId=') > -1 )  
    {
        if ( document.location.href.indexOf('prevRequester=') > -1 )  // doesn't appear in these URLs on its own, but can make a note of the requester name by adding this value to the URL yourself; use + signs for spaces
        {
            document.title = original_title + " - was HITs by '" + decodeURIComponent( getQueryVariable("prevRequester").replace(/\+/g, " ") ) + "' - " + $('td.error_title').text().trim() + " - "  + getQueryVariable("requesterId").replace(/\+/g, " ");
        }
        else
        {
            document.title = original_title + " - was HITs by ID " + getQueryVariable("requesterId").replace(/\+/g, " ") + " - " + $('td.error_title').text().trim();
        }
    }
    // other error pages
    else  
    {
	    document.title = original_title + " - " + $('td.error_title').text().trim();
	}
}
// help/policies pages
else if ( $('div.title_orange_text_bold').text().trim() != "" )  
{
	document.title = original_title + " - " + $('div.title_orange_text_bold').text().trim();
}
// report-a-HIT confirmation pages
else if ( $('span#alertboxHeader').text().trim() != "" )  
{
	document.title = original_title + " - " + $('span#alertboxHeader').text().trim();
}
// for URL used by https://greasyfork.org/scripts/4188-mturk-qualsorter
else if ( document.location.href.indexOf('/qualtable') > -1 )  
{
	document.title = original_title + " - " + "QualSorter Table";
}


// comment (put a // in front of) the below line to make all titles start with 'Amazon Mechanical Turk' instead of 'AMT'
document.title = document.title.replace("Amazon Mechanical Turk", "AMT");
