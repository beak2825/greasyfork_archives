// ==UserScript==
// @name          TPB User Comment Search v2.2
// @authors       Alia_Erenel, EDB, Aaron.Walkhouse
// @description   Adds a link to user pages to search for their comments via Google
// @include       http*://*thepiratebay.se/user/*
// @version 0.0.1.20140718194717
// @namespace https://greasyfork.org/users/3628
// @downloadURL https://update.greasyfork.org/scripts/3411/TPB%20User%20Comment%20Search%20v22.user.js
// @updateURL https://update.greasyfork.org/scripts/3411/TPB%20User%20Comment%20Search%20v22.meta.js
// ==/UserScript==

// Getting the username
var username = document.title.match( /^(.*)\s\-/ )[1];

// Getting the user status (credit to EDB)
var userclass;
userclass = "blank";
if(document.body.innerHTML.indexOf("http://static.thepiratebay.se/img/vip.gif") != -1) {
    userclass = "vip";
}
if(document.body.innerHTML.indexOf("http://static.thepiratebay.se/img/helper.png") != -1) {
    userclass = "helper";
}
if(document.body.innerHTML.indexOf("http://static.thepiratebay.se/img/trusted.png") != -1) {
    userclass = "trusted";
}

// The Google search query (tweaked by Aaron.Walkhouse)
if(userclass != "blank") {
gquery = "http://www.google.com/search?sitesearch=thepiratebay.se&tbs=rltm:1&filter=0&q=" + userclass + "+" + "%22" + username + "+" + "at%22" + "+" + "CET"
}
else {
gquery = "http://www.google.com/search?sitesearch=thepiratebay.se&tbs=rltm:1&filter=0&q=" + "%22" + username + "+" + "at%22" + "+" + "CET"
}

// Inserting Search button into TPB's layout
var gsearch=document.createElement('div');
  gsearch.innerHTML="<a target=new href=\"" + gquery + "\"> Search "+ username +"'s comments</a>";
  gsearch.style.textAlign='center';
  gsearch.style.marginTop = '5px';      

var gloc = document.getElementById("searchResult");
    gloc.parentNode.insertBefore(gsearch, gloc.nextSibling);