// ==UserScript==
// @name         The Reddit Archives
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Addon that changes color and skew of upvote and downvote buttons on old and new reddit when a post is archived to make it obvious when it is archived.
// @author       You
// @match        https://*.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @grant       GM_log
// @license     All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/460738/The%20Reddit%20Archives.user.js
// @updateURL https://update.greasyfork.org/scripts/460738/The%20Reddit%20Archives.meta.js
// ==/UserScript==




(function() {
    'use strict';
    var count = (document.body.innerText.match("This is an archived post. You won't be able to vote or comment.") || []).length;// use innerText instead of textContent so invisible archived interstitial doesn't cause problems
    //console.log(count);
    if (document.body.textContent.includes("This thread is archived") || (count == 1)) {//document.body.textContent.includes("This is an archived post. You won't be able to vote or comment.") &&
        console.log(document.body.textContent.includes("This thread is archived"));
        console.log(document.body.textContent.includes("This is an archived post. You won't be able to vote or comment."));

        /*(
    document.documentElement.textContent || document.documentElement.innerText
  ).indexOf('This thread is archived') > -1*/
        //rgb(255, 16, 240) rgb(235, 235, 235)
        var styles_up = "i.icon.icon-upvote { color:rgb(240,240,240); transform: rotate(180deg) skew(15deg) !important;background: aliceblue;}"//aliceblue 228,228,228 transform: scaleX(-1); background: grey;
        var styles_down = "i.icon.icon-downvote { color:rgb(240,240,240); transform: scaleX(-1) skew(15deg) !important;background: aliceblue;}"//background: white; background: grey;
        var styles_up_2 = "div.arrow.up { color:rgb(240,240,240) !important; transform: rotate(180deg) skew(15deg) !important;background: aliceblue !important;}"//aliceblue 228,228,228 transform: scaleX(-1); background: grey;
        var styles_down_2 = "div.arrow.down { color:rgb(240,240,240) !important; transform: scaleX(-1) skew(15deg) !important;background: aliceblue !important;}"//background: white; background: grey;
        // using !important to make sure to overrride any other css (or at least trying to)

        //var me = document.getElementsByClassName("icon-upvote");
        //me.color = "aliceblue";
        //GM_log("Hello, World!");
        //console.log("changing colors");// debug

        // attaching a new stylesheet for each button
        var styleSheet = document.createElement("style");// for new reddit, upvote button
        styleSheet.innerText = styles_up;
        document.head.appendChild(styleSheet);
        var styleSheet_2 = document.createElement("style");// downvote button
        styleSheet_2.innerText = styles_down;
        document.head.appendChild(styleSheet_2);
        var styleSheet_3 = document.createElement("style");// for old reddit (probably not 100% fullproof), upvote button
        styleSheet_3.innerText = styles_up_2;
        document.head.appendChild(styleSheet_3);
        var styleSheet_4 = document.createElement("style");// downvote button
        styleSheet_4.innerText = styles_down_2;
        document.head.appendChild(styleSheet_4);
        //console.log("color should be changed");// debug
    }
})();