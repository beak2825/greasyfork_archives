// ==UserScript==
// @name         RedditSimplifier
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  turns off subreddit style and hides sidebar
// @author       hello_frenz
// @match        https://www.reddit.com/*
// @match        https://old.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/41049/RedditSimplifier.user.js
// @updateURL https://update.greasyfork.org/scripts/41049/RedditSimplifier.meta.js
// ==/UserScript==



//Paste: https://pastebin.com/XfdxTbzU

(function() {
    'use strict';
    var chkStyle = $("#res-style-checkbox");
    if (chkStyle.prop('checked')){
        chkStyle.click();
    }
    $(".side").hide();
    var hide = $("<button id='btnHideSide'>");
    hide.text(">>");
    hide.css("position", "absolute");
    hide.css("bottom", "0px");
    hide.css("right", "0px");
    hide.css("height", "13px");
    hide.css("line-height", "10px");
    hide.css("margin", "0px");
    hide.css("padding", "0px");
    hide.css("display", "none");
    hide.click(function(){
        $(".side").hide();
        $("#btnShowSide").show();
        $("#btnHideSide").hide();
    });
    $("#header").append(hide);
    var show = $("<button id='btnShowSide'>");
    show.text("<<");
    show.css("position", "absolute");
    show.css("bottom", "0px");
    show.css("right", "0px");
    show.css("height", "13px");
    show.css("line-height", "10px");
    show.css("margin", "0px");
    show.css("padding", "0px");
    show.click(function(){
        $(".side").show();
        $("#btnShowSide").hide();
        $("#btnHideSide").show();
    });
    $("#header").append(show);
    // Your code here...
})();