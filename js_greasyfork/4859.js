// ==UserScript==
// @name       osu! Beatmap Mirror
// @version    1.6
// @description  Adds a mirror link to osu! download pages
// @include     http*://osu.ppy.sh/b/*
// @include     http*://osu.ppy.sh/s/*
// @include     http*://osu.ppy.sh/p/beatmaplist*
// @copyright   Ace3DF, 2014
// @grant       none
// @namespace https://greasyfork.org/users/5056
// @downloadURL https://update.greasyfork.org/scripts/4859/osu%21%20Beatmap%20Mirror.user.js
// @updateURL https://update.greasyfork.org/scripts/4859/osu%21%20Beatmap%20Mirror.meta.js
// ==/UserScript==

// Beatmap search page
// Search for each beatmap element
var search = document.getElementsByClassName("beatmap");
// For each beatmap element stored in search, run a loop to add html to each element
for(i = 0; i < search.length; i++){
    // Get beatmap ID
    var BeatmapID = search[i].getAttribute('id');
    // Find tag location
    var html = search[i].getElementsByClassName("tags")[0];
    html.innerHTML = html.innerHTML + ' <a href=""> » </a> <a href="http://bloodcat.com/osu/m/' + BeatmapID + '"> Bloodcat </a> ';
    html.innerHTML = html.innerHTML + ' <a href="http://loli.al/s/' + BeatmapID + '"> loli</a> ';
    html.innerHTML = html.innerHTML + ' <a href="http://osu.uu.gl/s/' + BeatmapID + '"> uu.gl</a> ';
}

// Beatmap Page
var beatmapID = document.getElementsByClassName('bmt')[0].src;
beatmapID = beatmapID.split( '/' )[4];
beatmapID = beatmapID.split( '.' )[0];
beatmapID = beatmapID.replace(/l/, '');

// Check if URL is a number (map) and not just a normal page
if (!isNaN(beatmapID)) { 
    // Find the header HTML to edit and add the links
    var html = document.getElementsByTagName("h1")[0]; // Get location to add the link to the site
    html.innerHTML = html.innerHTML + "<br>Mirror Links »<a href='http://bloodcat.com/osu/m/" + beatmapID + "'> Bloodcat</a>"; //Add Bloodcat
    html.innerHTML = html.innerHTML + " - <a href='http://loli.al/s/" + beatmapID + "'> loli</a>"; //Add loli
    html.innerHTML = html.innerHTML + " - <a href='http://osu.uu.gl/s/" + beatmapID + "'> uu.gl</a>"; //Add uu.gl
}
