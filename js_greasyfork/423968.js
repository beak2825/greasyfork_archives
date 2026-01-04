// ==UserScript==
// @name         Lostworld.io Rainbow Hack + Extra Controls
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Type the commands in the Info tab in the Lostworld.io chat for results. The wood, stone, food and gold will turn rainbow. Here is the link to my youtube channel: https://www.youtube.com/channel/UCva86StavXgOW1UKBSrlvXA/featured
// @author       Deadly Dotio
// @match        http://*lostworld.io/*
// @match        http://*sploop.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423968/Lostworldio%20Rainbow%20Hack%20%2B%20Extra%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/423968/Lostworldio%20Rainbow%20Hack%20%2B%20Extra%20Controls.meta.js
// ==/UserScript==

function rainbow(id, r = rain){
    var elm = document.getElementById(id);
    elm.style.color = `hsl(${r}, 100%, 50%)`;
}
var rain = 0;
setInterval(function(){
    rainbow('foodDisplay');
    rainbow('woodDisplay');
    rainbow('stoneDisplay');
    rainbow('goldDisplay');
    rainbow('chatInput');
    rainbow('clanDisplay');
    rainbow('createClanName');
    rainbow('createClanButton');
    rainbow('memberDisplay');
    rainbow('leaveClanButton');
    rainbow('loader');
    rain++;
    },);
var css = "h1 { background: blue; }"
var style = document.createElement("style");
style.type = "text/css";
style.appendChild(document.createTextNode(css));
document.head.appendChild(style);

(function() {
    "use strict"
var img = new Image();
img.src = 'path/to/image.jpg';
var holder = document.getElementById('holder');
holder.appendChild(img);
})();

(function() {
    'use strict';

    alert('HERE IS THE SPECIAL COMMAND: /bg ../entity/dragon. The command to get the hat is: bg ../hats/hat_1.');
    })();