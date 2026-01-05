// ==UserScript==
// @name        mmmturkeybacon Queue Order Fix
// @version     2.22
// @description After completing a HIT anywhere within your queue (i.e. HITs Assigned To You), this script will automatically continue the HIT at the top of your queue. 
// For example, if you sort your queue by Time Left (least first), you can use this script to work on the HITs that are closest to expiring instead of mturk's default behavior ignoring what your queue is sorted by and putting the oldest HIT next in line. You should only need to set the sort order once. HITs accepted after setting the sort order will be sorted automatically by mturk. Additionally you can manually continue the HIT at the top of your queue if you visit "https://www.mturk.com/mturk/myhits?first". Create a bookmark on your toolbar to quickly jump to the first HIT in your queue. This is especially useful if you just caught a HIT that will expire quickly.
// @author      mmmturkeybacon
// @namespace   http://userscripts.org/users/523367
// @match       https://*.mturk.com/mturk/myhits*
// @match       https://*.mturk.com/mturk/sortmyhits?*
// @match       https://*.mturk.com/mturk/viewmyhits?*
// @match       https://*.mturk.com/mturk/continue*
// @match       https://*.mturk.com/mturk/submit
// @match       https://*.mturk.com/mturk/return?requesterId=*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/3103/mmmturkeybacon%20Queue%20Order%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/3103/mmmturkeybacon%20Queue%20Order%20Fix.meta.js
// ==/UserScript==

/*
 * Mechanical Turk has two types of HITs. By far the ExternalQuestion HITs are 
 * the most common. These HITs use an iframe to display the task, disable the 
 * yellow Submit HIT button, and use the hidden link with the id hitExternalNextLink
 * to direct the browser to a new page after the task has been submitted in the
 * iframe. The second type of HIT is the QuestionForm HIT. These HITs do not use
 * an iframe, use the yellow Submit HIT button to submit, and do not use
 * hitExternalNextLink to direct the browser to a new page.
 *
 * For ExternalQuestion HITs, fixing the queue order is as simple as replacing
 * hitExternalNextLink with the URL of the next link you wish to work on.
 *
 * QuestionForm HITs don't use the hitExternalNextLink, however we can utilize
 * the fact that after a QuestionForm HIT is submitted the URL ends with 
 * /mturk/submit to redirect the browser to the top of the queue.
 *
 */

/* NOTE: This script doesn't actually do anything on the /mturk/myhits page but running it on that page makes it convenient to disable the script by unchecking it in the greasemonkey dropdown menu. */

/*
___Bookmarklets___
First HIT in the fixed queue  -- javascript:(function(){window.open('https://www.mturk.com/mturk/myhits?first')})()
Last HIT in the fixed queue   -- javascript:(function(){window.open('https://www.mturk.com/mturk/myhits?last')})()
Last HIT in the fixed queue*  -- javascript:(function(){window.open(localStorage.getItem('mtbqof_sortmyhits_URL').replace('sortmyhits?','viewmyhits?')+'?last')})()
*Will only work if a window with the mturk.com domain is in focus when the bookmarklet is clicked.

First HIT in the unfixed queue -- javascript:(function(){window.open('https://www.mturk.com/mturk/viewmyhits?searchSpec=HITSearch%2523T%25231%2523100%2523-1%2523T%2523!Status!0!rO0ABXQACEFzc2lnbmVk!%2523!CreationTime!0!%2523!&selectedSearchType=hitgroups&searchWords=&sortType=CreationTime%253A0&pageSize=100&?first','mtbqswin')})()
Last HIT in the unfixed queue  -- javascript:(function(){window.open('https://www.mturk.com/mturk/viewmyhits?searchSpec=HITSearch%2523T%25231%2523100%2523-1%2523T%2523!Status!0!rO0ABXQACEFzc2lnbmVk!%2523!CreationTime!0!%2523!&selectedSearchType=hitgroups&searchWords=&sortType=CreationTime%253A0&pageSize=100&?last','mtbqswin')})()

*/

var DEFAULT_SORT_URL = '/mturk/sortmyhits?searchSpec=HITSearch%23T%231%23100%23-1%23T%23!Status!0!rO0ABXQACEFzc2lnbmVk!%23!Deadline!0!%23!&selectedSearchType=hitgroups&searchWords=&sortType=Deadline%3A0&pageSize=100'; // Show up to 100 HITs on a single page. The most HITs I've ever seen in a full queue is 27, so set the max to 100 (instead of 25) to get every HIT and to future-proof.

var TIMEOUT_TIMELIMIT = 10000; // 10000 [ms]
var ON_ERROR_REDIRECT_URL = '/mturk/myhits';

