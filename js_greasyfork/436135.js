// ==UserScript==
// @name         gleam.io remaining runtime in document title
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Shows the runtime of the contest in the title
// @author       woebbi
// @license     GNU GPLv3 https://choosealicense.com/licenses/gpl-3.0/
// @match        *gleam.io/*
// @icon         https://www.google.com/s2/favicons?domain=gleam.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436135/gleamio%20remaining%20runtime%20in%20document%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/436135/gleamio%20remaining%20runtime%20in%20document%20title.meta.js
// ==/UserScript==

$(document).ready(function() {
    if (document.getElementsByClassName("status ng-binding")[1] !== null) {
        var status = document.getElementsByClassName("status ng-binding");
        var duration = status[status.length - 1].innerHTML.trim();


        var descr = document.getElementsByClassName("description ng-binding")
        descr = descr[descr.length - 1].innerHTML;
        var timething = descr.trim().charAt(0).toLowerCase();
        if (duration == "Ended"){
            duration = "e";
            timething = ""
        }
        console.log(duration + " " + timething);
        var textfortitle = "(" + duration + timething + ")";
        document.title = textfortitle + document.title;
    }
});