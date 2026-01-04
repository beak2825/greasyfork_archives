// ==UserScript==
// @name         pobieracz cda.pl
// @namespace    https://greasyfork.org/pl/users/389583-adrian080
// @version      0.1.3
// @description  Stara się umożliwić pobranie wideo, obejrzenie osobno i skopiowanie linku.
// @author       Adrian080
// @license      GNU GPLv3
// @match        http*://www.cda.pl/video/*
// @icon         http://scdn2.cda.pl/img/icon/fav/favicon.ico
// @run-at       document-end
// @grant        GM_setClipboard
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/439462/pobieracz%20cdapl.user.js
// @updateURL https://update.greasyfork.org/scripts/439462/pobieracz%20cdapl.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = '#downloaderButton{background-color:rgba(0,0%,0%,50%);border-radius:100%;font-size:1rem;padding:.3rem;position:absolute;top:4px;left:4px;cursor:pointer;z-index:69690;line-height:normal!important;transition:all 250ms}#downloaderButton:hover{transform:scale(1.2,1.2)}@keyframes popup-box{from{opacity:0;top:-20rem}to{opacity:1;top:0}}@keyframes popup-box-bg{from{background:rgba(0,0,0,0)}to{background:rgba(0,0,0,.5)}}#popup-box{line-height:normal!important;animation-name:popup-box-bg;animation-duration:.8s;font-size:120%;color:#fff;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.5);width:100%;height:100%;position:fixed;text-align:center;top:0;left:0;z-index:69691}#popup-box>div{animation-name:popup-box;animation-duration:.8s;background-color:#323232;box-shadow:0 0 1.5rem .3rem #969696;height:auto;max-width:50%;vertical-align:middle;position:relative;border-radius:1rem;padding:1.5rem}#popup-box #title{color:#0090ff;font-size:1.5rem;font-weight:700}#popup-box #current-quality{font-size:1.5rem;color:#00a0ff}#popup-box .buttons-container{width:60%;margin:0 auto}#popup-box button{display:block;width:100%;margin:.4rem;padding:.4rem;color:#fff;background-color:#0069ff;border:none;border-radius:.4rem;transition:all 250ms}#popup-box button:hover{background-color:#05f;transform:scale(1.1,1.1)}#popup-close-button{background-color:#1e1e1e;border-radius:100%;display:inline-block;font-family:arial;font-weight:bolder;position:absolute;top:-1rem;right:-1rem;font-size:2rem;padding:0 .6rem;cursor:pointer}#popup-close-button:hover{background-color:#000e36}';
    document.getElementsByTagName('head')[0].appendChild(style);

    const mainButton = document.createElement("span");
    mainButton.setAttribute("id", "downloaderButton");
    mainButton.setAttribute("style", "display: none;");
    mainButton.innerHTML = "🎥";
    document.getElementsByClassName("pb-player-html-wrapper")[0].appendChild(mainButton);

    const popUp = document.createElement("div");
    popUp.setAttribute("id", "popup-box");
    popUp.innerHTML = '<div><div id=popup-close-button>×</div><div id=title>Ładowanie...</div><br>Obecnie wybrana jakość wideo:<br><span id=current-quality></span><br><span style=font-size:.75rem>(ustaw w odtwarzaczu)</span><br><br><div class=buttons-container><button id=copy-btn>📎 Skopiuj link</button> <button id=open-tab-btn>🎞️ Otwórz w nowej karcie<br>i/lub<br>📂 Pobierz</button></div></div>';
    document.getElementsByClassName("pb-player-html-wrapper")[0].appendChild(popUp);

    const popupBox = document.getElementById("popup-box");
    const popupContent = document.querySelector("#popup-box div");
    const popupClose = document.getElementById("popup-close-button");
    const currentQuality = document.getElementById("current-quality");
    const title = document.getElementById("title");
    const copy = document.getElementById("copy-btn");
    const openTab = document.getElementById("open-tab-btn");

    let videoUrl, videoTitle, videoThumb, playerData;

    mainButton.addEventListener("click", ()=>{
       popupBox.style.display = "flex";
       playerData = document.getElementsByClassName("brdPlayer brndPlayerPd")[0].firstElementChild.getAttribute("player_data");
       playerData = JSON.parse(playerData);
       videoTitle = decodeURI(playerData.video.title);
       videoUrl = document.querySelector("video.pb-video-player").getAttribute("src");
       videoThumb = "https:"+playerData.video.thumb;
       videoThumb = videoThumb.substring(0, videoThumb.search("_ooooxooxox_")+12)+"160x90.jpg";
       currentQuality.innerHTML = document.getElementsByClassName("pb pb-quality-txt")[0].innerHTML;
       title.innerHTML = videoTitle;
    });
    popupBox.addEventListener("click", ()=>{
      if(!popupContent.matches(":hover") || popupClose.matches(":hover")){
        popupBox.style.display = "none";
      }
    });
    copy.addEventListener("click", ()=>{
        GM_setClipboard(videoUrl);
        GM_notification({title: "Skopiowano do schowka!", text: "Link do filmu został skopiowany do twojego schowka :D", image: videoThumb,timeout: 6000});
    });
    openTab.addEventListener("click", ()=>{
        window.open(videoUrl, "_blank").focus();
    });
   const observer = new IntersectionObserver(()=>{
        if(mainButton.style.display == "none"){
            mainButton.style.display = "inline-block";
        }else{
            mainButton.style.display = "none";
        }
    });
    observer.observe(document.getElementsByClassName("button-players")[0]);
})();