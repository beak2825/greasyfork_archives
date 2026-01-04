// ==UserScript==
// @name         VideoPlayerMagic
// @namespace    vpm
// @version      2025_12-18_02
// @description  Just some functionality to automatically maximize video playback
// @author       SimplyMe
// @license      MIT
// @match        *://*.pornhub.com/view_video.php*
// @match        *://*.xhamster.com/videos/*
// @match        *://*.xvideos.com/video*
// @match        *://*.eporner.com/video-*
// @match        *://*.eporner.com/hd-porn/*
// @match        *://*.spankbang.com/*/video/*
// @match        *://*.spankbang.com/*-*/playlist/*
// @match        *://*.pmvhaven.com/video/*
// @match        *://*.hypnotube.com/video/*
// @require      https://update.greasyfork.org/scripts/487369/1714770/VideoPlayerMagic-Styles.js
// @downloadURL https://update.greasyfork.org/scripts/487368/VideoPlayerMagic.user.js
// @updateURL https://update.greasyfork.org/scripts/487368/VideoPlayerMagic.meta.js
// ==/UserScript==

let maximizeVideo, normalizeVideo, interval, downloadUrl, skipNext, fileName;
let vidMaximized = false;

function downloadVideo() {
    let a = document.createElement('a');
    let id = `${Date.now()}`;
    a.download = `${id}.crawljob`;
    let url = downloadUrl();
    if (!url) return;
    let name = fileName()
    if (name) {
      a.href = `data:text,${id}%0D%0Atext=${url}%0D%0Afilename=${name}%0D%0Aenabled=TRUE%0D%0AautoConfirm=TRUE%0D%0AautoStart=TRUE`;
    } else {
      a.href = `data:text,${id}%0D%0Atext=${url}%0D%0Aenabled=TRUE%0D%0AautoConfirm=TRUE%0D%0AautoStart=TRUE`;
    }
    a.click();
}

function keyListen(e) {
    console.log("KeyListen", e.code);
    switch (e.code) {
        case 'Period':
            downloadVideo();
            break;
        case 'KeyN':
            skipNext();
            break;
        case 'Escape':
            if (vidMaximized) normalizeVideo();
            else maximizeVideo();
            break;
    }
}

function patchPornhub() {
    let player = document.getElementsByClassName('mgp_videoElement')[0];
    if (player == null) return;
    if (player.classList.contains('patched')) {
        maximizeVideo();
        window.clearInterval(interval);
        return;
    }

    downloadUrl = () => document.location;

    fileName = () => undefined;

    maximizeVideo = function() {
        document.getElementById('player').classList.add('maximized');
        document.getElementById('header').style.display = 'none';
        document.body.style.overflow = 'hidden';
        vidMaximized = true;
    }

    normalizeVideo = function() {
        document.getElementById('player').classList.remove('maximized');
        document.getElementById('header').style.display = '';
        document.body.style.overflow = '';
        vidMaximized = false;
    }

    skipNext = function() {
        if (document.location.toString().includes('&pkey=')) {
            document.getElementById('nextButton').click();
        }
        else {
            window.location = "https://www.pornhub.com/video/random";
        }
    }

    player.onplay = maximizeVideo;
    player.onended = () => {
        normalizeVideo();
        skipNext();
    }
    document.body.onkeydown = keyListen;
    player.classList.add('patched');
}

function patchXVideos() {
    let player = document.getElementById('html5video').querySelector('video');
    if (player == null) return;
    if (player.classList.contains('patched')) {
        player.play();
        maximizeVideo();
        window.clearInterval(interval);
        return;
    }

    downloadUrl = () => document.location;

    fileName = () => undefined;

    maximizeVideo = function() {
        document.getElementById('content').classList.add('maximized');
        document.body.style.overflow = 'hidden';
        vidMaximized = true;
    }

    normalizeVideo = function() {
        document.getElementById('content').classList.remove('maximized');
        document.body.style.overflow = '';
        vidMaximized = false;
    }

    skipNext = function() {
        // let moreBtn = document.querySelectorAll('a.show-more');
        // if (moreBtn.length > 0) {
        //    moreBtn[0].click();
        //    window.setTimeout(skipNext, 500);
        //    return;
        // }
        let related = document.querySelectorAll('div#related-videos div[id^=video_]');
        let index = Math.floor(Math.random() * related.length);
        let entry = related[index];
        let a = entry.querySelector('a.thumb-related-exo[href*=video]');
        window.location = a.href + '#rnd';
    }

    player.onplay = maximizeVideo;
    player.onended = () => {
        normalizeVideo();
        if (document.location.hash == '#rnd') {
            skipNext();
        }
    }

    document.body.onkeyup = keyListen;
    player.classList.add('patched');
}


