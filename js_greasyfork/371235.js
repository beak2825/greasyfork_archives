// ==UserScript==
// @name         YouTube Subtitle Preview
// @namespace    https://github.com/ayancey/YoutubeSubtitlePreview
// @version      0.2.1
// @description  Know if a video has subtitles before you click.
// @author       Alex Yancey
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371235/YouTube%20Subtitle%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/371235/YouTube%20Subtitle%20Preview.meta.js
// ==/UserScript==

// Replace this with your target language (ISO language code)
let TARGET_LANGUAGE = "en";

// Check if youtube videos in thumbnails have subtitles in target language. If they do, add a little indicator at the top left of the thumbnail.
function youtube_subtitle_check() {
    // Check for different thumbnail styles. This varies depending on if the user is on the old or new YouTube style.
    let thumbnail_types = [document.querySelectorAll("div.yt-lockup-thumbnail"), document.querySelectorAll("a.ytd-thumbnail"), document.querySelectorAll("a.thumb-link")];

    thumbnail_types.forEach(function (type) {

        // Get a list of all video thumbnails
        type.forEach(function (thumbnail) {
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
                    if (text.includes('lang_code="' + TARGET_LANGUAGE + '"') || text.includes('lang_code="' + TARGET_LANGUAGE + '-')) {
                        // Sorry, this is ugly. I'm not good with JavaScript.
                        let new_element = document.createElement("div");
                        new_element.style.backgroundColor = "white";
                        new_element.style.zIndex = "1000";
                        new_element.style.position = "absolute";
                        new_element.style.borderRadius = "8px";
                        new_element.style.boxShadow = "2px 1px 2px black";
                        new_element.style.padding = "2px";
                        new_element.style.textAlign = "center";
                        new_element.style.left = "2px";
                        new_element.style.top = "2px";
                        new_element.style.lineHeight = "normal";
                        new_element.style.fontFamily = "sans-serif";
                        new_element.style.fontSize = "8pt";
                        new_element.style.color = "black";
                        new_element.style.userSelect = "none";
                        new_element.innerHTML = TARGET_LANGUAGE.toUpperCase();
                        thumbnail.appendChild(new_element);
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