// ==UserScript==
// @name         Kaz stream server switcher
// @namespace    
// @version      1.5
// @description  Switches the video to stream directly from the 1-edge4-us-east video server.
// @author       AMKitsune
// @match        https://picarto.tv/Kazerad
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/423362/Kaz%20stream%20server%20switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/423362/Kaz%20stream%20server%20switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function(){
        setTimeout(function(){
            console.log("running stream server switcher");
            var tempButton = document.createElement("button");
            tempButton.onclick = switchServer;
            tempButton.innerText = "switch to direct server feed";
            tempButton.style.color = "black";
            document.querySelector(".FlexRow-sc-1j9kiqj-0.rUiVW").appendChild(tempButton);
        },10000);
    }

    function switchServer(){
        var newVideo = document.createElement("video");
        newVideo.src = "https://1-edge4-us-east.picarto.tv/stream/golive%2bKazerad.mp4";
        newVideo.controls = true;
        newVideo.style.width = "100%";
        newVideo.style.maxHeight = "78vh";
        newVideo.style.margin = "auto";
        newVideo.style.display = "block";
        document.querySelector(".video-container-wrapper").replaceWith(newVideo);
    }
})();