// ==UserScript==
// @name        希沃学院换课
// @namespace   Violentmonkey Scripts
// @match       https://study.seewoedu.cn/tCourse/group/*
// @grant       none
// @version     1.0
// @author      -
// @description 2024/8/20 21:17:54
// @license    咀嚼
// @downloadURL https://update.greasyfork.org/scripts/504431/%E5%B8%8C%E6%B2%83%E5%AD%A6%E9%99%A2%E6%8D%A2%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/504431/%E5%B8%8C%E6%B2%83%E5%AD%A6%E9%99%A2%E6%8D%A2%E8%AF%BE.meta.js
// ==/UserScript==
var aa = document.getElementsByClassName('state___IVT6G');
var bb = document.getElementsByClassName('name___lB9cB');
var v=document.querySelector("video");
var dd = document.getElementsByClassName('que-center-popup-body que-modal-body')
 setInterval(()=>{
  if(v){v.muted=true;v.playbackRate=2; v.play();}
  for(let a = 0; a < aa.length; a++) {
  var cc = document.querySelectorAll("div.left___rUtuF")[a].getElementsByClassName('playing-icon___TKBTt')[0]
  if(cc){
  if(a == '3' ||  a == '8' ||  a ==  '12'  ||  a == '17'  ||  a == '21' ||  a ==  '25' ||  a ==  '29' ||  a == '32' ||  a == '35'){b=a+1}else {b=a};
  if(aa[a].innerText == '已完成' ){if(aa[b+1].innerText == '未学习' || aa[b+1].innerText == '学习中'){    bb[b+1].click()}}
	}
  }

 }, 3000);


 setInterval(()=>{if(dd){window.location.reload()} }, 3000);