function patchXHamster() {
    let player = document.getElementById('xplayer__video');
    if (player == null) return;
    if (player.classList.contains('patched')) {
        player.play();
        maximizeVideo();
        window.clearInterval(interval);
        return;
    }

    downloadUrl = () => document.location;

    fileName = () => undefined;

    maximizeVideo = function() {
        document.getElementById('player-container').classList.add('maximized');
        document.getElementsByTagName('main')[0].style.zIndex = '100';
        document.body.style.overflow = 'hidden';
        vidMaximized = true;
    }

    normalizeVideo = function() {
        document.getElementById('player-container').classList.remove('maximized');
        document.getElementsByTagName('main')[0].style.zIndex = '';
        document.body.style.overflow = '';
        vidMaximized = false;
    }

    skipNext = function() {
        let moreBtn = document.querySelectorAll('button[data-role=show-more-next]');
        if (moreBtn.length > 0) {
            moreBtn[0].click();
            window.setTimeout(skipNext, 500);
            return;
        }
        let related = document.querySelectorAll('div.video-thumb[data-role=related-item]');
        let index = Math.floor(Math.random() * related.length);
        let entry = related[index];
        let a = entry.querySelector('a[data-role=thumb-link]');
        window.location = a.href + '#rnd';
    }

    player.onplay = maximizeVideo;
    player.onended = () => {
        normalizeVideo();
        if (document.location.hash == '#rnd') {
            skipNext();
        }
    }

    document.body.onkeydown = keyListen;
    player.classList.add('patched');
}

function patchEPorner() {
    let player = document.querySelector('video#EPvideo_html5_api')
    if (player == null) return;

    let patcher = () => {
        if (player.classList.contains('patched')) {
            let mute = document.getElementsByClassName('vjs-mute-control')[0];
            document.getElementsByClassName('vjs-big-play-button')[0].click();
            maximizeVideo();
            window.clearInterval(interval);

            let unmute = (i) => {if(mute.title=='Unmute'){mute.click();window.setTimeout(() => unmute(0),500);}if(i<5){window.setTimeout(() => unmute(i+1),500);}};
            window.setTimeout(() => unmute(0), 500);
            return;
        }
    }

    if (document.readyState == 'complete'){
        patcher();
    } else {
        document.body.onload = patcher;
    }

    downloadUrl = () => document.location;

    fileName = () => undefined;

    maximizeVideo = function() {
        document.querySelector('div#EPvideo').classList.add('maximized');
        document.querySelector('header').style.display = 'none';
        document.body.style.overflowY = 'hidden';
        vidMaximized = true;
    }

    normalizeVideo = function() {
        document.querySelector('div#EPvideo').classList.remove('maximized');
        document.querySelector('header').style.display = '';
        document.body.style.overflowY = '';
        vidMaximized = false;
    }

    skipNext = function() {
        let moreBtn = document.querySelectorAll('div#morerelated');
        if (moreBtn.length > 0
          && moreBtn[0].style.display != 'none') {
            moreBtn[0].click();
            window.setTimeout(skipNext, 500);
            return;
        }
        let videoContainer = document.querySelector('div#relateddiv');
        let videos = videoContainer.querySelectorAll('div.mb');
        let index = Math.floor(Math.random() * videos.length);
        let vid = videos[index];
        let a = vid.querySelector('a');
        window.location = a.href + '#rnd';
    }

    player.onplay = maximizeVideo;
    player.onended = () => {
        normalizeVideo();
        if (document.location.hash == '#rnd') {
            skipNext();
        }
    };

    document.body.onkeydown = keyListen;
    player.classList.add('patched');
}

function patchSpankbang() {
    let player = document.getElementById('main_video_player_html5_api');
    if (player == null) return;
    if (player.classList.contains('patched')) {
        let mute = document.getElementsByClassName('vjs-mute-control')[0];
        document.getElementsByClassName('i-play')[0].click();
        maximizeVideo();

        let unmute = (i) => {if(mute.title=='Unmute'){mute.click();window.setTimeout(() => unmute(0),500);}if(i<5){window.setTimeout(() => unmute(i+1));}};
        window.setTimeout(() => unmute(0), 500);
        return;
    }

    downloadUrl = () => document.getElementById('main_video_player_html5_api').src;

    fileName = () => undefined;

    maximizeVideo = function() {
        document.getElementById('main_video_player').classList.add('maximized');
        document.body.parentElement.style.overflowY = 'hidden';
        vidMaximized = true;
    }

    normalizeVideo = function() {
        document.getElementById('main_video_player').classList.remove('maximized');
        document.body.parentElement.style.overflowY = '';
        vidMaximized = false;
    }

    skipNext = function() {
        let videos = document.getElementsByClassName('video-item');
        let index = Math.floor(Math.random() * videos.length);
        let vid = videos[index];
        let a = vid.children[0];
        window.location = a.href + '#rnd';
    }

    player.onplay = maximizeVideo;
    player.onended = () => {
        normalizeVideo();
        if (document.location.hash == '#rnd') {
            skipNext();
        }
    };

    document.body.onkeydown = keyListen;
    player.classList.add('patched');
    window.clearInterval(interval);
    window.setTimeout(patchSpankbang, 250);
}

