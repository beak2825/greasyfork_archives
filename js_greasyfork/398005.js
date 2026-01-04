// ==UserScript==
// @name         Crunchyroll Skip Ads
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Skips ads on crunchyroll!
// @author       theusaf
// @match        https://static.crunchyroll.com/vilos-v2/web/vilos/player.html*
// @include      /^https?:\/\/(www\.)?crunchyroll\.com\/.*$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398005/Crunchyroll%20Skip%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/398005/Crunchyroll%20Skip%20Ads.meta.js
// ==/UserScript==

let video;
let video2;

console.log("ANTIAD-LOADED");

function getVideo(){
    console.log("ANTIAD-DETECTING VIDEO")
    video = location.host === "static.crunchyroll.com" && document.querySelector("video");
    video2 = document.querySelector('[title="Advertisement"]');
    if(!video && !video2){
        setTimeout(getVideo,2000);
    }else{
        console.log("ANTIAD-DETECTED VIDEO");
        activate(video || video2);
    }
}

function activate(video){
    const isAd = document.querySelector("[data-testid=vilos-ad_label]");
    let isAd2;
    try{
        isAd2 = getComputedStyle(video.parentElement).display === "block" && video.title === "Advertisement";
    }catch(e){
        isAd2 = false;
    }
    if(isAd){
        console.log("ANTIAD-SKIPPING [1]");
        const min = Number(isAd.innerHTML.match(/\d+(?=:)/)[0]) * 60;
        const sec = Number(isAd.innerHTML.match(/\d+(?=\))/)[0]) - 2;
        if(min + sec > 120){
            console.log(min + sec);
            video.currentTime += 120;
        }else{
            video.currentTime += min + sec;
        }
        setTimeout(function(){
            activate(video);
        },10000);
    }else if(isAd2){
        console.log("ANTIAD-SKIPPING [2]");
        try{
          video.currentTime += (video.duration - (video.currentTime + 0.5));
        }catch(err){}
        setTimeout(function(){
            activate(video);
        },1000);
    }else{
        console.log("ANTIAD-SCANNING");
        setTimeout(function(){
            activate(video);
        },3000);
    }
}

getVideo();