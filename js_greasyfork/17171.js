// ==UserScript==
// @name        Disable HTML5 Videos autoplay/autopreload
// @namespace   default
// @include     *
// @version     2.0
// @grant       none
// @description Prevent webbrowser from automatically playing/downloading HTML5 videos
// @downloadURL https://update.greasyfork.org/scripts/17171/Disable%20HTML5%20Videos%20autoplayautopreload.user.js
// @updateURL https://update.greasyfork.org/scripts/17171/Disable%20HTML5%20Videos%20autoplayautopreload.meta.js
// ==/UserScript==


document.addEventListener("DOMContentLoaded", function(e) {

    var disable_videos = function() {
        var videos = document.getElementsByTagName("video");

        if (document.readyState !== "interactive") {
            Array.forEach(videos, function(video) {
                if (!video.getAttribute("gm_processed")) return;
                //Now that document has completed loading, bring back video's original url
                video.setAttribute("src", video.getAttribute("gm_src"));
                video.pause();
                video.removeAttribute("gm_processed");
            });
            return;
        }
        setTimeout(disable_videos, 1000);

        Array.forEach(videos, function(video) {
            if (video.getAttribute("gm_processed")) return;
            var old_url = video.currentSrc;
            //Only process a video if it has "src" but not one starting with mediasource:
            if (old_url && (!old_url.startsWith("mediasource:"))) {
                console.log("GMoneky: disabling autoplay for ", video);
                video.removeAttribute("autoplay");
                video.removeAttribute("autobuffer");
                video.setAttribute("preload", "metadata");

                video.setAttribute("src", "about:blank");
                video.setAttribute("gm_src", old_url);
                video.setAttribute("gm_processed", true);
            }
        });
    };
    disable_videos();
});
