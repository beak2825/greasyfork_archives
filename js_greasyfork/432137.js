// ==UserScript==
// @name         Random Name Generator
// @namespace    -
// @version      -
// @description  try to take over the world
// @author       Axel?
// @match        *://*.moomoo.io/*
// @match        *://*moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432137/Random%20Name%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/432137/Random%20Name%20Generator.meta.js
// ==/UserScript==
selectSkinColor(6);
window.onbeforeunload = null;
localStorage.moofoll = !0;
setInterval(()=>{
    document.getElementById("ot-sdk-btn-floating").remove();
    document.querySelector("#pre-content-container").remove();
    console.clear();
}, 0);
let characters = ["p", "r", "o", "s", "c", "o", "p", "e"],
    name = "";
for(let i=0;i<8;i++){
    let random = Math.floor(Math.random() * characters.length);
    name += characters[random];
    characters.splice(random, 1);
};
localStorage.moo_name = name;