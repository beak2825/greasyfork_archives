// ==UserScript==
// @name         HNS Addon
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Zatím jenom random anime v záložce titulky
// @author       Airsane
// @match        http://hns.sk/animelist
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38196/HNS%20Addon.user.js
// @updateURL https://update.greasyfork.org/scripts/38196/HNS%20Addon.meta.js
// ==/UserScript==

let navul = document.querySelector('ul.nav');
let list = document.createElement("li");
let link = document.createElement('a');
link.href = "javascript:void(0);";
link.innerText = "Random Anime";
list.appendChild(link);
navul.appendChild(list);
link.addEventListener("click", getRandomAnime);
let anime = document.querySelectorAll("td > a");

function getRandomAnime() {

    let r = Math.floor(Math.random() * anime.length);
    window.location.href = anime[r].href;
}