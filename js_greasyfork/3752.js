// ==UserScript==
// @name        Fix Roblox
// @namespace   http://www.roblox.com/*
// @description Fixes the gay ass new layout. Script by cycoboy83.
// @include     http://www.roblox.com/*
// @grant       none
// @version 0.0.1.20140730005827
// @downloadURL https://update.greasyfork.org/scripts/3752/Fix%20Roblox.user.js
// @updateURL https://update.greasyfork.org/scripts/3752/Fix%20Roblox.meta.js
// ==/UserScript==

//Script by cycoboy83. Anyone taking credit for it will be prosecuted to the full extent of my Core L7.

//Start by removing the annoying ad container on the games page if it's there.
var lel1 = document.getElementById("GamesPageRightColumn");
var lel2 = document.getElementById("GamesPageLeftColumn");
if (lel1 != undefined) {
lel1.parentNode.removeChild(lel1);
lel2.style.marginRight = "10px";
}

//Finds the navbar
var navbar = document.getElementById("navigation");
var navicon = document.getElementsByClassName("nav-icon");

//Scrapes ROBUX, Tickets, PM, and FR numbers
var friends = document.getElementsByClassName("nav2014-friends");
var messages = document.getElementsByClassName("nav2014-messages");
var tix = document.getElementsByClassName("tickets-amount");
var robux = document.getElementsByClassName("robux-amount");
var friendamount = friends[0].getElementsByClassName("notification-text");
if (friendamount[0] != undefined) {
    var realfriendamount = friendamount[0].nodeValue;
}
else {
    var realfriendamount = "0";
}
var messageamount = messages[0].getElementsByClassName("notification-text");
if (messageamount[0] != undefined) {
    var realmessageamount = messageamount[0].nodeValue;
}
else {
    var realmessageamount = "0";
}
var realrobuxamount = robux[0].firstChild.nodeValue;
var realtixamount = tix[0].firstChild.nodeValue;

//Just takes up space now, so out it goes.
navbar.parentNode.removeChild(navbar);
navicon[0].parentNode.removeChild(navicon[0]);

//Creates blue bar for new interface
var newblue = document.createElement("div");
newblue.innerHTML = '<div>' +
'<center>' +
'<style>' +
'#bluebar {' +
    'list-style-type: none;'+
    'margin: 0;'+
    'padding: 0;'+
    'overflow: hidden;'+
    'width: 100%;'+
'}'+
    
'.changemetoo {' +
'color: #FFFFFF;' +
'}'+
    'a.changeme:link, a.changeme:visited {'+
 '   display: block;'+
  '  width: 10%;'+
   ' font-weight: bold;'+
    'color: #FFFFFF;'+
    'background-color: #0033CC;'+
    'text-align: center;'+
    'padding: 0px;'+
    'text-decoration: none;'+
    'text-transform: uppercase;'+
    'float: left;'+
'}'+

'a.changeme:hover, a.changeme:active {'+
 '   background-color: #000000;'+
'}'+
'</style>'+
'</head>'+
'<body>'+

'<ul id="bluebar">'+
    ' <li class="changemetoo"><a class="changeme" href="http://www.roblox.com/home">Home</a></li>'+
    '<li class="changemetoo"><a class="changeme" href="http://www.roblox.com/games">Games</a></li>'+
    '<li class="changemetoo"><a class="changeme" href="http://www.roblox.com/Catalog">Catalog</a></li>'+
    '<li class="changemetoo"><a class="changeme" href="http://www.roblox.com/develop">Develop</a></li>'+
    '<li class="changemetoo"><a class="changeme" href="http://www.roblox.com/My/Stuff.aspx">Inventory</a></li>'+
    '<li class="changemetoo"><a class="changeme" href="http://www.roblox.com/My/Character.aspx">Character</a></li>'+
    '<li class="changemetoo"><a class="changeme" href="http://www.roblox.com/browse.aspx">People</a></li>'+
    '<li class="changemetoo"><a class="changeme" href="http://www.roblox.com/Forum/">Forum</a></li>'+
    '<li class="changemetoo"><a class="changeme" href="http://www.blog.roblox.com">Blog</a></li>'+
    '<li class="changemetoo"><a class="changeme" href="http://en.help.roblox.com/home">Help</a></li>'+
'</ul>'+
'</center>' +
'</div>';



//Creates black bar for new interface
var newblack = document.createElement("div");
newblack.innerHTML = '<div>' +
'<center>' +
'<style>' +
'#blackbar {' +
    'list-style-type: none;'+
    'margin: 0;'+
    'padding: 0;'+
    'overflow: hidden;'+
    'width: 100%;'+
'}'+
    
'.changemetoo2 {' +
'color: #FFFFFF;' +
'}'+
    'a.changeme2:link, a.changeme2:visited {'+
 '   display: block;'+
  '  width: 25%;'+
   ' font-weight: bold;'+
    'color: #FFFFFF;'+
    'background-color: #000000;'+
    'text-align: center;'+
    'padding: 0px;'+
    'text-decoration: none;'+
    'text-transform: uppercase;'+
    'float: left;'+
'}'+

'a.changeme2:hover, a.changeme2:active {'+
 '   background-color: #FFFFFF;'+
    'color: #000000;' +
'}'+
'</style>'+
'</head>'+
'<body>'+

'<ul id="blackbar">'+
    ' <li class="changemetoo2"><a class="changeme2" href="http://www.roblox.com/friends.aspx#FriendRequestsTab">You have ' + realfriendamount + ' friend requests</a></li>'+
    '<li class="changemetoo2"><a class="changeme2" href="http://www.roblox.com/my/messages/?inbox">You have ' + realmessageamount + ' messages</a></li>'+
    '<li class="changemetoo2"><a class="changeme2" href="http://www.roblox.com/My/Money.aspx">You have ' + realrobuxamount + ' ROBUX</a></li>'+
    '<li class="changemetoo2"><a class="changeme2" href="http://www.roblox.com/My/Money.aspx">You have ' + realtixamount + ' tickets</a></li>'+
'</ul>'+
'</center>' +
'</div>';

//Inserts both bars into the webpage
document.body.insertBefore(newblack, document.body.firstChild);
document.body.insertBefore(newblue, newblack);


//Finds that annoying navigation header up top and removes it.
var byeheader = document.getElementsByClassName("header-2014 clearfix");
byeheader[0].parentNode.removeChild(byeheader[0]);