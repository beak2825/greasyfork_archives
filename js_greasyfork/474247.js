// ==UserScript==
// @name         Video source link
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT 
// @description  Redirects to the video source when clicking on the button
// @author       You
// @match        http*://*/*
// @icon         https://www.google.com/s2/favicons?domain=earth.google.com/web/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474247/Video%20source%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/474247/Video%20source%20link.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    function runWhenReady(readySelector, callback) {
        var numAttempts = 0;
        var tryNow = function() {
            var elem = document.querySelector(readySelector);
            if (elem) {
                callback(elem);
            } else {
                numAttempts++;
                if (numAttempts >= 15) {
                    console.warn('Giving up after 15 attempts. Could not find: ' + readySelector);
                } else {
                    setTimeout(tryNow, 250 * Math.pow(1.1, numAttempts));
                }
            }
        };
        tryNow();
    }

    var getSrc = () => {
        let video = document.querySelector("video");
        let src = video.src ? video.src : video.childNodes[0]?.src
        console.log(src)
        if (src && document.location.href != src ) {
            return src
        }
        else {
            console.log("You need to click on the video so that the src loads")
        }
        return "NonValidLink"
    }

    runWhenReady ('video', async function (ele) {
        let btn = document.createElement("button");
        let anchor = document.createElement("a");
        btn.innerHTML = "Redirect";
        //btn.onclick = redirectToSrc;
        btn.style.position = "fixed"
        btn.style.zIndex = 2147483
        btn.style.inset = "70px auto auto 0px"
        btn.style.setProperty("background-color", "cyan", "important")
        btn.style.border = "none"
        btn.style.setProperty("border", "2px solid black", "important")
        btn.style.borderRadius = "10px"
        btn.style.setProperty("color", "black", "important")
        btn.style.setProperty("width", "clamp(50px, 80px, 120px)", "important")
        btn.style.height = "30px"
        await new Promise((r) => setTimeout(r, 1500))
        let src = getSrc()
        anchor.href = src
        anchor.appendChild(btn)
        // Only show button if it points to a meaningful link
        if (src.startsWith("http")) {
            document.body.appendChild(anchor)
        }
    })
})();
