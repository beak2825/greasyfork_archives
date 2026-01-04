// ==UserScript==
// @name         bilibili-bgm-video-download
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  bilibili bgm video downloader
// @author       newbieking
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452420/bilibili-bgm-video-download.user.js
// @updateURL https://update.greasyfork.org/scripts/452420/bilibili-bgm-video-download.meta.js
// ==/UserScript==



console.log("For learning and communication only, commercial use is strictly prohibited, please delete within 24 hours\n\tCreated by newbieking.");
loadData( __playinfo__.data.dash.audio[0].base_url, __playinfo__.data.dash.video[0].base_url);
eventInit();
var items='';
async function loadData(audio_url, video_url){
    const audio_blob = await getBlob(audio_url);
    const video_blob = await getBlob(video_url);
    let a = getA(audio_blob, '下载BGM', 'mp3');
    let v = getA(video_blob, '下载视频', 'mp4');
    desktop(a, 'font-size: 26px; position: fixed; top: 200px; left: 0; z-index: 9999; list-style: none; border: 1px red solid; border-radius: 10px;background-color: #EDDBFF; text-decoration: none; padding:5px');
    desktop(v, 'font-size: 26px; position: fixed; top: 400px; left: 0; z-index: 9999; list-style: none; border: 1px red solid; border-radius: 10px;background-color: #EDDBFF; text-decoration: none; padding:5px');
}

async function getBlob(url) {
    return await fetch(url, {
      method: "GET",
        responseType: "blob"
    }).then((res)=>{
       return res.blob();
    }).then((blob)=>{
       return blob;
    }).catch((err)=>{
       console.log(err);
    });
}

function eventInit(){

    let interval = setInterval(()=>{
        items = document.querySelectorAll('.clickitem');
        if(items.length != 0){
            clearInterval(interval);
            items.forEach((item, index)=>{
                item.addEventListener('click', (e)=>{
                    let url = `https://api.bilibili.com/x/player/playurl?avid=${__INITIAL_STATE__.aid}&bvid=${__INITIAL_STATE__.bvid}&cid=${__INITIAL_STATE__.videoData.pages[index].cid}&fnval=4048`;
                    fetch(url, {
                        method: "GET",
                        responseType: "application/json"
                    }).then((res)=>{
                        return res.json();
                    }).then((j)=>{
                        //console.log(j)
                        //console.log(document.querySelector('#download'));
                        document.querySelectorAll('.download').forEach((e)=>{e.remove()})
                        loadData(j.data.dash.audio[0].base_url, j.data.dash.video[0].base_url);
                    }).catch((err)=>{
                        console.log(err);
                    })
                })
            })
        }
    }, 300);


}

function desktop(aElement, style){
//let ulElement = document.querySelector('.right-entry')
let liElement = document.createElement('li')
liElement.classList.add("download");
liElement.appendChild(aElement);
//ulElement.appendChild(liElement)

    liElement.style = style;;

    document.body.appendChild(liElement);
}


function getA(blob, content, ext){
    let bl = new Blob([blob], {type: "audio/mp3"})
    const a = document.createElement('a');
    a.href = URL.createObjectURL(bl);
    document.body.appendChild(a);
    if(document.querySelector('.tag-txt') == null){
      a.download = Date.now()+'.'+ext;
    }else{
      a.download = document.querySelector('.tag-txt').textContent+'.'+ext;
    }
    a.target = "_blank";
    a.textContent = content;
    return a;
}