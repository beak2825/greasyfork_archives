// ==UserScript==
// @name YouTube™ MP4&MP3 Downloader v1.2 by 1Soul
// @author 1Soul
// @description Hi This is my first time ever creating a userscript for TamperMonkey and I have specifically decided to make a youtube mp3 and mp4 downloader and wanted to share it with you all. Hope you enjoy using my first script!
// @version 1.2
// @date 2022-04-04
// @icon https://i.imgur.com/xh1G8SK.png
// @compatible chrome
// @compatible firefox
// @compatible opera
// @compatible safari
// @compatible edge
// @license CC-BY-NC-ND-4.0
// @match *://*.youtube.com/*
// @namespace https://greasyfork.org/users/897854
// @downloadURL https://update.greasyfork.org/scripts/442779/YouTube%E2%84%A2%20MP4MP3%20Downloader%20v12%20by%201Soul.user.js
// @updateURL https://update.greasyfork.org/scripts/442779/YouTube%E2%84%A2%20MP4MP3%20Downloader%20v12%20by%201Soul.meta.js
// ==/UserScript==

(function() {
    if (document.getElementById("browser-app") || document.getElementById("masthead") || window.Polymer) {
    setInterval(function() {
        if (window.location.href.indexOf("watch?v=") < 0) {
            return false;
        }
        if (document.getElementById("meta-contents") && document.getElementById("punisherx1") === null) {
            AddYT();
        }
    }, 1);

    setElement = function(url) {
       var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
       var match = String(url).match(regExp);
       return (match&&match[7].length==11)? match[7]: false;
    };
}

function AddYT() {
    var buttonDiv = document.createElement("span");
    buttonDiv.id = "punisherx1";
    buttonDiv.style.width = "100%";
    buttonDiv.style.marginTop = "6px";
    buttonDiv.style.padding = "10px 0";
    var addButton = document.createElement("a");
    addButton.appendChild(document.createTextNode("DOWNLOAD MP4"));
    addButton.style.width = "100%";
    addButton.style.cursor = "pointer";
    addButton.style.height = "inherit";
    addButton.style.backgroundColor = "#454545";
    addButton.style.color = "#ffffff";
    addButton.style.padding = "10px 22px";
    addButton.style.margin = "0px 0px";
    addButton.style.border = "0.4";
    addButton.style.borderRadius = "1px";
    addButton.style.fontSize = "1.4rem";
    addButton.style.fontFamily = "inherit";
    addButton.style.textAlign = "center";
    addButton.style.textDecoration = "none";
    addButton.href = "//yts1.net/youtube-to-mp4/en?q=https://www.youtube.com/watch?v=" + encodeURIComponent(setElement(window.location));
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
    var descriptionBox1 = document.querySelectorAll("ytd-video-secondary-info-renderer");
    if(descriptionBox1[0].className.indexOf("loading") > -1){
        descriptionBox1[0].classList.remove("loading");
    }
}
})();

// ==UserScript==
// @name YouTube™ MP3 Downloader v1.0 by 1Soul
// @author 1Soul
// @version 1.0
// @date 2022-04-04
// @icon https://i.imgur.com/xh1G8SK.png
// @compatible chrome
// @compatible firefox
// @compatible opera
// @compatible safari
// @compatible edge
// @antifeature referral-link
// @license CC-BY-NC-ND-4.0
// @match *://*.youtube.com/*
// ==/UserScript==

(function() {
    if (document.getElementById("browser-app") || document.getElementById("masthead") || window.Polymer) {
    setInterval(function() {
        if (window.location.href.indexOf("watch?v=") < 0) {
            return false;
        }
        if (document.getElementById("meta-contents") && document.getElementById("punisherx") === null) {
            AddYT();
        }
    }, 1);

    setElement = function(url) {
       var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
       var match = String(url).match(regExp);
       return (match&&match[7].length==11)? match[7]: false;
    };
}

function AddYT() {
    var buttonDiv = document.createElement("span");
    buttonDiv.id = "punisherx";
    buttonDiv.style.width = "100%";
    buttonDiv.style.marginTop = "4px";
    buttonDiv.style.padding = "10px 0";
    var addButton = document.createElement("a");
    addButton.appendChild(document.createTextNode("DOWNLOAD MP3"));
    addButton.style.width = "100%";
    addButton.style.cursor = "pointer";
    addButton.style.height = "inherit";
    addButton.style.backgroundColor = "#454545";
    addButton.style.color = "#ffffff";
    addButton.style.padding = "10px 22px";
    addButton.style.margin = "0px 0px";
    addButton.style.border = "0.4";
    addButton.style.borderRadius = "1px";
    addButton.style.fontSize = "1.4rem";
    addButton.style.fontFamily = "inherit";
    addButton.style.textAlign = "center";
    addButton.style.textDecoration = "none";
    addButton.href = "//yts1.net/youtube-to-mp3/en?q=https://www.youtube.com/watch?v=" + encodeURIComponent(setElement(window.location));
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
    var descriptionBox = document.querySelectorAll("ytd-video-secondary-info-renderer");
    if(descriptionBox[0].className.indexOf("loading") > -1){
        descriptionBox[0].classList.remove("loading");
    }
}
})();

