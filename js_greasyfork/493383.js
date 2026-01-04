// ==UserScript==
// @name         Blooket Random Game
// @namespace    http://fb.blooket.com/c/firebase/id
// @version      0.6
// @description  this may or may not be bannable lol!
// @author       not-made-by-konz-but-give-konz-credit
// @match        fb.blooket.com/c/firebase/id*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blooket.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493383/Blooket%20Random%20Game.user.js
// @updateURL https://update.greasyfork.org/scripts/493383/Blooket%20Random%20Game.meta.js
// ==/UserScript==

function load() {
    if (document.body.innerHTML.includes('"success":')) {
        init();
    } else {
        setTimeout(load, 1); // Check again in 100ms
    }
}

load();

function init(){
if (document.body.innerHTML.includes('"success":')) {
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
if (window.location.href.startsWith('https://fb.blooket.com/c/firebase/id') && document.body.innerHTML.includes('"success":true')) {
    window.location.href = `https://play.blooket.com/play?id=${id}`;
}
   else {
       document.body.innerHTML = "";
    const randomCode = Math.floor(1000000 + Math.random() * 9000000);
    console.log('Random code:', randomCode);
    window.location.href = `id?id=${randomCode}&&timestamp=${Date.now()}`;
    location.refresh();
   }
}
};