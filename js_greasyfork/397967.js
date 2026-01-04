// ==UserScript==
// @name         PUBG JIRA LINK GRABBER
// @namespace    https://greasyfork.org/en/scripts/397967-pubg-jira-link-grabber
// @version      0.1
// @description  Turn console teleport command into buttons, Get to the map location faster!
// @author       pto2k
// @match        https://jira.krafton.com/browse/PUBG*
// @match        https://jira.krafton.com/projects/PUBG/*
// @require      https://code.jquery.com/jquery-1.11.3.min.js
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/397967/PUBG%20JIRA%20LINK%20GRABBER.user.js
// @updateURL https://update.greasyfork.org/scripts/397967/PUBG%20JIRA%20LINK%20GRABBER.meta.js
// ==/UserScript==

var style =
    "#location-button-panel {display:inline-block;position:fixed;top:30%;left:0;\
    z-index:2147483647;background:#111;color:#fff;overflow:hidden;}\
    #location-button-panel input{color:#111;margin:2px 8px 2px 8px;border-width:2px;border-color:#32cd32}\
    #location-button-panel a{color:#fff;font-size:14px;text-decoration:none;\
    border-style:solid;border-width:1px;border-color:#32cd32}\
    #location-button-panel div{white-space:nowrap;margin:2px 10px 2px 10px;}"; // CSS to be added
GM_addStyle(style);
my_log("location-button-panel css loaded");

function my_log(log_text) {
    console.log('My LOG: ' + log_text);
}

var Desc;
var DescText;
Desc = document.getElementById('description-val');
DescText = document.getElementById('description-val').innerText;
var locations = DescText.match(/Admin MovePlayer.*/g)
//my_log(locations)

var location_button_panel = document.createElement("div");
location_button_panel.id = "location-button-panel";

for (var i = 0; i <locations.length; ++i){
//    my_log(locations[i]);
    var div_markup = document.createElement("div");
    var input_button = document.createElement("input");
    input_button.type = "button";
    input_button.value = "Location " + (i+1);
    input_button.id = locations[i];
    div_markup.appendChild(input_button);
    location_button_panel.appendChild(div_markup);
    input_button.addEventListener("click", function(){copy2clipboard(this.id)});
}

function copy2clipboard(value){
    GM_setClipboard(value);
    my_log('Copied:' + value);
}

document.body.appendChild(location_button_panel);

//auto hide animation
//$('#location-button-panel').hover(
    //function(){$(this).animate({width:'20em'},500);},
    //function(){$(this).animate({width:'2px'},500);}
    //)//.trigger('mouseleave');

(function() {
    'use strict';
    copy2clipboard(locations[0]);
})();