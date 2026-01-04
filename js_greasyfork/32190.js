// ==UserScript==
// @name            Auto pagination
// @description     Automatically reaches for "next" page when the bottom of a given page has been reached (where applicable)
// @include         http://gamestorrent.co/page/*
// @include         /^https?://pcgamestorrents\.com/(|.*/)page/.*$/
// @include         /^https://fitgirl-repacks\.site/page/.*$/
// @include         /^https://(e-|ex)hentai\.org/(|\?.*|tag/.*)$/
// @include         https://www.skidrow-games.com/page/*
// @author          iceman94
// @version         0.2
// @grant           none
// @namespace       https://greasyfork.org/users/148290
// @downloadURL https://update.greasyfork.org/scripts/32190/Auto%20pagination.user.js
// @updateURL https://update.greasyfork.org/scripts/32190/Auto%20pagination.meta.js
// ==/UserScript==


// Scroll back value in percent (see setScrollPos() function)
var scrollBackInPct = 0.02

// Global flag variable
var flag = false;

//=======================================================================================================
// Setting up functions
//=======================================================================================================

// Function to test if an URL is correctly formatted and reachable
function isUrl(url)
{
    var request;

    if (window.XMLHttpRequest)
    {
        request = new XMLHttpRequest();
    }
    else
    {
        request = new ActiveXObject('Microsoft.XMLHTTP');
    };

    try
    {
        request.open('GET', url, false);
        request.send();

        if (request.status !== 200)
        {
            return false;
        };
    }
    catch(e)
    {
        return false;
    };

    return true;
};

// Function to test if a value is numerically valid (i.e. an integer/float...)
// Source: https://stackoverflow.com/a/1830844
function isNumeric(n)
{
    return !isNaN(parseFloat(n)) && isFinite(n);
}

// Detects which attribute work with the target browser
function testAttr()
{
    var method;

    if(document.body.scrollTop)
    {
        method = 'chrome';
    } else if(document.documentElement.scrollTop)
    {
        method = 'firefox';
    } else {
        method = 'unsupported';
    };

    return method;
};

// Retrieves top scroll position (i.e. 0 = top)
function getScrollPos()
{
    var scrollP;

    switch(testAttr())
    {
        case 'chrome':
            scrollP = document.body.scrollTop;
            break;
        case 'firefox':
            scrollP = document.documentElement.scrollTop;
            break;
        default:
            console.log('[getScrollPos] Only Firefox/Chrome based browsers are supported.');
    };

    return scrollP;
};

// Retrieves client (i.e. browser) height
function getWinHeight()
{
    var winH;

    switch(testAttr())
    {
        case 'chrome':
            winH = document.body.clientHeight;
            break;
        case 'firefox':
            winH = document.documentElement.clientHeight;
            break;
        default:
            console.log('[getWinHeight] Only Firefox/Chrome based browsers are supported.');
    };

    return winH;
};

// Retrieves page height
function getScrollHeight()
{
    var scrollH;

    switch(testAttr())
    {
        case 'chrome':
            scrollH = document.body.scrollHeight;
            break;
        case 'firefox':
            scrollH = document.documentElement.scrollHeight;
            break;
        default:
            console.log('[getScrollHeight] Only Firefox/Chrome based browsers are supported.');
    };

    return scrollH;
};

// Modify actual top scroll position to avoid triggering a script loop (i.e. scroll back up for x% where x=scrollBackInPct)
function setScrollPos()
{
  if (flag && flag == true)
  {
      return false;
  };

    switch(testAttr())
    {
        case 'chrome':
            document.body.scrollTop = document.body.scrollTop - (document.body.scrollTop * scrollBackInPct);
            break;
        case 'firefox':
            document.documentElement.scrollTop = document.documentElement.scrollTop - (document.documentElement.scrollTop * scrollBackInPct);
            break;
        default:
            console.log('[setScrollPos] Only Firefox/Chrome based browsers are supported.');
    };
};

// Tests if scroll position has reached the bottom of the page
function isBottomReached()
{
    //var result;

    if(getScrollPos() + getWinHeight() == getScrollHeight())
    {
        //console.log('Bottom of the page reached!');
        return true;
    } else {
        return false;
    };

    //return result;
};

