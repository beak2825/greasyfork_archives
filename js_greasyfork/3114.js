// ==UserScript==
// @name        mmmturkeybacon Enhanced HIT Information Capsule (Shows Automatic Approval Time)
// @version     1.27
// @description Changes the requester name to a link that searches mturk for HITs by the requester. Adds a link to the average Turkopticon ratings for that requester. Adds a contact link for the requester. Displays hitAutoAppDelayInSeconds in a human readable format.
// @author      mmmturkeybacon
// @namespace   http://userscripts.org/users/523367
// @match       https://www.mturk.com/mturk/accept*
// @match       https://www.mturk.com/mturk/preview*
// @match       https://www.mturk.com/mturk/continue*
// @match       https://www.mturk.com/mturk/submit
// @match       https://www.mturk.com/mturk/return*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/3114/mmmturkeybacon%20Enhanced%20HIT%20Information%20Capsule%20%28Shows%20Automatic%20Approval%20Time%29.user.js
// @updateURL https://update.greasyfork.org/scripts/3114/mmmturkeybacon%20Enhanced%20HIT%20Information%20Capsule%20%28Shows%20Automatic%20Approval%20Time%29.meta.js
// ==/UserScript==

// API http://api.turkopticon.istrack.in/multi-attrs.php?ids=
//var base = 'http://turkopticon.istrack.in'; // mirror

var base_TO_URL = 'http://turkopticon.ucsd.edu/';
var base_searchbar_URL = 'https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups';

var requesterId = $('input[type="hidden"][name="requesterId"]').val();
if (!requesterId)
{
    // Continued HITs don't have the requesterId in a hidden input or
    // the return URL. We could search the iframe src URL for the
    // requesterId but it might not be there either, so it's not worth
    // the extra processing time required.    

    // try to get requesterId from return URL
    var $return_URL = $('a[href^="/mturk/return?groupId="]');
    if ($return_URL.length > 0)
    {
        requesterId = $return_URL.attr('href').split(/[&=]/)[3];
    }
}

/*
 * Before a HIT is accepted - accept hitId, hitReview hitId, and assignmentId are all the same.
    <form name="hitForm" method="GET" action="/mturk/accept">
        <input type="hidden" name="hitId" value="2NFBAT2D5NQYTXEZWYAG9TYP37L73N">

    <form name="hitForm" method="POST" action="/mturk/hitReview" style="display:inline;">
        <input type="hidden" name="groupId" value="2FH56XBAT2D5TIXJBDUQ4JH8YYQ40Y">
        <input type="hidden" name="hitId" value="2NFBAT2D5NQYTXEZWYAG9TYP37L73N">
        <input type="hidden" name="assignmentId" value="2NFBAT2D5NQYTXEZWYAG9TYP37L73N">

 * After a HIT is accepted - submit hitId and assignmentId are the same but hitReview hitId is different.
 * hitReview hitId is the ID referenced when emailing a requester through the contact form and in bonus
 * emails.
    <form name="hitForm" method="POST" action="/mturk/submit">
        <input type="hidden" name="hitId" value="21DPHIT3HVWA1CH28LAQ6175AN4CKV">

    <form name="hitForm" method="POST" action="/mturk/hitReview" style="display:inline;">
        <input type="hidden" name="groupId" value="2FH56XBAT2D5TIXJBDUQ4JH8YYQ40Y">
        <input type="hidden" name="hitId" value="2ZRNZW6HEZ6OKWPSDRZ6DGUPIWPZPI">
        <input type="hidden" name="assignmentId" value="21DPHIT3HVWA1CH28LAQ6175AN4CKV">
*/


var hitReview_hitId = $('form[name="hitForm"][action="/mturk/hitReview"] input[name="hitId"]').val();
var requesterName_node = $('a[id="requester.tooltip"]:contains("Requester:")').parent().next();
var requesterName = requesterName_node.text().trim();
var requesterName_plus = requesterName.replace(/ /g, '+');


