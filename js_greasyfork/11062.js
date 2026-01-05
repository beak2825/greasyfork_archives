// ==UserScript==
// @name         Steam Game analyser
// @namespace    http://your.homepage/
// @version      0.2
// @description  enter something useful
// @author       Necromunger
// @match        http://store.steampowered.com/app/*
// @grant        none
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/11062/Steam%20Game%20analyser.user.js
// @updateURL https://update.greasyfork.org/scripts/11062/Steam%20Game%20analyser.meta.js
// ==/UserScript==


var countNegative = parseInt($("#ReviewsTab_negative").find("span").last().html().replace('(', '').replace(')', '').replace(',',''));
var countPositive = parseInt($("#ReviewsTab_positive").find("span").last().html().replace('(', '').replace(')', '').replace(',',''));

var percent = 0;

var reviewText = "";

var thumbSrc = $(".thumb").first().find("img").attr("src");
var isPositiveThumb = thumbSrc.includes("thumbsUp");

if (countNegative > countPositive) {
    percent = countPositive/ (countNegative + countPositive);
    reviewText = "negative";
    
    if (isPositiveThumb) {
        thumbSrc = thumbSrc.replace("thumbsUp", "thumbsDown");
    }
}
else {
    percent = countNegative/ (countPositive + countNegative);
    reviewText = "positive";
    
    if (!isPositiveThumb) {
        thumbSrc = thumbSrc.replace("thumbsDown", "thumbsUp");
    }
}

percent = (percent * 100).toFixed(2);

var currentColor = $(".game_review_summary").css("color");

var styleContainer = ""+
    "position: fixed;"+
    "top: 0;"+
    "left: 0;"+
    "font-size: 20pt;"+
    "background-color: rgb(23, 26, 33);"+
    "padding: 20px;"+
    "font-weight: bold;"+
    "border-right: 3px solid "+currentColor+";"+
    "border-bottom: 3px solid "+currentColor+";"+
    "border-bottom-right-radius: 10px;"+
    "-moz-border-bottom-right-radius: 10px;"+
    "-webkit-border-bottom-right-radius: 10px;"+
    "color: "+currentColor+";"+
    "";

var styleSpan = ""+
    "font-weight: normal;"+
    "font-size: 14pt;"+
    "color: #b8b6b4;"+
    "";

var styleImage = ""+
    "vertical-align: middle;"+
    "margin-right: 10px;"+
    "border-radius: 4px;"+
    "-moz-border-radius: 4px;"+
    "-webkit-border-radius: 4px;"+
    "";

$('body').append('<div style="'+styleContainer+'">' + 
                     '<div>'+
                         '<img src="'+thumbSrc+'" width="35" height="35" style="'+styleImage+'"/>' + 
                         '<span style="vertical-align: bottom;">' + (100 - percent).toFixed(2) + '%</span><span style="'+styleSpan+'vertical-align: bottom;"> of users</span>'+
                     '</div>'+ 
                     '<span style="'+styleSpan+'">gave a '+reviewText+' review.</span>'+
                 '</div>');