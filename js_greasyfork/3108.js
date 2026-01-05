// ==UserScript==
// @name        mmmturkeybacon Numbered Google Results with Easy Copy
// @version     1.13
// @description Numbers results in the format M.N to show the result number. If you are on the first page it divides the results up into groups of 10 and after every 10 results M is increased by 1. This allows you to quickly see which page a result would be on if there were 10 results per page. For any page after the first, M is the page number and N is the result number. Hold the pointer over a button for instructions on copying. Disable Google Instant (Gear>Search settings>Never show Instant results).
// Click button to copy link URL, Ctrl-click to copy link title, Shift-click to copy link title and URL.
// @author      mmmturkeybacon
// @namespace   http://userscripts.org/users/523367
// @include     http*://www.google.*/search?*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant       GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/3108/mmmturkeybacon%20Numbered%20Google%20Results%20with%20Easy%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/3108/mmmturkeybacon%20Numbered%20Google%20Results%20with%20Easy%20Copy.meta.js
// ==/UserScript==

// If you have Google set to return 10 results per page (default), the first
// page usually has 10 results but not sometimes it will have fewer.

// If you change Results per page under Search Settings, Google will return
// more results per page. The number of links on the page might not always be
// the same as the number of results per page you chose. That's because Google
// doesn't count every link it shows you as a result.
// Ads aren't counted
// "More results from ..." are grouped with the link they are under. Google
// counts this as one result.
// "Images for ..." aren't counted. (imagebox_bigimages)
// "News for ..." and all the the links grouped with it are counted as one
// result?? (newsbox)

// scroll to first result if the following is true or the google URL contains &mtb_scroll
var SCROLL_TO_FIRST = false;

$(document).ready(function()
{
    // If instant search has been enabled
    //if(document.getElementById('misspell')) return;

    var $results_div = $('div[id="res"]');
    if ($results_div.length == 0)
    {
        throw new Error("No results.");
    }

    var result_num = 0;
    var page_num = Number($('td[class="cur"]').text());
    page_num = (page_num == 0) ? 1 : page_num;
    var page_str = page_num + '.';
    var is_first_page = (page_num == 1);

    var $results = $('li[class="g"],li[class="g w0"]').not('[id="imagebox_bigimages"]').not('[id="newsbox"]').find('h3');
    $results.each(function(i)
    {
        result_num++;
        if (result_num > 10 && is_first_page)
        {
            page_num++;
            page_str = page_num + '.'
            result_num = result_num - 10;
        }

        $(this).html('<button title="Click to copy URL.\nCtrl-click to copy title.\nShift-click to copy title and URL." id=mtb_btn'+page_str+result_num+'>'+page_str + result_num+'</button>' + '&nbsp;' + $(this).html());
        var $button = $(this).find('button[id^="mtb_btn"]');
        var $link = $(this).find('a');

        var button_handler = (function(title, URL){return function(event)
        {
            if (event.ctrlKey)
            {
                GM_setClipboard(title)
            }
            else if (event.shiftKey)
            {
                GM_setClipboard(title +' '+ URL)
            }
            else
            {
                GM_setClipboard(URL)
            }
        }})($link.html(), $link.attr('href'));

        $button.bind('click', button_handler);

    });

    // scroll to first button unless info box is present
    if ($('li.g.tpo.knavi.obcontainer').length == 0 && (SCROLL_TO_FIRST == true || document.location.href.indexOf('&mtb_scroll') > -1))
    {
        document.querySelector('button[id^="mtb_btn"]').scrollIntoView();
    }
});