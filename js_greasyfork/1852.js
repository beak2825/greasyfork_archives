// ==UserScript==
// @name       Watch Series Skipper
// @version    0.1.15
// @description  Skips WatchSeries.lt ad page
// @namespace  https://greasyfork.org/users/2329-killerbadger
// @match      http://watchseries.lt/open/cale/*
// @match      http://watchseries.sx/open/cale/*
// @match      http://watchseries.ag/open/cale/*
// @match      http://spainseries.lt/open/cale/*
// @match      http://watchseries.vc/open/cale/*
// @match      http://watchtvseries.ch/open/cale/*
// @match      http://watchtvseries.vc/open/cale/*
// @match      http://watchtvseries.se/open/cale/*
// @match      http://mywatchseries.to/cale.html*
// UK Mirrors:
// @match      http://watchseriesuk.lt/open/cale/*
// @match      http://watchseriesuk.ag/open/cale/*
// I believe that this clone is not directly affiliated with the main site, but upon request, I have added support.
// @match      http://watch-tv-series.to/open/cale/*
// @match      http://watch-series-tv.to/open/cale/*
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/1852/Watch%20Series%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/1852/Watch%20Series%20Skipper.meta.js
// ==/UserScript==
//alert(document.getElementById("countdown_str").innerHTML);
var hn = window.location.hostname; 
var button;
var newLoc;
if(hn==='watch-tv-series.to' || hn==='watch-series-tv.to') {
    button = document.getElementsByClassName('push_button blue')[0];
    if(button) {
	getLink();
        //if(newLoc===undefined) {setInterval(getLink(), 100);} 
        redirect(newLoc);
    }
    
}
else if(hn==='watchseries.lt') {
    button = document.getElementsByClassName('myButton')[0];
    if(button) {
	getLink();
        //if(newLoc===undefined) {setInterval(getLink(), 100);} 
        redirect(newLoc);
    }
}
else if(hn==='mywatchseries.to') {
    button = document.getElementsByClassName('push_button blue')[0];
    redirect(button);
}
else { 
    button = document.getElementsByClassName('actions grid-1 grid-lg-8-24')[0];
    b = button.innerHTML;
    newLoc = b.substring(b.indexOf("http"),b.indexOf('" class="action-btn txt')); 
    var styleIndex = newLoc.indexOf('style=');
    if(styleIndex != -1) { // probably not even necessary anymore
        newLoc = newLoc.substring(0,styleIndex-2);
    }
    redirect(newLoc);
}

function redirect(nLoc) {
    document.title = 'Redirecting...';
    window.location.replace(nLoc);
}

function getLink() {
    if(newLoc===undefined) {newLoc = button.href;}
    if(newLoc===undefined) {newLoc = button.getAttribute("link");}
    if(newLoc===undefined) {newLoc = button;}
}