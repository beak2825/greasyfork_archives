// ==UserScript==
// @name             XNXX Player Enlarger and Scroller
// @namespace   tuktuk3103@gmail.com
// @description   Enlarge player and scroll to it
// @include          *://*xnxx*.*/*
// @version          1.01
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/423453/XNXX%20Player%20Enlarger%20and%20Scroller.user.js
// @updateURL https://update.greasyfork.org/scripts/423453/XNXX%20Player%20Enlarger%20and%20Scroller.meta.js
// ==/UserScript==

(function scrollXNXX() {

    // Page modification without CSS
    window.addEventListener("DOMContentLoaded", function() {
        // More tiles in pages that had side ads
        if (document.querySelector(".mozaique:not(.thumbs-4)")) {
            document.querySelector(".mozaique:not(.thumbs-4)").className = "mozaique thumbs-4";
        }
        // Scroll to center video
        if (document.querySelector("body.video-page")) {
            document.querySelector("body.video-page #content").className = "player-enlarged";

            function scrollthere() {
                var vid = document.querySelector("#video-content"),
                    vh = vid.offsetHeight,
                    vd = vid.offsetTop,
                    fh = window.innerHeight,
                    sc = vd-((fh-vh)/2)
                console.log(vd)
                scrollTo(0, sc)
            }// Now inject this function
            var script = document.createElement("script")
            script.setAttribute("type","text/javascript")
            script.innerHTML = scrollthere.toString() + "scrollthere();"
            script.id = ("scrollVid")
            document.head.appendChild(script)
            // Include button in right corner to center video on screen
            var node = document.createElement("div");
            node.setAttribute("style","position: fixed;" +
                                      "bottom: 0;" +
                                      "right: 128px;" +
                                      "cursor: pointer;" +
                                      "border: 1px solid #313131;" +
                                      "border-top-left-radius: 5px;" +
                                      "color: #286fff;" +
                                      "font-weight: 700;" +
                                      "background: #101010;" +
                                      "text-align: center;" +
                                      "font-size: 12px;" +
                                      "padding: 7px 15px;" +
                                      "z-index: 999999;");
            node.setAttribute("onclick", "scrollthere();");
            node.setAttribute("title", "Click here to centre video");
            node.innerHTML = "Centre";
            node.id = "scroll";
            document.body.appendChild(node);
        }
    });
}());
