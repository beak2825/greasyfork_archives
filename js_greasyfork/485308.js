// ==UserScript==
// @name         Youtube - Auto Show Live Chat Replay
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Youtube Auto Show Live Chat Replay, YT自动展开直播聊天回放
// @author       Martin______X
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485308/Youtube%20-%20Auto%20Show%20Live%20Chat%20Replay.user.js
// @updateURL https://update.greasyfork.org/scripts/485308/Youtube%20-%20Auto%20Show%20Live%20Chat%20Replay.meta.js
// ==/UserScript==

let $__videoId = null;
//
const objClick = (async (obj) => {
    obj.click();
});
//
const idCheckLiveChatInterval = setInterval(() => {
    try{
        //watch-active-metadata style-scope ytd-watch-flexy style-scope ytd-watch-flexy
        let video_des =document.querySelector('.watch-active-metadata[video-id]');
        let videoId = video_des.getAttribute("video-id");
        if ($__videoId != videoId) {
            let chat = document.querySelector("#chat");
            if (chat.hasAttribute("collapsed")) {
                let button = chat.querySelector('button');
                objClick(button);
            } else {
                console.warn("Live Chat Expanded!");
                $__videoId = videoId;
            }
        }
    }catch(error){
        //console.error(error);
    }
}, 1);