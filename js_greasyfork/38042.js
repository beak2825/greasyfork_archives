// ==UserScript==
// @name         EZ Scrape Buttons
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  EZ Scrape Buttons @ WWT
// @author       skunklove
// @match        https://worldwidetorrents.me/torrents-details.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38042/EZ%20Scrape%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/38042/EZ%20Scrape%20Buttons.meta.js
// ==/UserScript==


(function() {
    'use strict';

/////////////////////////////////
//  EZ Scrape Buttons get URLS
/////////////////////////////////

//    if (location.href.match(/id=/)) { //NOT specific enuff , showed in Forums, ha

// ng if (location.href.match(/torrents-details.php?id=/)) { //show if Torrent Details Page
      if (location.href.match(/torrents-details/) && location.href.match(/id=/)) { // Verify ONLY if Torrent Details Page

        var url = window.location.href;     //......................../torrents-details.php?id=123456&scrape=1#technical
        var urlPart1     = url.split('=')[0];     //get the url till id
        var urlParameter = url.split('=')[1];     //get the id parameter
                                                                                 //yes          123456&scrape
                                                                                 //       window.alert(urlParameter);

        //split again
        var actualID = urlParameter.split('&')[0]; //get the url till id

        var convertedID = parseInt( actualID); // convert the id parameter into string REQ'D

        var nextID = convertedID += 1;
     // comments                                          ...... ID=
                                          var newURL = urlPart1 + "=" + nextID + "&scrape=1";  //   yesssssssssssssss
                                          var oldURL = urlPart1 + "=" + actualID + "&scrape=1";//   yesssssssssssssss

//window.alert(actualID);
//window.alert(nextID);
//window.alert(newURL);

        //lil bug if click x2
        //ah yes, took several attempts, but workssssssss now
        //removed <A> , now all JS for links


/////////////////////////////////
//  EZ Scrape Buttons ADD here
/////////////////////////////////
        document.body.innerHTML = document.body.innerHTML.replace(new RegExp("\\bTorrent Details For\\b", "g"),
"<button onclick=this.innerText='&nbsp;&nbsp;Scraping&nbsp;&nbsp;this&nbsp;&nbsp;ID...',window.location.href='" + oldURL + "';             type='submit' id='myButton'   class='w3-btn'   style='width:50%; background-Color:teal;  border-radius:5px;  '><i class='fa fa-flag'></i>    </button>" +
"<button onclick=this.innerText='&nbsp;&nbsp;Scraping&nbsp;&nbsp;next&nbsp;&nbsp;ID...',window.location.href='" + newURL + "';  type='submit' id='myButton'   class='w3-btn'   style='width:50%; background-Color:teal;  border-radius:5px;  '><i class='fa fa-flag'></i>    </button><BR><BR>");//<p>
//orig way
//"<a href=" + newURL + "><button onclick=this.innerText='&nbsp;&nbsp;Scraping&nbsp;&nbsp;next&nbsp;&nbsp;ID...';  type='submit' id='myButton'   class='w3-btn'   style='width:50%; background-Color:teal;  border-radius:5px;  '><i class='fa fa-flag'></i>    </button></a><p><BR>");// scrape&nbsp;&nbsp;newURL...    Torrent :<BR>


//error handling..
///////////////////////////////////////////////////////////////////////////////////////
//needs to work on f'ed up css pages, ID no longer exists (or not exist yet) ???????
            if (location.href.match(/torrents-details/)) {  //not the embed page widget
               // 22777 = good example
document.body.innerHTML = "" + "<a href=" + oldURL + "><button onclick=this.innerText='&nbsp;&nbsp;Scraping&nbsp;&nbsp;this&nbsp;&nbsp;ID...';  type='submit' id='myButton' value=L  class='w3-btn'   style='width:50%; height:50px; background-Color:teal;  border-radius:5px;  '><i class='fa fa-flag'></i>    </button></a>" +
                               "<a href=" + newURL + "><button onclick=this.innerText='&nbsp;&nbsp;Scraping&nbsp;&nbsp;next&nbsp;&nbsp;ID...';  type='submit' id='myButton'  value=R class='w3-btn'   style='width:50%; height:50px; background-Color:teal;  border-radius:5px;  '><i class='fa fa-flag'></i>    </button></a>" +
                                         document.body.innerHTML;
//added mod
//top space
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("margin\-top\:70px", "g"),
                                                                     "margin-top:0px");//was 33, mod to 0 with xtra buttons for css bs
            }
////////////////////////////////////////////////////////////////////////////////////////

//error handling..
//*************************************************************************************************************************
    if  (document.body.innerHTML.match(/magnet:/)) {//detect normal page
                     //   window.alert('magnet');
    } else {
                     //   NOT normal, add link to get back to latest
                                document.body.innerHTML = document.body.innerHTML.replace(new RegExp("<h3 class", "g"),
"<a href=../torrents.php><button onclick=this.innerText='&nbsp;&nbsp;Viewing&nbsp;&nbsp;&nbsp;&nbsp;Latest...';  type='submit' id='myButton'   class='w3-btn'   style='width:50%; height:85px; background-Color:teal;  border-radius:5px;  '><i class='fa fa-flag'></i>   HMMMMM, &nbsp;  maybe @ 100%..  &nbsp; &nbsp;  Click here to View Latest..  &nbsp; &nbsp; &nbsp; </button></a><h3 class");//testttttttttttttttt<p>
    }
//*************************************************************************************************************************


  } // ONLY show if Torrent Details Page
    // oops, forgot ;)



//hmmm, old text not showing now (fixed above)
        //if caught up 100%, next ID not found...
           //     document.body.innerHTML = document.body.innerHTML.replace(new RegExp("\\bSorry no\\b", "g"),
           //            "<a href=../torrents.php><button onclick=this.innerText='&nbsp;&nbsp;Loading&nbsp;&nbsp;latest...';  type='submit' id='myButton'   class='w3-btn'   style='width:50%; background-Color:teal;  border-radius:5px;  '><i class='fa fa-flag'></i>   OOPS, maybe @ 100%.  &nbsp;&nbsp;  show latest ?  </button></a><p><BR>Sorry... no ");//HDDDD Videooooooooooo

 })();
