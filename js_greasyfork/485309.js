// ==UserScript==
// @name         Youtube - Auto Expand Video Description
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  Youtube Auto Expand Video Description! YT自动展开视频描述详细！
// @author       Martin______X
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485309/Youtube%20-%20Auto%20Expand%20Video%20Description.user.js
// @updateURL https://update.greasyfork.org/scripts/485309/Youtube%20-%20Auto%20Expand%20Video%20Description.meta.js
// ==/UserScript==

let _$videoId = "";
//Async
const simpleClick = (async (obj) => {
    obj.click();
});
//Loop
const videoIdCheckDesInterval = setInterval(() => {
    try{
        //watch-active-metadata style-scope ytd-watch-flexy style-scope ytd-watch-flexy
        let video_des =document.querySelector('.watch-active-metadata[video-id]');
        let videoId = video_des.getAttribute("video-id");
        if (_$videoId != videoId) {
            if (video_des.hasAttribute("description-collapsed")) {
                //let collapse = video_des.querySelector("#collapse");
                let expand = video_des.querySelector("#expand");
                simpleClick(expand);
            }else{
                console.warn("Description Expanded!");
                _$videoId = videoId;
            }
        }
    }catch(error){
        //console.error(error);
    }
}, 1);