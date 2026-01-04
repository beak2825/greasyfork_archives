// ==UserScript==
// @name HTML5 video using VLC plugin
// @grant none
// @include     *
// @version 0.0.1.20210525221320
// @namespace https://greasyfork.org/users/776190
// @description html video player using vlc
// @downloadURL https://update.greasyfork.org/scripts/427028/HTML5%20video%20using%20VLC%20plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/427028/HTML5%20video%20using%20VLC%20plugin.meta.js
// ==/UserScript==
function html5vlc(){
    var videos = document.getElementsByTagName("video"); 
    var embeds = new Array(videos.length);
    for (var i = 0; i < videos.length; i++) { 
        var vlc = document.createElement("embed"); 
        vlc.type = "application/x-vlc-plugin"; 
        if (videos[i].autoplay) {
            vlc.setAttribute("autoplay", videos[i].autoplay);
        } else {
            vlc.setAttribute("autoplay", "false");
        }
        if (videos[i].controls) {
            vlc.setAttribute("controls", "true");
        }
        if (videos[i].width) {
            vlc.width = videos[i].width; 
        }
        if (videos[i].height) {
            vlc.height = videos[i].height; 
        }
        vlc.setAttribute("target", videos[i].src); 
        var sources = videos[i].getElementsByTagName("source"); 
        for (var j = 0; j < sources.length; j++) { 
            vlc.setAttribute("target", sources[j].src); 
        } 
        let id = videos[i].getAttribute("id");
        if (id) {
            vlc.setAttribute("id", id);
        }
        let clas = videos[i].getAttribute("class");
        if (clas) {
            vlc.setAttribute("class", clas); 
        }
        embeds[i] = vlc;
    }
    for (var i = embeds.length-1; i >= 0; i--) {
        videos[i].parentNode.replaceChild(embeds[i], videos[i]);
    }
}

var retry = 0;

function wait(){
    if(retry++ > 100)   //adjust timeout and retry value for instable connection
        return;
    if(document.getElementsByTagName("video").length == 0 || document.getElementsByTagName("video")[0].src == "")
        setTimeout(wait,100);
    else    html5vlc();
}

if(window.location.href.indexOf("youtube.com") > -1)
    wait();
else html5vlc();