function patchHypnotube() {
    let player = document.getElementsByClassName('plyr')[0];
    if (player == null) return;
    if (player.classList.contains('patched')) {
        document.querySelector("button.plyr__control[data-plyr='play']").click();
        player.play();
        return;
    }

    downloadUrl = () => player.querySelector('video').src;

    fileName = () => {
        var headers = document.querySelectorAll('main div.box-container:has(div.stage-col) h1');
        if (headers.length == 1) return `${headers[0].innerText}.mp4`;
        return undefined;
    }

    maximizeVideo = function() {
        player.classList.add('maximized');
        document.body.parentElement.style.overflowY = 'hidden';
        vidMaximized = true;
    }

    normalizeVideo = function() {
        player.classList.remove('maximized');
        document.body.parentElement.style.overflowY = '';
        vidMaximized = false;
    }

    skipNext = function() {
        let videos = document.getElementsByClassName('s-e-rate');
        let index = Math.floor(Math.random() * videos.length);
        let vid = videos[index];
        let a = vid.parentElement.parentElement.parentElement;
        if (a.href.includes('/video/')) {
          window.location = a.href + '#rnd';
        } else {
          skipNext();
        }
    }

    player.onplay = maximizeVideo;
    player.onended = () => {
        normalizeVideo();
        if (document.location.hash == '#rnd') {
            skipNext();
        }
    };

    document.body.onkeydown = keyListen;
    player.classList.add('patched');
    window.clearInterval(interval);
    window.setTimeout(patchHypnotube, 250);
}

function patchPmvHaven() {
    let player = document.querySelector('div.hls-player-wrapper video');
    if (player == null) return;

    let patcher = () => {
        if (player.classList.contains('patched')) {
            player.play();
            window.clearInterval(interval);
            return;
        }
    };

    if (document.readyState == 'complete'){
        patcher();
    } else {
        document.body.onload = patcher;
    }

    downloadUrl = function() {
        var script = document.querySelector('script#__NUXT_DATA__');
        if (!script) {
            console.warn('VPM:', 'Failed to find NUXT_DATA script');
            return undefined;
        }
        var includeRegex = /^https:\/\/(storage|video)\.pmvhaven\.com\/.*\.mp4$/;
        var excludeRegex = /\/((timeline-)?thumbnails?|videoPreview|profiles|avatars|previews)\//

        var data = eval(script.innerText);
        var urls = data.filter(v => v != undefined && includeRegex.exec(v) && !excludeRegex.exec(v));

        if (urls.length != 1) {
            console.warn('VPM:', 'Multiple URLs', urls);
            var text = 'Multiple URLs:\n' + urls.map((e, i) => i + ': ' + e).join('\n');
            var index = prompt(text, 0);
            if (index < urls.length) return urls[index];
            return undefined;
        }
        console.log('VPM:', 'Download URL', urls[0]);
        return urls[0];
    }

    fileName = () => document.location.pathname.split('/').pop();

    maximizeVideo = function() {
        document.querySelector('div.hls-player-wrapper').classList.add('maximized');
        document.body.parentElement.style.overflowY = 'hidden';
        vidMaximized = true;
    }

    normalizeVideo = function() {
        document.querySelector('div.hls-player-wrapper').classList.remove('maximized');
        document.body.parentElement.style.overflowY = '';
        vidMaximized = false;
    }

    skipNext = function() {
        let videos = document.querySelectorAll('div[class="lg:hidden"] a[href*="/video/"]');
        let index = Math.floor(Math.random() * videos.length);
        let vid = videos[index];
        let a = vid;
        window.location = a.href + '#rnd';
    }

    player.onplay = () => {
        player.loop = false;
        maximizeVideo();
    };
    player.onended = () => {
        normalizeVideo();
        if (document.location.toString().includes('/random')
           || document.location.hash == '#rnd') {
            skipNext();
        }
    };

    document.body.onkeyup = keyListen;
    player.classList.add('patched');
}

(function() {
    'use strict';
    injectStyles();
    if(document.location.host.includes('pornhub'))
        interval = window.setInterval(patchPornhub,100);
    else if (document.location.host.includes('xhamster'))
        interval = window.setInterval(patchXHamster,100);
    else if (document.location.host.includes('xvideos'))
        interval = window.setInterval(patchXVideos,100);
    else if (document.location.host.includes('eporner'))
        interval = window.setInterval(patchEPorner,100);
    else if (document.location.host.includes('spankbang'))
        interval = window.setInterval(patchSpankbang,100);
    else if (document.location.host.includes('hypnotube'))
        interval = window.setInterval(patchHypnotube,100);
    else if (document.location.host.includes('pmvhaven'))
        interval = window.setInterval(patchPmvHaven,100);
})();