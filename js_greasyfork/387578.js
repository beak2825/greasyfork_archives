// ==UserScript==
// @name         booru frame control
// @namespace    https://github.com/KisaragiAyano/web-scripts
// @version      0.2.1
// @description  Use button below the player or shift+mouse_wheel or press 'D'/'d'/'f'/'F' when the player focused to play the video frame by frame.
// @author       Niku Kikai
// @match        https://www.sakugabooru.com/post/show/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387578/booru%20frame%20control.user.js
// @updateURL https://update.greasyfork.org/scripts/387578/booru%20frame%20control.meta.js
// ==/UserScript==

'use strict';

function foo(){
    let video = document.getElementsByTagName("video");
    console.log(video);
    video = video[0];
    // video.autoplay = false;
    // video.controls = false;
    let parent = video.parentElement;

    let duration, Nfrm;

    let nfrm = 0;
    video.currentTime = nfrm /24;

    let control = document.createElement('div');
    let text_frm = document.createElement('label');
    let btn_pre_frm = document.createElement('button');
    let btn_nxt_frm = document.createElement('button');
    let btn_pre_2frm = document.createElement('button');
    let btn_nxt_2frm = document.createElement('button');
    let btn_pre_3frm = document.createElement('button');
    let btn_nxt_3frm = document.createElement('button');

    function show_frm(){
        text_frm.innerHTML = nfrm + ' / ' + Nfrm;
    }
    function seek_frm(){
        video.pause()
        if (nfrm < 0) nfrm = Nfrm - 1;
        nfrm = nfrm % Nfrm;
        video.currentTime = nfrm /24;
        show_frm();
    }
    function pre_frm(){
        nfrm = nfrm - 1;
        seek_frm();
    }
    function nxt_frm(){
        nfrm = nfrm + 1;
        seek_frm();
    }
    function pre_2frm(){
        nfrm = nfrm - 2;
        seek_frm();
    }
    function nxt_2frm(){
        nfrm = nfrm + 2;
        seek_frm();
    }
    function pre_3frm(){
        nfrm = nfrm - 3;
        seek_frm();
    }
    function nxt_3frm(){
        nfrm = nfrm + 3;
        seek_frm();
    }

    btn_pre_frm.type = 'button';
    btn_pre_frm.id = 'pre_frm';
    btn_pre_frm.innerHTML = '<';
    btn_pre_frm.addEventListener('click', pre_frm);

    btn_nxt_frm.type = 'button';
    btn_nxt_frm.id = 'nxt_frm';
    btn_nxt_frm.innerHTML = '>';
    btn_nxt_frm.addEventListener('click', nxt_frm);

    btn_pre_2frm.type = 'button';
    btn_pre_2frm.id = 'pre_2frm';
    btn_pre_2frm.innerHTML = '<<';
    btn_pre_2frm.addEventListener('click', pre_2frm);

    btn_nxt_2frm.type = 'button';
    btn_nxt_2frm.id = 'nxt_2frm';
    btn_nxt_2frm.innerHTML = '>>';
    btn_nxt_2frm.addEventListener('click', nxt_2frm);

    btn_pre_3frm.type = 'button';
    btn_pre_3frm.id = 'pre_3frm';
    btn_pre_3frm.innerHTML = '<<<';
    btn_pre_3frm.addEventListener('click', pre_3frm);

    btn_nxt_3frm.type = 'button';
    btn_nxt_3frm.id = 'nxt_3frm';
    btn_nxt_3frm.innerHTML = '>>>';
    btn_nxt_3frm.addEventListener('click', nxt_3frm);

    text_frm.style.display = 'inline-block';
    text_frm.style.textAlign = 'center';
    text_frm.style.width = '120px';

    control.appendChild(btn_pre_3frm);
    control.appendChild(btn_pre_2frm);
    control.appendChild(btn_pre_frm);
    control.appendChild(text_frm);
    control.appendChild(btn_nxt_frm);
    control.appendChild(btn_nxt_2frm);
    control.appendChild(btn_nxt_3frm);
    parent.appendChild(control);

    video.addEventListener('loadeddata', function(){
        duration = video.duration;
        Nfrm = Math.floor(duration * 24);
        show_frm();
    });
    video.addEventListener('timeupdate', function(){
        nfrm = Math.round(video.currentTime * 24);
        show_frm();
    });
    video.onwheel = function(e){
        if (e.deltaY > 0 && e.shiftKey) nxt_frm();
        if (e.deltaY < 0 && e.shiftKey) pre_frm();
    }

    parent.onkeypress = function(e){
        console.log(e.keyCode);
        if((e || window.event).keyCode === 100){
            pre_frm();
        }
        if((e || window.event).keyCode === 102){
            nxt_frm();
        }
        if((e || window.event).keyCode === 68){
            pre_3frm();
        }
        if((e || window.event).keyCode === 70){
            nxt_3frm();
        }
    };
}

foo();