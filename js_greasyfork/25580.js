// ==UserScript==
// @name         BrMP3Converter YT Plug-in
// @namespace    http://brmp3converter.ml/
// @version      1.6
// @description  Adds a download button to YouTube videos which allows you to download the MP3 of the video without having to leave the page
// @author       Matheus M Caetano
// @include      http*://*.youtube.com/*
// @include      http*://youtube.com/*
// @include      http*://*.youtu.be/*
// @include      http*://youtu.be/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/25580/BrMP3Converter%20YT%20Plug-in.user.js
// @updateURL https://update.greasyfork.org/scripts/25580/BrMP3Converter%20YT%20Plug-in.meta.js
// ==/UserScript==
start();

function start() {
    var pagecontainer=document.getElementById('page-container');
    if (!pagecontainer) return;
    if (/^https?:\/\/www\.youtube.com\/watch\?/.test(window.location.href)) run();
    var isAjax=/class[\w\s"'-=]+spf\-link/.test(pagecontainer.innerHTML);
    var logocontainer=document.getElementById('logo-container');
    if (logocontainer && !isAjax) { // fix for blocked videos
        isAjax=(' '+logocontainer.className+' ').indexOf(' spf-link ')>=0;
    }
    var content=document.getElementById('content');
    if (isAjax && content) { // Ajax UI
        var mo=window.MutationObserver||window.WebKitMutationObserver;
        if(typeof mo!=='undefined') {
            var observer=new mo(function(mutations) {
                mutations.forEach(function(mutation) {
                    if(mutation.addedNodes!==null) {
                        for (var i=0; i<mutation.addedNodes.length; i++) {
                            if (mutation.addedNodes[i].id=='watch7-container' ||
                                mutation.addedNodes[i].id=='watch7-main-container') { // old value: movie_player
                                run();
                                break;
                            }
                        }
                    }
                });
            });
            observer.observe(content, {childList: true, subtree: true}); // old value: pagecontainer
        } else { // MutationObserver fallback for old browsers
            pagecontainer.addEventListener('DOMNodeInserted', onNodeInserted, false);
        }
    }
}

function onNodeInserted(e) {
    if (e && e.target && (e.target.id=='watch7-container' ||
                          e.target.id=='watch7-main-container')) { // old value: movie_player
        run();
    }
}

function finalButton(){

    var buttonIframeDownload = document.createElement("iframe");
    buttonIframeDownload.src = '//www.convertmp3.io/fetch/?video=https://www.youtube.com/watch?v=' + window.location.href;
    buttonIframeDownload.scrolling = "no";
    buttonIframeDownload.id = "buttonIframe";
    buttonIframeDownload.style = "width:100%;height:60px;padding-top:20px;padding-bottom:20px;";

    document.getElementById("watch-header").appendChild(buttonIframeDownload);

}

function run(){

    if(!document.getElementById("parentButton") && window.location.href.substring(0, 25).indexOf("youtube.com") > -1 && window.location.href.indexOf("watch?") > -1){

        var parentButton = document.createElement("div");

        parentButton.className = "yt-uix-button yt-uix-button-default";
        parentButton.id = "parentButton";
        parentButton.style = "height: 23px;margin-left: 28px;padding-bottom:1px;";

        parentButton.onclick = function () {

            this.style = "display:none";
            finalButton();

        };

        document.getElementById("watch7-user-header").appendChild(parentButton);

        var childButton = document.createElement("span");

        childButton.appendChild(document.createTextNode("DOWNLOAD MP3"));

        childButton.className = "yt-uix-button-content";
        childButton.style = "line-height: 25px;font-size: 12px;";

        parentButton.appendChild(childButton);

    }

}