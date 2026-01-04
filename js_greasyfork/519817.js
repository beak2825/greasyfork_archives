// ==UserScript==
// @name         Mypikpak Video Download
// @name:zh      Mypikpak视频下载器
// @namespace    https://github.com/hugeWrongMistake/MypikpakVideoDownloader_direct
// @author       hugeWrongMistake
// @version      2024-12-05
// @description  A Tampermonkey scrpit for downloading videos from mypikpak.
// @description:zh 从Mypikpak下载视频的Tampermonkey脚本
// @match        https://mypikpak.com/s/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mypikpak.com
// @grant        GM_registerMenuCommand
// @grant        GM_addElement
// @grant        GM_download
// @connect      localhost
// @downloadURL https://update.greasyfork.org/scripts/519817/Mypikpak%20Video%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/519817/Mypikpak%20Video%20Download.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getVideoFilename(){
        const ele = document.getElementsByClassName("title")[0];
        if(!ele)
        {
            alert("Cant find video name");
            return "download.mp4";
        }
        else{return ele.innerText;}
    }
    function findVideos(cb)
    {
        const arr = document.getElementsByTagName("video");
        if(arr.length <= 0)
        {
            const msg = "Can't find any Video Element";
            alert(msg);
            throw msg;
        }
        const filename = getVideoFilename();
        for(var ele of arr)
        {
            console.log("found a video:" + filename);
            console.log("link:" + ele.currentSrc);
            cb(ele.currentSrc, filename);
        }
    }
    const menu_command_id = GM_registerMenuCommand("Detect Videos",function(event){
        findVideos((url, name)=>{
            if(name = prompt("Download? \n"+ url, name)){
                GM_download(url, name);
                console.log("start download: "+name);
            }
        });
        //
    },"d");
})();
