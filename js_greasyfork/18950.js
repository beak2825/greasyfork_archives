// ==UserScript==
// @name         Bot to Top
// @namespace    http://tampermonkey.net/
// @version      0.8.0
// @description  Move Youtube Mirror Bots and twitter bots to the top of the thread 
// @author       Itskira
// @match        *://*.reddit.com/r/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18950/Bot%20to%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/18950/Bot%20to%20Top.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //Oddshot (/u/YouTubeConverterBot) 
    if($('a.title').attr('href').toLowerCase().indexOf("oddshot.tv")) { //Link check
        var post = $(".commentarea a.author[href$='/user/YouTubeConverterBot']").parent().parent().parent(); //Comment + children
        post.parent().prepend(post); //Move it to the top
        post.css({outline: "1px solid #222547"}); //Purple from Oddshot outline
    }

    //Oddshot (/u/BeepBooBeepBoop)
    if($('a.title').attr('href').toLowerCase().indexOf("oddshot.tv")) { //Link check
        var post = $(".commentarea a.author[href$='/user/BeepBooBeepBoop']").parent().parent().parent(); //Comment + children
        post.parent().prepend(post); //Move it to the top
        post.css({outline: "1px solid #222547"}); //Purple from Oddshot outline
    }

    // Playstv (/u/playstv_bot)
    if($('a.title').attr('href').toLowerCase().indexOf("plays.tv")) { //Link check
        var post = $(".commentarea a.author[href$='/user/playstv_bot']").parent().parent().parent(); //Comment + children
        post.parent().prepend(post); //Move it to the top
        post.css({outline: "1px solid #5E94A4"}); //Blue from Playstv outline
    }

    //Twitter (/u/TweetPoster)
    if($('a.title').attr('href').toLowerCase().indexOf("twitter.com")) { //Link check
        var post = $(".commentarea a.author[href$='/user/TweetPoster']").parent().parent().parent(); //Comment + children
        post.parent().prepend(post); //Move it to the top
        post.css({outline: "1px solid #00aced"}); //Purple from Oddshot outline
    }

    //Gifv (/u/gifv-bot)
    if($('a.title').attr('href').toLowerCase().indexOf("plays.tv")) { //Link check
        var post = $(".commentarea a.author[href$='/user/gifv-bot']").parent().parent().parent(); //Comment + children
        post.parent().prepend(post); //Move it to the top
        post.css({outline: "1px solid #5E94A4"}); //Blue from Playstv outline
    }

    //Overwatch Patch Notes (/u/polarbytebot)
    if($('a.title').attr('href').toLowerCase().indexOf("battle.net")) { //Link check
        var post = $(".commentarea a.author[href$='/user/polarbytebot']").parent().parent().parent(); //Comment + children
        post.parent().prepend(post); //Move it to the top
        post.css({outline: "1px solid #FF9531"}); //Orange from Overwatch outline
    }
})();