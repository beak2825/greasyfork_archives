// ==UserScript==
// @name         PDF Drive direct download
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  to skip the annoying wait before download.
// @author       Kiwi Poon
// @match        *://www.pdfdrive.com/*.html
// @match        *://pdfdrive.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389634/PDF%20Drive%20direct%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/389634/PDF%20Drive%20direct%20download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get current url:
    console.log("Current URL: " + window.location.href);
    let url = window.location.href;

    // Check the url whether in download page current.
    if(url.match(/d[0-9]{3,11}.html/g)){

        console.log("This is a download page");
        // to show the download link
        document.getElementById("alternatives").style.display = "";
        document.getElementById("alternatives").style.textalign = "left";

        // hide the timer
        document.getElementById("broken").style.display = "none";

    // if the url isn't download page
    }else if(url.match(/e[0-9]{3,11}.html/g)){
        console.log("This is not a download page");

        // click the button automatically
        document.getElementById("download-button-link").click();
    }







})();