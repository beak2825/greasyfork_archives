// ==UserScript==
// @name        MissAV全屏播放增强
// @name:zh-CN  MissAV全屏播放增强
// @name:en     MissAV Fullscreen Enhanced
// @description MissAV全屏播放支持前后10s跳转与长按倍速
// @description:zh-CN MissAV全屏播放支持前后10s跳转与长按倍速
// @description:en MissAV Fullscreen play support 10s fast forward and backward, long press 2x playback rate
// @match       https://missav.com/*
// @match       https://missav.pw/*
// @match       https://123av.com/*
// @match       https://missav.ai/*
// @match       https://missav.ws/*
// @match       https://javplayer.me/*
// @match       https://5masterzzz.site/*
// @version     0.3.0
// @author
// @license     MIT
// @namespace Violentmonkey Scripts
// @downloadURL https://update.greasyfork.org/scripts/492641/MissAV%E5%85%A8%E5%B1%8F%E6%92%AD%E6%94%BE%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/492641/MissAV%E5%85%A8%E5%B1%8F%E6%92%AD%E6%94%BE%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

function createPlaybackRate() {
    const playbackRate = document.createElement("div")
    playbackRate.innerText = "X2";
    playbackRate.id = "playbackRate";
    playbackRate.style.position = "absolute";
    playbackRate.style.top = 0;
    playbackRate.style.left = "50%";
    playbackRate.style.fontSize = "2em";
    playbackRate.style.color = "white";
    playbackRate.style.transform = "translateX(-50%)";
    playbackRate.style.visibility = "hidden";
    return playbackRate;
}

!!(function() {
    const playbackRate = createPlaybackRate();
    let forward = document.createElement('div');
    let backward = document.createElement('div');

    [forward, backward].forEach(el => {
        el.style.position = 'absolute';
        el.style.top = 0;
        el.style.width = '100px';
        el.style.height = 'calc(100vh - 3em)';
        el.style.zIndex=9999;
        el.addEventListener('dblclick', e => e.stopPropagation());
    });

    const setVideoCurrentTime = duration => {
        const el = document.querySelector('.plyr__video-wrapper video');
        if (!el) return;
        el.currentTime += duration;
    }

    const onForwardClick = (e) => {
        setVideoCurrentTime(10);
        e.preventDefault();
        e.stopPropagation();
    }
    const onBackWardClick = (e) => {
        setVideoCurrentTime(-10);
        e.preventDefault();
        e.stopPropagation();
    }

    let playbackRateTap;
    const onPointerDown = e => {
        const el = document.querySelector('.plyr__video-wrapper video');
        if (!el) return;
        playbackRateTap = setTimeout(() => {
            el.playbackRate = 2.0;
            playbackRate.style.visibility = "visible";
        }, 500);
    }
    const onPointerUp = e => {
        const el = document.querySelector('.plyr__video-wrapper video');
        if (!el) return;
        el.playbackRate = 1.0;
        playbackRate.style.visibility = "hidden";
        clearTimeout(playbackRateTap);
    }

    forward.style.right = 0;
    forward.addEventListener('pointerdown', onForwardClick);

    backward.style.left = 0;
    backward.addEventListener('pointerdown', onBackWardClick);

    const effect = () => {
        const f = document.fullscreenElement;
        if (f) {
            f.appendChild(playbackRate);
            f.appendChild(forward);
            f.appendChild(backward);

            f.addEventListener('pointerdown', onPointerDown);
            f.addEventListener('pointerup', onPointerUp);
        } else {
            f.removeChild(playbackRate);
            f.removeChild(forward);
            f.removeChild(backward);

            f.removeEventListener('pointerdown', onPointerDown);
            f.removeEventListener('pointerup', onPointerUp);
        }
    }
    document.addEventListener('fullscreenchange', effect);
})();

!!(function() {
    const intervalId = setInterval(() => {
        const iframe = document.querySelector('iframe');
        if (!!iframe) {
            clearInterval(intervalId);
            addOpenButton(iframe.src);
        }
    }, 1000);

    function addOpenButton(src) {
        const btn = document.createElement('button');
        btn.style.backgroundColor = '#e85a83';
        btn.style.color = "white";
        btn.style.width = "100%";
        btn.textContent = "Open in new tab";
        btn.addEventListener('click', () => window.open(src));
        const player = document.querySelector('#player');
        player.parentNode.insertBefore(btn, player);
    }
})()