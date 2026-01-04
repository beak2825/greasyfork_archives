// ==UserScript==
// @name         Google disable safesearch
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Set off google safesearch
// @author       You
// @include      /^https\:\/\/[a-z]*\.(google)\.[a-z]*/search\?/
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/470173/Google%20disable%20safesearch.user.js
// @updateURL https://update.greasyfork.org/scripts/470173/Google%20disable%20safesearch.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var count = 0;
    window.addEventListener("load",function(){
        run();
    });

    function disableSafesearch() {
        var safeui = document.querySelector("g-menu-item a[aria-label][href*='setprefs?sig']");
        // new ui about may 2024
        var newsafeuiImage = document.querySelector("[data-sbu^='/setprefs']");
        var newsafeuiSearch = document.querySelector("div:has(>[href^='/safesearch']) div");

        if(safeui != null){
            if(safeui.href.match(/safeui=off$/) == null){
                window.location = safeui.href.replace(/safeui=(on|images)$/,"safeui=off");
                console.log("Google disable safesearch: done!");
            } else {
                console.log("Google disable safesearch: nothing to do!");
            }
        } else if (newsafeuiImage != null){
            if(newsafeuiImage.querySelector("[data-key='off'][selected='true']") == null) {
                if(newsafeuiImage.querySelector("[data-key='off']") != null){
                    //window.location = document.querySelector("[data-sbu^='/setprefs']").getAttribute("data-sbu") + "&safeui=off"
                    // document.querySelector("div:has(>[href^='/safesearch']) div").querySelector("span:last-child").innerText != "Off"
                    newsafeuiImage.querySelector("[data-key='off']").click();
                    console.log("Google disable safesearch: done!");
                }
            } else {
                console.log("Google disable safesearch: nothing to do!");
            }
        } else if (newsafeuiSearch != null) { // data-setprefs-off-url
            if (document.querySelector("div:has(>[href^='/safesearch']) div").querySelector("span:last-child").innerText != "Off") {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", "https://www.google.com/safesearch");
                xhr.send();
                xhr.responseType = "text"
                //xhr.responseType = "document";
                //xhr.overrideMimeType = "text/xml";
                xhr.onload = () => {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        xhr.open("GET", xhr.responseText.match("data-setprefs-off-url=\"([^\"]*)\"")[1].replaceAll("amp;",""));
                        xhr.send();
                        xhr.responseType = "html";
                        xhr.onload = () => {
                            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 204)) {
                                window.location = window.location;
                                console.log("Google disable safesearch: done!");
                            } else {
                                console.log(`Google disable safesearch: Failed error ${xhr.status}`);
                            }
                        };
                    } else {
                        console.log(`Google disable safesearch: Failed error ${xhr.status}`);
                    }
                };
            } else {
                console.log("Google disable safesearch: nothing to do!");
            }
        } else {
            safeui = document.querySelector("g-menu-item a[href*='setprefs?sig'][href$='safeui=off']");
            if(safeui != null) {
                window.location = safeui.href;
                console.log("Google disable safesearch: done!");
            } else {
                if(document.querySelector("g-menu-item a[href*='setprefs?sig'][href$='safeui=on']") != null){
                    console.log("Google disable safesearch: nothing to do!");
                } else {
                    console.log(document.querySelector("g-menu-item a[href*='setprefs?sig']"));
                    console.log("Google disable safesearch: failed!");
                }
            }
        }
    }

    function run(){
        //only few pages have safesearch settings menu
        if(document.URL.includes("tbm") == false || document.URL.match(/tbm=(isch|vid|nws)/) != null){
            if(document.querySelector("g-menu-item a[href*='setprefs?sig']") == null &&
               // new ui may 2024
               document.querySelector("[data-sbu^='/setprefs']") == null && document.querySelector("div:has(>[href^='/safesearch']) div") == null){
                //wait until safesearch settings menu exist
                window.setTimeout(function (){
                    run();
                },50);
                count += 1;
                if(count > 10){
                    console.log("Google disable safesearch: too fast!");
                    count = 0;
                }
            } else {
                disableSafesearch();
            }
        } else {
            console.log("Google disable safesearch: no safesearch page!");
        }
    }

})();