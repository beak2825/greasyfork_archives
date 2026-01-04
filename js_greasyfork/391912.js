// ==UserScript==
// @name         limitedPagesForHostLoc
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        *://www.hostloc.com/forum*
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/391912/limitedPagesForHostLoc.user.js
// @updateURL https://update.greasyfork.org/scripts/391912/limitedPagesForHostLoc.meta.js
// ==/UserScript==

$(document).ready(function(){

    //to set the less comment number checking whether to read the article
    var COMMENTLINE = 20;

    //to set the max page number you want to visit
    var MAXPAGES = "3";

    //get all comments of articles
    var comments = $("tbody tr td.num a.xi2");
    // console.log(comments);
   
    //this function has disabled
   //http://api.w3c.biz/hostloc.php?url=

    //check whether the comments is larger than COMMENTLINE
    for(var i=0; i < comments.length;i++){
        //console.log(comments[i].getAttribute("href"));
        if(comments[i].innerText > COMMENTLINE){
           window.open("https://www.hostloc.com/" + comments[i].getAttribute("href"));
        };
    };

    //click to next page
    var nextPageArray = $(".nxt");
    var nextHref = nextPageArray[1].getAttribute("href");

    //to get the next page's number
    var hrefArray = nextHref.split("-");
    console.log(hrefArray);
    var nextPageNumber = hrefArray[2].split(".");
    console.log( nextPageNumber[0]);
    console.log( MAXPAGES);
    console.log( nextPageNumber[0].localeCompare(MAXPAGES,undefined, {numeric: true})  );
   if( nextPageNumber[0].localeCompare(MAXPAGES ,undefined, {numeric: true}) != 1 ){
        console.log("go to next page");
        window.open("https://www.hostloc.com/" + nextHref);
        window.top.close();
        // console.log(nextHref);
    }else {
     console.log("reach the end");



    }
});