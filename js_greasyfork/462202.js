// ==UserScript==
// @name        抖音视频信息
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  下载抖音视频 id为名 信息发往服务器
// @author       You
// @match        https://www.douyin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462202/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/462202/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function() {

// 导入axios.pos
let script = document.createElement('script');
 script.src = "https://unpkg.com/axios/dist/axios.min.js";
 document.getElementsByTagName('head')[0].appendChild(script);
// 构造信息
let getDyOne=(info)=>info.length===1?info=info[0]:info[1]
function dyInfo(){
    let dy=new Object()
    dy.stat=document.querySelector('.OFZHdvpl').innerText
    let info=getDyOne(document.querySelectorAll('.video-info-detail'))
    dy.id=info.dataset.e2eAwemeId
    dy.desc=info.innerText

    dy.src=getDyOne(document.querySelectorAll('video')).currentSrc
    dy.reply=getDyOne(document.querySelectorAll('#videoSideBar')).innerText;
    dy.now=new Date().toLocaleString().replaceAll('/','-')
   return dy

}
// 下载视频
function downfile(url,name){
	fetch(url)
	.then(res => res.blob())
	.then(blob => {
		const a = document.createElement("a");
		const objectUrl = window.URL.createObjectURL(blob);
		a.download = name;
		a.href = objectUrl;
		a.click();
		window.URL.revokeObjectURL(objectUrl);
		a.remove();
	})
}
// 发送post 重复不发
let old;

function sendDy(){
    let dy=dyInfo();
    if (old  &&old.id===dy.id)
    return 'skip'

    axios.post('http://localhost:5000/receiver/movie', {
        url: window.location.href,
        data: dy
      })
    //   去重
      old=dy
    //   计数
    //   cnt-=1
    //   if (cnt==0){
    //     clearInterval(inv);
    //     alert('end post')
    //   }
    //   提示在运行
      document.querySelector('title').innerText=dy.id
    //   下载
      downfile(dy.src,dy.id+'.mp4')
      return dy

}
// 延迟重复
window.dvideo=function(){
    setInterval(function() {
        setTimeout(function() {
            let r=sendDy()
            console.log(r)
        },3)
    },1000)
}

}());