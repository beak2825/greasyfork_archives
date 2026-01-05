// ==UserScript==
// @name         add IMDb rating & votes next to all IMDb Movie/Series Links (Working 2025 on new view)
// @description  Adds movie ratings and number of voters to any imdb link on any webpage. Modified version of http://userscripts.org/scripts/show/96884 And  from [StackOverflow community (especially Brock Adams)]
// @author        [StackOverflow community (especially Brock Adams)]
// @version       2025-07-02
// @include        *
// @grant        GM_xmlhttpRequest
// @namespace    Extra2020
// @downloadURL https://update.greasyfork.org/scripts/3625/add%20IMDb%20rating%20%20votes%20next%20to%20all%20IMDb%20MovieSeries%20Links%20%28Working%202025%20on%20new%20view%29.user.js
// @updateURL https://update.greasyfork.org/scripts/3625/add%20IMDb%20rating%20%20votes%20next%20to%20all%20IMDb%20MovieSeries%20Links%20%28Working%202025%20on%20new%20view%29.meta.js
// ==/UserScript==
 
 
var maxLinksAtATime     = 40; //-- pages can have 100's of links to fetch. Don't spam server or browser.
var fetchedLinkCnt      = 0;
 
function processIMDB_Links () {
    //--- Get only links that could be to IMBD movie/TV pages.
    var linksToIMBD_Shows   = document.querySelectorAll ("a[href*='/title/']");
 
    for (var J = 0, L = linksToIMBD_Shows.length; J < L; J++) {
        var currentLink = linksToIMBD_Shows[J];
 
        /*--- Strict tests for the correct IMDB link to keep from spamming the page
            with erroneous results.
 
            if ( ! /^(?:www\.)?IMDB\.com$/i.test (currentLink.hostname)  ||  ! /^\/title\/tt\d+\/?$/i.test (currentLink.pathname) || ! /nm_knf_t_/i.test (currentLink.pathname) )
        */
 
        if ( ! /^(?:www\.)?IMDB\.com$/i.test (currentLink.hostname)  ||  ! /^\/title\/tt\d+\/?$/i.test (currentLink.pathname))
            continue;
 
 
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
 
        onabort:     function (response) {
            prependIMDB_Rating (response, linkNode);
        }
    } );
}
 
 
 
function prependIMDB_Rating (resp, targetLink) {
    var isError = true;
    var ratingTxt = "*Err!";
    var colnumber = 0;
    var justrate =0;
    var votess="";
    var color="#ddd";
    if (resp.status != 200 && resp.status != 304) {
        ratingTxt = '** ' + resp.status + ' Error!';
    }
    else {
 
//         var parser = new DOMParser();
//         var xmlDoc = parser.parseFromString(resp.responseText, "application/xml");
   var votesM = resp.responseText.match (/dwhNqC">(.*)<\/div><\/div><\/div><\/span><\/a><\/div><div data-testid="hero-rating-bar__user-rating/);
    var ratingM = resp.responseText.match (/imUuxf">(.*)<\/span><span>\/<!-- -->10/);
 
 
//console.log(ratingM);
//console.log(votesM);
 
        isError = false;
 
        justrate = ratingM[1].substring(0,3);
        votess = votesM[1].substring(0,4);
 
        ratingTxt =justrate + " - " + votess+ " ";
 
 
        colnumber = Math.floor(justrate);
           }
 
 
 
    color = ["#Faa","#Faa","#Faa","#F88", "#F88","#FAA", "#FF7","#7E7", "#5e5", "#0e0", "#ddd"]
    var resltSpan = document.createElement ("span");
    resltSpan.innerHTML = '<b><font style="color:black; background-color:'+ color[colnumber] + ';">' + ratingTxt + '</font></b>&nbsp;';
    // resltSpan.innerHTML = '<b><font style="background-color:' + justrate + '">' + ' [' + ratingTxt + '] </font></b>&nbsp;';
 
 
    if (isError) resltSpan.style.color = 'red';
 
    //var targetLink      = resp.context;
    //console.log ("targetLink: ", targetLink);
 
    targetLink.parentNode.insertBefore (resltSpan, targetLink);
}
 
//--- Create the continue button
var continueBttn       = document.createElement ("button");
continueBttn.innerHTML = "continueRatings";
 
continueBttn.addEventListener ("click", function (){
        fetchedLinkCnt             = 0;
        continueBttn.style.display = 'none';
        processIMDB_Links ();
    },
    false
);
 
processIMDB_Links ();