if (requesterId)
{
    var searchbar_URL = base_searchbar_URL+'&requesterId='+requesterId;
    var requesterName_HTML = '<a href="'+searchbar_URL+'" title="Search mturk by requesterId" target="_blank">'+requesterName+'</a>'+'&nbsp;['+requesterId+']';
    
    var avg_TO_URL = base_TO_URL+'aves/'+requesterId;
    var avg_TO_link = '<a href="' + avg_TO_URL + '" title="Average of all Turkopticon ratings" target="_blank">Averaged Turkopticon Ratings</a>';
    //var contact_URL = 'https://www.mturk.com/mturk/contact?subject=Regarding+Amazon+Mechanical+Turk+HIT+'+hitReview_hitId+'&requesterId='+requesterId+'&requesterName='+requesterName_plus;
    var contact_URL = 'https://www.mturk.com/mturk/contact?subject=Regarding+Amazon+Mechanical+Turk+HIT+'+hitReview_hitId+'&requesterName='+requesterName_plus+'&requesterId='+requesterId;
    var contact_link = '<a href="'+contact_URL+'" title="Contact the Requester of this HIT" target="_blank">Contact Requester</a>';
    var link_row_html = avg_TO_link+'&nbsp;&nbsp;'+contact_link;
}
else
{
    var searchbar_URL = base_searchbar_URL+'&searchWords='+requesterName_plus;
    var requesterName_HTML = '<a href="'+searchbar_URL+'" title="Search mturk for requester name" target="_blank">'+requesterName+'</a>';
/*
 * Since the requesterId is unavailable it is not possible to form a contact link or a direct link to the requester's turkopticon ratings.
 * To contact a requester after you've accepted a HIT simple go to your queue (HITs Assigned To You), click "Show all details",
 * find the HIT, and click "Contact the Requester of this HIT".
 * To get Turkopticon ratings for a queued HIT install mmmturkeybacon Color Coded Queue.

    var search_TO_url = base_TO_URL+'main/php_search?query='+requesterName_plus;
    var search_TO_link = '<a href="'+search_TO_url+'" title="Search Turkopticon for requester name" target="_blank">Search for Requester on Turkopticon</a>';
    var link_row_html = search_TO_link+'&nbsp;&nbsp;';
*/
}

requesterName_node.html(requesterName_HTML);


var hitAutoAppDelayInSeconds = $('input[type="hidden"][name="hitAutoAppDelayInSeconds"]').val();
//hitAutoAppDelayInSeconds = 2*(86400) + 1*(3600) + 2*(60) + 2;
//hitAutoAppDelayInSeconds = 2*(86400) + 2*(60) + 2;
//hitAutoAppDelayInSeconds = 2*(60) + 2;
//hitAutoAppDelayInSeconds = 0;

// time formatting code modified from http://userscripts.org/scripts/show/169154
var days  = Math.floor((hitAutoAppDelayInSeconds/(60*60*24)));
var hours = Math.floor((hitAutoAppDelayInSeconds/(60*60)) % 24);
var mins  = Math.floor((hitAutoAppDelayInSeconds/60) % 60);
var secs  = hitAutoAppDelayInSeconds % 60;

var time_str = (days  == 0 ? '' : days  + (days  > 1 ? ' days '    : ' day '))    +
               (hours == 0 ? '' : hours + (hours > 1 ? ' hours '   : ' hour '))   + 
               (mins  == 0 ? '' : mins  + (mins  > 1 ? ' minutes ' : ' minute ')) + 
               (secs  == 0 ? '' : secs  + (secs  > 1 ? ' seconds ' : ' second '));

if (hitAutoAppDelayInSeconds == 0)
{
    time_str = "0 seconds";
}

var requesterName_row = $('a[id="requester.tooltip"]:contains("Requester:")').parent().parent();
requesterName_row.after('<tr><td colspan="11" valign="top" nowrap="" align="left"><b>&nbsp;Automatically Approved:&nbsp;&nbsp;</b>'+time_str+'</td></tr>');
if (link_row_html)
{
    requesterName_row.after('<tr><td colspan="11" valign="top" nowrap="" align="left">&nbsp;'+link_row_html+'</td></tr>');
}