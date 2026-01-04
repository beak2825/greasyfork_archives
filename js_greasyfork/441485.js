// ==UserScript==
// @name         Direct Links From Yelp
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Skips Yelp's redirect page and causes restaurant site links to be direct.
// @author       Guessed#8822
// @license      MIT
// @match        https://www.yelp.com/*
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/441485/Direct%20Links%20From%20Yelp.user.js
// @updateURL https://update.greasyfork.org/scripts/441485/Direct%20Links%20From%20Yelp.meta.js
// ==/UserScript==

$(document).ready(function() {
    $('a').each(function() {
        try {
        if($(this).attr('href').indexOf('biz_redir') > -1) { //this looks for urls that include the redirect page
            var wrkstr = $(this).attr('href');
            wrkstr = wrkstr.replaceAll('%3A', ':'); //replace url-safe colons with colon characters
            wrkstr = wrkstr.replaceAll('%2F', '/'); //same for slashes
            wrkstr = wrkstr.slice(wrkstr.indexOf('url=http')+4); //slice off everything before the url= parameter
            if (wrkstr.indexOf('&') > -1) {
                wrkstr = wrkstr.substring(0, wrkstr.indexOf('&')); //remove any parameters after url
            }
            $(this).attr('href', wrkstr); //write the fixed URL to the href attribute
        }
        } catch(error) { //this accounts for a-tags that have no href value
        }
    });
});