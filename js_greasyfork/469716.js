// ==UserScript==
// @name         Redgifs source
// @description  Redirects redgifs link to its source video
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Redgifs source
// @author       John
// @match        https://*.redgifs.com/*
// @match        https://gfycat.com/*
// @include      /https?://.*gifv.*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at     document-start
// @downloadURL https://update.greasyfork.org/scripts/469716/Redgifs%20source.user.js
// @updateURL https://update.greasyfork.org/scripts/469716/Redgifs%20source.meta.js
// ==/UserScript==

var interval = undefined;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function openInNewTab(url) {
    window.open(url, '_blank').focus();
}
function navigate(currentDoc, path) {
    if (interval != undefined) {
        clearInterval(interval);
    }
    if (navigated) {
        console.log("Already navigated");
        return;
    }
    navigated = true;
    console.log("orig path:", path);
    var player = getPlayer();
    if (window.location.href.indexOf("redgifs") > -1) {
        //path = path.replace("-mobile", "");
    }
    if (player && player.src.indexOf("expires") > -1) {
        // path = path.replace("thumbs4.redgifs", "thumbs2.redgifs");
        // path = path.replace("thumbs4.redgifs", "thumbs3.redgifs");
    }
    console.log("Navigating to:", path);
    if (path == "") {
        console.log("Cannot navigate!")
    } else {
    // currentDoc.location = path;
        window.location = path;
    }
    //openInNewTab(path);
}

function getPlayer() {
    try {
        var qualityButton = document.getElementsByClassName("gif-quality")[0];
        // console.log("quality button:", qualityButton);
        if (qualityButton.classList.contains("sd")) {
            qualityButton.click();
            window.location.reload();
            return;
        }
        var playerVideo;
        var playerVideoClass;
        if (window.location.href.indexOf("redgifs") > -1) {
            console.log("redgifs!", document);
            // playerVideoClass = "player-video";
            playerVideoClass = "videoWrapper";
            // console.log("redgifs:", document.getElementsByClassName(playerVideoClass)[0].getElementsByTagName("video"));
            playerVideo = document.getElementsByClassName(playerVideoClass)[0].getElementsByTagName("video")[0];
        } else if (window.location.href.indexOf("gfycat") > -1) {
            playerVideoClass = "video media";
            playerVideo = document.getElementsByClassName(playerVideoClass)[0].getElementsByTagName("source")[0];
        } else if (window.location.href.indexOf("gifv") > -1) {
            playerVideo = document.getElementsByTagName("video")[0].getElementsByTagName("source")[0];
        }
        console.log("Player video:", playerVideo);
        return playerVideo;
    } catch (error) {
        // console.log("Not ready yet?", error);
        return undefined;
    }
}

var navigated = false;
document.onkeyup = function (e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if(code == 13) { //Enter keycode
        console.log("Key press enter");
        var player = getPlayer();
        if (player != undefined) {
            tryNavigate();
        }
    }
};

function getMeta(metaName) {
    const metas = document.getElementsByTagName('meta');
    console.log("metas:", metas)

    for (let i = 0; i < metas.length; i++) {
        console.log(metas[i].getAttribute('property'))
        if (metas[i].getAttribute('property') === metaName) {
            return metas[i].getAttribute('content');
        }
    }
    return '';
}  

function tryNavigate() {
    var player = getPlayer();
    if (player != undefined) {
        var srcPath = player.src || player.currentSrc;
        // if (window.location.href.indexOf("redgifs") > -1) {
        //     srcPath = getMeta("og:video");
        // }
        navigate(document, srcPath);
        return true;
    }
    return false;
}

function start() {
    if (window.location.href.indexOf("redgifs") > -1 && 
        window.location.href.indexOf("watch") <= -1) {
        interval = setInterval(function(){
            var player = getPlayer();
            if (player != undefined) {
                console.log("player:", player);
                // var newHeight = document.body.clientHeight * 0.75;
                var newHeight = 700;
                console.log("New height:", newHeight);
                if (player.parentElement.parentElement.parentElement.clientHeight > newHeight) {
                    player.parentElement.parentElement.parentElement.style = `height: ${newHeight}px` 
                }
                clearInterval(interval);
            }
        }, 1000);
        return;
    }
    if (!tryNavigate()) {
        interval = setInterval(function(){
            if (!tryNavigate()) {
                console.log("Waiting for players");
            }
        }, 1000);
    }
}

window.addEventListener('load', function() {
    console.log("Window loaded: redgifs");
    setTimeout(function() {
        start();
    }, 1500);
}, false);