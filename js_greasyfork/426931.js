// ==UserScript==
// @name         Reddit Sub-Filter
// @version      1.0
// @description  Skips and removes ads on YouTube automatically
// @author       schwarzington
// @match        https://www.reddit.com/*
// @match        reddit.com/*
// @match        http://www.reddit.com/*
// @grant        none
// @namespace    https://greasyfork.org/users/775479
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/426931/Reddit%20Sub-Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/426931/Reddit%20Sub-Filter.meta.js
// ==/UserScript==

(function() {
    var $ = window.jQuery;//OR
    $ = window.$;
    window.addEventListener("scroll", onScrollStart, false);
    'use strict';

    var waitForEl = function(selector, callback) {
        console.log("Waiting for.. " + selector);
        if ($(selector).length) {
            callback();
        } else {
            setTimeout(function() {
                waitForEl(selector, callback);
            }, 50);
        }
    };

    $("#header-search-bar").on("click", function(){
        waitForEl("[id^=SearchDropdown-]", function(){
            console.log("Hiding now");
            setTimeout(function(){
               $("[id^=SearchDropdown-]").hide();
            }, 50);

        });
    });

    $(".h-jI8r2f9ozTNqu_2TBeY").on("click", function(){
        $("#focus-Popular").hide();
        $("#focus-All").hide();
        $("#focus-DailyCharts").hide();
    });

var subreddits = ["AskReddit", "news", "worldnews", "space", "politics", "ufo", "climateactionplan", "ShowerThoughts"];

    $("a[data-click-id='subreddit']").each(function(index){
        subreddits.forEach(function (item, index1) {
            if($("a[data-click-id='subreddit']")[index].href.toLowerCase().indexOf(item.toLowerCase()) > 0){
                 $("a[data-click-id='subreddit']")[index].closest(".scrollerItem").hidden = true;
                 console.log("Hiding " + item + " Post");
             }
        });
    });

    $('#header-search-bar').on('keyup', function() {
        console.log("In");
        var value = $('#header-search-bar').val();
        console.log(value);
        subreddits.forEach(function (item, index1) {
           if(value.indexOf(item) > -1){
              $('#header-search-bar').val("");
           }
        });
    });

    function onScrollStart(){
           $("a[data-click-id='subreddit']").each(function(index){
        subreddits.forEach(function (item, index1) {
            if($("a[data-click-id='subreddit']")[index].href.toLowerCase().indexOf(item.toLowerCase()) > 0){
                 $("a[data-click-id='subreddit']")[index].closest(".scrollerItem").hidden = true;
                 console.log("Hiding " + item + " Post");
             }
        });
    }); }

})();
