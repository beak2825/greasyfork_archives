// ==UserScript==
// @name        云班课刷完最新章视频
// @match       https://www.mosoteach.cn/web/index.php
// @grant       none
// @version     1.21
// @description 2020/5/7 下午2:52:14
// @namespace https://greasyfork.org/users/535143
// @downloadURL https://update.greasyfork.org/scripts/402809/%E4%BA%91%E7%8F%AD%E8%AF%BE%E5%88%B7%E5%AE%8C%E6%9C%80%E6%96%B0%E7%AB%A0%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/402809/%E4%BA%91%E7%8F%AD%E8%AF%BE%E5%88%B7%E5%AE%8C%E6%9C%80%E6%96%B0%E7%AB%A0%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==
window.onload=function(){
  var zhankai=document.getElementsByClassName("res-row-title")[0];
  var zuiqianzhang=document.getElementsByClassName("hide-div")[0];
  if(zuiqianzhang.style.display=="none"){
    zhankai.click();
  }
  var num=zuiqianzhang.children.length;
  var infos=document.getElementsByClassName("res-info");
  for(var i =0;i<num;i++){
    if(infos[i].children[1].children[6].style.color=="rgb(236, 105, 65)"){
       infos[i].click();
        break;
    }
  }
  setTimeout(function(){
    var mp=document.getElementById("preview-video_native_hls");
    mp.playbackRate=15;
    setInterval(function(){
          mp.onended=function(){
            mp.play();
            setTimeout(function(){
              location.reload();
            },4000)
          }
   },1000)
  },5000)
  
}
