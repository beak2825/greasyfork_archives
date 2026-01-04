// ==UserScript==
// @name     vrporn.com switch sorting to newest
// @description vrporn.com switches sorting to newest on pornstars, tag/category and studio pages
// @version  3
// @grant    none
// @include  https://vrporn.com/*
// @namespace https://greasyfork.org/users/1079192
// @downloadURL https://update.greasyfork.org/scripts/476769/vrporncom%20switch%20sorting%20to%20newest.user.js
// @updateURL https://update.greasyfork.org/scripts/476769/vrporncom%20switch%20sorting%20to%20newest.meta.js
// ==/UserScript==

let interval = undefined;

window.addEventListener('load', function() {
  interval = setInterval(checkAndReplace, 1000);
}, false);

function checkAndReplace(){
	let regx = /https:\/\/vrporn\.com\/pornstars\/.*|https:\/\/vrporn\.com\/tag\/.*|https:\/\/vrporn\.com\/studio\/.*/gm;
  let a_urls = document.getElementsByTagName('a');
  for (let a of a_urls) {
    if(regx.test(a.href) && a.href.indexOf('?sort=newest') === -1){
      a.href = a.href + "?sort=newest";
    }
  }
}