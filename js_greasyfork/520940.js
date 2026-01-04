// ==UserScript==
// @name         YT Auto Play 
// @namespace    https://greasyfork.org/YT auto pl
// @version      3.1
// @description  YT pl, skip
// @license      Jimbootie 
// @match        *://www.youtube.com/playlist?list=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520940/YT%20Auto%20Play.user.js
// @updateURL https://update.greasyfork.org/scripts/520940/YT%20Auto%20Play.meta.js
// ==/UserScript==

(function(){ 
    "use strict";

    const playlists=[
        "https://www.youtube.com/playlist?list=PLtFqVlD5Wsh2inWKzYddqXToQX12-FEto",
        "https://www.youtube.com/playlist?list=PLtFqVlD5Wsh2NSD4Nkmlfg32761HdOjkq",
        "https://www.youtube.com/playlist?list=PLtFqVlD5Wsh3SqjIMeK8YoUL0FBRWPaza"
    ];
    
    let currentPlaylistIndex=parseInt(localStorage.getItem("currentPlaylistIndex"),10);
    let loopCount=parseInt(localStorage.getItem("loopCount"),10) || 0;
    
    if(isNaN(currentPlaylistIndex)||currentPlaylistIndex>=playlists.length){currentPlaylistIndex=-1;}

    function clickPlayAll(){
        const selectors=[
            'ytd-button-renderer.style-scope.ytd-playlist-header-renderer a',
            'button[aria-label="Play all"]',
            'ytd-playlist-video-renderer:first-child a'
        ];
        for(let selector of selectors){
            let button=document.querySelector(selector);
            if(button){button.click();return;}
        }
        let firstVideo=document.querySelector('ytd-playlist-video-renderer:first-child a');
        if(firstVideo){firstVideo.click();}
    }

    function skipSong(){
        let nextButton=document.querySelector(".ytp-next-button");
        if(nextButton){nextButton.click();}
    }

    function getRandomSkipTime(){return Math.floor(Math.random()*(55-45+1))+45;}

    function goToNextPlaylist(){
        if(loopCount>=10){
            console.log("✅ Loop completed 10 times. Stopping script.");
            return;
        }
        currentPlaylistIndex=(currentPlaylistIndex+1)%playlists.length;
        if(currentPlaylistIndex===0){loopCount++;localStorage.setItem("loopCount",loopCount);}
        localStorage.setItem("currentPlaylistIndex",currentPlaylistIndex);
        window.location.href=playlists[currentPlaylistIndex];
    }

    function startAutomation(){
        setTimeout(clickPlayAll,5000);
        function scheduleSkip(){
            setTimeout(()=>{
                skipSong();
                scheduleSkip();
            },getRandomSkipTime()*1000);
        }
        scheduleSkip();
        setTimeout(goToNextPlaylist,35*60*1000);
    }

    const currentUrl=window.location.href;
    let detectedIndex=playlists.findIndex(url=>currentUrl.includes(url.split("=")[1]));
    if(detectedIndex!==-1){
        currentPlaylistIndex=detectedIndex;
        localStorage.setItem("currentPlaylistIndex",currentPlaylistIndex);
    }

    window.onload=startAutomation;
})();
