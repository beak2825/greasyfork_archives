// ==UserScript==
// @name         YouTube Subtitle Preview Plus
// @namespace    https://github.com/hjie/YouTube-Subtitle-Preview-Plus
// @version      0.0.1
// @description  to check subtitle when you search
// @author       hjie
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389388/YouTube%20Subtitle%20Preview%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/389388/YouTube%20Subtitle%20Preview%20Plus.meta.js
// ==/UserScript==

// Replace this with your target language (ISO language code)
const TARGET_LANGUAGE = ["en", "zh"];

// Check if youtube videos in thumbnails have subtitles in target language. If they do, add a little indicator at the top left of the thumbnail.
function youtube_subtitle_check() {
    // Check for different thumbnail styles. This varies depending on if the user is on the old or new YouTube style.
    //let thumbnail_types = [document.querySelectorAll("div.yt-lockup-thumbnail"), document.querySelectorAll("a.ytd-thumbnail"), document.querySelectorAll("a.thumb-link")];
    let thumbnail_types = [document.querySelectorAll("a.ytd-thumbnail")];

    thumbnail_types.forEach(function (type) {



        // Get a list of all video thumbnails
        type.forEach(function (thumbnail) {
            if(!thumbnail.hasAttribute("href")){
                return false;
            }

            // Get YT video id for testing
            let video_id = "";
            if (thumbnail.hasAttribute("href")) {
                video_id = thumbnail.getAttribute("href").split("/watch?v=")[1].split("&")[0];
            } else {
                video_id = thumbnail.querySelector("a").getAttribute("href").split("/watch?v=")[1].split("&")[0];
            }

            // Make sure we only check once
            if (thumbnail.getAttribute("subtitle_tested") == "true") {
                return;
            }
            thumbnail.setAttribute("subtitle_tested", "true");

            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    let text = xhttp.responseText;

                    for (let i = 0; i < TARGET_LANGUAGE.length; i++) {
                        let lang = TARGET_LANGUAGE[i];


                        if (text.includes('lang_code="' + lang + '"') || text.includes('lang_code="' + lang + '-')) {
                            let left_pos = i * 20;
                            // Sorry, this is ugly. I'm not good with JavaScript.
                            let new_element = document.createElement("span");
                            new_element.style.backgroundColor = "white";
                            new_element.style.zIndex = "1000";
                            new_element.style.position = "absolute";
                            new_element.style.borderRadius = "8px";
                            new_element.style.boxShadow = "2px 1px 2px black";
                            new_element.style.padding = "2px";
                            new_element.style.textAlign = "center";
                            new_element.style.left = left_pos + "px";
                            new_element.style.top = "2px";
                            new_element.style.lineHeight = "normal";
                            new_element.style.fontFamily = "sans-serif";
                            new_element.style.fontSize = "8pt";
                            new_element.style.color = "black";
                            new_element.style.userSelect = "none";
                            new_element.innerHTML = lang.toUpperCase();
                            thumbnail.appendChild(new_element);
                        }
                    }
                }
            };
            xhttp.open("GET", "https://video.google.com/timedtext?type=list&v=" + video_id, true);
            xhttp.send();
        });

    });


}

// Run on page load and every 3 seconds
youtube_subtitle_check();
setInterval(youtube_subtitle_check, 3000);
