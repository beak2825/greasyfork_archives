// ==UserScript==
// @name         ppics
// @namespace    http://tampermonkey.net/
// @version      2024-03-33
// @description  Converting Into FullScreen Slide
// @author       You
// @match        https://www.pornpics.de/galleries/*/
// @match        https://www.pornpics.com/galleries/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pornpics.de
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491225/ppics.user.js
// @updateURL https://update.greasyfork.org/scripts/491225/ppics.meta.js
// ==/UserScript==

function onButtonClick()
{
    fetch("https://www.pornpics.de/random/index.php?lang=en", {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "en-US,en;q=0.5",
        "X-Requested-With": "XMLHttpRequest",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "Pragma": "no-cache",
        "Cache-Control": "no-cache"
    },
    "referrer": location.href,
    "method": "POST",
    "mode": "cors"
}).then(request => {
  request.json().then(stre => {
      location.href = stre.link;
      //console.log(stre.link)
     //imageEvent(stre.link)
  })
})
}

function imageEvent(galink)
{
         fetch(galink, {
    "credentials": "omit",
    "headers": {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Access-Control-Allow-Origin": "*",
        "Sec-GPC": "1",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Pragma": "no-cache",
        "Cache-Control": "no-cache"
    },
    "method": "GET",
    "mode": "cors"
}).then(request => {
  request.text().then(stre => {
     let nextGalAnchor = document.createElement("div");
      nextGalAnchor.innerHTML = stre;
      for(let i=0; i < document.querySelectorAll('img.pswp__img').length; i++)
      {
          const remoteImages = nextGalAnchor.querySelectorAll('img.ll-loaded');
          console.log(remoteImages)
          if ( i < remoteImages.length){
              document.querySelectorAll('img.pswp__img')[i].src = remoteImages[i].src;
          }
      }
  })
});
}

function helper1(){
    let topDiv = document.querySelectorAll('.pswp__top-bar')[0];
    let nextGalAnchor = document.createElement("A");
    //document.querySelectorAll('img.pswp__img')[1].addEventListener('click', onButtonClick)
    let nextGalBtn = document.querySelectorAll('.pswp__button--zoom')[0].cloneNode(true);
    //let nextGalBtn = document.createElement("BUTTON");
    //nextGalBtn.className = document.querySelectorAll('.pswp__button--fullscreen-button')[0].className;
    //nextGalBtn.removeEventListener("click", () => {})
    //nextGalBtn.className = "pswp__button";
    //nextGalBtn.innerHTML = "N";
    nextGalAnchor.innerHTML = "N";
    nextGalBtn.addEventListener('click', onButtonClick);
    topDiv.appendChild(nextGalBtn);
    topDiv.appendChild(nextGalAnchor);
    document.querySelectorAll('.pswp__button--fullscreen-button')[0].click();
}

(function() {
    'use strict';
    setTimeout(function () {
        document.querySelectorAll('.icon-play')[0].click()
    }, 1500)
    setTimeout(helper1, 2000);
//document.querySelectorAll('.pswp__button--fullscreen-button')[0].onload = () => {document.querySelectorAll('.pswp__button--fullscreen-button')[0].click()}
    // Your code here...
})();