// Parses an URL to find a page number and, if true, returns an object w/ infos about it
function getPageInfos(url)
{
    var currUrl = new URL(url);
    var parsedPathname = currUrl.pathname.split("");

    var numArr = new Array();
    var prevValue = undefined;
    var pageNb = "";

    for (var i=parsedPathname.length -1; i>-1; i--)
    {
        if (isNumeric(parsedPathname[i]))
        {
            numArr.push({[i]: parsedPathname[i]});
            prevValue = parsedPathname[i];
        };

        if (!isNumeric(parsedPathname[i]) && isNumeric(prevValue))
        {
            break;
        };
    };

    for (var j=numArr.length -1; j>-1; j--)
    {
        for (var key in numArr[j])
        {
            pageNb = pageNb + numArr[j][key];
        };
    };

    var pageObj = new Object();
    var pathnameBefore = "";
    var pathnameAfter = "";
    pageObj.current_page_nb = pageNb;

    for (key in numArr[numArr.length -1])
    {
        pageObj.first_page_nb_pos = parseInt(key);
    };

    for (key in numArr[0])
    {
        pageObj.last_page_nb_pos = parseInt(key) +1;
    };

    for (i=0; i<pageObj.first_page_nb_pos; i++)
    {
        pathnameBefore = pathnameBefore + parsedPathname[i];
    };
    pageObj.pathname_before = pathnameBefore;

    for (i=pageObj.last_page_nb_pos; i<parsedPathname.length; i++)
    {
        pathnameAfter = pathnameAfter + parsedPathname[i];
    };
    pageObj.pathname_after = pathnameAfter;

    return pageObj;
};

// Returns position of "Next" button in page
function findNextPage()
{
    var elmtObj = new Object();

    //Is there an element w/ an Id called 'unext'?
    if(document.getElementById('unext'))
    {
        elmtObj.type = 'tag';
        elmtObj.content = document.getElementById('unext');
        //console.log('[findNextPage] ', document.getElementsByClassName('next')[0]);
        return elmtObj;
    };

    //Is there an element w/ a ClassName called 'next'?
    if(document.getElementsByClassName('next')[0])
    {
        elmtObj.type = 'tag';
        elmtObj.content = document.getElementsByClassName('next')[0];
        //console.log('[findNextPage] ', document.getElementsByClassName('next')[0]);
        return elmtObj;
    };

    //Is there a tag w/ an attribute called 'next-page-url'?
    var coll = document.getElementsByTagName('div');
    var l = coll.length;
    for (var i=0; i<l; i++)
    {
        if(coll[i] && coll[i].getAttribute('next-page-url'))
        {
            elmtObj.type = 'uri';
            elmtObj.content = coll[i].getAttribute('next-page-url');
            //console.log('[findNextPage] ', coll[i].getAttribute('next-page-url'));
            return elmtObj;
        };
    };

    //Is there an element w/ a TagName containing ONLY a ">" (greater than) sign as textContent?
    coll = document.getElementsByTagName('a');
    var collL = coll.length;
    for (i=0; i<collL; i++)
    {
        if (coll[i].href && coll[i].textContent == ">")
        {
            elmtObj.type = 'uri';
            elmtObj.content = coll[i].href;
            //console.log('[findNextPage] ', coll[i].href);
            return elmtObj;
        };
    };

    //Is there a page (i.e. URI) ending w/ a number that follows the actual one?
    var pageInfos = getPageInfos(window.location);
    var nextPageUrl = pageInfos.pathname_before + (parseInt(pageInfos.current_page_nb) +1) + pageInfos.pathname_after;
    //if (isUrl(nextPageUrl))
    if (nextPageUrl && nextPageUrl != "NaN" && isUrl(nextPageUrl))
    {
        elmtObj.type = 'uri';
        elmtObj.content = nextPageUrl;
        //console.log('[findNextPage] ', nextPageUrl);
        return elmtObj;
    };
};

// Fetches next page based on target's element: tag (anchor, div, img...), attribute (src, class...), URI...
function goNext(tgtObj)
{
    // WIP - May change to handle a wide variety of element
    var type = tgtObj.type || undefined;
    var content = tgtObj.content || undefined;

    window.onscroll = function()
    {
        if(isBottomReached() === true)
        {
            switch(type)
            {
                case 'tag':
                    setScrollPos();
                    flag = true;
                    content.click();
                    break;
                case 'attribute':
                    console.log('[goNext] "attribute" method not yet implemented.');
                    break;
                case 'uri':
                    setScrollPos();
                    flag = true;
                    window.location = content;
                    break;
                default:
                    console.log('[goNext] This type of element is actually not (yet?) managed by this script.');
            };
        } else {
            //Do nothing for now
        }

        //return false;
    };
};


//=======================================================================================================
// Showtime !
//=======================================================================================================

goNext(findNextPage());
