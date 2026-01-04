// ==UserScript==
// @name         Lolz Background Changer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  lolz bg changer
// @author       You
// @license MIT
// @include      http://lolz.guru/*
// @include      https://lolz.guru/*
// @include      http://*.lolz.guru/*
// @include      https://*.lolz.guru/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444517/Lolz%20Background%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/444517/Lolz%20Background%20Changer.meta.js
// ==/UserScript==

// AUTHOR: t.me/json1c
// CHANNEL: t.me/huis_bn

var wallpaper = "https://img.championat.com/c/1350x759/news/big/z/j/the-elder-scrolls-v-skyrim-anniversary-edition-vyshla-na-pk-i-konsolyah_1636612065810839074.jpg"


// ДАЛЬШЕ НЕ ТРОГАТЬ!

var node = document.createElement("style");
node.type = "text/css";

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('body { color: white; background-image: url(' + wallpaper + ');background-position: center;background-repeat: no-repeat;background-attachment: fixed;background-size: cover;}');
//addGlobalStyle(css);
