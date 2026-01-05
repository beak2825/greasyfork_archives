// ==UserScript==
// @name         MaSt Play MODS
// @namespace    MaSt Play MODS
// @version      0.1
// @description  MODS
// @author       MaSt
// @match        http://abs0rb.me/*
// @match        http://agar.io/*
// @match        http://agarabi.com/*
// @match        http://agarly.com/*
// @match        http://en.agar.bio/*
// @match        http://agar.pro/*
// @match        http://agar.biz/*
// @match        http://gota.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20935/MaSt%20Play%20MODS.user.js
// @updateURL https://update.greasyfork.org/scripts/20935/MaSt%20Play%20MODS.meta.js
// ==/UserScript==
window.onload = function() {
    var ctx = document.getElementById("canvas").getContext("2d");
    $("h2").replaceWith('<h2>MaSt Agar.io</h2>');
    $("title").replaceWith('<title>MaSt Agar.io</title>');
    $("h1").replaceWith('<h1>MaSt Agar.io</h1>');
    option_show_mass = true;
    option_skip_stats = true;
};
var SplitInterval;
var MacroInterval;
var SplitDebounce = false;
var MacroDebounce = false;
$(document).on('keydown', function(input) {
    console.log("got keydown");
    if (input.keyCode == 16) {
        if (SplitDebounce) {
            return;
        }
        SplitDebounce = true;
        SplitInterval = setInterval(function() {
            $("body").trigger($.Event("keydown", {
                keyCode: 32
            }));
            $("body").trigger($.Event("keyup", {
                keyCode: 32
            }));
        }, 0);
    } else if (input.keyCode == 81) {
        if (MacroDebounce) {
            return;
        }
        MacroDebounce = true;
        MacroInterval = setInterval(function() {
            $("body").trigger($.Event("keydown", {
                keyCode: 87
            }));
            $("body").trigger($.Event("keyup", {
                keyCode: 87
            }));
        }, 0);
    }
});
$(document).on('keyup', function(input) {
    if (input.keyCode == 16) {
        SplitDebounce = false;
        clearInterval(SplitInterval);
        return;
    } else if (input.keyCode == 81) {
        MacroDebounce = false;
        clearInterval(MacroInterval);
        return;
    }
});
$( "#canvas" ).after( "<div style='background-color: #000000; -moz-opacity: 0.4; -khtml-opacity: 0.4; opacity: 0.4; filter: alpha(opacity=40); zoom: 1; width: 615px; top: 30px; left: 30px; display: block; position: absolute; text-align: center; font-size: 15px; color: #ffffff; padding: 5px; font-family: Ubuntu;'> <div style='color:#ffffff; display: inline; -moz-opacity:1; -khtml-opacity: 1; opacity:1; filter:alpha(opacity=100); padding: 10px;'><a href='//www.youtube.com/channel/UCDus6QxlKthkN_n0oaEOsOg' target='_blank'>PLAY - Agar.io YT</a></div> <div style='color:#ffffff; display: inline; -moz-opacity:1; -khtml-opacity: 1; opacity:1; filter:alpha(opacity=100); padding: 10px;'><br>Macro Feed: <a>Q</a> </div> <div style='color:#ffffff; display: inline; -moz-opacity:1; -khtml-opacity: 1; opacity:1; filter:alpha(opacity=100); padding: 10px;'><br>Full split: <a>Shift</a> </div> <div style='color:#ffffff; display: inline; -moz-opacity:1; -khtml-opacity: 1; opacity:1; filter:alpha(opacity=100); padding: 10px;'><br>La team: <a href='//pastebin.com/raw/nmcs1XEw' target='_blank'>Lien des chaines</a> </div>" );
document.getElementById("gamemode").style.backgroundColor = "black";
document.getElementById("gamemode").style.color = "white";
document.getElementById("region").style.backgroundColor = "black";
document.getElementById("region").style.color = "white";
document.getElementById("quality").style.backgroundColor = "black";
document.getElementById("quality").style.color = "white";
document.getElementById("statsGraph").style.bottom = "";
document.getElementById("statsGraph").style.top = "40px";
document.getElementById("stats").getElementsByTagName("hr")[0].style.top = "270px";
document.getElementById("socialStats").style.bottom = "";
document.getElementById("socialStats").style.top = "290px";
document.getElementById("statsContinue").style.bottom = "20px";
document.getElementById("statsContinue").style.top = "344px";
document.getElementById("stats").getElementsByTagName("hr")[1].style.top = "40px";
document.getElementById("stats").style.height = "398px";
document.getElementById("stats").style.padding = "0 0 0";
document.getElementsByClassName("agario-exp-bar progress")[0].style.backgroundColor = "black";