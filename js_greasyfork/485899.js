// ==UserScript==
// @name        倍速按钮可以倍速、点击end直接结束本视频观看
// @namespace   Violentmonkey Scripts
// @match       http://play.lkyedu.com/*
// @grant       GM_addStyle
// @version     1.0
// @license     MIT
// @author      WangYulong
// @description 2024/1/28 16:02:57
// @downloadURL https://update.greasyfork.org/scripts/485899/%E5%80%8D%E9%80%9F%E6%8C%89%E9%92%AE%E5%8F%AF%E4%BB%A5%E5%80%8D%E9%80%9F%E3%80%81%E7%82%B9%E5%87%BBend%E7%9B%B4%E6%8E%A5%E7%BB%93%E6%9D%9F%E6%9C%AC%E8%A7%86%E9%A2%91%E8%A7%82%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/485899/%E5%80%8D%E9%80%9F%E6%8C%89%E9%92%AE%E5%8F%AF%E4%BB%A5%E5%80%8D%E9%80%9F%E3%80%81%E7%82%B9%E5%87%BBend%E7%9B%B4%E6%8E%A5%E7%BB%93%E6%9D%9F%E6%9C%AC%E8%A7%86%E9%A2%91%E8%A7%82%E7%9C%8B.meta.js
// ==/UserScript==
(function(){
  'use strict';
  console.log('我的脚本加载了');
  var button16=document.createElement("button");
  button16.textContent="16x";
  button16.id = "id16";
  button16.addEventListener("click",clickbutton);
  function clickbutton(){
     const speed = 16;
    // document.querySelector("video").playbackRate = speed;
    const video = document.querySelector('video');
    if (video) {
      video.playbackRate = speed;
    }
  }

  var button32=document.createElement("button");
  button32.textContent="32x";
  button32.id = "id32";
  button32.addEventListener("click",function(){
    const speed = 32;
    const video = document.querySelector("video");
    if(video){
      video.playbackRate=speed;
    }
  })

  var button8=document.createElement("button");
  button8.textContent="8x";
  button8.id = "id8";
  button8.addEventListener("click",function(){
    const speed = 8;
    const video = document.querySelector("video");
    if(video){
      video.playbackRate=speed;
    }
  })

  var button4=document.createElement("button");
  button4.textContent="4x";
  button4.id = "id4";
  button4.addEventListener("click",function(){
    const speed = 4;
    const video = document.querySelector("video");
    if(video){
      video.playbackRate=speed;
    }
  })

  var button2=document.createElement("button");
  button2.textContent="2x";
  button2.id = "id2";
  button2.addEventListener("click",function(){
    const speed = 2;
    const video = document.querySelector("video");
    if(video){
       video.playbackRate=speed;
    }
  })

  var button_end = document.createElement("button");
  button_end.textContent="end";
  button_end.id="id_end";
  button_end.addEventListener("click",function(){
    var video = document.querySelector("video");
    var progressBar = document.querySelector('.progress-bar');
    video.currentTime = video.duration;
    // progressBar.addEventListener("click",function(e){
    //   var pos = (e.pageX - this.offsetLeft) / this.offsetWidth;
    //   video.currentTime = pos * video.duration;
    // });


  })


//       document.addEventListener('DOMContentLoaded', function() {
//       var video = document.querySelector('video');
//       var progressBar = document.querySelector('.progress-bar');

//       progressBar.addEventListener('click', function(e) {
//         var pos = (e.pageX - this.offsetLeft) / this.offsetWidth;
//         video.currentTime = pos * video.duration;
//       });

//       // 跳到视频末尾
//       var jumpToTheEndButton = document.querySelector('#jump-to-end-button');
//       jumpToTheEndButton.addEventListener('click', function() {
//         video.currentTime = video.duration;
//       });
//     });


  // const container = document.getElementsByClassName("_video-mask_1g44j_1")[0];
  // alert(container);

  const container = document.querySelector('body');
  const container1 = document.getElementsByClassName("s-top-left-new s-isindex-wrap")[0];
  // const container2 = document.getElementsByClassName("bili-header__bar")[0];
  if (container1) {
        container1.appendChild(button32);
        container1.appendChild(button16);
        container1.appendChild(button8);
        container1.appendChild(button4);
        container1.appendChild(button2);
    }
  // else if (container2) {
  //       container2.appendChild(button16);
  //       container2.appendChild(button8);
  //       container2.appendChild(button4);
  //       container2.appendChild(button2);
  //   }
  else if (container) {
        container.appendChild(button32);
        container.appendChild(button16);
        container.appendChild(button8);
        container.appendChild(button4);
        container.appendChild(button2);
        container.appendChild(button_end);
    }

  // button.addEventListener('click', function() {
  //       alert('你点击了按钮！');
  //   });

  // document.querySelector("video").playbackRate==="16";

  // document.body.append("button");

  // var like_comment = document.getElementsByClassName("page-top-rightinfo")[0]; //getElementsByClassName 返回的是数组，所以要用[] 下标
  // // alert(like_comment.length);
  // // alert(like_comment);
  // like_comment.appendChild(button);


  // 使用 CSS 将按钮显示在最上方
  GM_addStyle(`
    #id_end,#id32,#id16,#id8,#id4,#id2 {
      background-color:#dddd11;
      color:red;
      height:50px;
      width:50px;
      text-align:center;
      z-index: 9999;
    }
  `);





})();