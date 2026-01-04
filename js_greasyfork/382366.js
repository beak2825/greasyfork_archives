// ==UserScript==
// @name AbyssusHelper2
// @description La version 2.0 d'AbyssusHelper, si si c'est vrai
// @version  2.0.1
// @grant none
// @match https://s1.abyssus.games/*
// @include https://s1.abyssus.games/*
// @namespace https://greasyfork.org/users/184736
// @downloadURL https://update.greasyfork.org/scripts/382366/AbyssusHelper2.user.js
// @updateURL https://update.greasyfork.org/scripts/382366/AbyssusHelper2.meta.js
// ==/UserScript==

const urlSite = "https://t3y.eu/Abyssus/";
var page;
if (document.location.href.indexOf("?page=") != -1) {
    page = document.location.href.split("?page=")[1];
    if (page.indexOf("&") != -1) page = page.split("&")[0];
} else {
    page = "accueil";
}

let scriptElement = document.createElement('script');
scriptElement.src = urlSite + 'script/main.php?page=' + page;


document.body.appendChild(scriptElement);