// ==UserScript==
// @name         Youtube Shorts channel name
// @namespace    https://github.com/jab442/Tampermonkey-Youtube-Shorts-Name
// @version      0.2.5
// @description  Add Channel name to Youtube shorts
// @author       You
// @match        https://www.youtube.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469853/Youtube%20Shorts%20channel%20name.user.js
// @updateURL https://update.greasyfork.org/scripts/469853/Youtube%20Shorts%20channel%20name.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let videos;
    let intervalYtLogo;

    let intervalId = setInterval(function(){
        let videos = document.querySelectorAll(".ytd-rich-grid-slim-media #thumbnail:not(.processed)");
        for(let video of videos){
            video.classList.add("processed");
            makeRequest(video);
        }
    }, 1000);

    function makeRequest(video) {
        let href = video.getAttribute("href");
        var ancestor = $(video).closest("#content");
        var descendant = ancestor.find(".inline-metadata-item");
        const youtubeURL = "https://www.youtube.com" + href;

        GM_xmlhttpRequest({
            method: 'GET',
            url: youtubeURL,
            onload: function(response) {
                var data = response.responseText;
                var match = data.match(/\/@([^\?""]*)/);
                if (match && match[1]) {
                    var result = match[1];
                    descendant.siblings(".tampermonkey").remove();
                    const html=
                          `<div class="tampermonkey" style="padding-left:10px">
                          <a href="https://www.youtube.com/@${result}" style="text-decoration: none; color: #aaa;"
                          onmouseover="this.style.color='#f1f1f1';"
                          onmouseout="this.style.color='#aaa';">
                          ${result}
                          </a>
                          </div>`
                    descendant.after(html);
                } else {
                    console.log("Pattern not found in the response data.");
                }
            }
        });
    }
    $(".ytd-logo").click(()=>{
        clearInterval(intervalId);
        clearInterval(intervalYtLogo);
        intervalYtLogo=setInterval(()=>{
            $(".processed").removeClass("processed");
            let videos = document.querySelectorAll(".ytd-rich-grid-slim-media #thumbnail");
            for (let video of videos) {
             makeRequest(video);
        }
        },1000)
    });
})();