$(document).ready(function()
{
    var this_URL = window.location.href;
    var this_URL_type = this_URL.split(/mturk\/|\?/)[1];

    /* if hitExternalNextLink contains the groupId we are not working from the queue */
    var hitExternalNextLink = $('a[id="hitExternalNextLink"]:not([href*="groupId="])');
    var is_external_HIT = $('iframe').length > 0;
    var sortmyhits_URL = localStorage.getItem('mtbqof_sortmyhits_URL') || DEFAULT_SORT_URL;


    if (hitExternalNextLink.length > 0 && window.name.indexOf('mtbqswin') == -1)
    { // This HIT is in the queue pipeline.
        var this_hitId = hitExternalNextLink.attr('href').split(/&|hitId=/)[2];
        if (this_URL_type == 'continue' || this_URL_type == 'submit' || this_URL_type == 'return')
        {
            $.ajax({
                url: sortmyhits_URL,
                type: 'GET',
                success: function(data)
                {
                    var $src = $(data);
                    var maxpagerate = $src.find('td[class="error_title"]:contains("You have exceeded the maximum allowed page request rate for this website.")');
                    if (maxpagerate.length == 0)
                    {
                        var $continue_links = $src.find('a[href^="/mturk/continue"]');
                        var first_queue_URL = $continue_links.eq(0).attr('href');
                        if (first_queue_URL)
                        {
                            var first_queue_hitId = first_queue_URL.split('hitId=')[1];
                            if (this_hitId != first_queue_hitId)
                            {
                                if (this_URL_type == 'submit' || this_URL_type == 'return')
                                {
                                    window.location.replace(first_queue_URL);
                                }
                                else if (is_external_HIT)
                                {
                                    hitExternalNextLink.attr('href', first_queue_URL);
                                }
                            }
                            else if (is_external_HIT)
                            {
                                var second_queue_URL = $continue_links.eq(1).attr('href');
                                if (second_queue_URL)
                                {
                                    hitExternalNextLink.attr('href', second_queue_URL);
                                }
                                else
                                {

                                    // No more HITs left when we last checked but it's possible one arrived afterwards,
                                    // so redirect to the first HIT in the queue if it is there.
                                    hitExternalNextLink.attr('href', '/mturk/myhits?first');
                                }
                            }

                            var num_hits = $src.find('td[class="title_orange_text"]:contains("Results")').text().trim().split(' ')[2];
                            var hit_rank = $continue_links.index($src.find('a[href^="/mturk/continue?hitId='+this_hitId+'"]')) + 1;

                            if (hit_rank > 0 && num_hits > 0)
                            {
                                document.title = hit_rank+'/'+num_hits+' '+document.title;
                            }
                        }
                    }
                    else
                    {
                        hitExternalNextLink.attr('href', ON_ERROR_REDIRECT_URL);
                    }
                },
                error: function(xhr, status, error)
                {
                    hitExternalNextLink.attr('href', ON_ERROR_REDIRECT_URL);
                },
                timeout: TIMEOUT_TIMELIMIT
            });
        }
    }
    else if (this_URL.endsWith('?first') || (this_URL_type == 'continue' && $('span[id="alertboxHeader"]:contains("You have already")').length > 0))
    { // When we see a that URL that ends with ?first jump to the first HIT in the queue. Or if you've already completed or returned a HIT then jump to the first HIT in the queue.
        var first_queue_URL = $('a[href^="/mturk/continue"]:first').attr('href');
        if (first_queue_URL)
        {
            window.location.replace(first_queue_URL);
        }
    }
    else if (this_URL.endsWith('myhits?last'))
    {
        window.location.replace(sortmyhits_URL.replace('sortmyhits?','viewmyhits?')+'?last');
    }
    else if (this_URL.endsWith('?last'))
    { // When we see a that URL that ends with ?last jump to the first HIT in the queue.
        var last_queue_URL = $('a[href^="/mturk/continue"]:last').attr('href');
        if (last_queue_URL)
        {
            window.location.replace(last_queue_URL);
        }
    }
    else if (this_URL_type == 'sortmyhits')
    { // Modify and save the queue sort URL so the code can see all queue HITs on the same page to determine rank.
        localStorage.setItem('mtbqof_sortmyhits_URL', window.location.href.split("mturk.com")[1].replace("%2310%23", "%23100%23").replace(/&pageSize=\d{1,3}/, '&pageSize=100'));  // Show up to 100 HITs on a single page. The most HITs I've ever seen in a full queue is 27, so set the max to 100 (instead of 25) to get every HIT and to future-proof.
    }
    // else it's a submit link but not inside the queue pipeline, so do nothing

});