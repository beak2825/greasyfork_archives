// ==UserScript==
// @name         VK video download
// @namespace    https://github.com/DaniilAfendulov/VK-video-dowload
// @version      0.1
// @description  Позволяет скачивать видео из вк, даже если это видео переслали вам сообщением из закрытой группы. Кнопка скачать появляется при нажатии правой кнопки мыши на видео
// @author       Daniil Afendulov
// @include      https://vk.com/*
// @include      https://m.vk.com/*
// @include      https://pvv4.vkuservideo.net/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/404574/VK%20video%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/404574/VK%20video%20download.meta.js
// ==/UserScript==


(function() {
    'use strict';
        // Your code here...
    if(window.location.hostname === "m.vk.com" && window.opener.location.hostname === "vk.com") vkm();
    if(window.location.hostname === "pvv4.vkuservideo.net" ) pvv4();
    if(window.location.hostname === "vk.com") vk();
})();

function vk() {
    window.addEventListener('message', function(event) {
        if (event.source.location.hostname === "m.vk.com") {
            let src = event.data;
            alert('m.vk.com');
            window.location = src;
            return;
        }
    });

    var el;
    var timerId = setInterval(pollDOM, 2000);
    function pollDOM () {
        console.log('tick');
        el = document.querySelector("#video_player > div > div.videoplayer_ui > div.videoplayer_context_menu.hidden");
        if (!el) {
            el = document.querySelector("#video_player > div > div.videoplayer_ui > div.videoplayer_context_menu");
        }
        if (el) setBtn();
    }



    function setBtn() {
        //clearInterval(timerId);
        let div = document.querySelector('#tmr');
        if(div) return;

        div = document.createElement('div');
        div.className = "_item";
        div.id = 'tmr';
        div.innerHTML = "скачать";
        div.onclick = handler;
        el.prepend(div);
    }


    function handler() {
        var ourl = window.location.toString();
        var url = ourl;
        url = url.replace('https://','https://m.');
        let index = url.indexOf('video');
        if(index === -1) return;

        url = url.slice(0,"https://m.vk.com/".length) + url.slice(index);
        url = url.replace('%2F','?list=');
        index = url.indexOf('%2F');
        if(index === -1) return;
        url = url.slice(0,index);
        var win = window.open(url);
    }
}

function vkm() {
    window.onload = function() {
        let src = window.location.pathname;
        console.log(src);
        src = '#'+src.substring(1)+" > div.VideoPage__video > video > source:nth-child(2)";
        console.log(src);
        src = document.querySelector(src).src;
        src = src.substring(0, src.indexOf('.mp4')+4);
        let win = window.opener;
        win.postMessage(src, '*');
        window.close();
    }
}

function pvv4() {
    window.onload = function() {
        let video = document.querySelector("body > video > source");
        let a = document.createElement('a');
        a.href = video.src;
        a.download = 'video.mp4';
        a.click();
        window.history.back();
    }
}