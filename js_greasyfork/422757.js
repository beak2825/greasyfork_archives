// ==UserScript==
// @name YouTube Downloader
// @description Download YouTube videos
// @author Micr00
// @match *://*.youtube.com/*
// @include https://workbench.qr1hi.arvadosapi.com/*
// @icon https://i.imgur.com/9P0rNed.png
// @version 1.0.0.2
// @namespace https://greasyfork.org/users/744083
// @downloadURL https://update.greasyfork.org/scripts/422757/YouTube%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/422757/YouTube%20Downloader.meta.js
// ==/UserScript==

(function() {
    if (document.getElementById("micr00-app") || document.getElementById("masthead") || window.Micr00) {
    setInterval(function() {
        if (window.location.href.indexOf("watch?v=") < 0) {
            return false;
        }
        if (document.getElementById("meta-contents") && document.getElementById("download") === null) {
            AddDownload();
        }
    }, 100);
}

function AddDownload() {
    var url = encodeURIComponent(location.href).replace('https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D','');
    var buttonDiv = document.createElement("span");
    buttonDiv.id = "download";
    buttonDiv.style.width = "100%";
    buttonDiv.style.marginTop = "3px";
    buttonDiv.style.marginLeft = "4px";
    buttonDiv.style.padding = "12px 0";
    var addButton = document.createElement("a");
    addButton.appendChild(document.createTextNode("DOWNLOAD"));
    addButton.style.width = "100%";
    addButton.style.height = "inherit";
    addButton.style.backgroundColor = "#0059FF";
    addButton.style.color = "#ffffff";
    if (document.documentElement.outerHTML.includes('<yt-formatted-string class="style-scope ytd-subscribe-button-renderer">Subscribed</yt-formatted-string>')) {
       addButton.style.padding = "10px 19px";
    } else {
       addButton.style.padding = "10px 15px";
    }
    addButton.style.borderRadius = "2px";
    addButton.style.fontSize = "1.4rem";
    addButton.style.fontFamily = "inherit";
    addButton.style.textAlign = "center";
    addButton.style.textDecoration = "none";
    addButton.href = "//y2mate.com/youtube/" + url
    addButton.target = "_blank";
    buttonDiv.appendChild(addButton);

    var targetElement = document.querySelectorAll("[id='subscribe-button']");
    if(targetElement){
      for(var i = 0; i < targetElement.length; i++){
        if(targetElement[i].className.indexOf("ytd-video-secondary-info-renderer") > -1){
            targetElement[i].appendChild(buttonDiv);
        }
      }
    }
}
})();