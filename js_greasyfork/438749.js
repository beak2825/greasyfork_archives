// ==UserScript==
// @name         podtsawowy_skrypt_tampermoneky
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  topis testeste eetsete
// @author       Filszu
// @license MIT
// @match        http://*/*
// @include      https://www.youtube.com/*
// @include      *://*/**
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @resource     customCSS https://raw.githubusercontent.com/Filszu/video_player_genius/673022e83f3bfb49ba10db5163dc404be79c8630/style.css
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/438749/podtsawowy_skrypt_tampermoneky.user.js
// @updateURL https://update.greasyfork.org/scripts/438749/podtsawowy_skrypt_tampermoneky.meta.js
// ==/UserScript==

alert('hello');
console.log('%c------------⚙vpGenius------------', 'color: green; ');


console.log('start: add CSS');
var newCSS = GM_getResourceText ("customCSS");
GM_addStyle (newCSS);
console.log('done: add CSS');

const el = document.createElement("div");
    const menu = el;
    menu.innerHTML = `
     <div class="specialFont" id="menu-container">FILIP</div>`;

const body = document.querySelector("body");
body.append(menu);



console.log('%c**********⚙vpGenius**********', 'color: green; ');

