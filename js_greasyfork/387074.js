// ==UserScript==
// @name         zuber视频播放
// @namespace    mscststs
// @version      0.1
// @description  就不装APP
// @author       mscststs
// @match        http*://mobile.zuber.im/*
// @require https://greasyfork.org/scripts/38220-mscststs-tools/code/MSCSTSTS-TOOLS.js?version=713767
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387074/zuber%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/387074/zuber%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    async function  init(){
        let d = await mscststs.wait(".video_detail_wrap.photo")
        d.addEventListener("click",function(e){
            let video = document.querySelector(".video_detail_wrap.photo").style.backgroundImage.slice(5,100).split("?")[0];

            window.open(video);
            e.cancelBubble = true;
            e.stopPropagation();
            e.preventDefault();

        },true)
    }
    init();
})();