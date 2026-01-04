// ==UserScript==
// @name         Konadown
// @namespace    https://konachan.com/
// @version      1.0
// @description  Alter Konachan download links so that they actually download the file instead of opening the file in chrome
// @author       kein
// @match        https://konachan.com/post/show/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/386604/Konadown.user.js
// @updateURL https://update.greasyfork.org/scripts/386604/Konadown.meta.js
// ==/UserScript==

$(function() {
    'use strict';
    let name, fName, link, submit, pause, elementExists;

    // First link, the PNG
    elementExists = document.getElementsByClassName("original-file-unchanged");
    if (elementExists.length != 0) {
        link = $(".original-file-unchanged").attr("href");
        for (let i = 0; i < link.length; i++) {
            name += link[i];
            if (link[i] == "/") {
                name = "";
            }
        }
        submit = "";
        fName = "";
        for (let i = 0; i < name.length; i++) {
            if (pause > 0) {
                pause--;
                continue;
            }
            submit = name[i];
            if (submit == "%") {
                pause = 2;
                if (name[i]+name[i+1]+name[i+2] == "%21") {
                    submit = "!";
                } else {
                    submit = " ";
                }
            }
            fName += submit;
        }
        $(".original-file-unchanged").attr("download", fName);
    } else {
        console.warn("Unchanged file does not exist");
    }


    // Second link, the JPG
    elementExists = document.getElementsByClassName("original-file-changed");
    if (elementExists.length != 0) {
        link = $(".original-file-changed").attr("href");
        for (let i = 0; i < link.length; i++) {
            name += link[i];
            if (link[i] == "/") {
                name = "";
            }
        }
        submit = "";
        fName = "";
        for (let i = 0; i < name.length; i++) {
            if (pause > 0) {
                pause--;
                continue;
            }
            submit = name[i];
            if (submit == "%") {
                pause = 2;
                if (name[i]+name[i+1]+name[i+2] == "%21") {
                    submit = "!";
                } else {
                    submit = " ";
                }
            }
            fName += submit;
        }

        $(".original-file-changed").attr("download", fName);
    } else {
        console.warn("Changed file does not exist");
    }
})();