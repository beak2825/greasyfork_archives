// ==UserScript==
// @name         Polltab Bracket Show Iframe
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  It allows you to paste youtube video url's as the question and then when actually viewing the bracket instead of showing the url as text it will instead show an embedded YouTube video of the url. 
// @author       You
// @match        https://www.polltab.com/bracket-poll*
// @grant        none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/422745/Polltab%20Bracket%20Show%20Iframe.user.js
// @updateURL https://update.greasyfork.org/scripts/422745/Polltab%20Bracket%20Show%20Iframe.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();


var preSrc = "<div class=\"choiceitem\"><div class=\"choiceitem-media\"><div style=\"width: 100%; height: 170px;\"><div style=\"width: 100%; height: 100%;\"><iframe frameborder=\"0\" allowfullscreen=\"1\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" title=\"YouTube video player\" width=\"100%\" height=\"100%\" src=\"https://www.youtube.com/embed/"
var postSrc = "?autoplay=0&mute=0&controls=1&origin=https%3A%2F%2Fwww.polltab.com&playsinline=1&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1&widgetid=19\" id=\"widget20\"></iframe></div></div></div></div>"

var container = document.querySelectorAll(".bracketpoll-container");
var itemHeight = document.querySelectorAll(".bracketbox-team-item");
var youtubeLink = document.getElementsByClassName("bracketbox-team-item-label-text");
var round1 = document.querySelectorAll(".bracketpoll-group.round1 .bracketpoll-group-round");
var round2 = document.querySelectorAll(".bracketpoll-group.round2 .bracketpoll-group-round");
var round3 = document.querySelectorAll(".bracketpoll-group.round3 .bracketpoll-group-round");
var round4 = document.querySelectorAll(".bracketpoll-group.round4 .bracketpoll-group-round");
var round5 = document.querySelectorAll(".bracketpoll-group.round5 .bracketpoll-group-round");
var round6 = document.querySelectorAll(".bracketpoll-group.round6 .bracketpoll-group-round");



container[0].style.height = "initial";

for (let i = 0; i < youtubeLink.length; i++) {
    console.log(youtubeLink[i].innerText.split('?v=')[1]);
    youtubeLink[i].innerHTML = preSrc + youtubeLink[i].innerText.split('?v=')[1] + postSrc;
    youtubeLink[i].style.overflow = 'auto';
}

for (let i = 0; i < round1.length; i++) {
    round1[i].style.height = '410px';
}

for (let i = 0; i < round2.length; i++) {
    round2[i].style.height = '530px';
    round2[i].style.margin = '330px 0px 530px';
}

for (let i = 0; i < round3.length; i++) {
    round3[i].style.height = '1060px';
    round3[i].style.margin = '590px 0px 1060px';
}

for (let i = 0; i < round4.length; i++) {
    round4[i].style.height = '2120px';
    round4[i].style.margin = '1120px 0 2120px';
}

for (let i = 0; i < round5.length; i++) {
    round5[i].style.height = '4240px';
    round5[i].style.margin = '2180px 0 4240px';
}

for (let i = 0; i < round6.length; i++) {
    round6[i].style.height = '4240px';
    round6[i].style.margin = '4300px 0px 4240px';
}

for (let i = 0; i < itemHeight.length; i++) {
    itemHeight[i].style.height = '225px';
}


