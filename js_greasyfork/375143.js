// ==UserScript==
// @name         shiny alert
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  pokefarm stuff
// @author       You
// @match        https://pokefarm.com/shelter
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375143/shiny%20alert.user.js
// @updateURL https://update.greasyfork.org/scripts/375143/shiny%20alert.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var shelter= null;
    var next = document.getElementById("sheltercommands");
    setInterval(function() {
        shelter = document.getElementById("shelterarea").getElementsByClassName("tooltip_content");
    for(var i=0; i < shelter.length; i++) {
        if(next.innerHTML.length<500 && (shelter[i].innerHTML.includes("shiny.png")||shelter[i].innerHTML.includes("albino.png")||shelter[i].innerHTML.includes("melanistic.png")||shelter[i].innerHTML.includes("/_delta/")||shelter[i].innerHTML.includes("prehistoric.png")||shelter[i].innerHTML.includes("mega.png")||shelter[i].innerHTML.includes("starter.png"))) {
           next.insertAdjacentHTML('afterbegin', "<div style='position:absolute; left:50%; transform:translate(-50%);'><img src='https://pfq-static.com/img/misc/goldstar.png'> on page</div>");
        }
    }}, 100);
})();