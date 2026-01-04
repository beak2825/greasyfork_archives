// ==UserScript==
// @name         Youtube Faster Fullscreen
// @namespace    http://tampermonkey.net/
// @version      0.20
// @description  Tries to replace player with embed player so we get faster fullscreen and no scrolling/comments/description while in fullscreen.
// @author       Filipe Henriques
// @match        https://www.youtube.com/*
// @icon         https://cdn-icons-png.flaticon.com/512/124/124015.png
// @grant        none
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/433941/Youtube%20Faster%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/433941/Youtube%20Faster%20Fullscreen.meta.js
// ==/UserScript==

(function () {
    // 'use strict';

// Only run the userscript outside iframes
// if ( !(window.location !== window.parent.location) ) {

    // Keyboard shortcut support for the iframe
    (window.opera ? document.body : document).addEventListener('keydown', function(e) {
        console.log(e);
        if (e.srcElement.nodeName == "INPUT" || e.srcElement.id == "contenteditable-root") {return false;}
        // Fullscreen
        if (e.key === "f" && !e.ctrlKey) {
            e.cancelBubble = true;
            e.stopImmediatePropagation();

            // we are inside the iframe. else -> outside iframe
            if(!document.querySelector(".ytp-fullscreen-button.ytp-button")){
                let button = document.getElementById("myFrame").contentWindow.document.getElementsByClassName("ytp-fullscreen-button ytp-button")[0];
                button.click();
            } else { document.querySelector(".ytp-fullscreen-button.ytp-button").click(); }
        }
        // Pause
        if (e.code === "Space" || e.code == "KeyK") {
            e.cancelBubble = true;
            e.stopImmediatePropagation();
            e.preventDefault();
            // outside iframe
            if(!document.querySelector(".ytp-fullscreen-button.ytp-button")){
                let video = document.getElementById("myFrame").contentWindow.document.querySelector("video");
                if (video.paused) {video.play();}
                else {video.pause();}
            }
        }
        // Mute
        if (e.code === 'KeyM') {
            e.cancelBubble = true;
            e.stopImmediatePropagation();
            let mute = document.querySelector('.ytp-mute-button.ytp-button');
            // we are inside the iframe. else -> outside iframe
            if(!mute){
                let button = document.getElementById("myFrame").contentWindow.document.getElementsByClassName('ytp-mute-button ytp-button')[0];
                button.click();
            } else { mute.click(); }
        }
        // Captions
        if (e.code === 'KeyC') {
            e.cancelBubble = true;
            e.stopImmediatePropagation();
            let captions = document.querySelector('.ytp-subtitles-button.ytp-button');
            // we are inside the iframe. else -> outside iframe
            if(!captions){
                let button = document.getElementById("myFrame").contentWindow.document.getElementsByClassName(' ytp-subtitles-button ytp-button')[0];
                button.click();
            } else { captions.click(); }
        }
        // TODO ADD SEEKING WITH ARROW KEYS OUTSIDE IFRAMEm
        return false;
    }, !window.opera);

// ######################################################################################################

    // Global observer waits until elements we want appear
    var href = document.location.href;
    var ytd_found = false;        var ytd = null;
    var player_found = false;     var player = null;
    var orig_found = false;       var original_player = null;
    var skeleton_found = false;   var skeleton_theater = null;
    var watch_on_yt_fnd = false;  var watch_on_yt_bt = null;
    var player_replaced = false;
    var observer = new MutationObserver(function (mutations, me) {
        // Check if we are navigating somewhere else and force page reload
        if (href != document.location.href) {
            let oldref = href;
            href = document.location.href;
            if ( oldref.includes('watch') && !document.location.href.includes('watch')) {
                let frame = document.getElementById("myFrame");
                frame.contentWindow.document.querySelector("video").pause();
                frame.parentElement.remove();
                frame.remove();
            } if ( !oldref.includes('watch') && !document.location.href.includes('watch')) {
                // do nothing
            } else {document.location.href = href;}
        }
        // First original player in page
        if (!orig_found) {original_player = document.querySelector("video");}
        if (original_player && !orig_found) {

            orig_found = true;
            original_player.pause();
            original_player.addEventListener('play', (event) => {
                event.target.pause();
            // }, { once: true });
            });
        }
        // Intercept first appearance of skeleton theater
        if (!skeleton_found) {skeleton_theater = document.querySelector('#player.skeleton.theater');}
        if (skeleton_theater && !skeleton_found) {

            skeleton_found = true;
            replacePlayer(skeleton_theater);
            let o = new MutationObserver(function (mutations, me) {
                mutations[0].target.removeAttribute("hidden");
                document.getElementById("myFrame").style = 'width: 100%; height: 100%; position: relative';
            });
            o.observe(skeleton_theater, {attributes: true});

        }
        // Remove player theater which is the final original player as soon as it appears
        if (!player_found) { player = document.getElementById('player-theater-container');}
        if (player && !player_found) {
            player_found = true;
            player.firstChild.remove();
        }
        // Remove Watch on Youtube button
        if (!watch_on_yt_fnd) { watch_on_yt_bt = document.getElementById("myFrame").contentWindow.document.querySelector(".ytp-youtube-button.ytp-button.yt-uix-sessionlink");}
        if ( watch_on_yt_bt && !watch_on_yt_fnd) {
            watch_on_yt_bt.remove();
        }
        return;
    });
    observer.observe(document, {
        childList: true,
        subtree: true
    });


    // Replace player with an iframe embed player
    function replacePlayer(element) {
        let video_id = window.location.search.split('v=')[1];
        let ampersandPosition = video_id.indexOf('&');
        if(ampersandPosition != -1) {video_id = video_id.substring(0, ampersandPosition);}
        let start_time = 0;
        let t = window.location.search.split('t=')[1];
        if (t) { start_time = t.slice(0, -1);}

        let iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube.com/embed/' + video_id + '?autoplay=1&enablejsapi=1&start=' + start_time;
        iframe.title = 'Youtube video player';
        iframe.style = 'width: inherit; height: inherit; position: fixed';
        iframe.frameborder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.setAttribute('allowFullScreen', '');
        iframe.id = 'myFrame';
        element.prepend(iframe);
    }


// }
}) ();