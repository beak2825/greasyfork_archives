// ==UserScript==
// @name         Danbooru: Notes display without mouse hover
// @namespace    dbmod.io
// @version      0.3.2
// @description  This script displays the contents of notes on Danbooru within the hover box so you don't have to hover over them to see anything.
// @author       FPX
// @match        https://danbooru.donmai.us/posts/*
// @match        http://danbooru.donmai.us/posts/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22740/Danbooru%3A%20Notes%20display%20without%20mouse%20hover.user.js
// @updateURL https://update.greasyfork.org/scripts/22740/Danbooru%3A%20Notes%20display%20without%20mouse%20hover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    function loadNotes() {
        var noteBodies = document.getElementsByClassName("note-body");
        var attempts = 0;
        while (noteBodies.length === 0) {
            noteBodies = document.getElementsByClassName("note-body");
            attempts++;
            if (attempts == 200) {
                break;
            }
        }
        var noteBoxes = document.getElementsByClassName("note-box");
        for (var i=0; i<noteBodies.length; i++) {
            var id = noteBodies[i].getAttribute("data-id");
            var width = noteBodies[i].style.minWidth;
            var data = noteBodies[i].innerHTML;
            for (var j=0; j<noteBoxes.length; j++) {
                var id2 = noteBoxes[j].getAttribute("data-id");
                if (id2 == id) {
                    noteBoxes[j].style.height = "auto";
                    noteBoxes[j].style.width = Math.max(noteBoxes[j].style.width, width);
                    noteBoxes[j].children[2].style.fontSize = "0.8em";
                    noteBoxes[j].children[2].style.wordWrap = "break-word";
                    noteBoxes[j].children[2].style.opacity = "1.0";
                    noteBoxes[j].children[2].style.background = "rgba(255, 255, 238, 0.875)";
                    noteBoxes[j].children[2].style.width = width;
                    noteBoxes[j].children[2].style.height = "auto";
                    noteBoxes[j].children[2].innerHTML = data/*.replace(/<[^>]*>/g, "")*/;
                }
            }
        }
    }
    setTimeout(loadNotes, 100);
})();