// ==UserScript==
// @name Trademe Auction listing Full Breadcrumb
// @namespace http://None.com
// @include https://www.trademe.co.nz/*auction-*
// @include https://www.trademe.co.nz/*Listing.aspx*
// @include https://www.trademe.co.nz/*Listing-*
// @grant none
// @version 1.40
 
/*
>> Description:

TM Make plenty of pointless changes to their site.
Previously when you are viewing an action listing, the path to the category the auction
is listed in is displayed as a link form just above the auction title.

EX.:  Home > Computers > Desktops > No monitor

This is known as a breadcrumb.
clicking any part of the link would have taken you to the associated category directory.

With the new change, if you click on an auction link from within a members listing pages, the
links from that auction listing will only display auctions from that particular member, not
all members as it used to do.

EX:  membername > Computers > Desktops > No monitor

This stupid change has annoyed me long enough to create this greasemonkey script.

The script adds a normal breadcrumb link in an auction page when it detects a member only breadcrumb.
The user has the option of displaying both the full & member breadcrumb or else just the normal breadcrumb by itself.
this option can be changed by clicking the link on the right hand side of the listing page opposite the breadcrumb.

Note: if your using chrome with tampermonkey and you click the settings link to change the number of breadcrumbs
lines, the settings link wont be redisplayed until you browse to a different auction. 
This is due to a design flaw in chrome`s reload page function  

This script will not run on following categories as they are not effected by this change
(1) Trade Me Jobs
(2) Trade Me Property
(3) Trade Me Property
(4) Movies-TV

History:
V1.40 - Updated code for trademe`s changes to the sites urls and https usage
v1.30 - Improved description in code & greasyfork.
        Added a link into the auction page so user can set if they want both or single line of breadcrumbs displayed without having to edit the scripts code.
        Breadcrumbs are now placed in their own class instead of being inserted into BreadcrumbsContainer body
v1.25 - Added text regarding uninstalling existing script before performing an update
v1.22 - Changed scripts name and corrected spelling mistakes
v1.21 - Corrected some metadata code
v1.10 - Added the option for user to select wether they want one or two breadcrumbs displayed

*/
// @description Display Full Category Path in TM Listings
// @downloadURL https://update.greasyfork.org/scripts/10310/Trademe%20Auction%20listing%20Full%20Breadcrumb.user.js
// @updateURL https://update.greasyfork.org/scripts/10310/Trademe%20Auction%20listing%20Full%20Breadcrumb.meta.js
// ==/UserScript==

var bcnol;
breadcrumbs();

function breadcrumbs(){
    var i; 
    var code = document.documentElement.innerHTML;

    bc = window.TradeMe.BreadCrumbs;                   // get breadcrumbs value 
    var temp1 = code.indexOf('<a href="/">Home</a>');  // Check if page already has full root catagory path
    var temp2 = bc.indexOf('Trade Me Jobs');           // Check if listing is in Jobs
    var temp3 = bc.indexOf('Trade Me Motors');         // Check if listing is in Motors
    var temp4 = bc.indexOf('Trade Me Property');       // Check if listing is in Property

    if (temp1 < 0 && temp2 < 0  && temp3 < 0 && temp4 < 0) { 
        var pathU = bc.split("|");                       // pathU = breadcrumbs split by pipe   
        var bc = bc.toLowerCase();                       // Convert breadcrumbs to lowercase for use in url path
        var pathL = bc.split("|");                       // pathL = breadcrumbs split by pipe           
    
        for (i = 0; i < pathL.length; i++) {
            pathL[i] = pathL[i].replace(" &amp; ", "-");   // Replace Amperstand`s with a dash
            pathL[i] = pathL[i].replace(", ", "-");        // Replace comma with a dash
            pathL[i] = pathL[i].replace(" ", "-");         // Replace space with a dash
        }
    

        var codeInsert = '<a href="/">Home </a>&nbsp;&gt;\n\n';
        codeInsert += '<a href="/' + pathL[0] + '">' + pathU[0] + '</a>&nbsp;&gt;\n\n';

        if (pathL.length > 1) {
            codeInsert += '<a href="/' + pathL[0] + '/' + pathL[1] + '">' + pathU[1] + '</a>&nbsp;&gt;\n\n';
        }

        if (pathL.length > 2) {
            codeInsert += '<a href="/' + pathL[0] + '/' + pathL[1] + '/' + pathL[2] + '">' + pathU[2] + '</a>&nbsp;&gt;\n\n';
        }

        if (pathL.length > 3) {
            codeInsert += '<a href="/' + pathL[0] + '/' + pathL[1] + '/' + pathL[2] + '/' + pathL[3]  + '">' + pathU[3] + '</a>&nbsp;&gt;\n\n';
        }

        codeInsert = codeInsert.substring(0, codeInsert.length - 7);    // Remove the greater-than symbol from the last catagory

        bcnol = localStorage.getItem("bcnol");  // Load Setting

        if (bcnol === null){
            bcnol = "1";
        }

        if (bcnol == "1" ) {
            codeInsert += "<TD><a id=\"bcl\" style=\"float:right;\" title=\"Switch to two breadcrumbs\" href=\"javascript:void(0)\">[-->]</a></TD></p>";
            document.getElementById("BreadcrumbsContainer").innerHTML =  "<p class=\"breadCrumbs\">" + codeInsert;
        }

        if (bcnol == "2" ) {
            codeInsert += "<TD><a id=\"bcl\" style=\"float:right;\" title=\"Switch to one breadcrumb\" href=\"javascript:void(0)\">[X]</a></TD></p>";
            document.getElementById("BreadcrumbsContainer").innerHTML += "<p class=\"breadCrumbs\">" + codeInsert;
        }

        var oea = document.getElementById("bcl");
        oea.addEventListener('click',changeSetting,true);
    }
}

function changeSetting (){

    if (bcnol == "1"){
      localStorage.setItem("bcnol","2");
      location.reload(true);
    }

    if (bcnol == "2"){
        localStorage.setItem("bcnol","1");
        location.reload(true); 
    }
}