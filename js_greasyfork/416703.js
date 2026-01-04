// ==UserScript==
// @name         Twitch Latency Overlay (EMBEDDED)
// @namespace    http://tampermonkey.net/
// @version      0.7 (embedded)
// @description  Latency to Broadcaster Overlay (customizable, see more in the code section).(FOR EMBEDDED/ADBLOCK VERSION) - Edited version of https://greasyfork.org/en/scripts/391680-twitch-latency-on-player-controls/
// @author       zaykho (for the modified version)
// @include      https://player.twitch.tv/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/416703/Twitch%20Latency%20Overlay%20%28EMBEDDED%29.user.js
// @updateURL https://update.greasyfork.org/scripts/416703/Twitch%20Latency%20Overlay%20%28EMBEDDED%29.meta.js
// ==/UserScript==

(function(){
//////////////////////////////////////////////
// Set the position for the Overlay: [0 by default (video)](you can click on the overlay button to automatically toggle to the next position)
// 0, 1, 2, 3: Inside of the Video (work for Theatre and Full-Screen)
// 0 = Top Right.
// 1 = Bottom Right.
// 2 = Bottom Left.
// 3 = Top Left.
var tlo_position=0;
// Set the font color for the Overlay ["#a263ff" by default (light-purple)]
var tlo_font_color="#a263ff";
// Set the font size for the Overlay [13 by default]
var tlo_font_size=13;
// Set the delay required before creating the overlay (in milliseconds, after loading the page) [3000 by default]
var tlo_create_delay=3000;
//////////////////////////////////////////////
///////// DO NOT EDIT PAST THIS LINE /////////
//////////////////////////////////////////////
var tlo_main;
var tlo_index="width:90px;height:30px;font:bold "+tlo_font_size+"px Arial,sans-serif;line-height:30px;border-radius:4px;text-align:center;cursor:pointer;color:"+tlo_font_color;
var tlo_list=[];
tlo_list[0]="position:absolute;right:15px;top:10px;box-shadow:#111011 0px 0px 2px;background:#18181b;"+tlo_index;
tlo_list[1]="position:absolute;right:15px;bottom:44px;box-shadow:#111011 0px 0px 2px;background:#18181b;"+tlo_index;
tlo_list[2]="position:absolute;left:15px;bottom:44px;box-shadow:#111011 0px 0px 2px;background:#18181b;"+tlo_index;
tlo_list[3]="position:absolute;left:15px;top:10px;box-shadow:#111011 0px 0px 2px;background:#18181b;"+tlo_index;
//////////////////////////////////////////////
function tlo_function_click(){
if(tlo_position == 3 || tlo_position == -1){tlo_position=0;}
else{tlo_position+=1;}
document.querySelector(".video-player").appendChild(tlo_main);
tlo_main.style.cssText=tlo_list[tlo_position];
}
//////////////////////////////////////////////
function tlo_function_over(){
tlo_main.style.background="#9147ff";
tlo_main.style.color="#ffffff";
tlo_main.style.boxShadow="#7346b5 0px 0px 2px";
}
//////////////////////////////////////////////
function tlo_function_out(){
tlo_main.style.color=tlo_font_color;
tlo_main.style.background="#18181b";tlo_main.style.boxShadow="#111011 0px 0px 2px";
}
//////////////////////////////////////////////
window.addEventListener('load',function(){
//////////////////////////////////////////////
setTimeout(function(){
//////////////////////////////////////////////
document.querySelector("button[data-a-target='player-settings-button']").click();
document.querySelector("button[data-a-target='player-settings-menu-item-advanced']").click();
document.querySelector("div[data-a-target='player-settings-submenu-advanced-video-stats'] input").click();
document.querySelector("div[data-a-target='player-overlay-video-stats']").style.display="none";
//////////////////////////////////////////////
tlo_main=document.querySelector("div[data-a-target='player-overlay-video-stats'] > table > tbody > tr:nth-child(5) > td:nth-child(2) > p");
//////////////////////////////////////////////
tlo_main.addEventListener("click", tlo_function_click);
tlo_main.addEventListener("mouseover", tlo_function_over);
tlo_main.addEventListener("mouseout", tlo_function_out);
//////////////////////////////////////////////
tlo_position-=1;tlo_function_click();
document.querySelector("button[data-a-target='player-settings-button']").click();
//////////////////////////////////////////////
}, tlo_create_delay);
//////////////////////////////////////////////
})
//////////////////////////////////////////////
})();