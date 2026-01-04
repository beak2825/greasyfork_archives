// ==UserScript==
// @name         Bonk modded rooms on top
// @version      1.2
// @author       Salama
// @description  Makes modded gamemodes appear on top of the room list
// @match        https://*.bonk.io/gameframe-release.html
// @run-at       document-end
// @grant        none
// @supportURL   https://discord.gg/Dj6usq7ww3
// @namespace    https://greasyfork.org/users/824888
// @downloadURL https://update.greasyfork.org/scripts/446900/Bonk%20modded%20rooms%20on%20top.user.js
// @updateURL https://update.greasyfork.org/scripts/446900/Bonk%20modded%20rooms%20on%20top.meta.js
// ==/UserScript==

let table = document.getElementById("roomlisttable");
let vanillaModes = ["Classic", "Arrows", "Death Arrows", "Grapple", "Football", "VTOL"];
let style = document.createElement('style');
document.head.appendChild(style);
style.outerHTML=`<style>.MODDEDPOSHANDLED{opacity:1 !important;}</style>`
table.addEventListener('DOMNodeInserted', e => {
    if(e.target.nodeName !== '#text' || [...e.target.parentNode.parentNode.children].indexOf(e.target.parentNode) !== 2 || e.target.parentNode.parentNode.classList.contains("MODDEDPOSHANDLED")) return;
    e.target.parentNode.parentNode.classList.add("MODDEDPOSHANDLED");
    if(table.children[0].children.length === 0) return;
    if(!vanillaModes.includes(e.target.data))
    table.children[0].insertBefore(e.target.parentNode.parentNode, table.children[0].children[[...table.children[0].children].findIndex(i => {return vanillaModes.includes(i.children[2].textContent)})]);
});
console.log("Made modded gamemodes appear on top of the room list")