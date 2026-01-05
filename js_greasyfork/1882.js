// ==UserScript==
// @name         TL Recent posts
// @include      *teamliquid.net/*
// @author       nakam
// @description  Adds a recent post indicator at the end of the post time.
// @version 0.0.1.20140530203430
// @namespace https://greasyfork.org/users/2349
// @downloadURL https://update.greasyfork.org/scripts/1882/TL%20Recent%20posts.user.js
// @updateURL https://update.greasyfork.org/scripts/1882/TL%20Recent%20posts.meta.js
// ==/UserScript==
// a function that loads jQuery and calls a callback function when jQuery has finished loading
function addJQuery(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
    script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
}

function main() {
    // Note, jQ replaces $ to avoid conflicts.
    var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    var myRe = /(January|February|March|April|May|June|July|August|September|October|November|December).{4,7}20[0-9]{2}.[0-9]{2}:[0-9]{2}/g;
  
    $(".forummsginfo,.forummsginfoa").each(function( index ) {
        var newPostHeader = convertPostTitle($(this).html());
        $(this).html(newPostHeader);
    });
    
    $(".quote").each(function( index ) {
        var post = convertQuote($(this).html());
        $(this).html(post);
    });
  
    function dateStringToObject(content) {
        
        var workStr = String(content.match(myRe));
        if(workStr === 'null'){
            return 'null';
        }

        var postHour = workStr.substring(workStr.length - 5, workStr.length - 3);
        var postMinute = workStr.substring(workStr.length - 2, workStr.length);
        var postYear = parseInt(workStr.match(/[0-9]{4}/), 0);
        var postMonthName = workStr.match(/[A-z]*/);
        var postMonth = monthToNumber(postMonthName);
        var postDay = workStr.match(/[0-9]{2}/);

        var postDate = new Date(postYear, postMonth, postDay, postHour, postMinute);
        return postDate; 
    }
    
    function makeRecentTextString(postDate) {
        var curDate = new Date();
        
        var diffMinutes = Math.abs((curDate - postDate)/1000/60);
        var recentText;
        var recentTextString;
        var color = "#d20000";
        
        if (diffMinutes < 60) {
            recentText = Math.round(diffMinutes) + " min";
            recentTextString = "<span style='color:" + color + "'> ("+recentText+")</span>"
        }
        else if (diffMinutes < 60*24) {
            recentText = Math.round(Math.abs(diffMinutes / 60)) + " hours";
            recentTextString = "<span style='color:" + color + "'> ("+recentText+")</span>"
        }
        else if (diffMinutes < 60*24*10) {
            recentText = Math.round(Math.abs(diffMinutes / 60 / 24)) + " days";
            recentTextString = "<span style='color: black'> ("+recentText+")</span>"
        }
        else {
            recentTextString = "";
        }
        return recentTextString;
    }
    function adjustQuoteTime(postDate) {
        postDate = Date.parse(postDate)-3600000*7;
        var newDate = new Date();
        newDate.setTime(postDate);
        return newDate;
    }
    function convertQuote(content) {
    
        var postDate = dateStringToObject(content);
        if(postDate === 'null'){
            return content;
        }
        
        postDate = adjustQuoteTime(postDate);

        var recentTextString = makeRecentTextString(postDate);
        var newPostMinutes = (postDate.getMinutes()<10?'0':'') + postDate.getMinutes();
        var newDateString = monthNames[postDate.getMonth()] + " " + postDate.getDate() + " " + postDate.getFullYear() + " " + postDate.getHours() + ":" + newPostMinutes + " " + recentTextString;
        
        return content.replace(myRe, newDateString);        
    }
  
    function convertPostTitle(content) {
        var postDate = dateStringToObject(content);
        if(postDate === 'null') {
            return content;
        }
        var recentTextString = makeRecentTextString(postDate);
        
        newPostMinutes = postDate.getMinutes();
        
        if (postDate.getMinutes() < 10) {
            newPostMinutes = "0"+newPostMinutes;
        }

        var newDateString = monthNames[postDate.getMonth()] + " " + postDate.getDate() + " " + postDate.getFullYear() + " " + postDate.getHours() + ":" + newPostMinutes + " " + recentTextString;
        
        return content.replace(myRe, newDateString);
    }
    function monthToNumber(monthName) {
        "use strict";
        if (monthName == "January") {
            return 0;
        }
        if (monthName == "February") {
            return 1;
        }
        if (monthName == "March") {
            return 2;
        }
        if (monthName == "April") {
            return 3;
        }
        if (monthName == "May") {
            return 4;
        }
        if (monthName == "June") {
            return 5;
        }
        if (monthName == "July") {
            return 6;
        }
        if (monthName == "August") {
            return 7;
        }
        if (monthName == "September") {
            return 8;
        }
        if (monthName == "October") {
            return 9;
        }
        if (monthName == "November") {
            return 10;
        }
        if (monthName == "December") {
            return 11;
        }
    }
}


// load jQuery and execute the main function
addJQuery(main);