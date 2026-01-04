// ==UserScript==
// @name         ReSteam
// @namespace    http://pyroglyph.co.uk/
// @version      1.0
// @description  Tweaks to make Steam look nicer!
// @author       Pyroglyph
// @match        http://store.steampowered.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32605/ReSteam.user.js
// @updateURL https://update.greasyfork.org/scripts/32605/ReSteam.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Remove ugly background gradients/glows
    document.getElementsByClassName('game_page_background')[0].style.background = '';
    document.getElementsByClassName('game_background_glow')[0].style.background = 'rgba(0,0,0,0)';

    // Add new fonts to page
    var styleNode = document.createElement('style');
    var textNode = document.createTextNode('@import url("https://fonts.googleapis.com/css?family=Prompt|Nunito");');
    styleNode.appendChild(textNode);
    document.head.appendChild(styleNode);

    // Replace all fonts with nicer ones
    var elems = document.getElementsByTagName('*');
    for (var i = 0; i < elems.length; i++) {
        var style = window.getComputedStyle(elems[i]);

        if (style.fontFamily.includes('Motiva')) {
            elems[i].style.setProperty('font-family','\'Prompt\', sans-serif');
        }
        else {
            elems[i].style.setProperty('font-family','\'Nunito\', sans-serif');
        }
    }

    // Make themed backgrounds for store pages
    if (window.location.href.includes('/app/')) {
        var imageSrc = document.getElementsByClassName('game_header_image_full')[0].src;
        var bgNode = document.createElement('img');
        bgNode.src = imageSrc;
        bgNode.style = 'position:fixed;top:0px;left:0px;height:100%;width:auto;z-index:-100;filter:opacity(.2)blur(64px);';
        document.body.appendChild(bgNode);
    }
})();