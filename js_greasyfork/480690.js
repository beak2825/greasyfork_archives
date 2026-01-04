// ==UserScript==
// @name         amusic.tk 试听下载
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.4
// @description  点击播放即可自动下载试听版本音乐
// @author       Alan
// @match        https://amusic.tk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amusic.tk
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480690/amusictk%20%E8%AF%95%E5%90%AC%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/480690/amusictk%20%E8%AF%95%E5%90%AC%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //自定义download方法为了自定义下载文件名
    function downloadFile(url,fileName) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function() {
            if (this.status === 200) {
                var blob = new Blob([this.response]);
                var blobUrl = window.URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = fileName;
                a.click();
                window.URL.revokeObjectURL(blobUrl);
            }
        };
        xhr.send();
    }

    function creatDownload(){
        let rightEle=document.querySelector(".right-4")
        let fistChild=rightEle.children[0].children[0];
        let ele=document.createElement("a");
        ele.className="download n-button__icon";
        ele.setAttribute("style","color: white;    background-color: #ff0f0f;    font-weight: bolder;")
        ele.textContent="下载";
        fistChild.parentNode.insertBefore(ele,fistChild)
    }
    let oldUrl='';
    console.log("开始");
    document.onclick=()=>{
        let playBtn;
        let  btn=document.querySelectorAll(".n-button__content");
        let dwn=document.querySelector(".download");
        if (dwn ==null){
            creatDownload();
            console.log("已添加下载按钮")
        }
        for(let i=0;i<btn.length;i++){
            if(btn[i].textContent=="播放"){
                // console.log(btn[i])
                playBtn=btn[i]
            }

        }
        if (playBtn==undefined){
            console.log("暂未找到播放按钮");
            return
        }
        let dlink=document.querySelector(".download");
        playBtn.addEventListener("click",()=>{
            let tim=setInterval(()=>{
                let audio=document.querySelector("audio")
                if(audio!=null){
                    if(audio.src!=oldUrl && audio.src!=undefined ){
                        // let name=document.querySelector(".n-card-header__main").textContent;
                        let  name   = document.querySelector(".text-lg").textContent; //从播放器获得名称
                        dlink.setAttribute("download",audio.src);
                        dlink.setAttribute("href",audio.src);
                        dlink.textContent=name;
                        dlink.setAttribute("target","_blank")
                        downloadFile(audio.src,name+".mp3");
                        oldUrl=audio.src
                        console.log("正在下载：",name,audio.src)
                    }

                }


            },500)

            },"once")
    }

})();