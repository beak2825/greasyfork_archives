// ==UserScript==
// @name         HackForums SoundCloud HTML5
// @namespace    http://www.hackforums.net/member.php?action=profile&uid=2525478
// @version      0.3
// @description  Switches the embeded SoundCloud Flash object with the new HTML5 objects
// @author       TyrantKingBen
// @match        http://*.hackforums.net/showthread.php*
// @match        https://w.soundcloud.com/player/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11565/HackForums%20SoundCloud%20HTML5.user.js
// @updateURL https://update.greasyfork.org/scripts/11565/HackForums%20SoundCloud%20HTML5.meta.js
// ==/UserScript==

// SoundCloud HTML5 Element Theme
var overallColor = "#02FF0D";
var widgetBackgroundColor = "#3B0050";
var widgetBorder = "1px solid #BA45FF";
var progressBarBackgroundColor = "#00D9FF";
var titleColor1 = "#02FF0D";
var titleTextShadow1 = "0px 1px 0px rgba(5, 194, 194, 0.9)";
var titleColor2 = "#02FF0D";
var titleTextShadow2 = "0px 1px 0px rgba(5, 194, 194, 0.9)";
var playButtonStroke = "#065489";
var playButtonFill = "#06213A";
var logoColor = "#BA45FF";
var logoHoverColor = "#02FF0D";
var waveFormFilter = "grayscale(0%) contrast(188%)";
var timerCanvasFilter = "hue-rotate(270deg)";


var href = window.location.href; //Get current URL
if (href.indexOf("soundcloud") != -1 && href.indexOf("hackforums") != -1) { //Embedded SoundCloud HTML5 player
    setSoundCloudTheme();
} else { //HackForums thread
    var posts = document.getElementsByClassName("trow2 post_content ");
    for (i = 0; i < posts.length; i++) {
        var objects = posts[i].getElementsByTagName("object");
        for (j = 0; j < objects.length; j++) {
            if (objects[j].innerHTML.indexOf("soundcloud") != -1) {
                changeSoundCloud(objects[j]);
            }
        }
    }
}

function setSoundCloudTheme() {
    try {
        var widget = document.getElementById("widget");
        widget.className = "widget"; //Remove g-background-default g-shadow-inset
        widget.style.backgroundImage = "url()";
        widget.style.backgroundColor = widgetBackgroundColor;
        widget.style.border = widgetBorder;

        var progressBar = document.getElementsByClassName("singleSound g-box-full")[0].previousElementSibling;
        progressBar.className = progressBar.className.replace(" sc-background-orange", "");
        progressBar.style.backgroundColor = progressBarBackgroundColor;

        var cookiePolicy = document.getElementsByClassName("cookiePolicy sc-background-light")[0];
        if (cookiePolicy != null) {
            cookiePolicy.parentNode.removeChild(cookiePolicy);
            cookiePolicyRemoved = true;
        }

        document.getElementsByClassName("compactSound g-box-full")[0].className = "compactSound g-box-full"; //Remove g-background-default
        document.getElementsByClassName("compactSound g-box-full")[0].style.padding = "3px";
        document.getElementsByClassName("compactSound__artwork sc-media-left")[0].style.width = "73px";
        document.getElementsByClassName("compactSound__artwork sc-media-left")[0].style.height = "73px";
        document.getElementsByClassName("compactSound__header")[0].style.top = "-2px";
        document.getElementsByClassName("compactSound__waveform")[0].style.top = "45px";
        document.getElementsByClassName("playButton medium")[0].children[0].innerHTML = ".playButton .playButton__overlay { visibility: hidden; } .playButton:hover .playButton__overlay, .playButton:focus .playButton__overlay { visibility: visible; } .playButton:focus { outline: none; }";

        var playButton = document.getElementsByClassName("playButton__overlay")[0].previousElementSibling;
        playButton.setAttribute("stroke", playButtonStroke);
        playButton.setAttribute("fill", playButtonFill);

        var title = document.getElementsByClassName("title sc-truncate")[0];
        title.children[0].style.color = titleColor1;
        title.children[0].style.textShadow = titleTextShadow1;
        title.children[2].style.color = titleColor2;
        title.children[2].style.textShadow = titleTextShadow2;

        var logoCSS = document.getElementsByClassName("logo")[0].children[0];
        logoCSS.innerHTML = ".logo { display: inline-block; height: 22px; padding: 5px 0; } " + 
            ".logo__path { fill: " + logoColor + "; } .logo.inverse .logo__path { fill: #fff; } .logo.alt .logo__path { fill: #333; } " + 
            ".logo:hover .logo__path, .logo:focus .logo__path { fill: " + logoHoverColor + "; } " + 
            ".logo.state-small { width: 25px; overflow: hidden; }";

        var waveForm = document.getElementsByClassName("waveform loaded")[0];
        waveForm.style.webkitFilter = waveFormFilter;

        var likeButton = document.getElementsByClassName("soundHeader__actions g-transition-opacity")[0];
        likeButton.parentNode.removeChild(likeButton);
        
        var timerCanvas = document.getElementsByTagName("canvas")[1];
        timerCanvas.style.webkitFilter = timerCanvasFilter;
    } catch (error) {
        console.log(error);
        setTimeout(function() { setSoundCloudTheme(); }, 10);
    }
}

function changeSoundCloud(object) {
    var objectSrc = object.innerHTML.match(/src=\"(.+?)\"/)[1];
    var soundCloudUrl = objectSrc.match(/url=(.+?)&amp/)[1];

    var request;
    if (window.XMLHttpRequest) request = new XMLHttpRequest();
    else request = new ActiveXObject("Microsoft.XMLHTTP");
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            try {
                var page = request.responseText;
                var trackUri = page.match(/\"uri\":\"(.+?)\"/)[1];
                var iframe = document.createElement("iframe");
                iframe.width = "100%";
                iframe.height = "81px";
                iframe.scrolling = "no";
                iframe.frameBorder = "no";
                iframe.src = "https://w.soundcloud.com/player/?url=" + encodeURIComponent(trackUri) + "&amp;color=" + overallColor.replace("#", "") + "&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;origin=http%3A%2F%2Fhackforums.net";
                object.parentNode.insertBefore(iframe, object);
                object.parentNode.removeChild(object);
            } catch (error) {
                console.log(error);
            }
        }
    }

    request.open("GET", "http://schf.ga/sc.php?url=" + encodeURIComponent(soundCloudUrl), true);
    request.send(null);
}