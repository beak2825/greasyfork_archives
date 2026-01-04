// ==UserScript==
// @name            Crunchyroll: Resize Player To Window Size for CR HLS Player
// @description     Moves the video to the top of the website and resizes it to the screen size.
// @author          Chris H (Zren / Shade), Ran Cossack
// @icon            http://crunchyroll.com/favicon.ico
// @namespace       http://rancossack.com
// @version         1.2
// @include         http*://*.crunchyroll.c*/*
// @include         http*://crunchyroll.c*/*
// @downloadURL https://update.greasyfork.org/scripts/32054/Crunchyroll%3A%20Resize%20Player%20To%20Window%20Size%20for%20CR%20HLS%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/32054/Crunchyroll%3A%20Resize%20Player%20To%20Window%20Size%20for%20CR%20HLS%20Player.meta.js
// ==/UserScript==
(function() {
  setTimeout(function(){
    // Can't use !important with javascript element.style.___ so we need to inject CSS.
    // http://stackoverflow.com/a/462603/947742
    function addNewStyle(newStyle) {
        var styleElement = document.getElementById('styles_js');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.type = 'text/css';
            styleElement.id = 'styles_js';
            document.getElementsByTagName('head')[0].appendChild(styleElement);
        }
        styleElement.appendChild(document.createTextNode(newStyle));
    }
    
    var style = "html, body, #showmedia_video_box, #showmedia_video_box_wide, #showmedia_video_player, #showmedia_video, #video { width: 100%; height: 100%; }";
    
    var videoBox = document.getElementById('showmedia_video_box') || document.getElementById('showmedia_video_box_wide') || document.getElementById('showmedia_video');
    if (!videoBox) return;
    document.body.insertBefore(videoBox, document.body.firstChild);
    videoBox.style.width = '100%';
    videoBox.style.height = '100%';
    videoBox.style.backgroundColor = '#000';
    var videoPlayer = document.getElementById('showmedia_video_player') || document.getElementById('video');
    if (!videoPlayer) return;
    //var videoObject = videoBox.getElementsByTagName('object')[0];
    videoPlayer.width = '100%';
    videoPlayer.height = '100%';
    addNewStyle(style);
  }, 1000);      
})();