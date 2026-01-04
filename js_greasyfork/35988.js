// ==UserScript==
// @name          AmaLand Network - Embedded Video Direct Link
// @description   Provides Direct Link to Embedded Videos
// @include       http://members.429members.com/video/*
// @include       http://members.429members.com/sites/*/*/video/*
// @include       http://members.amaland.com/video/*
// @include       http://members.amaland.com/sites/*/*/video/*
// @include       http://members.asianpornmembers.com/video/*
// @include       http://members.asianpornmembers.com/sites/*/*/video/*
// @include       http://members.bestgfvideos.com/video/*
// @include       http://members.bestgfvideos.com/sites/*/*/video/*
// @include       http://members.boyfriendnudes.com/video/*
// @include       http://members.boyfriendnudes.com/sites/*/*/video/*
// @include       http://members.gf-members.com/video/*
// @include       http://members.gf-members.com/sites/*/*/video/*
// @include       http://members.gfarchive.com/video/*
// @include       http://members.gfarchive.com/sites/*/*/video/*
// @include       http://members.gfpornbox.com/video/*
// @include       http://members.gfpornbox.com/sites/*/*/video/*
// @include       http://members.gfpornmovies.com/video/*
// @include       http://members.gfpornmovies.com/sites/*/*/video/*
// @include       http://members.gfpornvideos.com/video/*
// @include       http://members.gfpornvideos.com/sites/*/*/video/*
// @include       http://members.gfsexvideos.com/video/*
// @include       http://members.gfsexvideos.com/sites/*/*/video/*
// @include       http://members.gfvideohub.com/video/*
// @include       http://members.gfvideohub.com/sites/*/*/video/*
// @include       http://members.gossipmembers.com/video/*
// @include       http://members.gossipmembers.com/sites/*/*/video/*
// @include       http://members.madporn.com/video/*
// @include       http://members.madporn.com/sites/*/*/video/*
// @include       http://members.porndvdhub.com/video/*
// @include       http://members.porndvdhub.com/sites/*/*/video/*
// @include       http://members.sexadgang.dk/video/*
// @include       http://members.sexadgang.dk/sites/*/*/video/*
// @include       http://members.spankbox.com/video/*
// @include       http://members.spankbox.com/sites/*/*/video/*
// @include       http://members.thehardcorenetwork.com/video/*
// @include       http://members.thehardcorenetwork.com/sites/*/*/video/*
// @include       http://members.toonpass.com/video/*
// @include       http://members.toonpass.com/sites/*/*/video/*
// @author        Lucifuga
// @version       0.2
// @namespace https://greasyfork.org/users/160947
// @downloadURL https://update.greasyfork.org/scripts/35988/AmaLand%20Network%20-%20Embedded%20Video%20Direct%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/35988/AmaLand%20Network%20-%20Embedded%20Video%20Direct%20Link.meta.js
// ==/UserScript==
 
var html = document.documentElement.innerHTML;
var searchstring = 'iframe src=';
var pos = html.indexOf(searchstring)+12;
var endpos = html.indexOf('width', pos)-2;
var link = html.substr(pos, endpos-pos);

var linknode = document.createElement("a");
linknode.className = "Embedded";
var linktext = document.createTextNode(" - Embedded");
linknode.setAttribute('href',link);
linknode.appendChild(linktext);

var body = document.getElementsByTagName('h2')[0];
body.appendChild(linknode);
