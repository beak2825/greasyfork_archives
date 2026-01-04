// ==UserScript==
// @name         Copy Video URL
// @namespace    https://greasyfork.org/en/users/689482-quin15
// @version      0.9
// @description  Copy Video URL of YouTube video
// @author       Quin15
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445018/Copy%20Video%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/445018/Copy%20Video%20URL.meta.js
// ==/UserScript==

(function() {

    setInterval(function() {
        if (window.location.href.indexOf("watch") < 0) {
            return false;
        }
        if (document.getElementById("meta-contents") && document.getElementById("copyVidID") === null) {
            AddYT();
        }
    }, 1);

    function AddYT() {
        var buttonDiv = document.createElement("span");
        buttonDiv.id = "copyVidID";
        buttonDiv.style = "width: 100%; margin-top: 3px; padding: 10px 0;"
        var addButton = document.createElement("a");
        addButton.appendChild(document.createTextNode("Copy ID"));
        addButton.style = 'width: 100%; margin: 3px; padding: 10px 22px; cursor: pointer; height: inherit; background-color: #393939; color: #fff; border-radius: 2px; font-size: 1.4rem; font-family: inherit; text-align: center';
        buttonDiv.appendChild(addButton);

        document.querySelector('#meta #subscribe-button.style-scope').appendChild(buttonDiv);

        document.getElementById("copyVidID").firstElementChild.onclick = function() {
            function YouTubeGetID(url){
                url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
                return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
            }
            var vidID = YouTubeGetID(window.location.href)
            navigator.clipboard.writeText(vidID);
        }
    }
})();