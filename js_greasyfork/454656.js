// ==UserScript==
// @name        hanime.tv - avatar & banner helper
// @namespace   https://myanimelist.net/profile/kyoyatempest
// @include     https://hanime.tv/channel
// @match       https://hanime.tv/channels/*
// @version     1.6
// @author      kyoyacchi
// @description This scripts lets you open avatar and banner in a new tab when you click on them.
// @icon        https://hanime.tv/favicon.ico
// @license gpl-3.0
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/454656/hanimetv%20-%20avatar%20%20banner%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/454656/hanimetv%20-%20avatar%20%20banner%20helper.meta.js
// ==/UserScript==


function App(){

let v = document.querySelector(".avatar__image")
? document.querySelector(".avatar__image") : null;

let url = document.querySelector(".avatar__image") ? document.querySelector(".avatar__image").style.backgroundImage.split('"')[1] : null;

if (v){
v.onclick = function () {
  if (url) {
window.open(url, "_blank")

  }
}
}


let banner =document.querySelector(".channel__banner")? document.querySelector(".channel__banner") : null;
let bannerurl = banner ? document.getElementsByClassName("channel__banner__bg_overlay")[0].style.backgroundImage.split('"')[1] : null;



  if (banner){

banner.onclick = function () {
  if (bannerurl == "https://static-assets-44d.pages.dev/images/temp_bg_top.png") {//default
    return
  } else {

   window.open(bannerurl,"_blank")
  }

}
  }


}
window.addEventListener("load",()=>{
  App();
});
let curl = window.location.href
function checkUrl (){
  let newUrl = window.location.href
  if(newUrl != curl){
    App();
  }
}

setInterval(checkUrl,1000);