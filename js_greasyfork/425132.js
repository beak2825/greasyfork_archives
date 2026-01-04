// ==UserScript==
// @name         DubHaters AnimeDao
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  redirects you from the dub version to the subbed version of the anime in Animedao
// @author       78ThousandNumbers
// @match        https://animedao.to/anime/*-dubbed/
// @icon         https://www.google.com/s2/favicons?domain=animedao.to
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/425132/DubHaters%20AnimeDao.user.js
// @updateURL https://update.greasyfork.org/scripts/425132/DubHaters%20AnimeDao.meta.js
// ==/UserScript==

//Script Explanation:
//
//You go to "https://animedao.to/anime/attack-on-titan-dubbed/" (The Dubbed Version)
//automatically sends you to "https://animedao.to/anime/attack-on-titan/" (The Subbed Version)
//
//
// Made By 78ThousandNumbers for fun poggers
var BadDub = window.location.href;
//gets address location
window.onload = function(){
//on load of window, execute function()
console.log(BadDub);
//sends the url page of the dub to console
var Sub = BadDub.replace("-dubbed", '');
//replaces dubbed with nothing lol
console.log(Sub);
//sends the url page of the sub to console
window.location.assign(Sub);
//assign page to sub
};

