// ==UserScript==
// @name         Add movie ratings to IMDB links
// @description  Adds movie ratings and number of voters to any imdb link. Modified version of http://userscripts.org/scripts/show/96884
// @author         StackOverflow community (especially Brock Adams)
// @version        2015-11-24-9-joeytwiddle
// @license        MIT
// @match        *://www.imdb.com/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @namespace    https://greasyfork.org/users/8615
// @derived-from https://greasyfork.org/en/scripts/2033-add-imdb-rating-votes-next-to-all-imdb-movie-series-links-improved
// @downloadURL https://update.greasyfork.org/scripts/23317/Add%20movie%20ratings%20to%20IMDB%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/23317/Add%20movie%20ratings%20to%20IMDB%20links.meta.js
// ==/UserScript==
// Special Thanks to Brock Adams for this script: http://stackoverflow.com/questions/23974801/gm-xmlhttprequest-data-is-being-placed-in-the-wrong-places/23992742

var maxLinksAtATime     = 100; //-- pages can have 100's of links to fetch. Don't spam server or browser.
var fetchedLinkCnt      = 0;
var skipEpisodes        = true; //-- I only want to see ratings for movies or TV shows, not TV episodes

var $ = unsafeWindow.$;

function processIMDB_Links () {
    //--- Get only links that could be to IMBD movie/TV pages.
    var linksToIMBD_Shows   = document.querySelectorAll ("a[href*='/title/']");

    for (var J = 0, L = linksToIMBD_Shows.length;  J < L;  J++) {
        var currentLink = linksToIMBD_Shows[J];

        /*--- Strict tests for the correct IMDB link to keep from spamming the page
            with erroneous results.
        */
        if (    ! /^(?:www\.)?IMDB\.com$/i.test (currentLink.hostname)
            ||  ! /^\/title\/tt\d+\/?$/i.test (currentLink.pathname)
        )
            continue;

        // I am beginning to think a whitelist might be better than this blacklist!

        // Skip thumbnails on the search results page
        if ($(currentLink).closest('.primary_photo').length) {
            continue;
        }

        // Skip thumbnails in the six recommendations area of a title page
        if ($(currentLink).closest('.rec_item').length) {
            continue;
        }

        // Skip top-rated episodes on the right-hand sidebar of TV series pages; they already display a rating anyway!
        if ($(currentLink).closest('#top-rated-episodes-rhs').length) {
            continue;
        }

        // Skip thumbnail of title at top of Season page
        if ($(currentLink).find(':only-child').prop('tagName') === 'IMG') {
            continue;
        }

        // Skip the thumbnail of each episode on a season page (episode names still processed)
        if ($(currentLink).closest('.image').length) {
            continue;
        }

        // Skip thumbnails in "Known For" section of actor pages
        if ($(currentLink).closest('.known-for').length && $(currentLink).find('img').length) {
            continue;
        }

        // Skip episodes on actor pages
        if (skipEpisodes && $(currentLink).closest('.filmo-episodes').length) {
            continue;
        }

        if (! currentLink.getAttribute ("data-gm-fetched") ){
            if (fetchedLinkCnt >= maxLinksAtATime){
                //--- Position the "continue" button.
                continueBttn.style.display = 'inline';
                currentLink.parentNode.insertBefore (continueBttn, currentLink);
                break;
            }

            fetchTargetLink (currentLink); //-- AJAX-in the ratings for a given link.

            //---Mark the link with a data attribute, so we know it's been fetched.
            currentLink.setAttribute ("data-gm-fetched", "true");
            fetchedLinkCnt++;
        }
    }
}

function fetchTargetLink (linkNode) {
    //--- This function provides a closure so that the callbacks can work correctly.

    /*--- Must either call AJAX in a closure or pass a context.
        But Tampermonkey does not implement context correctly!
        (Tries to JSON serialize a DOM node.)
    */
    GM_xmlhttpRequest ( {
        method:     'get',
        url:        linkNode.href,
        //context:    linkNode,
        onload:     function (response) {
            prependIMDB_Rating (response, linkNode);
        },
        onload:     function (response) {
            prependIMDB_Rating (response, linkNode);
        },
        onabort:     function (response) {
            prependIMDB_Rating (response, linkNode);
        }
    } );
}

