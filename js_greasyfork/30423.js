// ==UserScript==
// @name         moonwalk Video Ads Remover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  When I watch movies only video player ads makes me cry they're blocked by AdBlock, but I can't start play a video without waiting for 14 sec
// @author       You
// @match        http://logethy.com/*/frame*
// @include     http://moonwalk.co/*
// @include     http://moonwalk.cc/*
// @include     http://moonwalk.pw/*
// @include     http://streamguard.cc/*
// @include     http://moonwalk.center/*
// @include     https://moonwalk.co/*
// @include     https://moonwalk.cc/*
// @include     https://moonwalk.pw/*
// @include     https://streamguard.cc/*
// @include     https://moonwalk.center/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30423/moonwalk%20Video%20Ads%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/30423/moonwalk%20Video%20Ads%20Remover.meta.js
// ==/UserScript==

$('#player').click(function(){
    adv_showed = true;
    showVideo();
    console.log('Fuck moonwalk.cc Ads');
    setTimeout(function(){
        $('#MToverroll').css('z-index','9999999');
    },10000);
});