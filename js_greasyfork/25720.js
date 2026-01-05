// ==UserScript==
// @name         Love Archiver
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Archives projects you love into a specific studio.
// @author       @TheUltimatum
// @match        https://scratch.mit.edu/projects/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25720/Love%20Archiver.user.js
// @updateURL https://update.greasyfork.org/scripts/25720/Love%20Archiver.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.onload=function main() {
        var STUDIO="YOUR STUDIO NUMBER HERE!";
        var heart=document.getElementById("love-this").children[1];
        heart.onclick=function() {
            if (heart.className.toString() == "love icon") {
                $.ajax({type: "PUT",url: "https://scratch.mit.edu/site-api/projects/in/"+STUDIO+"/add/?pks="+document.location.pathname.split("/")[2]});
                console.log("Added: https://scratch.mit.edu/projects"+document.location.pathname.split("/")[2]);
            }
        };
    };
})();