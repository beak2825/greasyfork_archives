// ==UserScript==
// @name          CH MTurk HIT Link Cleanup
// @description   On Oct 12, 2016, Amazon added a bunch of useless garbage variables to all the HIT links on MTurk search results pages, making your browser history no longer able to change the link color of HITs you've already visited. This script removes the garbage from those links so your browser history can work properly again. And if you put it first in your userscript execution order, it should also fix some other scripts that were affected by this garbage.
// @version       2.0c
// @author        clickhappier
// @namespace     clickhappier
// @include       https://www.mturk.com/mturk/*
// @require       http://code.jquery.com/jquery-latest.min.js
// @grant         GM_log
// @downloadURL https://update.greasyfork.org/scripts/24065/CH%20MTurk%20HIT%20Link%20Cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/24065/CH%20MTurk%20HIT%20Link%20Cleanup.meta.js
// ==/UserScript==


// get URL variable - adapted from http://css-tricks.com/snippets/javascript/get-url-variables/ to be universal vs window.location-only
function getUrlVariable(url, variable)
{
    var query = url.split('?');
    var vars = query[1].split("&");
    for ( var i=0; i<vars.length; i++ ) 
    {
        var pair = vars[i].split("=");
        if ( pair[0] == variable )
            { return pair[1]; }
    }
    return(false);
}

// set URL variable - from http://stackoverflow.com/questions/5999118/add-or-update-query-string-parameter/15023688#15023688
function setUrlVariable(uri, key, value) {
    var re = new RegExp("([?|&])" + key + "=.*?(&|#|$)", "i");
    if (uri.match(re)) 
    {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    } 
    else 
    {
        var hash =  '';
        var separator = uri.indexOf('?') !== -1 ? "&" : "?";    
        if( uri.indexOf('#') !== -1 )
        {
            hash = uri.replace(/.*#/, '#');
            uri = uri.replace(/#.*/, '');
        }
        return uri + separator + key + "=" + value + hash;
    }
}

// remove URL variable - from http://stackoverflow.com/questions/1634748/how-can-i-delete-a-query-string-parameter-in-javascript/16189172#16189172
function removeUrlVariable(url, parameter)
{
  var fragment = url.split('#');
  var urlparts= fragment[0].split('?');

  if (urlparts.length>=2)
  {
    var urlBase=urlparts.shift(); //get first part, and remove from array
    var queryString=urlparts.join("?"); //join it back up

    var prefix = encodeURIComponent(parameter)+'=';
    var pars = queryString.split(/[&;]/g);
    for (var i= pars.length; i-->0;) {               //reverse iteration as may be destructive
      if (pars[i].lastIndexOf(prefix, 0)!==-1) {   //idiom for string.startsWith
        pars.splice(i, 1);
      }
    }
    url = urlBase + (pars.length > 0 ? '?' + pars.join('&') : "");
    if (fragment[1]) {
      url += "#" + fragment[1];
    }
  }
  return url;
}


$('a[href*="/mturk/preview"]').each(function()
    {
        var oldLinkUrl = $(this).attr('href');
        var newLinkUrl = oldLinkUrl;
        // build cleaned HIT links
        newLinkUrl = removeUrlVariable(newLinkUrl, "rank");
        newLinkUrl = removeUrlVariable(newLinkUrl, "sortType");
        newLinkUrl = removeUrlVariable(newLinkUrl, "isSelectedBySearchExperiment");
        // apply completed url
        $(this).attr('href', newLinkUrl);
    });
