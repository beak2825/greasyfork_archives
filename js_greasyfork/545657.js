// ==UserScript==
// @name         poopshitters (drawaria online)
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  the poopshitters
// @author       𝔇ꬲⵢꓸ
// @icon         https://yt3.googleusercontent.com/bgJHJbSQOzCHY41sPgejrcr3VmLBbK2_oEJXITd690MHUKLu9msuVoPBvUTSyIH4Y5mSZwmCIHs=s900-c-k-c0x00ffffff-no-rj
// @match        https://drawaria.online/*
// @match        https://*.drawaria.online/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/545657/poopshitters%20%28drawaria%20online%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545657/poopshitters%20%28drawaria%20online%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
        #movable-container {
            position: fixed;
            top: 10px;
            left: 10px;
            width: 200px;
            height: 200px;
            z-index: 9999;
            user-select: none;
        }
        #movable-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 5px;
            cursor: move;
            border: 2px dashed #ccc;
        }
        #music-button {
            position: absolute;
            bottom: 10px;
            right: 10px;
            width: 40px;
            height: 40px;
            background-color: rgba(255, 255, 255, 0.7);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border: none;
            transition: all 0.2s;
        }
        #music-button:hover {
            background-color: rgba(255, 255, 255, 0.9);
            transform: scale(1.1);
        }
        #music-button::after {
            content: "▶";
            color: #333;
            font-size: 16px;
            margin-left: 2px;
        }
        .playing::after {
            content: "❚❚";
            margin-left: 0;
        }
        #sc-widget {
            display: none;
        }
    `);
   const container = document.createElement('div');
    container.id = 'movable-container';
const img = document.createElement('img');
    img.id = 'movable-image';
    img.src = 'https://i1.sndcdn.com/artworks-SVRmKFzsxnEbDWiR-Rl8w3w-t500x500.jpg';
    img.alt = 'Movable Image';
    img.draggable = false;
    const musicBtn = document.createElement('button');
    musicBtn.id = 'music-button';
    musicBtn.title = 'Play/Pause Music';
    container.appendChild(img);
    container.appendChild(musicBtn);
    document.body.appendChild(container);
    const widgetDiv = document.createElement('div');
    widgetDiv.id = 'sc-widget';
    document.body.appendChild(widgetDiv);
    const script = document.createElement('script');
    script.src = 'https://w.soundcloud.com/player/api.js';
    document.head.appendChild(script);

    let widget;
    let isPlaying = false;
    window.onload = function() {
        const iframe = document.createElement('iframe');
        iframe.id = 'sc-iframe';
        iframe.src = 'https://w.soundcloud.com/player/?url=https://soundcloud.com/user-716808723/the-poopshitters-album-1-song-1-the-first-drop&auto_play=false&buying=false&liking=false&download=false&sharing=false&show_artwork=false&show_comments=false&show_playcount=false&show_user=false&hide_related=true&visual=false';
        iframe.allow = 'autoplay';
        widgetDiv.appendChild(iframe);

        widget = SC.Widget('sc-iframe');
        musicBtn.addEventListener('click', function() {
            if (isPlaying) {
                widget.pause();
                musicBtn.classList.remove('playing');
            } else {
                widget.play();
                musicBtn.classList.add('playing');
            }
            isPlaying = !isPlaying;
        });
        widget.bind(SC.Widget.Events.READY, function() {
            widget.bind(SC.Widget.Events.PAUSE, function() {
                musicBtn.classList.remove('playing');
                isPlaying = false;
            });
            widget.bind(SC.Widget.Events.PLAY, function() {
                musicBtn.classList.add('playing');
                isPlaying = true;
            });
        });
    };
    let isDragging = false;
    let offsetX, offsetY;
    img.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);

    function startDrag(e) {
        if (e.target.id !== 'movable-image') return;
        isDragging = true;
        const rect = container.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        container.style.opacity = '0.7';
        e.preventDefault();
    }
    function drag(e) {
        if (!isDragging) return;
        container.style.left = (e.clientX - offsetX) + 'px';
        container.style.top = (e.clientY - offsetY) + 'px';
    }
    function endDrag() {
        isDragging = false;
        container.style.opacity = '1';
    }
})();