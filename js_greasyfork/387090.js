// ==UserScript==
// @name         Luke's VidDownloader
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Allows you to download videos from reddit and youtube easily!
// @author       You
// @match        https://www.reddit.com/r/*
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/387090/Luke%27s%20VidDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/387090/Luke%27s%20VidDownloader.meta.js
// ==/UserScript==

(function() {
    'use strict'
    // Behave differently on different sites.
    const loc = window.location.href;
    if(loc.startsWith('https://www.reddit.com/r/')) {
        window.setInterval(function(){
            try {
                const a = document.getElementById('downloadfromplugin').id;
            } catch(e) {
                try {
                    const videolink = window.location.href;
                    const buttonZone = document.getElementsByClassName('PWY92ySDjTYrTAiutq4ty')[0];
                    buttonZone.innerHTML += `<button id="downloadfromplugin" class="_2snJGyyGyyH38duHobOUKE m9hgq8-2 dAQykt b1zwxr-0 hxpTao" role="menuitem"><span class="m9hgq8-0 inRMrM"><i class="icon icon-embed _3MSdPVJwGxrpakz-e1MQhO s1htoir6-0 bpvrMF"></i></span><span class="m9hgq8-1 dRGkl">Download</span></button>`;
                    const added = document.getElementById('downloadfromplugin');

                    added.addEventListener('click', function () {
                        window.location.href = "https://viddit.red/?url=" + videolink;
                    });
                } catch(error) {}
            }
        }, 200);
    }
    if(loc.toLowerCase().includes('youtube.com/watch?v=')) {
        const toStop = window.setInterval(function() {
            const viewCountElements = document.getElementsByClassName('yt-view-count-renderer');
            if(viewCountElements.length >= 1) {
                window.clearInterval(toStop);
                enableYoutubeLink();
            }
        }, 1000);
    }
})();
function enableYoutubeLink() {
    const loc = window.location.href;
    const viewCount = document.getElementsByClassName('yt-view-count-renderer')[0];
    const link = loc.replace('youtube', 'youtubepp');
    //viewCount.innerHTML = viewCount.innerHTML + ' <a href="' + link + '">(Download This Video)</a>';
    viewCount.innerHTML = viewCount.innerHTML + ' <button onclick="window.location.href=\'' + link + '\'">Download This Video</button>';
}