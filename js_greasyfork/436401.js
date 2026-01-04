// ==UserScript==
// @name         Youtube Dislike Viewer (USE YOUR OWN API, READ BEFORE DOWNLOADING!)
// @namespace    http://tampermonkey.net/
// @version      1
// @description  A script to add Youtube dislikes back. Use your own API, the extensions don't update the dislikes instantly so I made this.
// @license MIT
// @author       Dildoer the Cocknight
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436401/Youtube%20Dislike%20Viewer%20%28USE%20YOUR%20OWN%20API%2C%20READ%20BEFORE%20DOWNLOADING%21%29.user.js
// @updateURL https://update.greasyfork.org/scripts/436401/Youtube%20Dislike%20Viewer%20%28USE%20YOUR%20OWN%20API%2C%20READ%20BEFORE%20DOWNLOADING%21%29.meta.js
// ==/UserScript==

(function() {

//MAKE SURE YOU ENTER YOUR OWN API IN HERE! I'M NOT LETTING ANYONE USE MINE!
let api = "";

let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    onUrlChange();

  }
}).observe(document, {subtree: true, childList: true});

    function getInfo(){
if(window.location.href.split('/')[3].substring(0, 5) == "watch"){
                    console.log('yes');
    fetch(`https://www.googleapis.com/youtube/v3/videos?id=${location.href.split("?v=")[1]}&key=${api}&part=statistics`)
    .then(res => res.json())
    .then((out) => {

    console.log(out);

let dislikeTimer = setInterval(() => {
    if(document.querySelectorAll('ytd-toggle-button-renderer a yt-formatted-string')[1] != undefined){

    let dislikes = out.items[0].statistics.dislikeCount;
        console.log(`the dislikes are ${dislikes}`)
    if (dislikes > 99999999) { dislikes = Math.round(dislikes / 10000000) + "M" } else if (dislikes > 999999) { dislikes = Math.round(dislikes / 100000) / 10 + "M" } else if (dislikes > 9999) { dislikes = Math.round(dislikes / 10000) + "K" } else if (dislikes > 999) { dislikes = Math.round(dislikes / 100) / 10 + "K" }

        document.querySelectorAll('ytd-toggle-button-renderer a yt-formatted-string')[1].innerText = dislikes;

        if(document.querySelector('.ratioBar') != undefined){
  document.querySelector('.likesBar').style.width = `${(parseInt(out.items[0].statistics.likeCount) / (parseInt(out.items[0].statistics.likeCount) + parseInt(out.items[0].statistics.dislikeCount))) * 100}%`;
} else{
document.querySelector('#menu-container ytd-menu-renderer').insertAdjacentHTML('beforeend', `
<div class="ratioBar" style="
    width: 34%;
    background-color: red;
    height: 3px;
    margin-top: 35px;
    position: absolute;
            "><div class="likesBar" style="
    background-color: green;
    width: ${(parseInt(out.items[0].statistics.likeCount) / (parseInt(out.items[0].statistics.likeCount) + parseInt(out.items[0].statistics.dislikeCount))) * 100}%;
    height: 100%;
"></div></div>
`
                                                 );


}

        clearInterval(dislikeTimer);
} else{ console.log('waiting for dislike button to spawn before proceeding...')}
}, 100);


}).catch(err => console.error(err));
                }
}


function onUrlChange() {

console.log('url changed');
 getInfo();

}

   getInfo();


})();