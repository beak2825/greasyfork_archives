// ==UserScript==
// @name         YouTube Homie Videos
// @namespace    https://github.com/ayancey/YoutubeHomies
// @version      0.1.2
// @description  Know which vids your buds want to watch
// @author       Alex Yancey
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428866/YouTube%20Homie%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/428866/YouTube%20Homie%20Videos.meta.js
// ==/UserScript==

function addStyle(styleString) {
    const style = document.createElement('style');
    style.textContent = styleString;
    document.head.append(style);
}

var popup = false;

// Check if youtube videos in thumbnails have subtitles in target language. If they do, add a little indicator at the top left of the thumbnail.
function youtube_homie_check() {

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let text = xhttp.responseText;
            let videos = JSON.parse(text).videos;
            console.log(JSON.parse(text));

            videos.forEach(v => {
                if (window.location.href.includes(v)) {
                    if (!popup) {
                        alert("Your boys want to watch this video with you!");
                        popup = true;
                    }
                }
            });
            
            // Get a list of all video thumbnails
            document.querySelectorAll("ytd-thumbnail").forEach(function (thumbnail) {
                // Get YT video id for testing
                let video_id = "";
                if (thumbnail.hasAttribute("href")) {
                    video_id = thumbnail.getAttribute("href").split("/watch?v=")[1].split("&")[0];
                } else {
                    video_id = thumbnail.querySelector("a").getAttribute("href").split("/watch?v=")[1].split("&")[0];
                }

                if (videos.includes(video_id)) {
                    //thumbnail.style.border = "thick solid #0000FF";
                    thumbnail.classList.add("rainbow-box");
                }
            });


        }
    };
    xhttp.open("GET", "https://2rh72v0jzh.execute-api.us-west-2.amazonaws.com/videos", true);
    xhttp.send();
}


addStyle(`
.rainbow-box {
  border: 5px solid transparent;
  border-image: linear-gradient(to bottom right, #b827fc 0%, #2c90fc 25%, #b8fd33 50%, #fec837 75%, #fd1892 100%);
  border-image-slice: 1;
}
`);

function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

docReady(youtube_homie_check);
setTimeout(youtube_homie_check, 1000);
setInterval(youtube_homie_check, 10000);
