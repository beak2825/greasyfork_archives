// ==UserScript==
// @name         Hide Code For Surviv (On Zone Change)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Hide the surviv code and link when you use a specific zone
// @author       Maxx Tandon
// @match        *://www.surviv.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370545/Hide%20Code%20For%20Surviv%20%28On%20Zone%20Change%29.user.js
// @updateURL https://update.greasyfork.org/scripts/370545/Hide%20Code%20For%20Surviv%20%28On%20Zone%20Change%29.meta.js
// ==/UserScript==

function main(){
    var link = document.getElementById('team-url');
    link.style.visibility = "hidden";
    link = document.getElementById("team-code");
    link.style.visibility = "hidden";
    console.log(document.getElementById("team-url"));
};
main();