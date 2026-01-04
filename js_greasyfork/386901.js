// ==UserScript==
// @name         Leetcode Score
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  calculate score for leetcode. Easy = 1, Mid = 3, Hard = 9
// @author       weihao
// @match        https://leetcode.com/problemset/all/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386901/Leetcode%20Score.user.js
// @updateURL https://update.greasyfork.org/scripts/386901/Leetcode%20Score.meta.js
// ==/UserScript==
$(document).ready(function() {
    setTimeout(show, 1000);

    function show() {
        var sp = document.getElementById("welcome").childNodes[0];

        var easy = Number(sp.childNodes[2].childNodes[2].data);
        var mid = Number(sp.childNodes[4].childNodes[2].data);
        var hard = Number(sp.childNodes[6].childNodes[2].data);

        var score = easy * 1 + mid * 3 + hard * 9;

        sp.appendChild(document.createTextNode("\u00A0-\u00A0"));
        var s = document.createElement("span");
        s.appendChild(document.createTextNode("score " + score));
        s.classList.add("label");
        s.classList.add("label-info");
        s.classList.add("round");
        sp.appendChild(s);
    }
});