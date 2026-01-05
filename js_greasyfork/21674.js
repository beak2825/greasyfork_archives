// ==UserScript==
// @name        KissAnime AutoPlay 
// @description Automatically plays the next video in the list.
// @locale      en
// @namespace   https://greasyfork.org/en/users/29660-bmn
// @author      Fenrir Oorgata
// @include     *://kissanime.com/*
// @include     *://kisscartoon.me/*
// @include     *://kissanime.to/*
// @include     *://kissasian.com/*
// @version     2016.05.17
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21674/KissAnime%20AutoPlay.user.js
// @updateURL https://update.greasyfork.org/scripts/21674/KissAnime%20AutoPlay.meta.js
// ==/UserScript==
// Copyright (c) 2016 Fenrir Oorgata; MIT License
function playNext(e) {
    var button_img = document.getElementById('btnNext');
    var button = button_img.parentNode;
    button.click();
}

var video = document.getElementById('my_video_1_html5_api');
video.addEventListener('ended', playNext, false);