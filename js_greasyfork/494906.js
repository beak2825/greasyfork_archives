// ==UserScript==
// @name         Rumble - Auto Best Video Quality
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Rumble - Auto Best Video Quality.
// @author       Martin______X
// @match        https://rumble.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rumble.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494906/Rumble%20-%20Auto%20Best%20Video%20Quality.user.js
// @updateURL https://update.greasyfork.org/scripts/494906/Rumble%20-%20Auto%20Best%20Video%20Quality.meta.js
// ==/UserScript==

let $url = "";
let $click_times = 0;
const simpleClick = (async (target, a)=>{
    if(target){
        target.click();
    }
    if(a){
        $click_times++;
    }
});

//
const rumbleQualityInterval = setInterval(() => {
    let url = document.URL;
    if(url != $url){
        try{
            // playback setting
            let playback = document.getElementsByClassName("touched_overlay_item")[0].nextElementSibling.lastChild.lastChild;
            // setting click object
            let playback_click = playback.firstChild;
            //click setting
            simpleClick(playback_click);
            //quality click
            let quality = playback.lastChild.lastChild.lastChild;
            simpleClick(quality, true);
        }catch{/*do nothing*/}

        // multi clicks check
        if($click_times > 3){
            $click_times = 0;
            $url = url;
        }
    }
}, 500);