function prependIMDB_Rating (resp, targetLink) {
    var isError     = true;
    var ratingTxt   = "** Unknown Error!";
    var colnumber   = 0;
    var justrate    = 'RATING_NOT_FOUND';

    if (resp.status != 200  &&  resp.status != 304) {
        ratingTxt   = '** ' + resp.status + ' Error!';
    }
    else {
        // Example value: ["Users rated this 8.5/10 (", "8.5/10"]
        //var ratingM = resp.responseText.match (/Users rated this (.*) \(/);
        // Example value: ["(1,914 votes) -", "1,914"]
        //var votesM  = resp.responseText.match (/\((.*) votes\) -/);

        var doc = document.createElement('div');
        doc.innerHTML = resp.responseText;
        var elem = doc.querySelector('.title-overview .vital .ratingValue strong');
        var title = elem && elem.title || '';

        var ratingT = title.replace(/ based on .*$/, '');
        var votesT  = title.replace(/.* based on /, '').replace(/ user ratings/, '');

        // The code below expects arrays (originally returned by string match)
        var ratingM = [ratingT, ratingT + "/10"];
        var votesM  = [votesT, votesT];

        //console.log('ratingM', ratingM);
        //console.log('votesM', votesM);

        if (/\(awaiting \d+ votes\)|\(voting begins after release\)|in development,/i.test (resp.responseText) ) {
                ratingTxt   = "NR";
                isError     = false;
                colnumber = 0;
        } else {
           if (ratingM  &&  ratingM.length > 1  &&  votesM  &&  votesM.length > 1) {
            isError     = false;

               justrate = ratingM[1].substr(0, ratingM[1].indexOf("/"));

               var votes = votesM[1];
               var votesNum = Number( votes.replace(/,/,'','') );
               var commas_found = votes.match(/,/,'g');
               if (commas_found && commas_found.length === 1) {
                   votes = votes.replace(/,.../, 'k');
               } else if (commas_found && commas_found.length === 2) {
                   votes = votes.replace(/,.*,.*/, 'M');
               }

           // ratingTxt   = ratingM[1] + " - " + votesM[1];
           ratingTxt   = "<strong>" + justrate + "</strong>" + " / " + votes;
           colnumber = Math.round(justrate);
           }
        }
    }


    // NOTE: I switched from <b> to <strong> simply because on Season pages, the rating injected after episode titles was getting uglified by an IMDB CSS rule: .list_item .info b { font-size: 15px; }
    targetLink.setAttribute("title", "Rated " + ratingTxt.replace(/<\/*strong>/g,'').replace(/\//,'by') + " users." );

    if (justrate < 5) {
        return;
    }


    // Slowly approach full opacity as votesNum increases.  10,000 votes results in opacity 0.5 (actually 0.6 when adjusted).
    var opacity = 1 - 1 / (1 + 0.0001 * votesNum);
    // Actually let's not start from 0; we may still want to see the numbers!
    opacity = 0.2 + 0.8*opacity;
    // Don't use too many decimal points; it's ugly!
    //opacity = Math.round(opacity * 10000) / 10000;
    opacity = opacity.toFixed(3);

    var color = ["#Faa", "#Faa","#Faa", "#Faa","#Faa", "#F88","#Faa", "#ff7","#7e7", "#5e5", "#0e0", "#ddd"];
    var resltSpan       = document.createElement ("span");
    // resltSpan.innerHTML = '<b><font style="border-radius: 5px;padding: 1px;border: #575757 solid 1px; background-color:' + color[colnumber] + ';">' + ' [' + ratingTxt + '] </font></b>&nbsp;';
    // resltSpan.innerHTML = '<b><font style="background-color:' + justrate + '">' + ' [' + ratingTxt + '] </font></b>&nbsp;';
    // I wanted vertical padding 1px but then the element does not fit in the "also liked" area, causing the top border to disappear!  Although reducing the font size to 70% is an alternative.
    resltSpan.innerHTML = '&nbsp;<font style="font-weight: normal;font-size: 80%;opacity: '+opacity+';border-radius: 3px;padding: 0.1em 0.6em;border: rgba(0,0,0,0.1) solid 1px; background-color:' + color[colnumber] + ';color: black;">' + '' + ratingTxt + '</font>';


    if (isError)
        resltSpan.style.color = 'red';

    //var targetLink      = resp.context;
    //console.log ("targetLink: ", targetLink);

    //targetLink.parentNode.insertBefore (resltSpan, targetLink);
    targetLink.parentNode.insertBefore (resltSpan, targetLink.nextSibling);
}

//--- Create the continue button
var continueBttn        = document.createElement ("button");
continueBttn.innerHTML  = "Get more ratings";

continueBttn.addEventListener ("click", function (){
        fetchedLinkCnt              = 0;
        continueBttn.style.display  = 'none';
        processIMDB_Links ();
    },
    false
);

processIMDB_Links ();
