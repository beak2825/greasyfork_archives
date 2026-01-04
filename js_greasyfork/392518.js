// ==UserScript==
// @name         Watchseries
// @version      1.3
// @homepage https://github.com/bahhax404
// @description  Make watchseries great by removing one step to get to the streams
// @include      *https://www1.watch-series.la/episode/*
// @icon https://static.watch-series.la/templates/default/images/logo-hover.png
// @copyright    GNU General Public License v3.0
// @run-at       document-body
// @author       Bahha 
// @namespace https://greasyfork.org/users/186498
// @downloadURL https://update.greasyfork.org/scripts/392518/Watchseries.user.js
// @updateURL https://update.greasyfork.org/scripts/392518/Watchseries.meta.js
// ==/UserScript==


//remove useless links. temporary solution for now
document.getElementsByClassName('watchlink')[0].remove();
document.getElementsByClassName('watchlink')[5].remove();

// retrieve watch links 
var watchlinks = document.getElementsByClassName('watchlink');

//get td elements that contain the actual links and unhide them
td_elements = document.querySelectorAll('td.deletelinks');
for( var i = 0; i < td_elements.length;i++){
    td_elements[i].style.display = "block";
    
}

//get the real links from the report link feature
var reportlinks = document.getElementsByClassName('btn btn-danger btn-sm');

//get the real links from onclick attribute of reportlinks
var sloppy_links = [];
for(var i = 0; i < reportlinks.length;i++){
    sloppy_links[i] = reportlinks[i].getAttribute('onclick');
}

//regex to extract the final link from the string stored in sloppy_links
urlregex = /(https?:\/\/[^\']*)/;

//store the actual final links in an array
var actual_links = [];
for(var i = 0; i < sloppy_links.length; i++){
    actual_links[i] = sloppy_links[i].match(urlregex)[1];
 }

//replace the redirecting links with actual links
for (var i = 0; i < watchlinks.length; i++) {
    watchlinks[i].setAttribute("href", actual_links[i]);
}

//Done !

//TODO remove useless links dynamically 

