// ==UserScript==
// @name        Reddit submission votes
// @namespace   Redditvotes
// @include     *reddit.com*
// @exclude     *adzerk.net*
// @version     1
// @grant       none
// @description Restores the old upvote/downvote count for submissions.
// @downloadURL https://update.greasyfork.org/scripts/18783/Reddit%20submission%20votes.user.js
// @updateURL https://update.greasyfork.org/scripts/18783/Reddit%20submission%20votes.meta.js
// ==/UserScript==

var votepoints = $(".linkinfo > .score > .number").text();
var likepercent = $(".linkinfo > .score").text();
var url = $(location).attr('href');
var votepoints2 = +votepoints.replace(',', '')

//alert(url + ", " + votepoints + ", " + likepercent);

var percentstring = likepercent.substr(likepercent.indexOf("(") + 1);

var percent = percentstring.substr(0, percentstring.indexOf("%"));

var downpercent = 100 - percent;

var totalvotes = (votepoints2 / (percent - downpercent)) * 100;

var upvotes = Math.round((totalvotes / 100) * percent);

var downvotes = Math.round((totalvotes / 100) * downpercent);

//alert("percent: " + percent + ", downpercent " + downpercent + ", totalvotes: " + totalvotes + ", upvotes: " + upvotes + ", downvotes: " + downvotes);

$.fn.digits = function(){ 
    return this.each(function(){ 
        $(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") ); 
    })
}

$("head").append("<style>.linkinfo .upvotes {color: orangered; font-size: 80%;} .linkinfo .downvotes {color: #5F99CF; font-size: 80%;}</style>");
if (votepoints2 > 0) {
$(".linkinfo > .score").replaceWith("<div class=\"score\"><span class=\"number\">" + votepoints + "</span><span class=\"word\"> points</span> (" + percent + "% like it)</div><span class=\"upvotes\"><span class=\"number\">" + upvotes + "</span><span class=\"word\"> upvotes</span></span> <span class=\"downvotes\"><span class=\"number\">" + downvotes + "</span><span class=\"word\"> downvotes</span></span>");
} else {
$(".linkinfo > .score").replaceWith("<div class=\"score\"><span class=\"number\">" + votepoints + "</span><span class=\"word\"> points</span> (" + percent + "% like it)</div><span class=\"upvotes\"><span class=\"number\">?</span><span class=\"word\"> upvotes</span></span> <span class=\"downvotes\"><span class=\"number\">?</span><span class=\"word\"> downvotes</span></span>");
}

$(".number").digits();