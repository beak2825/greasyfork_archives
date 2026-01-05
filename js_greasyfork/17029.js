// ==UserScript==
// @name         YouTube Better Like / Dislike
// @namespace    https://greasyfork.org/en/users/8935-daniel-jochem
// @version      2.2b2
// @description  Colour based Like / Dislike buttons and added percentage ratios when hovering over.
// @include      *.youtube.com/watch?v=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17029/YouTube%20Better%20Like%20%20Dislike.user.js
// @updateURL https://update.greasyfork.org/scripts/17029/YouTube%20Better%20Like%20%20Dislike.meta.js
// ==/UserScript==
'use strict';

var currentURL;
setInterval(Check, 100);

function SetUpVars() {
var toLike = document.getElementsByClassName("yt-uix-button-content")[21].innerHTML,
    likeRaw,
    liked = document.getElementsByClassName("yt-uix-button-content")[22].innerHTML,

    toDislike = document.getElementsByClassName("yt-uix-button-content")[23].innerHTML,
    dislikeRaw,
    disliked = document.getElementsByClassName("yt-uix-button-content")[24].innerHTML,

    like,
    dislike,
    combined,

    percentLiked,
    percentDisliked,

//Convert the like and dislike values from string to int
like = parseInt(toLike.replace(/,/g, ""));
dislike = parseInt(toDislike.replace(/,/g, ""));

//Save out the like and dislike variable to be used later
likeRaw = like;
dislikeRaw = dislike;

//Add both like and dislike values together to divide by later
combined = like + dislike;
}

//A hack-y way of adding a stylesheet to the page. Userscripts have to use this method unfortunately.
var sheet = (function() {
    var style = document.createElement("style");
    style.appendChild(document.createTextNode(""));
    document.head.appendChild(style);
    return style.sheet;
})();

function Update() {
    //If the like button has been pressed
    if(document.getElementsByClassName("like-button-renderer-like-button-clicked hid").length == 0) {
        //Add one to the amount of likes and re-calculate
        percentLiked = ((like + 1) / (combined + 1) * 100).toFixed(2) + "%";
        percentDisliked = (dislike / (combined + 1) * 100).toFixed(2) + "%";

        //Add the Green like button (for synergy with YouTube Black Theme script)
        sheet.insertRule(".like-button-renderer-like-button.yt-uix-button:active:before, .like-button-renderer-like-button.yt-uix-button.yt-uix-button-toggled:before {background: no-repeat url(//i.imgur.com/cl5B48Y.png) -118px -213px !important}", 0);

    //Else if the dislike button has been pressed
    } else if (document.getElementsByClassName("like-button-renderer-dislike-button-clicked hid").length == 0) {
        //Add one to the amount of dislikes and re-calculate
        percentLiked = (like / (combined + 1) * 100).toFixed(2) + "%";
        percentDisliked = ((dislike + 1) / (combined + 1) * 100).toFixed(2) + "%";

        //Add the Red dislike button (for synergy with YouTube Black Theme script)
        sheet.insertRule(".like-button-renderer-dislike-button.yt-uix-button:active:before, .like-button-renderer-dislike-button.yt-uix-button.yt-uix-button-toggled:before {background: no-repeat url(//i.imgur.com/cl5B48Y.png) -72px -409px !important}", 0);

    //Else show the un-clicked button percentages.
    } else {
        percentLiked = (like / combined * 100).toFixed(2) + "%";
        percentDisliked = (dislike / combined * 100).toFixed(2) + "%";
    }
}


function Check() {
    if(document.URL != currentURL || currentURL == undefined) {
        currentURL = document.URL;
        SetUpVars();
    }

    Update();

    //If the Like or Dislike buttons are hovered over, show the percentages
    if(document.getElementsByClassName("like-button-renderer-like-button")[0].getAttribute("data-content-id") != null || document.getElementsByClassName("like-button-renderer-dislike-button")[0].getAttribute("data-content-id") != null || document.getElementsByClassName("like-button-renderer-like-button")[1].getAttribute("data-content-id") != null || document.getElementsByClassName("like-button-renderer-dislike-button")[1].getAttribute("data-content-id") != null) {
        document.getElementsByClassName("yt-uix-button-content")[21].innerHTML = percentLiked;
        document.getElementsByClassName("yt-uix-button-content")[22].innerHTML = percentLiked;
        document.getElementsByClassName("yt-uix-button-content")[23].innerHTML = percentDisliked;
        document.getElementsByClassName("yt-uix-button-content")[24].innerHTML = percentDisliked;

    //Else if not hovered over,
    } else if(document.getElementsByClassName("yt-uix-button-content")[21].innerHTML == percentLiked || document.getElementsByClassName("yt-uix-button-content")[22].innerHTML == percentLiked) {

        //If the like button has been pressed, show the updated values
        if(document.getElementsByClassName("like-button-renderer-like-button-clicked hid").length == 0) {
            document.getElementsByClassName("yt-uix-button-content")[21].innerHTML = likeRaw + 1;
            document.getElementsByClassName("yt-uix-button-content")[22].innerHTML = likeRaw + 1;
        } else {
            document.getElementsByClassName("yt-uix-button-content")[21].innerHTML = likeRaw;
            document.getElementsByClassName("yt-uix-button-content")[22].innerHTML = likeRaw;
        }

        //If the dislike button has been pressed, show the updated values
        if(document.getElementsByClassName("like-button-renderer-dislike-button-clicked hid").length == 0) {
            document.getElementsByClassName("yt-uix-button-content")[23].innerHTML = dislikeRaw + 1;
            document.getElementsByClassName("yt-uix-button-content")[24].innerHTML = dislikeRaw + 1;
        } else {
            document.getElementsByClassName("yt-uix-button-content")[23].innerHTML = dislikeRaw;
            document.getElementsByClassName("yt-uix-button-content")[24].innerHTML = dislikeRaw;
        }
    }
}