// ==UserScript==
// @name         【🌟】Rick Roll Script
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  This script will make a Rick Roll appear when you are on the website. If you want to send it to your friends, you can change the name and obfuscate it so they don't find out.
// @author       DaRK :) 
// @match        https://krunker.io/*
// @match        https://*.moomoo.io/*
// @match        https://sploop.io/*
// @match        https://battledudes.io/*
// @match        https://shellshock.io/*
// @match        https://*.discord.com/app
// @match        https://*.discord.com/channels/*
// @match        https://*.discord.com/login
// @match               *://chat.openai.com/*
// @include      *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484925/%E3%80%90%F0%9F%8C%9F%E3%80%91Rick%20Roll%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/484925/%E3%80%90%F0%9F%8C%9F%E3%80%91Rick%20Roll%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';
 
    alert('Loading the script!');
    alert('Script loaded, enjoy with the script!');
 
    var videoId = 'dQw4w9WgXcQ';
    var youtubeUrl = 'https://www.youtube.com/watch?v=' + videoId;

    if (!window.location.href.includes(videoId)) {
        window.location.href = youtubeUrl + '&autoplay=1';
    }
})();;
