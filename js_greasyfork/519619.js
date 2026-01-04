// ==UserScript==
// @name         Yet Another Redgifs Downloader (YARD)
// @namespace    http://tampermonkey.net/
// @version      0.1.1.2
// @description  adds a button to the top-left corner that downloads redgifs videos as mp4.
// @author       Starcalledd
// @match        http*://*.redgifs.com/*
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519619/Yet%20Another%20Redgifs%20Downloader%20%28YARD%29.user.js
// @updateURL https://update.greasyfork.org/scripts/519619/Yet%20Another%20Redgifs%20Downloader%20%28YARD%29.meta.js
// ==/UserScript==


// big disclaimer, i have no fucking clue what im doing and any actual programmer reading this will likely have an aneurysm.
(function() {
    'use strict';

    // makes a button in the top left. blatantly copied this specific portion from someone else but it's so generic i don't think i'm getting sued over it.
    var button = document.createElement("button");
    button.innerHTML = "Download Video";
    button.style.position = "fixed";
    button.style.top = "10px";
    button.style.left = "10px";
    button.style.zIndex = 1000;


    // makes the button do something. you know, so you can use it.
    button.onclick = function(){

        // this is awful. i hate this. do not give me access to regex under any circumstances.
        // reads the page's source code and finds all strings matching the format of:
        // files.redgifs.com/VeryCoolVideo-mobile.jpg
        // there are usually two.
        var pageSource = document.body.innerHTML
        var shitREGEX = /(media\.redgifs\.com\/\w*-mobile\.jpg)/
        console.log(shitREGEX);
        var regMatch = shitREGEX.exec(pageSource).toString();
        // alert(regMatch);
        console.log(regMatch);

        // utterly and completely fucked. there is an easier way to do this. i do not care.
        // takes the output from the previous section and isolates the video ID
        // in the example earlier, the ID would be VeryCoolVideo
        let step1 = regMatch.split(".");
        let step2 = step1[2].split("/");
        let step3 = step2[1].split("-");
        var videoID = step3[0].toString();
        console.log(videoID);
        // alert(videoID);

        if (url = null) {
            alert("something went wrong and the url came back as NULL. report it on the Greasyfork/Sleazyfork page.");
        };

        // grabs the direct link to the video you're watching.
        var url = `https://media.redgifs.com/${videoID}.mp4`
        // GM_download(url, `${videoID}.mp4`)       || wasn't FUCKING WORKING so i changed to GM_openInTab.
        GM_openInTab(url);

        console.log("HEYA");
    };

    document.body.appendChild(button); // actually add the button to page. you know, so you can use it.
    console.log("BUTTON = BUTTONED");

})();