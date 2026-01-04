// ==UserScript==
// @name        广东国家开放大学在线自动观看学习
// @namespace   www.31ho.com
// @match       http://lms.ouchn.cn/course/*
// @version     1.2
// @author      keke31h
// @grant       GM_setValue
// @grant       GM_getValue
// @description 自动播放国开在线课程
// @downloadURL https://update.greasyfork.org/scripts/427940/%E5%B9%BF%E4%B8%9C%E5%9B%BD%E5%AE%B6%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E5%9C%A8%E7%BA%BF%E8%87%AA%E5%8A%A8%E8%A7%82%E7%9C%8B%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/427940/%E5%B9%BF%E4%B8%9C%E5%9B%BD%E5%AE%B6%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E5%9C%A8%E7%BA%BF%E8%87%AA%E5%8A%A8%E8%A7%82%E7%9C%8B%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==
function sleep(timeOutMs) {
    return new Promise((resolve) => {
        setTimeout(resolve, timeOutMs);
    });
}

async function waitVideo(video){
  return new Promise((resolve) => {
    
    video.addEventListener('ended', function () { //结束
        console.log("播放结束");
        resolve(video);
    }, false);
  });
}

(async function(){
  //等待15s
  await sleep(10000);
  
  let index = 0 ;
  
  let path = window.location.pathname ;
  let key = 'lms.ouchn.cn';
 
  if(path.search('learning-activity') > 0){
     key = path.substring(0,path.search('learning-activity'));
     index = GM_getValue(key,0);
  }
  
  
  let nodes = document.querySelectorAll('a.activity-title');
  
  if(nodes){
    nodes = Array.from(nodes);
    for(let i = index ; i < nodes.length ; ++i){
      let node = nodes[i];
      node.click();
      
      await sleep(2 * 1000);
      
      GM_setValue(key,i);
      
      let video = document.getElementsByTagName('video');
      if(video.length > 0){
        video = video[0];
        video.muted = true ;
        video.play();
        await waitVideo(video);
        
      }
    }
  }
})();