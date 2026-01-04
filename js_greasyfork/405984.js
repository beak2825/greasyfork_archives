// ==UserScript==
// @name         Youtube Mp3-Mp4 etc. Downloader, By RetroX
// @namespace    http://tampermonkey.net/
// @version      V1.02
// @author       RetroX
// @match *://*.youtube.com/*
// @grant        none
// @description just a youtube mp3 mp4 etc. downloader enjoy it.
// @downloadURL https://update.greasyfork.org/scripts/405984/Youtube%20Mp3-Mp4%20etc%20Downloader%2C%20By%20RetroX.user.js
// @updateURL https://update.greasyfork.org/scripts/405984/Youtube%20Mp3-Mp4%20etc%20Downloader%2C%20By%20RetroX.meta.js
// ==/UserScript==
//  Яetro✖ Presents- Enjoy.

(function() {
    if (document.getElementById("polymerz-app") || document.getElementById("masthead") || window.Polymerz) {
    setInterval(function() {
        if (window.location.href.indexOf("watch?v=") < 0) {
            return false;
        }
        if (document.getElementById("meta-contents") && document.getElementById("punisherz") === null) {
            Addytpolymerz();
        }
    }, 100);

    setElement = function(url) {
       var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
       var match = String(url).match(regExp);
       return (match&&match[7].length==11)? match[7]: false;
    };

} else {

    setInterval(function() {
        if (window.location.href.indexOf("watch?v=") < 0) {
            return false;
        }
        if (document.getElementById("watch8-sentiment-actions") && document.getElementById("punisherz") === null) {
            AddhtmlDV();
        }
    }, 100);

    setElement = function(url) {
       var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
       var match = String(url).match(regExp);
       return (match&&match[7].length==11)? match[7]: false;
    };
}

function AddhtmlDV() {
    if (document.getElementById("watch8-sentiment-actions")) {
        var wrap = document.getElementById('watch8-sentiment-actions');
        var button = "<div id='punisherz' style='display: inline-block; margin-left: 5px; vertical-align: middle;'>";
        button += "<a href=\"//y2mate.com/youtube-mp3/" + encodeURIComponent(setElement(window.location)) + "\" target=\"_blank\"" + "style=\"display: inline-block; font-size: inherit; height: inherit; border: 1px solid rgb(226, 226, 226); border-radius: 3px; padding-left: 28px; cursor: pointer; vertical-align: middle; position: relative; line-height: 22px; text-decoration: none; z-index: 1; color: rgb(226, 226, 226);\">";
        button += "<i style=\"position: absolute; display: inline-block; left: 6px; top: 3px; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA3UlEQVR42mNgoDX4//+/PhBHA7EnEHOSolEAiLf8RwL//v17DqRcCWkyBmJ2oOJN/7GDr0Csik2zG1DTZySb8IFJ2Aw4+594cASIGZE18wDxEzT/vgZSd0EYysZmiCBIsyMQv8CioAaIl0JxDQ6XLAAZ8B6HZDvIIVDcjk0B0GWfGKAKyDXgC8iAh2iCF4DUCSAuQDKgACp2EU3tclj0fUESBMV/ChAfQjIAxE5BSxvngVgMFgvSQJwKxIVQ2/SRFUPZ+lD5PCD2AWIWQkmZE2rzQZLyAJakLUDT3AoALzJfljL5Yb4AAAAASUVORK5CYII=); background-size: 12px; background-repeat: no-repeat; background-position: center center; width: 16px; height: 16px;\"></i>";
        button += "<span style=\"padding-right: 12px;\">Mp3-Mp4</span></a></div>";
        var style = "<style>#punisherz button: -moz-focus-inner {padding: 0; margin:0} #punisherz a {background-color: #1A1616} #punisherz a:hover {background-color: #1A1616} #punisherz a:active {background-color: #1A1616}</style>";
        var tmp = wrap.innerHTML;
        wrap.innerHTML = tmp + button + style;
    }
}

function Addytpolymerz() {
    var buttonDiv = document.createElement("span");
    buttonDiv.id = "punisherz";
    buttonDiv.style.width = "100%";
    buttonDiv.style.marginTop = "3px";
    buttonDiv.style.padding = "12px 0";
    var addButton = document.createElement("a");
    addButton.appendChild(document.createTextNode("Mp3-Mp4"));
    addButton.style.width = "100%";
    addButton.style.cursor = "hand";
    addButton.style.height = "inherit";
    addButton.style.backgroundColor = "#CC0000";
    addButton.style.color = "#ffffff";
    addButton.style.padding = "10px 22px";
    addButton.style.margin = "0px 0px";
    addButton.style.border = "0";
    addButton.style.borderRadius = "2px";
    addButton.style.fontSize = "1.4rem";
    addButton.style.fontFamily = "inherit";
    addButton.style.textAlign = "center";
    addButton.style.textDecoration = "none";
    addButton.href = "//y2mate.com/youtube-mp3/" + encodeURIComponent(setElement(window.location));
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