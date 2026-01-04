// ==UserScript==
// @name         刷题脚本
// @namespace    https://hunau.web2.superchutou.com
// @version      0.4
// @description  播完自动切换到下一个视频的小脚本..
// @author       sean<jishuzcn@gmail.com>
// @match        *://*.superchutou.com/#/video/*
// @icon
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @grant        GM_cookie
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472488/%E5%88%B7%E9%A2%98%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/472488/%E5%88%B7%E9%A2%98%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(function() {
  'use strict';
  // 播放进度大于83%播放下一个
  var max_progress = 68; // 正整数
  //定时器
  var timer,timer2,timer3;
  //初始状态为暂停
  // var startstatus = 0;
  //次数
  var number = 0;
  var urls = [];//所有视频链接
  var videoList;

  function videoStatus(){
      var playStatus = document.querySelector("#CuPlayer > .pv-paused");
      var videoObj = document.querySelector('video');
      if(videoObj){
        if (videoObj.paused){// 暂停状态
          let sean = document.querySelector("#sean");
          sean.innerText = "刷课脚本已关闭";
          sean.style.color = "yellow";
          //停止脚本
          if(timer != null){
            clearInterval(timer);
            timer = null;
          }
        } else {
            let sean = document.querySelector("#sean");
            sean.innerText = "刷课脚本已开启";
            sean.style.color = "white";
            //开始脚本
            if(timer == null){
              timer = setInterval(start, 1000);
            }
        }
      }

      // var playBtn  = document.querySelector(".pv-controls > .pv-controls-left > .pv-playpause"); // 播放按钮
      // if((playStatus && startstatus ==1) ||
      //     (!playStatus && startstatus == 0)){
      //   playBtn.click();
      //   alert("禁用视频播放按钮，请点击上方红色按钮播放~")
      // }
  }

  function start(){
      if(number % 200 == 0){
            console.clear();
      }
      //获取进度条
      var pass = document.querySelector(".pv-progress-bg > .pv-progress-current > .pv-progress-current-bg");
      //判断播放进度是否为设置的最大进度值
      if(pass){
        let curUrl = window.location.href;
        let point = urls.indexOf(curUrl);
        number += 1;

        console.log("当前课程是位于第几个：" + point)
        if(point < 0){
          alert('未正确获取到所有课程信息，请刷新浏览器!')
        }

        let progress = parseInt(pass.style.width);
        if(progress > 0){
            let seanProgress = document.querySelector("#sean_progress");
            seanProgress.innerText = "当前课程播放进度为"+progress + "%(进度达到"+max_progress+"%将跳转到下一个视频)";
        }
        if(max_progress < progress){
            //切换下一个视频
          if(point < urls.length-1){
            let size = point+1
            progress = 0;
            let seanProgress = document.querySelector("#sean_progress");
            seanProgress.innerText = ""
            clearInterval(timer);
            timer = null;
            videoList[size].click();
            setTimeout(function (){
              let sean = document.querySelector("#sean");
              sean.click();
            },3000);
          }
        }
      }
      // console.log("执行第"+ number + "次");
  }

  function getAllUrl(){
    videoList = document.querySelectorAll(".ant-list a");
    for (let i = 0; i < videoList.length; i++) {
      urls[i] = videoList[i].href;
    }
    console.log(urls); // 所有课程信息
    // timer3 = setInterval(getCurPoint, 1000);
  }

  window.addEventListener('load', function() {
      if(!window.localStorage){
        alert('当前浏览器不支持localStorage对象，请升级浏览器或更换成谷歌浏览器~');
      }
      // 添加按钮
      var divEle = document.querySelector("#root > div > div.ant-row > div.ant-col.ant-col-19");
      var cutPagrName = divEle.querySelector("span")
      cutPagrName.setAttribute("id","web_name");
      // 样式一
      // var option = document.createElement("div");
      // //添加样式
      // option.style="color:DarkOrange;text-align:center;line-height:90px;font-size:15px;background-repeat: no-repeat; background-size: 100%; width: 100px; height: 100px;border-radius: 50px; position:fixed;right:60px;top:200px; z-index:999;"+
      //     "background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAB4AAAAQ4CAYAAADo08FDAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAOJ0TSURBVHja7P3JjmTJuuj3/a1dnTcRkZlVu/Y+Z59zKV5oQJEAByQ0kSBBA72AIL2ORnocPYFGGgjQlCBAiRJxL8+9u6vKzIhw99VYr4HF2XoGpb7fsJCVGe7hvszs60z97/9P/+eGEEIIIYQQQgghhBBCCCGEEEKI/5+n5S0QQgghhBBCCCGEEEIIIYQQQogfgySAhRBCCCGEEEIIIYQQQgghhBDiByEJYCGEEEIIIYQQQgghhBBCCCGE+EFIAlgIIYQQQgghhBBCCCGEEEIIIX4QkgAWQgghhBBCCCGEEEIIIYQQQogfhCSAhRBCCCGEEEIIIYQQQgghhBDiByEJYCGEEEIIIYQQQgghhBBCCCGE+EFIAlgIIYQQQgghhBBCCCGEEEIIIX4QkgAWQgghhBBCCCGEEEIIIYQQQogfhCSAhRBCCCGEEEIIIYQQQgghhBDiByEJYCGEEEIIIYQQQgghhBBCCCGE+EFIAlgIIYQQQgghhBBCCCGEEEIIIX4QkgAWQgghhBBCCCGEEEIIIYQQQogfhCSAhRBCCCGEEEIIIYQQQgghhBDiByEJYCGEEEIIIYQQQgghhBBCCCGE+EFIAlgIIYQQQgghhBBCCCGEEEIIIX4QkgAWQgghhBBCCCGEEEIIIYQQQogfhCSAhRBCCCGEEEIIIYQQQgghhBDiByEJYCGEEEIIIYQQQgghhBBCCCGE+EFIAlgIIYQQQgghhBBCCCGEEEIIIX4QkgAWQgghhBBCCCGEEEIIIYQQQogfhCSAhRBCCCGEEEIIIYQQQgghhBDiByEJYCGEEEIIIYQQQgghhBBCCCGE+EFIAlgIIYQQQg) "
      // //添加点击事件
      // // option.setAttribute("onClick","StartOrStop()");
      // option.setAttribute("id","sean");
      // option.innerText = "点击启动脚本";
      // 样式二
      var prog = document.createElement("span");
      prog.style = "margin-left:10px;color:yellow";
      prog.setAttribute("id","sean_progress");
      divEle.appendChild(prog)
      var option = document.createElement("button");
      option.style= "margin-left:20px;border-radius: 50px;padding: 10px 20px;background-color: #e74c3c;color: #fff;cursor: pointer;border: none;"
      option.setAttribute("id","sean");
      var playStatus = document.querySelector("#CuPlayer > .pv-paused");
      option.innerText = "刷课脚本";
      //插入节点到页面
      divEle.appendChild(option)
      var desc = document.createElement("span");
      desc.style = "margin-left:10px;color:red";
      desc.setAttribute("id","sean_desc");
      desc.innerText = "自动播放下一条视频会有缓冲时间，请勿操作页面，可能会导致脚本暂停~";
      divEle.appendChild(desc)
      option.onclick = function() {
          //获取播放状态
          var playBtn = document.querySelector(".pv-controls > .pv-controls-left > .pv-playpause"); // 播放按钮
          playBtn.click();
      }
      // option.click();
      setTimeout(function(){
        getAllUrl();
        timer2 = setInterval(videoStatus, 3000);
      },5000)
  }, true);
})();