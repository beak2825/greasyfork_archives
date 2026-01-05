// ==UserScript==
// @name       loli.al osu linker
// @version    0.1
// @description  adds a link to loli.al of that beatmap
// @include		https://osu.ppy.sh/p/*
// @include		https://osu.ppy.sh/s/*
// @include		https://osu.ppy.sh/b/*
// @copyright  2012+, SullyJHF
// @namespace https://greasyfork.org/users/4795
// @downloadURL https://update.greasyfork.org/scripts/4617/lolial%20osu%20linker.user.js
// @updateURL https://update.greasyfork.org/scripts/4617/lolial%20osu%20linker.meta.js
// ==/UserScript==

//for beatmap search page
var beatmaps = document.getElementsByClassName("beatmap");
for(i = 0; i < beatmaps.length; i++){
    var curID = beatmaps[i].getAttribute('id')
    var curTag = beatmaps[i].getElementsByClassName("tags")[0];
    curTag.innerHTML = curTag.innerHTML + '<a href="http://loli.al/mirror/search/?keyword='+curID+'" style="background: #BEB8FF">DL Mirror</a>';
}

//for actual beatmap page
var tablist_el = document.getElementById("tablist");
var regexp_diff = /beatmapTab active\" href=\"\/b\/(.*)\&amp.*<span>.*<\/span><\/a><\/li>/g;
var kokotina = tablist_el.innerHTML;
var diffname = regexp_diff.exec(kokotina)[1];

var lol = document.getElementsByTagName("h1")[0];
lol.innerHTML = lol.innerHTML + "<br><a target='_blank' href='http://loli.al/mirror/search/?keyword=" + diffname + "'>» DL Mirror</a>";