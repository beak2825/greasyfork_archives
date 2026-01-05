// ==UserScript==
// @name        mmmturkeybacon Numbered Google Results (with 10-per-page mod)
// @author      mmmturkeybacon + clickhappier
// @description Numbers Google search results in the format M.N (page number, and result number 1-10 on that page). Google Instant should be disabled.
// @version     1.0.1.1c
// @namespace   http://userscripts.org/users/523367
// @include     https://www.google.*/search?*
// @include     https://www.google.*/?gws_rd=ssl*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/2970/mmmturkeybacon%20Numbered%20Google%20Results%20%28with%2010-per-page%20mod%29.user.js
// @updateURL https://update.greasyfork.org/scripts/2970/mmmturkeybacon%20Numbered%20Google%20Results%20%28with%2010-per-page%20mod%29.meta.js
// ==/UserScript==


// v1, 2014-02-09 - mmmturkeybacon's original release on userscripts.org (imported to greasyfork on 2014-07-08)
// v1c, 2014-07-02 - modified by clickhappier to add page numbering for 10-result pages
// v1.0.1c, 2015-07-24 - Google's recent formatting changes broke it; rewrote it with jquery in the process of fixing it. 
//                       I saw after finishing that mmmturkeybacon rewrote his version in Mar-Apr 2015 too, and had added
//                       10-per-page support to it now as well as 'easy copy' and some other features, but I guess I'll keep
//                       this around anyway for those who prefer this version.


// If you have Google set to return 10 results per page (default), the first
// page usually has 10 results, but sometimes it will have more or fewer.
// If you change Results per page under Search Settings, Google will return
// more results per page. The number of links on the page might not always be
// the same as the number of results per page you chose. That's because Google
// doesn't count every link it shows you as a result.
// Ads and special results such as images aren't counted.
// "More results from ..." are grouped with the link they are under, as one result.

// Google Instant should be disabled on each Google country domain you use
// (Gear menu -> 'Search Settings' -> 'Never show Instant results.').


function numberIt(jNode)
{

    var i;
    var result_num = 0;
    var page_num = 1;
    var page_str = '';

    // add 10-per-page #s
    if ( $('table#nav tbody tr td.cur').text().trim().length )
    {
        page_num = $('table#nav tbody tr td.cur').text().trim();
    }
    page_str = page_num + '.';
    // end 10-per-page #s

    $('.g div.rc h3.r').each(function(index)
    {
        if ( $(this).find('span.num').length )
        {
            console.log("numbered");
            return;
        }
        else
        {
            result_num++;
            if (result_num > 10)
            {
                page_num++;
                page_str = page_num + '.';
                result_num = result_num - 10;
            }
        
            $(this).html( '<span class="num">' + page_str + result_num + '</span>' + '&nbsp;-&nbsp;' + $(this).html() );
        }
    });

}

$(document).ready(numberIt);