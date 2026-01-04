// ==UserScript==
// @name         Hide Code for Surviv
// @namespace    http://tampermonkey.net/surviv
// @version      0.2
// @description  Hide code
// @author       Maxx Tandon
// @match        *://surviv.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369638/Hide%20Code%20for%20Surviv.user.js
// @updateURL https://update.greasyfork.org/scripts/369638/Hide%20Code%20for%20Surviv.meta.js
// ==/UserScript==

function main(){
    var link = document.getElementById('team-url');
    link.style.visibility = "hidden";
    link = document.getElementById("team-code");
    link.style.visibility = "hidden";
    //console.log(document.getElementById("team-url"));
};
main();