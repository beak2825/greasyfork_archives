// ==UserScript==
// @name        Find Local Hentai People in your Area!
// @include     https://animepahe.com/play* 
// @include     https://kwik.cx/f*
// @version     6.9
// @author      menthe d'hiver
// @description Find loacal hentai people while you run this bitch ass script
// @icon        https://cdn.mcstatic.com/contents/avatars/8000000/8284000/8284319.jpg
// @namespace https://greasyfork.org/users/673669
// @downloadURL https://update.greasyfork.org/scripts/408259/Find%20Local%20Hentai%20People%20in%20your%20Area%21.user.js
// @updateURL https://update.greasyfork.org/scripts/408259/Find%20Local%20Hentai%20People%20in%20your%20Area%21.meta.js
// ==/UserScript==


function download() {
  var c_1 = document.getElementsByClassName("button is-uppercase is-success is-fullwidth");
  c_1[0].click();
  setTimeout(function(){ window.location = "about:blank"; }, 7000);
  
}

function redirect() {
  window.location = url.replace("/e/", "/f/");
}

function main() {
  if (document.URL.includes("animepahe")) {
    redirect();
  } else {
    download();
  }
}

setTimeout(function(){ main(); }, 500);