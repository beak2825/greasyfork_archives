// ==UserScript==
// @name         Discogs/Release/Date+Listing Rearrange
// @namespace    https://greasyfork.org/en/scripts/387911/
// @version      1.13
// @description  add date instead of "statistics" and move listings to make copying to list info easier
// @author       denlekke
// @match        https://www.discogs.com/*release/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387911/DiscogsReleaseDate%2BListing%20Rearrange.user.js
// @updateURL https://update.greasyfork.org/scripts/387911/DiscogsReleaseDate%2BListing%20Rearrange.meta.js
// ==/UserScript==

window.addEventListener("load", function(event) {
    date_listing_rearrange()
});

function date_listing_rearrange() {
    'use strict';

    // Your code here...
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //As January is 0.
    var yyyy = today.getFullYear();




    var stats = document.getElementById('release-stats')
    var listings = document.getElementsByClassName('forsale_QoVFl')[0];
    console.log(listings);
    var beforenode = null;
    beforenode = document.getElementsByClassName('content_1TFzi')[2];
    console.log(beforenode);
    var parentnode = beforenode.parentNode;

    var statscontent = null;
    if(stats){
        statscontent = stats.children[1]
    }
    if(document.getElementsByClassName('forsale_QoVFl')[0] != null){
        statscontent.innerHTML = '<b>'+yyyy+'/'+mm+'/'+dd+'</b><br>'+document.getElementsByClassName('forsale_QoVFl')[0].innerText+statscontent.innerHTML;
    }
    else{
        statscontent.innerHTML = '<b>'+yyyy+'/'+mm+'/'+dd+'</b><br>'+statscontent.innerHTML;
    }
    var headerNode = document.getElementsByClassName('wrapper_cGBtH')[3]
    headerNode.appendChild(listings);
//    parentnode.insertBefore(listings,beforenode);
    var toremoveparent = document.getElementById("release-marketplace");
    toremoveparent.innerHTML = '';
}