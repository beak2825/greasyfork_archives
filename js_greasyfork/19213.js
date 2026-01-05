// ==UserScript==
// @name           Revolutionary Tweeter
// @author         Kelvin Zhang
// @namespace      http://polunom.com
// @description    Adds #talonsrev16 to the end of all tweets
// @include        http://twitter.com/*
// @include        https://twitter.com/*
// @version 0.0.1.20160429034205
// @downloadURL https://update.greasyfork.org/scripts/19213/Revolutionary%20Tweeter.user.js
// @updateURL https://update.greasyfork.org/scripts/19213/Revolutionary%20Tweeter.meta.js
// ==/UserScript==

function addHashtag() {
    var maxtweet = 140;
    var hash = "#talonsrev16";
    if (hash == undefined) hash = "";
    var tweet = document.getElementById('tweet-box-global').textContent;
    var newtweet = tweet + " " + hash;
    if (newtweet.length > maxtweet) {
        alert("Tweet is too long to append hashtag.");
    }
    else{
        document.getElementById('tweet-box-global').innerHTML = "<div>" + newtweet + "</div>";
    }
}

var classname = document.getElementsByClassName("tweet-action");

for (var i = 0; i < classname.length; i++) {
    classname[i].addEventListener('click', addHashtag, true);
}
