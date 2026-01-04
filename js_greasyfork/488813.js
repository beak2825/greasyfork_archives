// ==UserScript==
// @name         bilibili-bgm-video-download
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  bilibili bgm video downloader， 修改下载文件名称为视频名称
// @author       newbieking
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488813/bilibili-bgm-video-download.user.js
// @updateURL https://update.greasyfork.org/scripts/488813/bilibili-bgm-video-download.meta.js
// ==/UserScript==



console.log("For learning and communication only, commercial use is strictly prohibited, please delete within 24 hours\n\tCreated by newbieking.");
loadData( __playinfo__.data.dash.audio[0].base_url, __playinfo__.data.dash.video[0].base_url);
eventInit();
var items='';

// 接收音频和视频的URL，并将它们分别转换为Blob对象。
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

// 定义一个函数，用于初始化事件
function eventInit(){
    // 设置一个时间间隔
    let interval = setInterval(()=>{
        // 获取页面中所有类名为'clickitem'的元素
        items = document.querySelectorAll('.clickitem');
        // 如果获取到的元素长度不为0
        if(items.length != 0){
            // 停止执行setInterval,clearInterval() 方法的参数必须是由 setInterval() 返回的 ID 值。
            clearInterval(interval);
            // 遍历每个元素
            items.forEach((item, index)=>{
                // 为每个元素添加点击事件监听器
                item.addEventListener('click', (e)=>{
                    // 构建请求的 URL
                    let url = `https://api.bilibili.com/x/player/playurl?avid=${__INITIAL_STATE__.aid}&bvid=${__INITIAL_STATE__.bvid}&cid=${__INITIAL_STATE__.videoData.pages[index].cid}&fnval=4048`;
                    fetch(url, {// 发起网络请求
                        method: "GET",
                        responseType: "application/json"
                    }).then((res)=>{
                        return res.json();
                    }).then((j)=>{
                        // 移除页面中所有类名为'download'的元素
                        document.querySelectorAll('.download').forEach((e)=>{e.remove()})
                        // 加载音频和视频数据
                        loadData(j.data.dash.audio[0].base_url, j.data.dash.video[0].base_url);
                    }).catch((err)=>{
                        // 捕获异常并打印错误信息到控制台
                        console.log(err);
                    })
                })
            })
        }
    }, 300);
}

// 接受两个参数，一个是 `<a>` 元素，另一个是样式。创建一个 `<li>` 元素，将其中的 `<a>` 元素作为子元素添加，用于在页面上显示下载链接。
function desktop(aElement, style){
let liElement = document.createElement('li')
liElement.classList.add("download");
liElement.appendChild(aElement);
    liElement.style = style;;
    document.body.appendChild(liElement);
}


// 将Blob对象添加到 `<a>` 元素的href属性中，以创建一个可下载的链接。
function getA(blob, content, ext){
    let bl = new Blob([blob], {type: "audio/mp3"})
    const a = document.createElement('a');
    a.href = URL.createObjectURL(bl);
    document.body.appendChild(a);
    if(document.querySelector('.video-title') == null){
      a.download = Date.now()+'.'+ext;
    }else{
      a.download = document.querySelector('.video-title').textContent+'.'+ext;
    }
    a.target = "_blank";
    a.textContent = content;
    return a;
}
