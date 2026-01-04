// ==UserScript==
// @name         Name Reverser
// @namespace    -
// @version      -
// @description  lol
// @author       Axel?
// @match        *://*.moomoo.io/*
// @match        *://*moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432191/Name%20Reverser.user.js
// @updateURL https://update.greasyfork.org/scripts/432191/Name%20Reverser.meta.js
// ==/UserScript==
window.onbeforeunload = null;
localStorage.moofoll = !0;
setInterval(()=>{
    document.getElementById("ot-sdk-btn-floating").remove();
    document.querySelector("#pre-content-container").remove();
    console.clear();
}, 0);
let oldName = localStorage.moo_name,
    characters = oldName.split(""),
    name = "";
for(let i=oldName.length - 1;i>0;i--){
    name += characters[i];
};
name += characters[0];
localStorage.moo_name = name;