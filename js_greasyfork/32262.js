// ==UserScript==
// @name         youtube Extend Button
// @version      0.1
// @description  Adds a Button to YouTube
// @author       MarissaChan
// @include      http*://*.youtube.com/*
// @include      http*://youtube.com/*
// @include      http*://*.youtu.be/*
// @include      http*://youtu.be/*
// @run-at       document-end
// @grant        MIT
// @namespace https://greasyfork.org/users/149000
// @downloadURL https://update.greasyfork.org/scripts/32262/youtube%20Extend%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/32262/youtube%20Extend%20Button.meta.js
// ==/UserScript==

function addExtendButton(){

    if (document.getElementById("watch8-secondary-actions") !== null && document.getElementById("watch8-secondary-actions").querySelector("#extendButton") === null){

        var extendButton = document.createElement("button");
        extendButton.setAttribute("id", "extendButton");
        extendButton.classList.add("yt-uix-button", "yt-uix-button-size-default", "yt-uix-button-opacity", "yt-uix-tooltip");
        var content = document.createElement("span");
        content.classList.add("yt-uix-button-content");
        content.innerHTML = "Extend";
        extendButton.appendChild(content);
        document.getElementById("watch8-secondary-actions").insertBefore(extendButton, document.getElementById("watch8-secondary-actions").children[2]);var url = window.location.href;
        var videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
        if(videoid !== null) {
            console.log("video id = ",videoid[1]);
            extendButton.addEventListener('click', function() {
                document.location.href = "https://www.youtube.com/embed/" + videoid[1];
            }, false);

        }
	}

}

setInterval(addExtendButton, 50);