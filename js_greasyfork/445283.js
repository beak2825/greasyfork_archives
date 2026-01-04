// ==UserScript==
// @name        OPS - releases colored
// @description OPS releases and albums colored
// @match       https://orpheus.network/*
// @grant       none
// @version     1.1
// @author      SH3LL
// @license     GPLv3
// @namespace https://greasyfork.org/users/762057
// @downloadURL https://update.greasyfork.org/scripts/445283/OPS%20-%20releases%20colored.user.js
// @updateURL https://update.greasyfork.org/scripts/445283/OPS%20-%20releases%20colored.meta.js
// ==/UserScript==

function main(){
  let albums = document.getElementsByClassName("group_info clear");
  for (let album of albums){
      for(let album_word of album.children){
        if(album_word.tagName === "A") album_word.style.color = 'aquamarine';
      }
      for(let album_word of album.children[0].children){
        album_word.style.color = 'aquamarine';
      }    
  }
  
  
  let album_versions = document.getElementsByClassName("edition_info");
  for (let album_version of album_versions){
      album_version.children[0].style.color = 'mediumturquoise';   
  }
}

main();