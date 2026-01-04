// ==UserScript==
// @name         Tumblr New Bee Movie
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  tumblr bullshit idk
// @author       please don't make me attribute this to myself any further
// @match        https://www.tumblr.com/*
// @grant         GM_getResourceText
// @resource     script https://gist.githubusercontent.com/MattIPv4/045239bc27b16b2bcf7a3a9a4648c08a/raw/2411e31293a35f3e565f61e7490a806d4720ea7e/bee%2520movie%2520script
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459033/Tumblr%20New%20Bee%20Movie.user.js
// @updateURL https://update.greasyfork.org/scripts/459033/Tumblr%20New%20Bee%20Movie.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let script = GM_getResourceText("script");

    document.getElementsByClassName('O42NY')[0].style.backgroundImage = 'url("https://cdn.discordapp.com/attachments/689001855484690432/789635146923245578/beemovie128aspect.gif")'
    document.getElementsByClassName('O42NY')[0].style.maxHeight = '18px'
    document.getElementsByClassName('O42NY')[0].style.height = '18px'
    document.getElementsByClassName('O42NY')[0].style.maxWidth = '32px'
    document.getElementsByClassName('O42NY')[0].style.width = '32px'
    document.getElementsByClassName('O42NY')[0].innerText = ''
    document.getElementsByClassName('O42NY')[0].innerHTML = `<marquee>${script}</marquee>`
    console.log("???")
})();