// ==UserScript==
// @name        TMDB search IDs
// @description Show TMDB IDs in TMDB search
// @namespace   Violentmonkey Scripts
// @match       https://www.themoviedb.org/search
// @grant       none
// @version     1.0
// @author      SH3LL
// @downloadURL https://update.greasyfork.org/scripts/477760/TMDB%20search%20IDs.user.js
// @updateURL https://update.greasyfork.org/scripts/477760/TMDB%20search%20IDs.meta.js
// ==/UserScript==


let myblocks=document.getElementsByClassName("card v4 tight");
for(let currblock of myblocks){
  // get ID
  let content_id=currblock.children[0].children[0].children[0].children[0].href.replace("https://www.themoviedb.org/tv/","").replace("https://www.themoviedb.org/movie/","")

  // craft label
  let mylabel=document.createElement("label");
  mylabel.style.color="red";
  mylabel.style.fontWeight="bold";
  mylabel.style.fontSize="20px";
  mylabel.innerText=content_id;

  // append label
  currblock.children[0].children[1].children[0].children[0].append(mylabel);
}