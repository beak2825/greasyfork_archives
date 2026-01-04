// ==UserScript==
// @name                                                                     3.播放页精简
// @namespace
// @author
// @description  视频网站页面简化：只保留播放器和简介以及使用说明；适配网站：莫扎兔，6080,333影视，伊雪湾，厂长资源
// @license MIT
// @version                                                                 2.3.5
// @icon         data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTA4cHgiIGhlaWdodD0iMTA4cHgiIHZpZXdCb3g9IjAgMCAxMDggMTA4IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPHRpdGxlPueyvueBteeQgzwvdGl0bGU+CiAgICA8ZyBpZD0i6aG16Z2iLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSLnsr7ngbXnkIMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuODMwNzY5LCAwLjgzMDc2OSkiIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik01My4xNjkyMzA3LDEwNi4zMzg0NjEgQzIzLjgyNzY5MjIsMTA2LjMzODQ2MSAwLDgyLjUxMDc2OTIgMCw1My4xNjkyMzA3IEMwLDUxLjAwMzA3NjkgMS43NzIzMDc3NSw0OS4yMzA3NjkyIDMuOTM4NDYxNSw0OS4yMzA3NjkyIEwzMy40NzY5MjMsNDkuMjMwNzY5MiBDMzUuNjQzMDc2OSw0OS4yMzA3NjkyIDM3LjQxNTM4NDUsNTEuMDAzMDc3IDM3LjQxNTM4NDYsNTMuMTY5MjMwNyBDMzcuNDE1Mzg0Niw2MS44MzM4NDYxIDQ0LjUwNDYxNTQsNjguOTIzMDc2OSA1My4xNjkyMzA3LDY4LjkyMzA3NjkgQzYxLjgzMzg0NjEsNjguOTIzMDc2OSA2OC45MjMwNzY5LDYxLjgzMzg0NjEgNjguOTIzMDc2OSw1My4xNjkyMzA3IEM2OC45MjMwNzY5LDUxLjAwMzA3NjkgNzAuNjk1Mzg0Niw0OS4yMzA3NjkyIDcyLjg2MTUzODUsNDkuMjMwNzY5MiBMMTAyLjQsNDkuMjMwNzY5MiBDMTA0LjU2NjE1NCw0OS4yMzA3NjkyIDEwNi4zMzg0NjEsNTEuMDAzMDc3IDEwNi4zMzg0NjEsNTMuMTY5MjMwNyBDMTA2LjMzODQ2MSw4Mi41MTA3NjkyIDgyLjUxMDc2OTIsMTA2LjMzODQ2MSA1My4xNjkyMzA3LDEwNi4zMzg0NjEgWiIgaWQ9Iui3r+W+hCIgZmlsbD0iIzMzMzYzQSI+PC9wYXRoPgogICAgICAgICAgICA8cGF0aCBkPSJNOC4wNzM4NDYxMiw1Ny4xMDc2OTIyIEMxMC4wNDMwNzY5LDgwLjI0NjE1MzcgMjkuNTM4NDYxNSw5OC40NjE1Mzg1IDUzLjE2OTIzMDcsOTguNDYxNTM4NSBDNzYuOCw5OC40NjE1Mzg1IDk2LjI5NTM4NDYsODAuMjQ2MTUzOSA5OC4yNjQ2MTU0LDU3LjEwNzY5MjIgTDc2LjUwNDYxNTQsNTcuMTA3NjkyMiBDNzQuNjMzODQ2MSw2OC4yMzM4NDYxIDY0Ljg4NjE1MzksNzYuOCA1My4xNjkyMzA3LDc2LjggQzQxLjQ1MjMwNzYsNzYuOCAzMS43MDQ2MTU0LDY4LjIzMzg0NjEgMjkuODMzODQ2MSw1Ny4xMDc2OTIyIEw4LjA3Mzg0NjEyLDU3LjEwNzY5MjIgWiIgaWQ9Iui3r+W+hCIgZmlsbD0iI0ZGRkZGRiI+PC9wYXRoPgogICAgICAgICAgICA8cGF0aCBkPSJNNTMuMTY5MjMwOCwzLjkzODQ2MTUgQzI1Ljk5Mzg0NjEsMy45Mzg0NjE1IDMuOTM4NDYxNSwyNS45OTM4NDYxIDMuOTM4NDYxNSw1My4xNjkyMzA3IEwzMy40NzY5MjMsNTMuMTY5MjMwNyBDMzMuNDc2OTIzLDQyLjMzODQ2MTUgNDIuMzM4NDYxNSwzMy40NzY5MjMgNTMuMTY5MjMwOCwzMy40NzY5MjMgQzY0LDMzLjQ3NjkyMyA3Mi44NjE1Mzg1LDQyLjMzODQ2MTUgNzIuODYxNTM4NSw1My4xNjkyMzA3IEwxMDIuNCw1My4xNjkyMzA3IEMxMDIuNCwyNS45OTM4NDYxIDgwLjM0NDYxNTQsMy45Mzg0NjE1IDUzLjE2OTIzMDgsMy45Mzg0NjE1IFoiIGlkPSLot6/lvoQiIGZpbGw9IiNENjA5MDkiPjwvcGF0aD4KICAgICAgICAgICAgPHBhdGggZD0iTTEwMi40LDU3LjEwNzY5MjIgTDcyLjg2MTUzODUsNTcuMTA3NjkyMiBDNzAuNjk1Mzg0Niw1Ny4xMDc2OTIyIDY4LjkyMzA3Nyw1NS4zMzUzODQ1IDY4LjkyMzA3NjksNTMuMTY5MjMwNyBDNjguOTIzMDc2OSw0NC41MDQ2MTU0IDYxLjgzMzg0NjEsMzcuNDE1Mzg0NiA1My4xNjkyMzA3LDM3LjQxNTM4NDYgQzQ0LjUwNDYxNTQsMzcuNDE1Mzg0NiAzNy40MTUzODQ2LDQ0LjUwNDYxNTQgMzcuNDE1Mzg0Niw1My4xNjkyMzA3IEMzNy40MTUzODQ2LDU1LjMzNTM4NDYgMzUuNjQzMDc2OSw1Ny4xMDc2OTIyIDMzLjQ3NjkyMyw1Ny4xMDc2OTIyIEwzLjkzODQ2MTUsNTcuMTA3NjkyMiBDMS43NzIzMDc2Miw1Ny4xMDc2OTIyIDAsNTUuMzM1Mzg0NSAwLDUzLjE2OTIzMDcgQzAsMjMuODI3NjkyMiAyMy44Mjc2OTIzLDAgNTMuMTY5MjMwNywwIEM4Mi41MTA3NjkyLDAgMTA2LjMzODQ2MSwyMy44Mjc2OTIyIDEwNi4zMzg0NjEsNTMuMTY5MjMwNyBDMTA2LjMzODQ2MSw1NS4zMzUzODQ2IDEwNC41NjYxNTQsNTcuMTA3NjkyMiAxMDIuNCw1Ny4xMDc2OTIyIFoiIGlkPSLot6/lvoQiIGZpbGw9IiMzMzM2M0EiPjwvcGF0aD4KICAgICAgICAgICAgPHBhdGggZD0iTTc2LjUwNDYxNTQsNDkuMjMwNzY5MyBMOTguMzYzMDc2OSw0OS4yMzA3NjkzIEM5Ni4yOTUzODQ2LDI2LjA5MjMwNzYgNzYuOCw3Ljg3NjkyMyA1My4xNjkyMzA3LDcuODc2OTIzIEMyOS41Mzg0NjE1LDcuODc2OTIzIDEwLjA0MzA3NjksMjYuMDkyMzA3NiA4LjA3Mzg0NjEyLDQ5LjIzMDc2OTMgTDI5LjkzMjMwNzYsNDkuMjMwNzY5MyBDMzEuNzA0NjE1NCwzOC4xMDQ2MTU0IDQxLjQ1MjMwNzYsMjkuNTM4NDYxNSA1My4xNjkyMzA3LDI5LjUzODQ2MTUgQzY0Ljg4NjE1MzksMjkuNTM4NDYxNSA3NC42MzM4NDYxLDM4LjEwNDYxNTQgNzYuNTA0NjE1NCw0OS4yMzA3NjkzIEw3Ni41MDQ2MTU0LDQ5LjIzMDc2OTMgWiIgaWQ9Iui3r+W+hCIgZmlsbD0iI0Q2MDkwOSI+PC9wYXRoPgogICAgICAgICAgICA8cGF0aCBkPSJNNTMuMTY5MjMwNyw3Ni44IEM0MC4xNzIzMDc2LDc2LjggMjkuNTM4NDYxNSw2Ni4xNjYxNTM5IDI5LjUzODQ2MTUsNTMuMTY5MjMwNyBDMjkuNTM4NDYxNSw0MC4xNzIzMDc2IDQwLjE3MjMwNzYsMjkuNTM4NDYxNSA1My4xNjkyMzA3LDI5LjUzODQ2MTUgQzY2LjE2NjE1MzksMjkuNTM4NDYxNSA3Ni44LDQwLjE3MjMwNzYgNzYuOCw1My4xNjkyMzA3IEM3Ni44LDY2LjE2NjE1MzkgNjYuMTY2MTUzOSw3Ni44IDUzLjE2OTIzMDcsNzYuOCBaIiBpZD0i6Lev5b6EIiBmaWxsPSIjMzMzNjNBIj48L3BhdGg+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik01My4xNjkyMzA3LDM3LjQxNTM4NDYgQzQ0LjUwNDYxNTQsMzcuNDE1Mzg0NiAzNy40MTUzODQ2LDQ0LjUwNDYxNTQgMzcuNDE1Mzg0Niw1My4xNjkyMzA3IEMzNy40MTUzODQ2LDYxLjgzMzg0NjEgNDQuNTA0NjE1NCw2OC45MjMwNzY5IDUzLjE2OTIzMDcsNjguOTIzMDc2OSBDNjEuODMzODQ2MSw2OC45MjMwNzY5IDY4LjkyMzA3NjksNjEuODMzODQ2MSA2OC45MjMwNzY5LDUzLjE2OTIzMDcgQzY4LjkyMzA3NjksNDQuNTA0NjE1NCA2MS44MzM4NDYxLDM3LjQxNTM4NDYgNTMuMTY5MjMwNywzNy40MTUzODQ2IEw1My4xNjkyMzA3LDM3LjQxNTM4NDYgWiIgaWQ9Iui3r+W+hCIgZmlsbD0iI0ZGRkZGRiI+PC9wYXRoPgogICAgICAgICAgICA8cGF0aCBkPSJNNDMuMzIzMDc2OSw1My4xNjkyMzA3IEM0My4zMjMwNzY5LDU4LjYwNzExMTQgNDcuNzMxMzUwMSw2My4wMTUzODQ2IDUzLjE2OTIzMDcsNjMuMDE1Mzg0NiBDNTguNjA3MTExNCw2My4wMTUzODQ2IDYzLjAxNTM4NDYsNTguNjA3MTExNCA2My4wMTUzODQ2LDUzLjE2OTIzMDcgQzYzLjAxNTM4NDYsNDcuNzMxMzUwMSA1OC42MDcxMTE0LDQzLjMyMzA3NjkgNTMuMTY5MjMwNyw0My4zMjMwNzY5IEM0Ny43MzEzNTAxLDQzLjMyMzA3NjkgNDMuMzIzMDc2OSw0Ny43MzEzNTAxIDQzLjMyMzA3NjksNTMuMTY5MjMwNyBaIiBpZD0i6Lev5b6EIiBmaWxsPSIjMzMzNjNBIj48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=
// @match                                                                *://www.mozhatu.com/*
// @match                                                                *://vip.tv1920.xyz/*

// @match                                                                *://www.6080dy3.com/*
// @match                                                                *://www.ylwt33.com/*
// @match                                                                *://www.yixuewan.com/*
// @match                                                                *://www.freeok.vip/*
// @match                                                                *://czzy03.com/*
// @match                                                                *://www.bdys03.com/*
// @match                                                                *://dadagui.me/*
// @match                                                                *://v6-default.365yg.com/*
// @match                                                                *://v9-default.365yg.com/*
// @match                                                                *://v26-default.365yg.com/*
// @match                                                                *://v3-default.365yg.com/*
// @match                                                                *://www.dadagui.me/*
// @match                                                                *://91free.vip/*
// @match                                                                *://www.smdyy1.cc/*
// @match                                                                *://www.3wyy.com/*
// @match                                                                *://www.yangshizhibo.com/*
// @match        *://*/*
// @exclude       *://sun.20001027.com/*
// @exclude       *://lf-zt.douyin.com/*
// @exclude       *://www.douyin.com/*
// @exclude       *://001.20001027.com/*
// @run-at      document-body
// @grant          GM_xmlhttpRequest
// @grant          GM_setClipboard
// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_listValues
// @namespace
// @namespace
// @namespace
// @namespace
// @namespace
// @namespace
// @namespace
// @namespace
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/461873/3%E6%92%AD%E6%94%BE%E9%A1%B5%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/461873/3%E6%92%AD%E6%94%BE%E9%A1%B5%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==


GM_addStyle(
  "*[style *= 'z-index: 2147483646']{display: none !important; width:666px;}"
);

//优先样式

//czzy
GM_addStyle(".custom-background{height:100vh;overflow: hidden;}");
GM_addStyle(".videoplay{height:100vh!important; width:100vw;}");


GM_addStyle(".mi_cont.dobg_pl{display:none;}");
GM_addStyle(".mplayer-poster{opacity: 0;}");
GM_addStyle(".player-box-main{width:100vw !important;}");
GM_addStyle(".foot_right_bar{display:none;}");
GM_addStyle(
  `
  .load-box{
    position: fixed;
    z-index: 9999;
    top: 50%;
    left:50%;
    transform: translate(-50%, -50%);
    width: fit-content;
    height: 0.575rem;
    display: block;
    overflow-wrap: break-word;
    color: rgba(255, 255, 255, 1);
    font-size: 0.597rem;
    font-family: SourceHanSansCN-Regular;
    font-weight: 400;
    text-align: center;
    white-space: nowrap;
    line-height: 0.598rem;}
  `
);

//广告遮挡
                    //czzy
let useMaskCreate = new RegExp("czzy.fun").test(window.location.href)||
                    new RegExp("cz.cz01.site:81").test(window.location.href) ||
                    new RegExp("124.222.164.107:81").test(window.location.href) ||
                    new RegExp("gun-a1-sb.c-zzy.online").test(window.location.href)  ||
                    new RegExp("43.154.3.196").test(window.location.href) ||
                    new RegExp("jx.xmflv.com").test(window.location.href) ||
                    new RegExp("lziplayer.com").test(window.location.href) ||
                    new RegExp("vip.lz-cdn14.com").test(window.location.href)||
                    new RegExp("47.242.56.72").test(window.location.href)||
                    new RegExp("static/player/dplayer.html").test(window.location.href)
                    
                    
                    
                    ? true
                    : false;

if (useMaskCreate) {

  var mask = document.createElement("div");
  mask.classList.add("masking");
  document.body.appendChild(mask);
  GM_addStyle(
    ".masking{top: 0;left: 0;background: black;width: 100vw;height: 100vh;position: absolute;z-index: 999;}"
  );
  GM_addStyle(
    `
    .page {
      position: relative;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
    }
    
    .group_1 {
      
    }
    
    .group_2 {
      

      position: fixed;
      top: 30%;
      left: 50%;
      transform: translateX(-50%);
      
    }
    
    
    
    .image_1 {
      width: 2.759rem;
      height: 2.759rem;
      transform: translateY(-3vh);
      position: relative;
      left: -95%;
    }
    
    .text_1 {
      width: 4.138rem;
      height: 1.265rem;
      overflow-wrap: break-word;
      color: rgba(255, 255, 255, 1);
      font-size: 1.333rem;
      font-family: YouYuan;
      text-align: center;
      white-space: nowrap;
      line-height: 1.334rem;
      margin-top: 0.736rem;
      font-style: italic;
      position: fixed;
      top: 27%;
      left: 49%;
      z-index: 9;

    }
    
    .group_4 {
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
    }
    
    .box_1 {
      background-image: linear-gradient(
        90deg,
        rgba(253, 227, 53, 1) 0,
        rgba(253, 227, 53, 1) 0.585938%,
        rgba(253, 227, 53, 1) 48.217773%,
        rgba(254, 223, 54, 1) 49.414062%,
        rgba(255, 227, 53, 1) 100%,
        rgba(255, 227, 53, 1) 100%
      );
      width: 5.288rem;
      height: 0.046rem;
    }
    
    .text-wrapper_1 {
      width: 16.115rem;
      height: 0.575rem;
      margin: 1.104rem 0 0 14.023rem;
    }
    
    .text_2 {
      width: 16.115rem;
      height: 0.575rem;
      overflow-wrap: break-word;
      color: rgba(255, 255, 255, 1);
      font-size: 0.597rem;
      font-family: SourceHanSansCN-Regular;
      font-weight: NaN;
      text-align: center;
      white-space: nowrap;
      line-height: 0.598rem;
    }
    .image_bg {
      width: 106vw;
      height: 106vh;
      top: -6%;
      left: -6%;
      position: fixed;
    }
    }
    `
  );
  
  mask.innerHTML=` 
  <div class="page flex-col">
  <div class="text_1">小太阳</div>

  <div class="group_1 flex-col">
  <img
  class="image_bg"
  referrerpolicy="no-referrer"
  src="https://lanhu.oss-cn-beijing.aliyuncs.com/psglvgtzre8kijmoro3z635rxtraubfko7ab8877d0-cbf2-410c-b2a9-d20f4044f5b5"
/>
  <div class="group_2 flex-col">
  
  <div class="group_3 flex-row justify-between">
  <img
    class="image_1"
    referrerpolicy="no-referrer"
    src="https://lanhu.oss-cn-beijing.aliyuncs.com/pss7hvuuwya2s07pvqep7hytj1a4idezz76ea6c701e2-06ca-4e1d-9730-2aadc0ad31c9"
  />
</div>
<div class="group_4 flex-row"><div class="box_1 flex-col"></div></div>

</div>
</div>
</div>

`

 


  let maskClearInt = setInterval(() => {
    document.documentElement.scrollTop=0
    if (document.getElementsByTagName("video")[0]) {
      if (
        document.getElementsByTagName("video")[0].currentTime > 0 &&
        document.getElementsByTagName("video")[0].paused == false &&
        document.querySelector(".load-box").style.display=="none"
      ) {
        if (document.querySelector(".masking")) {
          setTimeout(() => {
          document.querySelector(".masking").remove();
            
          }, 350);
          clearInterval(maskClearInt);
          maskClearInt = null;
        }
      }
    }

    if (document.getElementsByTagName("iframe")[0]) {
      if( document.querySelector(".masking"))
      setTimeout(() => {
       if( document.querySelector(".masking"))
       document.querySelector(".masking").remove();
        
      }, 500);
    }

  }, 100);
}
  // 设计稿宽度
  var designWidth = 3840;
  // 在屏幕宽度375px，的时候，设置根元素字体大小 100px

  var remPx = 100;
  var scale = window.innerWidth / designWidth; //计算当前屏幕的宽度与设计稿比例
  // 根据屏幕宽度 动态计算根元素的 字体大小
  document.documentElement.style.fontSize = scale * remPx + "px";






if (new RegExp("cz.cz01.site:81").test(window.location.href)) {
  var stateObject = {};
  var title = "Wow Title";
  var newUrl = "/asdasdsa";
  history.pushState(stateObject, title, newUrl);
}

if (new RegExp("greasyfork.org").test(window.location.href)) {
  console.log("greasyfork");

  GM_addStyle("ul{display: none !important; }");
  GM_addStyle("#script-stats{display: none !important; }");
  GM_addStyle("#script-content p{display: none !important; }");
  GM_addStyle("#script-feedback-suggestion{display: none !important; }");
  GM_addStyle("#main-header{display: none !important; }");
  GM_addStyle("h2{display: none !important; }");
  GM_addStyle(".install-help-link{display: none !important; }");
  GM_addStyle(".width-constraint{display: none !important; }");

  

  GM_addStyle(
    ".box-main{ position: absolute;left: 50%;top: 20%; transform: translateX(-50%);}"
  );

  GM_addStyle("hr{display: none !important; }");
  GM_addStyle(".title{position: relative;top: 5%;left: 50%; transform: translateX(-50%); width: fit-content;}");

  GM_addStyle(".title_h3{font-size: 1.8vw; position: relative;top: 22%; white-space: nowrap;}");
  GM_addStyle("#install-area{position: relative;margin-top: 2vh; opacity:0; }");
  GM_addStyle("#tips{width: fit-content;font-size: 1.75vw; position: relative;top: 58%; left:50%; transform: translateX(-50%);opacity: 0.75;font-weight: 600;}");
  GM_addStyle("#progress{width: fit-content;font-size: 1.75vw; position: relative;top: 58%; left:50%; transform: translateX(-50%);opacity: 0.75;font-weight: 600;}");
  GM_addStyle(".width-constraint{position: relative; margin:0; }");
  


  setTimeout(() => {}, 2000);
  setTimeout(() => {
    let box = document.createElement("div");
    box.classList.add("box-main");

    var h1 = document.createElement("h1");
    h1.innerHTML = "小太阳更新";
    h1.classList.add("title");
    box.appendChild(h1);


    var h3 = document.createElement("h3");
    h3.innerHTML = "正在逐个检查更新，请在出现【更新】后按确定键更新，可能会一次更新多个，请耐心等待";
    h3.classList.add("title_h3");
    box.appendChild(h3);

    box.appendChild(document.querySelectorAll(".width-constraint")[1]);
    var div = document.createElement("div");
    div.innerHTML = "检查更新中……";
    div.setAttribute('id', 'tips')
    box.appendChild(div);

    var progress = document.createElement("div");
    progress.innerHTML = "";
    if (new RegExp("461871").test(window.location.href)) {
      progress.innerHTML = "20%";
    }

    if (new RegExp("461873").test(window.location.href)) {
      progress.innerHTML = "40%";
    }
    
    if (new RegExp("461442").test(window.location.href)) {
      progress.innerHTML = "60%";
    }

    if (new RegExp("462697").test(window.location.href)) {
      progress.innerHTML = "80%";
    }
    progress.setAttribute('id', 'progress')
    box.appendChild(progress);

    

    
    
    document.body.appendChild(box);
    box.appendChild(document.querySelector("#install-area"));

    setTimeout(() => {
      if (document.getElementById("install-area")) {
        console.log("click");
        if (
          new RegExp("更新").test(
            document.querySelector("#install-area").innerText
          )
        ) {
          document.getElementById("install-area").firstElementChild.click();
        }
      }
    }, 3000);
  }, 2000);

  setTimeout(() => {
    setInterval(() => {
      if (
        new RegExp("重新安装").test(
          document.querySelector("#install-area").innerText
        )
      ) {
        if (new RegExp("461869").test(window.location.href)) {

          window.location.href =
          "https://greasyfork.org/zh-CN/scripts/461871-2-%E9%80%89%E9%9B%86%E7%AD%89%E5%8A%9F%E8%83%BD%E8%8F%9C%E5%8D%95";

          
        }

        if (new RegExp("461871").test(window.location.href)) {
          window.location.href =
            "https://greasyfork.org/zh-CN/scripts/461873-3-%E6%92%AD%E6%94%BE%E9%A1%B5%E7%B2%BE%E7%AE%80";
          
         
        }

        if (new RegExp("461873").test(window.location.href)) {
         
          window.location.href =
          "https://greasyfork.org/zh-CN/scripts/461442-4-%E7%9B%B4%E6%92%AD%E7%AE%80%E5%8C%96";

        }
        
        
        if (new RegExp("461442").test(window.location.href)) {
          window.location.href =
            "https://greasyfork.org/zh-CN/scripts/462697-5-%E6%8A%96%E9%9F%B3%E8%84%9A%E6%9C%AC";
        }

        if (new RegExp("462697").test(window.location.href)) {
          document.querySelector("#progress").style.display = "none"
          document.querySelector(".title").innerHTML = "更新完成"
          document.querySelector("#tips").innerHTML = "请按【确认】键回到小太阳"
          document.querySelector(".title_h3").style.display = "none"
          window.onkeydown = () => {
            var theEvent = window.event || e;
            var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
           if(code == 13){
            window.location.href = "http://sun.20001027.com/";
           }
          };

        }

      }
    }, 1000);
  }, 3000);

  document.addEventListener("visibilitychange", function () {
    // 页面变为不可见时触发

    // 页面变为可见时触发
    if (document.visibilityState == "visible") {
    //  document.querySelector("#tips").innerHTML = "更新完成";

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  });

  

  window.onkeydown = () => {
    var theEvent = window.event || e;
    var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
    if (code == 13) {
      if (document.getElementById("input_icVfdW5kZWZpbmVk_bu")) {
        document.getElementById("input_icVfdW5kZWZpbmVk_bu").click();
      }
      if (document.getElementById("input_icVfdW5kZWZpbmVk_bu")) {
        document.getElementById("input_icVfdW5kZWZpbmVk_bu").click();
      }
    }

    if (code == 38) {
      let i = 0;

      const interval = setInterval(() => {
        if (i < 2) {
          document.onkeyup = function (ev) {
            if (ev.code == "ArrowUp") {
              sessionStorage.clear();
              window.location.href = "https://sun.20001027.com/";
              clearInterval(interval);
            }
          };
        } else {
          // document.getElementById("clist").style.opacity = 1;
          // document.getElementsByClassName(
          //   "menu-box"
          // )[0].style.opacity = 1;
          // document.getElementsByClassName("use-intro")[0].style.display =
          //   "none";

          document.onkeyup = null;
          clearInterval(interval);
        }
        i++;
      }, 300);
    }
  };
  throw new Error("结束");
}

var hasError = false;
var useVideoTipsOne = false;
var useVideoTipsTwo = false;
console.log(window.location.href, 88);


function NotVideo(name) {
 
  let loadBox = document.createElement("div");
  loadBox.innerHTML = "视频加载失败，请按确认【重新加载】";
  loadBox.classList.add("load-box");
  loadBox.style.display = "block";

  name
    ? document.getElementsByClassName(name)[0].appendChild(loadBox)
    : document.getElementById("error")
    ? document.getElementById("error").appendChild(loadBox)
    : document.body.appendChild(loadBox);

  hasError = true;
}

function yanaifeiTips() {
  
  let loadBox = document.createElement("div");
  loadBox.innerHTML = "视频正在加载中，加载速度跟网速有关，请耐心等待几秒钟。";
  loadBox.classList.add("load-box");
  loadBox.style.display = "block";

  document.body.appendChild(loadBox);

  let yaVideoTimer = setInterval(() => {
    if (document.getElementsByTagName("video")[0]) {
      document
        .getElementsByTagName("video")[0]
        .addEventListener("error", function (e) {
          document.querySelector(".load-box").innerHTML =
            "视频加载失败，请按确认【重新加载】";
          hasError = true;
        });

      document
        .getElementsByTagName("video")[0]
        .addEventListener("canplay", function (e) {
          document.querySelector(".load-box").innerHTML =
            "视频加载成功，点击遥控OK键，开始播放";
          hasError = false;
        });

      document
        .getElementsByTagName("video")[0]
        .addEventListener("playing", function (e) {
          document.querySelector(".load-box").style.display = "none";
        });

      clearInterval(yaVideoTimer);
      console.log(66);
    }
  }, 50);
}

function VideoTips(name) {
 
  let loadBox = document.createElement("div");
  loadBox.innerHTML = "视频正在加载中，加载速度跟网速有关，请耐心等待几秒钟。";
  loadBox.classList.add("load-box");
  loadBox.style.display = "block";

  name
    ? document.getElementsByClassName(name)[0].appendChild(loadBox)
    : document.body.appendChild(loadBox);

  document
    .getElementsByTagName("video")[0]
    .addEventListener("loadedmetadata", function (e) {
      document.querySelector(".load-box").innerHTML =
        "视频正在加载中，加载速度跟网速有关，请耐心等待几秒钟。";
      document.querySelector(".load-box").style.display = "block";
      hasError = false;
    });
  if (new RegExp("czzy.fun").test(window.location.href)) {
    var errorTimer = setInterval(() => {
      if(document.querySelector(".h2_closeclick")){
        document.querySelector(".h2_closeclick").click()
      }
      if (
        document.querySelector(".dplayer-notice").innerHTML == "视频加载失败"
      ) {
        document.querySelector(".load-box").innerHTML =
          "视频加载失败，请按确认【重新加载】";
        hasError = true;
        clearInterval(errorTimer);
      }
    }, 500);
  } else {
    document
      .getElementsByTagName("video")[0]
      .addEventListener("error", function (e) {
        document.querySelector(".load-box").innerHTML =
          "视频加载失败，请按确认【重新加载】";
        hasError = true;
      });
  }

  document
    .getElementsByTagName("video")[0]
    .addEventListener("canplay", function (e) {
      for (const item of document.querySelectorAll(".load-box")) {
        item.innerHTML = "视频加载成功，点击遥控OK键，开始播放";
      }

      hasError = false;
    });

  document
    .getElementsByTagName("video")[0]
    .addEventListener("playing", function (e) {
      for (const item of document.querySelectorAll(".load-box")) {
        item.style.display = "none";
      }
    });

  if (
    new RegExp("dadagui.me/static/player").test(window.location.href) ||
    new RegExp("dadagui.me/webcloud").test(window.location.href)
  ) {
    let dadaguiErrorTime = 0;

    let dadaguiErrorInt = setInterval(() => {
      if (document.getElementsByClassName("dplayer-notice")[0]) {
        if (
          document.getElementsByClassName("dplayer-notice")[0].innerHTML ==
          "视频加载失败"
        ) {
          for (const item of document.querySelectorAll(".load-box")) {
            item.innerHTML = "视频加载失败，请按确认【重新加载】";
            item.style.display = "block";
          }

          hasError = true;

          clearInterval(dadaguiErrorInt);
        }
      }

      if (dadaguiErrorTime > 250) {
        clearInterval(dadaguiErrorInt);
      }

      dadaguiErrorTime++;
    }, 200);
  }

  // let videoCurrentInt = setInterval(() => {
  //   if( document.getElementsByTagName("video")[0].currentTime>0.2){
  //     for (const item of   document.querySelectorAll(".load-box")) {
  //       item.style.display = "none";
  //     }

  //     clearInterval(videoCurrentInt)
  //   }

  // }, 200);
}

function LoadTips(name) {
  
  let loadBox = document.createElement("div");
  loadBox.innerHTML = "视频正在加载中，加载速度跟网速有关，请耐心等待几秒钟。";
  loadBox.classList.add("load-box");
  loadBox.style.display = "block";

  name
    ? document.getElementsByClassName(name)[0].appendChild(loadBox)
    : document.body.appendChild(loadBox);

  document
    .getElementsByTagName("video")[0]
    .addEventListener("error", function (e) {
      document.querySelector(".load-box").innerHTML =
        "视频加载失败，请按确认【重新加载】";
      hasError = true;
    });

  document
    .getElementsByTagName("video")[0]
    .addEventListener("canplay", function (e) {
      document.querySelector(".load-box").innerHTML =
        "视频加载成功，点击遥控OK键，开始播放";
      hasError = false;
    });

  document
    .getElementsByTagName("video")[0]
    .addEventListener("playing", function (e) {
      document.querySelector(".load-box").style.display = "none";
    });
}

useVideoTipsOne =
  new RegExp("czzy.fun").test(window.location.href) ||
  new RegExp("bdys10").test(window.location.href) ||
  new RegExp("gaze.run").test(window.location.href)
    ? true
    : false;
//适配新网站
useVideoTipsTwo =
  new RegExp("zj.jsjinfu.com:8443").test(window.location.href) ||
  new RegExp("cz.cz01.site:81").test(window.location.href) ||
  new RegExp("al.cos20.c-zzy.com:81").test(window.location.href) ||
  new RegExp("gun-a1-sb.c-zzy.online").test(window.location.href) ||
  new RegExp("jx.aidouer.net").test(window.location.href) ||
  new RegExp("api.peizq.online").test(window.location.href) ||
  new RegExp("dadagui.me/static/player").test(window.location.href) ||
  new RegExp("dadagui.me/webcloud").test(window.location.href) ||
  new RegExp("vip.jsjinfu.com:8443/?").test(window.location.href) ||
  new RegExp("player.yaplayer.one").test(window.location.href) ||
  new RegExp("fack.tv1920.xyz").test(window.location.href) ||
  new RegExp("p.upin.top/aliplayer").test(window.location.href) ||
  new RegExp("ttzj365.com/playerapi/aliplayer").test(window.location.href) ||
  new RegExp("91free.vip/static").test(window.location.href) ||
  new RegExp("jx1.xn--9sw0lnkz85j.xn--fiqs8s").test(window.location.href) ||
  new RegExp("r.tvkanba.com").test(window.location.href) ||
  new RegExp("m3u8.c-zzy.online").test(window.location.href) ||
  new RegExp("jx1.xn--1lq90i13mxk5bolhm8k.xn--fiqs8s").test(
    window.location.href
  ) ||
  new RegExp("vip.lzcdn2.com").test(window.location.href) ||
  new RegExp("jx.m3u8.tv").test(window.location.href) ||
  new RegExp("libvio.top").test(window.location.href) ||
  new RegExp("players.immmm.top").test(window.location.href) ||
  new RegExp("sjx.quankan.app").test(window.location.href) ||
  new RegExp("jx.huishij.").test(window.location.href) ||
  new RegExp("hnjiexi").test(window.location.href) ||
  new RegExp("vip.zykbf").test(window.location.href) ||
  new RegExp("jx.zxdy5.top/jiexi").test(window.location.href) ||
  new RegExp("jx.wolongzywcdn.com:65").test(window.location.href) ||
  new RegExp("lzplayer.tv").test(window.location.href) ||
  new RegExp("test3.gqyy8.com:4438").test(window.location.href) ||
  new RegExp("43.240.74.102:4433").test(window.location.href) ||
  new RegExp("124.222.164.107:81").test(window.location.href) ||
  new RegExp("43.154.3.196").test(window.location.href) ||
  new RegExp("jx.xmflv.com").test(window.location.href) ||
  new RegExp("cdn.zyc888.top").test(window.location.href) ||
  new RegExp("lziplayer.com").test(window.location.href) ||
  new RegExp("vip.lz-cdn").test(window.location.href) ||
  new RegExp("47.242.56.72").test(window.location.href) ||
  new RegExp("/static/player/dplayer.html").test(window.location.href) 

  

 
  
  
  
    ? true
    : false;

if (useVideoTipsOne) {
  let findtime = 0;
  let videoTimer = setInterval(() => {
    console.log(4343);

    if (document.querySelectorAll(".noplay")[0]) {
      NotVideo("video_box");
      clearInterval(videoTimer);
    }

    if (document.getElementsByTagName("video")[0]) {
      switch (window.location.host) {
        case "www.bdys10.com":
          {
            VideoTips("col-sm-12");
          }
          break;
        case "czzy.fun":
          {
            console.log(4343);

            VideoTips("video_box");
          }
          break;
        case "www.czzy.fun":
          {
            console.log(4343);

            VideoTips("video_box");
          }
          break;

        case "gaze.run":
          {
            VideoTips("vjs-user-active");
          }
          break;
        default:
          break;
      }

      clearInterval(videoTimer);
    }

    findtime++;

    if (findtime > 30) {
      clearInterval(videoTimer);
    }
  }, 300);
}

if (useVideoTipsTwo) {
  let errorTime = 0;
  let videoTimer = setInterval(() => {
    if (new RegExp("player.yaplayer.one").test(window.location.href)) {
      console.log(66);

      yanaifeiTips();

      clearInterval(videoTimer);
    } else {
      if (document.getElementsByTagName("video")[0]) {
        console.log(11666, window.location.href);

        VideoTips();
        clearInterval(videoTimer);
      }

      setTimeout(() => {
        if (document.getElementById("error")) {
          NotVideo();
          clearInterval(videoTimer);
        }
      }, 3000);
      errorTime++;

      if (errorTime > 150) {
        if (new RegExp("jx.m3u8.tv").test(window.location.href)) {
          //NotVideo();
        }
        clearInterval(videoTimer);
      }
    }
  }, 100);
}

//播放失败跨iframe导致确认不刷新



if (
  new RegExp("m3u8.c-zzy.online").test(window.location.href) ||
  new RegExp("players.immmm.top").test(window.location.href)
) {
  setTimeout(() => {
    if (
      document.getElementsByClassName("load-box")[0].innerHTML ==
      "视频加载失败，请按确认【重新加载】"
    ) {
      console.log(999999999);

      window.parent.postMessage({ type: "error", text: 1234 }, "*");
    }
  }, 6000);
}

setTimeout(() => {
  if (
    new RegExp("czzy.fun").test(window.location.href) ||
    new RegExp("libvio.top").test(window.location.href)
  ) {
    window.addEventListener(
      "message",
      (event) => {
        if (event.data.type == "error") {
          console.log(64646343);
          hasError = true;
        }
      },
      false
    );
  }
}, 3000);
//

//播放玩自动播放下一集以及部分网站焦点事件

//http://www.udanmu.com/
if (
    new RegExp("lziplayer.com").test(window.location.href)||
    new RegExp("vip.lz-cdn").test(window.location.href) ||
    new RegExp("47.242.56.72").test(window.location.href)
   ) {
  setTimeout(() => {
    document
      .getElementsByTagName("video")[0]
      .addEventListener("ended", function (e) {
        window.parent.postMessage({ type: "save", text: 1234 }, "*");
      });
  }, 9000);
}
console.log(window.location.href);

setTimeout(() => {
  if (new RegExp("udanmu").test(window.location.href)) {
    window.addEventListener(
      "message",
      (event) => {
        if (event.data.type == "save") {
          document
            .querySelector(".menu-box .active")
            .nextElementSibling.click();
        }
      },
      false
    );
  }
}, 3000);


if (new RegExp("r.tvkanba").test(window.location.href)) {
  setTimeout(() => {
    document
      .getElementsByTagName("video")[0]
      .addEventListener("ended", function (e) {
        window.parent.postMessage({ type: "save", text: 1234 }, "*");
      });
  }, 9000);
}
console.log(window.location.href);

setTimeout(() => {
  if (new RegExp("qionggedy.cc").test(window.location.href)) {
    window.addEventListener(
      "message",
      (event) => {
        if (event.data.type == "save") {
          document
            .querySelector(".album_list .current")
            .previousElementSibling.firstElementChild.click();
        }
      },
      false
    );
  }
}, 3000);

if (new RegExp("aidouer").test(window.location.href)) {
  window.onload = () => {
    setTimeout(() => {
      window.parent.focus();
    }, 200);
  };
}
if (new RegExp("p.upin.top/aliplaye").test(window.location.href)) {
  window.onload = () => {
    setTimeout(() => {
      window.parent.focus();
    }, 200);
  };
}

if (new RegExp("vip.jsjinfu").test(window.location.href)) {
  setTimeout(() => {
    document
      .getElementsByTagName("video")[0]
      .addEventListener("ended", function (e) {
        window.parent.postMessage({ type: "save", text: 1234 }, "*");
      });
  }, 9000);
}
console.log(window.location.href);

setTimeout(() => {
  if (new RegExp("88mv").test(window.location.href)) {
    window.addEventListener(
      "message",
      (event) => {
        if (event.data.type == "save") {
          document
            .querySelector(".selected")
            .nextElementSibling.firstChild.click();
        }
      },
      false
    );
  }
}, 3000);

if (new RegExp("player.yaplayer").test(window.location.href)) {
  setTimeout(() => {
    document
      .getElementsByTagName("video")[0]
      .addEventListener("ended", function (e) {
        window.parent.postMessage({ type: "save", text: 1234 }, "*");
      });
  }, 9000);
}
console.log(window.location.href);

setTimeout(() => {
  if (new RegExp("yanaifei").test(window.location.href)) {
    window.addEventListener(
      "message",
      (event) => {
        if (event.data.type == "save") {
          document
            .querySelector(".module-play-list-link.active")
            .nextElementSibling.click();
        }
      },
      false
    );
  }
}, 3000);

if (new RegExp("jx.huishij.com").test(window.location.href)) {
  setTimeout(() => {
    document
      .getElementsByTagName("video")[0]
      .addEventListener("ended", function (e) {
        window.parent.postMessage({ type: "save", text: 1234 }, "*");
      });
  }, 9000);
}
console.log(window.location.href);

setTimeout(() => {
  if (new RegExp("lyjxwl.com").test(window.location.href)) {
    window.addEventListener(
      "message",
      (event) => {
        if (event.data.type == "save") {
          document
            .querySelectorAll(".fade-in .active")[0]
            .previousElementSibling.firstChild.click();
        }
      },
      false
    );
  }
}, 3000);

if (new RegExp("tv1920").test(window.location.href)) {
  setTimeout(() => {
    document
      .getElementsByTagName("video")[0]
      .addEventListener("ended", function (e) {
        window.parent.postMessage({ type: "save", text: 1234 }, "*");
      });
  }, 9000);
}

setTimeout(() => {
  if (new RegExp("dazhutizi").test(window.location.href)) {
    window.addEventListener(
      "message",
      (event) => {
        if (event.data.type == "save") {
          window.location.pathname = `${
            window.location.pathname.split("-")[0]
          }-${window.location.pathname.split("-")[1]}-${
            Number(window.location.pathname.split("-")[2]) + 1
          }`;
        }
      },
      false
    );
  }
}, 3000);

if (
  new RegExp("me/static/player/").test(window.location.href) ||
  new RegExp("dadagui.me/webcloud/").test(window.location.href)
) {
  setTimeout(() => {
    document
      .getElementsByTagName("video")[0]
      .addEventListener("ended", function (e) {
        window.parent.postMessage({ type: "save", text: 1234 }, "*");
      });
  }, 2000);
}

setTimeout(() => {
  if (new RegExp("dadagui.me/vodplay").test(window.location.href)) {
    if (document.querySelectorAll(".btn.btn-default")[2]) {
      document.querySelectorAll(".btn.btn-default")[2].click();
    }

    window.addEventListener(
      "message",
      (event) => {
        if (event.data.type == "save") {
          document
            .querySelector(".stui-play__list.clearfix .active")
            .nextElementSibling.children[0].click();
        }
      },
      false
    );
  }
}, 4000);
if (new RegExp("jx.aidouer.net").test(window.location.href)) {
  setTimeout(() => {
    document
      .getElementsByTagName("video")[0]
      .addEventListener("ended", function (e) {
        window.parent.postMessage({ type: "save", text: 1234 }, "*");
      });
  }, 2000);
}

setTimeout(() => {
  if (new RegExp("czzy.fun/v_play").test(window.location.href)) {
    if (document.getElementsByTagName("video")[0] == undefined) {
      window.addEventListener(
        "message",
        (event) => {
          if (event.data.type == "save") {
            document.querySelector(".pbplay.nona").nextElementSibling.click();
          }
        },
        false
      );
    }
  }
}, 4000);

if (new RegExp("bdys").test(window.location.href)) {
  setTimeout(() => {
    document
      .getElementsByTagName("video")[0]
      .addEventListener("ended", function (e) {
        document
          .getElementsByClassName("btn btn-success btn-square me-2 active")[0]
          .nextElementSibling.click();
      });
  }, 10000);
}
if (new RegExp("gaze.run/play").test(window.location.href)) {
  setTimeout(() => {
    document
      .getElementsByTagName("video")[0]
      .addEventListener("ended", function (e) {
        document
          .getElementsByClassName("playbtn_active")[0]
          .parentElement.nextElementSibling.firstChild.click();
      });
  }, 10000);
}

if (
  new RegExp("vip.zykbf.com").test(window.location.href) ||
  new RegExp("hnjiexi.com").test(window.location.href) ||
  new RegExp("jx.zxdy5.top").test(window.location.href) ||
  new RegExp("jx.wolongzywcdn.com:65").test(window.location.href) ||
  new RegExp("lzplayer.tv").test(window.location.href)
) {
  setTimeout(() => {
    document
      .getElementsByTagName("video")[0]
      .addEventListener("ended", function (e) {
        window.parent.postMessage({ type: "save", text: 1234 }, "*");
      });
  }, 9000);
}
console.log(window.location.href);

setTimeout(() => {
  if (new RegExp("555zxdy").test(window.location.href)) {
    window.addEventListener(
      "message",
      (event) => {
        if (event.data.type == "save") {
          document
            .querySelector(".module-play-list .active")
            .nextElementSibling.click();
        }
      },
      false
    );
  }
}, 3000);

if (new RegExp("test3.gqyy8.com").test(window.location.href)) {
  GM_addStyle("iframe{height: 100vh !important;}");
}

if (window.location.origin == "http://cietv.com") {
  if (new RegExp("zhibo").test(window.location.href)) {
    GM_addStyle("#header{display: none !important;}");
    GM_addStyle(".widget-tab{display: none !important;}");
    GM_addStyle(".portfolio-related.portfolio-box{display: none !important;}");
    GM_addStyle(".ad{display: none !important;}");
    GM_addStyle(".footer{display: none !important;}");
    GM_addStyle(".post-navi{display: none !important;}");

    GM_addStyle(".breadcrumb{display: none !important;}");
    GM_addStyle("#switch{display: none !important;}");
    GM_addStyle("#video{position: fixed;top: 0;left: 0;width: 80vw;}");
    GM_addStyle(
      ".intro-box{position: fixed;top: 0.4rem;left:80vw;color: white; font-size:0.4rem; font-weight:600;}"
    );
    GM_addStyle(
      ".use-intro{z-index:9999;background: #282828;position: fixed;top: 0;left:80vw; width:30vw; height:100vh; color: white; font-size:0.4rem; font-weight:600;}"
    );
    var useIntro = document.createElement("div");
    useIntro.classList.add("use-intro");
    useIntro.innerHTML =
      "https://i.hd-r.cn/5d2077ecb7eb6248719de76201a6a97a.png";

    var introBox = document.createElement("div");
    introBox.classList.add("intro-box");
    useIntro.appendChild(introBox);

    let img = document.createElement("img");
    img.src = "https://i.hd-r.cn/5d2077ecb7eb6248719de76201a6a97a.png";
    img.style.width = "20vw";

    introBox.appendChild(img);
    setTimeout(() => {
      document.body.appendChild(useIntro);
    }, 1200);

    var designWidth = 3840;
    // 在屏幕宽度375px，的时候，设置根元素字体大小 100px

    var remPx = 100;
    var scale = window.innerWidth / designWidth; //计算当前屏幕的宽度与设计稿比例
    // 根据屏幕宽度 动态计算根元素的 字体大小
    document.documentElement.style.fontSize = scale * remPx + "px";

    setTimeout(() => {
      // let index = 0;

      window.onkeydown = () => {
        var theEvent = window.event || e;
        var code = theEvent.keyCode || theEvent.which || theEvent.charCode;

        if (code == 38) {
          let i = 0;

          const interval = setInterval(() => {
            if (i < 2) {
              document.onkeyup = function (ev) {
                if (ev.code == "ArrowUp") {
                  sessionStorage.clear();
                  window.location.href = "http://sun.20001027.com/";
                  clearInterval(interval);
                }
              };
            } else {
              // document.getElementById("clist").style.opacity = 1;
              // document.getElementsByClassName(
              //   "menu-box"
              // )[0].style.opacity = 1;
              // document.getElementsByClassName("use-intro")[0].style.display =
              //   "none";

              document.onkeyup = null;
              clearInterval(interval);
            }
            i++;
          }, 300);
        }
      };
    }, 1000);
  }
} else if (window.location.origin == "http://www.yangshizhibo.com") {
  GM_addStyle("#clist{opacity:0}");
  // let data = sessionStorage.getItem("key");

  // if (data == null) {
  //   setTimeout(() => {
  //     window.location.reload();
  //   }, 2000);
  // }
  // sessionStorage.setItem("key", "isSun");

  const webview = window.location.origin;
  var designWidth = 3840;
  // 在屏幕宽度375px，的时候，设置根元素字体大小 100px

  var remPx = 100;
  var scale = window.innerWidth / designWidth; //计算当前屏幕的宽度与设计稿比例
  // 根据屏幕宽度 动态计算根元素的 字体大小
  document.documentElement.style.fontSize = scale * remPx + "px";
  setTimeout(() => {
    document.getElementById("clist").style.opacity = 0;
    for (const item of document.querySelectorAll(".yszb")) {
      item.remove();
    }

    document.getElementsByClassName("indexfooter")[0].remove();
    document.getElementsByClassName("headerline")[0].remove();

    var useIntro = document.createElement("div");
    useIntro.classList.add("use-intro");
    useIntro.innerHTML = "";

    // let useArray = [
    //   // "左：打开节目菜单",
    //   // "右：收起节目菜单",
    //   //"双击上：回到小太阳",
    //   "下：暂停/播放",
    //   "ok：全屏/退出全屏",
    // ];

    let img = document.createElement("img");
    img.src = "https://i.hd-r.cn/5d2077ecb7eb6248719de76201a6a97a.png";
    img.style.marginTop = "0.4rem";
    img.style.width = "20vw";
    useIntro.appendChild(img);

    document.body.appendChild(useIntro);
    document.getElementsByClassName("use-intro")[0].style.display = "block";
    GM_addStyle(
      ".use-intro{position: fixed;top: 0.4rem;left:78.3vw;color: white; font-size:0.4rem; font-weight:600;}"
    );

    let box = document.createElement("div");
    box.classList.add("menu-box");
    var urlArray = [
      {
        name: "推荐频道",
        url: "http://www.yangshizhibo.com/dianshizhibo/tuijianpindao/21.html",
      },
      {
        name: "电视直播",
        url: "http://www.yangshizhibo.com/dianshizhibo/gangtaipindao/622.html",
      },
      {
        name: "央视频道",
        url: "http://www.yangshizhibo.com/dianshizhibo/yangshipindao/383.html",
      },
      {
        name: "卫视频道",
        url: "http://www.yangshizhibo.com/dianshizhibo/weishipindao/419.html",
      },
      {
        name: "地方频道",
        url: "http://www.yangshizhibo.com/dianshizhibo/geshengpindao/beijingpindao/508.html",
      },
      {
        name: "其他频道",
        url: "http://www.yangshizhibo.com/dianshizhibo/gangtaipindao/622.html",
      },
    ];

    for (const item of urlArray) {
      let a = document.createElement("a");
      a.classList.add("pindao");
      a.href = item.url;

      a.innerHTML = item.name;
      box.appendChild(a);
    }

    document.body.appendChild(box);

    GM_addStyle(
      ".menu-box{position:fixed;top:0; width:15vw; height:24vh; opacity:0; right:6.5vw;}"
    );
    GM_addStyle(
      ".menu-box> a{display:block;width:15vw; height:4vh; font-size:0.5rem; color:white; font-weight:700;border-bottom: 2px solid; padding: 0 2vw;}"
    );
  }, 900);

  let classArray = [];
  function getClass(element) {
    if (!(element.tagName === "HTML" && element.parentNode)) {
      classArray.push(element.className);

      getClass(element.parentNode);
    } else {
      return classArray;
    }
  }

  if (webview == "http://www.yangshizhibo.com") {
    var e = new KeyboardEvent("keydown", { keyCode: 39, which: 39 });

    setTimeout(() => {
      if (new RegExp("dianshizhibo").test(window.location.pathname)) {
        // let index = 0;
        window.onkeydown = () => {
          var theEvent = window.event || e;
          var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
          // if (
          //   document.getElementsByClassName("menu-box")[0].style.opacity == 1
          // ) {
          //   if (code == 13) {
          //     document.getElementsByClassName("tv-active")[0].click();
          //   }

          //   if (code == 40) {
          //     if (
          //       index <
          //       document.querySelectorAll(".boxmain")[0].children.length - 1
          //     ) {
          //       index++;
          //     }
          //     if (index > 6) {
          //       document.querySelector(".clist").scrollTop += 27;
          //     }

          //     if (index < 0) {
          //       document
          //         .getElementsByClassName("tv-active")[0]
          //         .classList.remove("tv-active");
          //       document
          //         .querySelectorAll(".pindao")
          //         [index + 6].classList.add("tv-active");
          //     } else {
          //       document
          //         .getElementsByClassName("tv-active")[0]
          //         .classList.remove("tv-active");

          //       document
          //         .querySelectorAll(".boxmain")[0]
          //         .children[index].classList.add("tv-active");
          //     }
          //   }
          //   if (code == 38) {
          //     if (index > -6) {
          //       index--;
          //     }

          //     if (index == 0) {
          //       document.querySelector(".clist").scrollTop = 0;
          //     }

          //     if (
          //       index > 6 &&
          //       index <
          //         document.querySelectorAll(".boxmain")[0].children.length - 4
          //     ) {
          //       document.querySelector(".clist").scrollTop -= 27;
          //     }

          //     if (index < 0) {
          //       document
          //         .getElementsByClassName("tv-active")[0]
          //         .classList.remove("tv-active");
          //       document
          //         .querySelectorAll(".pindao")
          //         [index + 6].classList.add("tv-active");
          //     } else {
          //       document
          //         .getElementsByClassName("tv-active")[0]
          //         .classList.remove("tv-active");
          //       document
          //         .querySelectorAll(".boxmain")[0]
          //         .children[index].classList.add("tv-active");
          //     }
          //   }
          // }

          // if (code == 39) {
          //   document.getElementById("clist").style.opacity = 0;
          //   document.getElementsByClassName("menu-box")[0].style.opacity = 0;
          //   document.getElementsByClassName("use-intro")[0].style.display =
          //     "block";
          // }

          if (code == 37) {
            setTimeout(() => {
              document.dispatchEvent(e);
            }, 600);
          }

          if (code == 38) {
            let i = 0;

            const interval = setInterval(() => {
              if (i < 2) {
                document.onkeyup = function (ev) {
                  if (ev.code == "ArrowUp") {
                    sessionStorage.clear();
                    window.location.href = "http://sun.20001027.com/";
                    clearInterval(interval);
                  }
                };
              } else {
                // document.getElementById("clist").style.opacity = 1;
                // document.getElementsByClassName(
                //   "menu-box"
                // )[0].style.opacity = 1;
                // document.getElementsByClassName("use-intro")[0].style.display =
                //   "none";

                document.onkeyup = null;
                clearInterval(interval);
              }
              i++;
            }, 300);
          }
        };

        document.getElementsByTagName("font")[0].remove();
      }
    }, 2600);

    GM_addStyle("body{overflow:hidden;}");
    GM_addStyle(".boxplay{width:100vw; height:100vh; margin:0}");
    GM_addStyle(".boxFlash{width:78vw; height:100vh; margin:0}");
    GM_addStyle("#clist{height:60vh !important; margin:0;}");
    GM_addStyle(
      ".videoRight{width:21.5vw !important; position:fixed;top:25vh; right:0}"
    );

    GM_addStyle(".videoRight{display:none !important;}");
    GM_addStyle(
      ".boxmain > a{ background-size: 5rem !important; font-size:0.4rem; line-height:0.6rem; height:0.6rem; white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}"
    );

    // setTimeout(() => {
    //   let isDom = false;
    //   for (const element of document.getElementsByClassName("boxmain")[0]
    //     .children) {
    //     if (
    //       isDom == true &&
    //       window.location.pathname == element.getAttribute("href")
    //     ) {
    //       element.remove();
    //     }

    //     if (
    //       isDom == false &&
    //       window.location.pathname == element.getAttribute("href")
    //     ) {
    //       isDom = true;
    //       console.log(element);
    //       element.classList.add("tv-active");
    //       GM_addStyle(
    //         ".tv-active{ background-image:none !important;background-color:red !important; color:red;font-size: 0.7rem !important;height: 0.8rem !important;line-height: 0.8rem !important;font-weight: 600;}"
    //       );
    //     }
    //   }

    //   for (let dom of document.body.getElementsByTagName("*")) {
    //     classArray = [];
    //     getClass(dom);
    //     //console.log(classArray);
    //     console.log(classArray.includes("floatLeft videoLeft"));

    //     if (!classArray.includes("floatLeft videoLeft")) {
    //       //dom.remove();
    //     }
    //   }
    // }, 1600);
  }
} else {
  let time = 500;
  if (new RegExp("smdyy1").test(window.location.href)) {
    time = 2000;
  }

  (function () {
   
    setTimeout(() => {
      // 设计稿宽度
      var designWidth = 3840;
      // 在屏幕宽度375px，的时候，设置根元素字体大小 100px

      var remPx = 100;
      var scale = window.innerWidth / designWidth; //计算当前屏幕的宽度与设计稿比例
      // 根据屏幕宽度 动态计算根元素的 字体大小
      document.documentElement.style.fontSize = scale * remPx + "px";
      if (
        new RegExp("yaplayer").test(window.location.href) ||
        new RegExp("p.upin.top/aliplayer").test(window.location.href) ||
        new RegExp("ttzj365.com/playerapi").test(window.location.href) ||
        new RegExp("jx1.xn--9sw0lnkz85j.xn--fiqs8s").test(
          window.location.href
        ) ||
        new RegExp(".xn--fiqs8s").test(window.location.href) ||
        new RegExp("zj.jsjinfu.com:8443").test(window.location.href) ||
        new RegExp("vip.jsjinfu.com:8443").test(window.location.href) ||
        (new RegExp("dadagui").test(window.location.href) &&
          !new RegExp("vodplay").test(window.location.href)) ||
        new RegExp("jx.m3u8.tv").test(window.location.href) ||
        new RegExp("players.immmm.top").test(window.location.href) ||
        new RegExp("sjx.quankan.app").test(window.location.href) ||
        new RegExp("hnjiexi").test(window.location.href) ||
        new RegExp("jx.zxdy5.top/jiexi").test(window.location.href) ||
        new RegExp("lzplayer.tv").test(window.location.href) ||
        new RegExp("test3.gqyy8.com").test(window.location.href) ||
        new RegExp("43.240.74.102:4433").test(window.location.href) ||
        new RegExp("greasyfork.org").test(window.location.href) ||
        new RegExp("jx.xmflv.com").test(window.location.href)
      ) {
        return;
      }
      function imageCreate() {
        var style = document.createElement("style");
        style.type = "text/css";
        style.rel = "stylesheet";
        style.appendChild(document.createTextNode(css));
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(style);
        var parasunky = document.createElement("div");

        var page_right = document.createElement("div");
        page_right.classList.add("page_right");

        let currentTop = 22;

        parasunky.classList.add("sunky");
        parasunky.setAttribute("id", "sunky");
        parasunky.style.position = "absolute";

        //parasunky.style.top = currentTop+'%';
        parasunky.style.marginTop = "0.3rem";

        parasunky.style.marginLeft = "-0.06rem";

        //parasunky.style.maxWidth = "20%";
        parasunky.innerHTML = `<img style="width:7.55rem" src="https://i.328888.xyz/2023/04/04/ijAIWJ.png">`;

        page_right.appendChild(parasunky);

        document.body.appendChild(page_right);

        const blockLabel = document.getElementsByClassName("area_block")[0];
      }

      if (new RegExp("default.365yg").test(window.location.href)) {
        imageCreate();

        let clickTimes = 0;

        document.documentElement.onkeyup = function (e) {
          // 回车提交表单

          var theEvent = window.event || e;
          var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
          console.log(clickTimes);

          if (code == 38) {
            if (clickTimes == 1) {
              clickTimes += 1;
            } else {
              clickTimes = 1;
            }
          } else {
            if (code == 40 && clickTimes == 2) {
              clickTimes += 1;
            } else if (code == 40 && clickTimes == 3) {
              clickTimes += 1;
            } else {
              clickTimes = 0;
            }
          }
          if (clickTimes == 4) {
            window.location.href = "http://sun.20001027.com/";
          }
        };
        GM_addStyle(
          "video{width: 78vw;position:absolute;top:50% !important; left:0;margin:0;overflow:hidden; transform: translateY(-50%); }"
        );
        GM_addStyle("body{overflow:hidden;margin:0;}");
      }

      window.setInterval(function () {
        if (document.getElementById("fsdmvideo")) {
          document.getElementById("fsdmvideo").volume = 1;
        }
        if (document.getElementsByClassName("dplayer-video")[0]) {
          document.getElementsByClassName("dplayer-video")[0].volume = 1;
        }
        if (document.getElementsByClassName("dplayer-video")[0]) {
          document.getElementsByClassName("dplayer-video")[0].volume = 1;
        }
      }, 2 * 1000);

      const urlArr = [
        "vplay",
        "vodplay",
        "sid",
        "v_play",
        "play",
        ".html",
        "fanplay",
        "mov,",
      ];
      var css = "{display:none !important;height:0 !important}";

      if (
        urlArr.every((item) => !new RegExp(item).test(window.location.href))
      ) {
        if (!new RegExp("default.365yg").test(window.location.href)) {
          return;
        }
      }

      if (new RegExp("czzy.fun").test(window.location.href)) {
        document.documentElement.scrollTop = 0;

        document.getElementsByClassName("el-dialog__wrapper")[1].style.display =
          "none";
        if (document.getElementsByClassName("v-modal")[0]) {
          document.getElementsByClassName("v-modal")[0].style.display = "none";
        }
        setInterval(() => {
          var renderCSS = () => {
            let style = document.createElement("style");
            style.innerHTML = `.h2_player_prevideo {display:none !important} .h2_closeclick {opacity: 0} !important`;
            document.head.appendChild(style);
          };
          if (document.querySelector(".h2_closeclick")) {
            renderCSS();
            document.querySelector(".h2_closeclick").click();
            setTimeout(() => {
              document.querySelector("video").play();
            }, 50);
          }
        }, 500);
      }
      if (!new RegExp("fqfun").test(window.location.href)) {
        //莫札兔
        css += ".header{display:none !important;}";
        css += ".sidebar{display:none !important;}";
        css +=
          ".page .main{    padding:0px 0px 0 0!important;margin:0!important;}";
        css += ".player .player-heading{display:none !important;}";
        css += ".player .module-play-list{display:none !important;}";
        css += ".module-player-handle-items{display:none !important;}";
        css += ".module-adslist{display:none !important;}";
        css += ".fixedGroup{display:none !important;}";
        css += ".module-heading{display:none !important;}";
        css += ".module:nth-child(2){display:none !important;}";
        css += ".module:nth-child(3){display:none !important;}";
        css += ".footer{display:none !important;}";
        css += ".main{height:100vh}";
        css += ".module-player{margin:0!important;padding:0!important}";
        css += ".player-box-main{height:100vh;background-color: black;}";

        css += ".player-list{height:initial!important}";
        css += ".module-info-heading{color:red !important}";
        css +=
          ".area_intro>.module-info-tag-link::after{border: none; !important}";
        //6080

        css += ".fixed_right_bar{display:none !important;}";
        css += ".header-content{display:none !important;}";
        css += "#header,.player-block{padding-top:0 !important;}";
        css += ".module-info-tag-link{padding:0 !important;}";
        css += ".player-wrapper{height:96vh}";
        css += ".module-player-info{background:#fff!important}";
        css += ".title-info{display:none !important;}";
        css += ".title-info-ad{display:none !important;}";
        css += ".module-info-heading h1::before{display:none !important;}";
        css += ".module-blocklist{display:none !important;}";
        css += ".player-info{display:none !important;}";
        css += "#panel2{border:none!important}";
        css += ".player-box-side,.module-player-side{width:20% !important;}";
        css += ".player-box-main{width:100vw !important;}";
        css += ".content{max-width:100vw !important;}";
        css += ".module-lines-list{display:none !important;}";
        css +=
          ".player-block,.player-box-side,.player-side-playlist,.myui-player{background:#fff !important;}";
        css +=
          ".player-side-playlist,.module-list-right-title-wrap .thesis-wrap .title-link{width:100% !important;}";
        css += "#footer,#minigonggaop{display:none !important;}";
        css +=
          ".module-list-right-title-wrap .thesis-wrap a{display:none !important}";
        css += "#HMRichBox{display:none !important}";

        //ylwt33
        css += ".myui-header__top{display:none !important;}";
        css += "myui-player__item .tips{ display: none; !important;}";
        css += ".pull-right,.tips {display:none !important;}";
        css += "body {padding:0 !important;}";
        css +=
          "#fix_bottom_dom,.myui-panel-bg,.myui-player__operate,.myui-player__data,.myui-foot,.myui-content__list {display:none !important;}";
        css +=
          ".MacPlayer,.myui-player__box,.embed-responsive{height:100vh!important;}";
        css += ".container{max-width:100vw!important;}";
        css +=
          "#player-sidebar,.playbox,.myui-player__item{background:#fff!important}";
        css += ".text-fff,.ptit a{color:#282828!important}";
        css += ".module-player-info .module-info-tag-link::after{border:none}";
        css += ".module-info-tag-link{background:transparent!important}";
        css += ".myui-panel__head .title:before{display:none}";
        css += "#player-sidebar-is{display:none}";

        //changzhang 3072 3072
        css += ".nav{display:none !important;}";
        css += ".playbox{margin-top: 0px; !important;}";
        css +=
          ".paycon {width:20% !important;position: fixed;top: 0;left: 80%;}";
        css += ".right_btn {display:none !important;}";
        css += ".text-muted{color:#424242!important;font-size:14px}";
        css += ".movie_box_do{width:100%; !important;}";
        css += ".mikd{margin:0;max-width:80%;padding:0}";
        css += ".xiluxue,.ttmtiart{display:none !important;}";
        css += ".juji_box,.c-player-panel{display:none !important;}";
        css +=
          ".myui-panel__head .title,.ptit{padding-left:0!important;font-size:28px!important;font-weight:700;}";
        css += ".col-lg-wide-25{width:20%}";
        css += ".col-lg-wide-75{width:80%}";
        css += ".img_info{background:green;width:100px;height:100px}";
        css += ".ptit{display:none}";
        css += ".video_box{margin-right:0}";
        css += ".dplayer{background-color:black !important}";

        //freeok
        css += ".module-info-tag-link::after{border: none; }";
        css += ".module-player-info,.col-pd{display:none !important}";
        css += ".is_pc{display:none !important}";
        //yixuewan
        css += ".player-rm{display:none}";

        //byds03.com
        css += ".ayx>a{display:none;!important}";
        css += ".navbar-expand-md {display:none;!important}";
        css += ".card-footer>h2 {display:none;!important}";
        css += ".card-header{display:none;!important}";
        css += ".border-top{display:none;!important}";
        css += ".row>.col-12{display:none;!important}";
        css += ".play-list>.col-12{display:none; opacity:0;!important}";
        css += ".scroll-x{display:none; opacity:0;!important}";
        css += ".card>.card-footer{display:none; opacity:0;!important}";

        css +=
          ".clear-padding-sm{margin:0; padding:0; max-width: unset !important;}";

        css += ".col-sm-12{margin-top:0;!important}";
        css += "#video{padding-bottom: 50.25% !important}";
        css += ".row-cards{--tblr-gutter-x: unset !important;}";
        css += ".row{--tblr-gutter-x: unset !important;}";

        if (window.navigator.platform.toLowerCase() == "linux armv8l") {
          css +=
            ".col-sm-12{position: absolute;width:79.1vw !important;max-height:100vh;margin-left:0;margin-top:0;padding-left:0;padding-top:0;padding-right:0;!important}";
        } else if (window.navigator.platform.toLowerCase() == "linux armv71") {
          if (new RegExp("bdys").test(window.location.href)) {
            GM_addStyle(".load-box{font-size: 0.6rem !important;}");

            GM_addStyle("#sunky img{width: 19vw !important;}");
            GM_addStyle("#sunky {margin-top: 10vh; top: unset !important;}");
            GM_addStyle(".barrage {left: 76.5vw !important;}");

            GM_addStyle(".area {width: 36vh !important;}");
            GM_addStyle(".control_menu{top: 16% !important;}");
            css +=
              ".col-sm-12{position: absolute;width:75.5vw !important;max-height:100vh;margin-left:0;margin-top:0;padding-left:0;padding-top:0;padding-right:0;!important}";
          }
        } else {
          css +=
            ".col-sm-12{position: absolute;width:79.1vw !important;max-height:100vh;margin-left:0;margin-top:0;padding-left:0;padding-top:0;padding-right:0;!important}";
        }

        // css += "@media screen and (min-width:461px){html{font-size:18px;}}@media screen and (max-width:460px) and (min-width:401px){html{font-size:22px;}}@media screen and (max-width:400px){html{font-size:30px;}} "

        // var height = document.getElementsByTagName("body")[0].offsetHeight;

        css += ".page-body{margin-top:7%;!important}";

        css += ".ayx >img{display:none;!important}";
        css += ".page-wrapper{background-color: #000000;!important}";

        //dadagui.me
        css += ".stui-header{display: none !important}";
        css += ".stui-player__detail{display: none !important}";
        css += ".stui-player__side{display: none !important}";
        css += ".stui-foot{display: none !important}";
        css += ".stui-player{padding: 0 !important}";

        css += ".stui-player__left{width: 101% !important}";

        css +=
          ".container{position: absolute;max-width:30.4rem; width: 29.5rem;max-height:100vh;margin-left:0;margin-top:0;padding-left:0;padding-top:0;padding-right:0;!important}";


        //udanmu
        css += ".player-box-side{display: none !important}";

        //字体统一样式
        //css+= '.area>.area_title {font: normal normal 550 29px /1.2 courier; color:black;width:250px;}'
        //css+= '.area_intro>.module-info-tag-link {font: normal normal 400 20px /3 courier; color:black}'
        //css+= '.area_intro>span, .area_intro>a, .area_intro{font: normal normal 400 20px /3 courier; color:black}'
        //反斜杠大小问题
        //css+= '.slash {font-size:20px;}'
        //css+= '.area_intro>.module-info-tag-link>.slash {font-size:20px;padding-left:5px;padding-right:0;!important}'

        css += ".module-info-tag-link>.slash {font-size:20px }";

        //UI图样式还原
      }

      if (new RegExp("88mv").test(window.location.href)) {
        css += ".adx_bottom_globle{display: none !important}";
        css += ".leaveNavInfo{display: none !important}";
        css += ".topone{display: none !important}";
        css += ".header-all{display: none !important}";
        css += ".player{max-width:30.3rem;background: #000000 !important}";
        css += ".player>.main{width:100%}";
        css += ".player>.main>.ptitle{display: none !important}";
        css += "body>.main{display: none !important}";
        css += ".download{display: none !important}";
        css += "body{height: 100vh !important;overflow:hidden !important; }";

        //css += ".player>.main>.MacPlayer>table{margin-top: 7% !important}";
        css +=
          ".player>.main>.MacPlayer>table>tbody>tr>#playleft iframe:nth-child(2){height: 100% !important}";
      }

      GM_addStyle(
        ".webfullscreen_style{ display: block !important;position: fixed !important;width: 100vw !important;height: 100vh !important;top: 0 !important;left: 0 !important;background: #000 !important;z-index: 9999999 !important;}"
      );

      GM_addStyle(".webfullscreen_style_zindex{z-index: 9999999 !important;}");

      css +=
        ".page_right {height: 100vh; display: flex;justify-content: center;padding:0.3rem; position:absolute; top:0; right:0 !important; background-color: rgba(255, 255, 255, 1);width: 8rem;margin-left: 30.4rem;opacity: 1; }";
      css +=
        ".area{padding:0.29rem; background-color: rgba(255, 240, 229, 1);border-radius: 0.2rem;height: 2.12rem;border: 0.02rem solid rgba(255, 112, 0, 1);width: 6.8rem;opacity: 1;}";

      if (new RegExp("czzy.fun").test(window.location.href)) {
        css +=
          ".area{padding:0.29rem; background-color: rgba(255, 240, 229, 1);border-radius: 0.2rem;height: 1.5rem;border: 0.02rem solid rgba(255, 112, 0, 1);width: 6.8rem;opacity: 1;}";
      } else {
        css +=
          ".area{padding:0.29rem; background-color: rgba(255, 240, 229, 1);border-radius: 0.2rem;height: 2.12rem;border: 0.02rem solid rgba(255, 112, 0, 1);width: 7.44rem;opacity: 1;}";
      }
      css += ".player-box-main{padding-right:32px;!important}";
      css +=
        ".page_right>.area>.area_block{height: 0.1rem;width:fit-content; background: linear-gradient(to right, rgba(255,112,0,1),rgb(255, 255, 255,0.4));border-radius: 5px;background-size: 100% 100%;}";
      css += ".area_intro{display:flex;margin-top: 0.25rem;}";
      css +=
        ".area_title{width:fit-content; height: 0.73rem;overflow-wrap: break-word;color: rgba(51, 51, 51, 1);font-size: 0.52rem;font-family: PingFangSC-Medium;font-weight: 500;text-align: left;line-height: 0.73rem;}";
      css +=
        ".intro_item{background-color: rgba(255, 213, 180, 1);border-radius: 0.1rem;height: 0.43rem;width:fit-content;opacity: 1; }";
      css +=
        ".area_intro:first-child{ width: 0.92rem;height: 0.43rem;!important}";
      css += ".intro_item:not(:first-child){margin-left:0.24rem; }";

      css +=
        ".intro_item>div{ height: 0.31rem;overflow-wrap: break-word;color: rgba(51, 51, 51, 1);font-size: 0.26rem;font-family: Helvetica;font-weight: NaN;text-align: left;white-space: nowrap;line-height: 0.31rem;margin: 0.06rem 0 0 0.17rem;}";
      css += ".intro_item>div:not(:first-child){width:fit-content;}";
      css += ".intro_item:first-child(:first-child){width:0.92rem; }";
      css += ".area_intro>.intro_item>div{margin:0.06rem 0.17rem;}";

      //一些其他的问题
      css += ".player-box-main{padding-right: 0; !important;}";

      if (window.location.host == "czzy.fun") {
        GM_addStyle(".dplayer-video-wrap{margin-top:0rem;}");
      }

      //去广告
      css += "#show-3651912026076680308-10646{width:0}";

      css += ".artplayer-plugin-ads-html{display: none !important;}";

      var inses = document.getElementsByTagName("ins");
      if (document.getElementsByTagName("ins")) {
        for (let ins of inses) {
          ins.style.width = 0;
          ins.style.display = "none";
        }
      }

      if (window.location.host == "www.ylwt33.com") {
        css += "body{height:100vh;overflow:hidden}";
      }

      if (
        window.location.host == "czzy.fun" ||
        window.location.host == "www.czzy.fun"
      ) {
        var video_box = document.getElementsByClassName("video_box");
        css += ".page_right{height:100rem !important;}";
        if (video_box[0]) {
          video_box[0].classList.remove("v_box_xiao");
        }
      }

      if (window.location.host == "dazhutizi.net") {
        css += ".page_right{height:100rem !important;}";
      }
      if (new RegExp("tv1920").test(window.location.href)) {
        // var name = $.parseJSON(decodeURI(location.search));
        // name = name.substring(name.lastIndexOf("=") + 1);
        // console.log(name);
        // alert(name);
      }

      if (
        !new RegExp("tv1920").test(window.location.href) &&
        !new RegExp("aidouer").test(window.location.href)
      ) {
        loadStyle(css);
      }

      //document.querySelector(".fixedGroup-item .icon-rijian").click()
      //document.querySelector("#clothes .icon-a-rijianmoshi").click()

      function loadStyle(css) {
        if (
          new RegExp("yaplayer").test(window.location.href) ||
          new RegExp("api.peizq.online").test(window.location.href) ||
          new RegExp("yanaifei.tv/static/player").test(window.location.href)
        ) {
          return;
        }

        var style = document.createElement("style");
        style.type = "text/css";
        style.rel = "stylesheet";
        style.appendChild(document.createTextNode(css));
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(style);
        var parasunky = document.createElement("div");

        var page_right = document.createElement("div");
        var area_block = document.createElement("div");

        page_right.classList.add("page_right");
        area_block.classList.add("area_block");

        function styleUniformed(name) {
          var area = document.createElement("div");

          let info = document.getElementsByClassName(name)[0];

          let title_label = document.createElement("div");
          let intro_label = document.createElement("div");

          let title, intro;
          area.classList.add("area");
          if (
            !new RegExp("czzy.fun").test(window.location.href) &&
            !new RegExp("6080").test(window.location.href)
          ) {
            title = info.children[0].children[0].innerHTML;
            intro = info.children[1].innerText.replace(/\s/g, "");
            if (!isNaN(Number(intro[3]))) {
              intro = intro.slice(0, 4) + "    " + intro.slice(4);
              const length = intro.length;
              intro = intro.substring(0, length - 1);
            }

            if (new RegExp("ylwt33").test(window.location.href)) {
              intro = document
                .getElementsByClassName("pull-left")[0]
                .innerText.replace(/\s/g, "");
              console.log(intro, 33);
            }
          } else {
            if (new RegExp("6080").test(window.location.href)) {
              title = info.innerHTML;
            } else {
              title = info.children[0].innerHTML;
              intro = info.children[1] ? info.children[1].innerHTML : "";
            }
          }
          let arr = [];
          if (
            intro &&
            intro.split("").some((item) => item === " " || item === "/")
          ) {
            arr = intro.split("/")[0].split(" ");
            arr.push(intro.split("/")[1]);
            console.log(arr);
          }

          let title_node = document.createTextNode(title);
          title_label.classList.add("area_title");
          intro_label.classList.add("area_intro");
          title_label.appendChild(title_node);

          area.appendChild(title_label);
          area.appendChild(area_block);
          if (intro) {
            area.appendChild(intro_label);
          }

          // area.style.position = "absolute";
          //area.style.left = "82%";
          //area.style.top = "6%";
          document.body.appendChild(area);
          area.parentNode.replaceChild(page_right, area);
          page_right.appendChild(area);

          arr.forEach((item) => {
            let intro_item = document.createElement("div");
            let span = document.createElement("div");

            if (item) {
              intro_item.classList.add("intro_item");
              intro_item.appendChild(span);

              span.innerHTML = item;
              intro_label.appendChild(intro_item);
            }
          });
        }

        function bydsUniformed(name) {
          var area = document.createElement("div");

          let info = document.getElementsByClassName(name)[0];
          console.log(info);
          let title_label = document.createElement("div");
          let intro_label = document.createElement("div");
          let title, intro;
          area.classList.add("area");
          title = info.children[0].children[0].innerText;
          intro = info.children[0].innerText.split("-")[1].split(" ")[1];

          let title_node = document.createTextNode(title);
          title_label.classList.add("area_title");
          intro_label.classList.add("area_intro");
          title_label.appendChild(title_node);
          area.appendChild(title_label);
          area.appendChild(area_block);
          if (intro) {
            area.appendChild(intro_label);
          }
          document.body.appendChild(area);
          area.parentNode.replaceChild(page_right, area);
          page_right.appendChild(area);
          let arr = [intro];
          arr.forEach((item) => {
            let intro_item = document.createElement("div");
            let span = document.createElement("div");

            if (item) {
              intro_item.classList.add("intro_item");
              intro_item.appendChild(span);

              span.innerHTML = item;
              intro_label.appendChild(intro_item);
            }
          });
        }

        function dadaGuiUniformed(name) {
          var area = document.createElement("div");

          let info = document.getElementsByClassName(name)[0];
          console.log(info);
          let title_label = document.createElement("div");
          let intro_label = document.createElement("div");
          let title, intro;
          area.classList.add("area");
          title = document.getElementsByClassName("title")[0].innerText;
          intro = document
            .getElementsByClassName("data")[0]
            .innerText.split("/");

          console.log(title, intro);
          let title_node = document.createTextNode(title);
          title_label.classList.add("area_title");
          intro_label.classList.add("area_intro");
          title_label.appendChild(title_node);
          area.appendChild(title_label);
          area.appendChild(area_block);
          if (intro) {
            area.appendChild(intro_label);
          }
          document.body.appendChild(area);
          area.parentNode.replaceChild(page_right, area);
          page_right.appendChild(area);

          if (intro[4]) {
            var str = "" + intro[4].split("详")[0];

            //intro.splice(4,1,str)
            intro.splice(4, 1);
            console.log(str);
            GM_addStyle(".intro_item:not(:first-child){margin-left:0.24rem; }");
          }
          let arr = [...intro];
          arr.forEach((item) => {
            let intro_item = document.createElement("div");
            let span = document.createElement("div");

            if (item) {
              intro_item.classList.add("intro_item");
              intro_item.appendChild(span);

              span.innerHTML = item;
              intro_label.appendChild(intro_item);
            }
          });
        }

        function smddyUniformed(name) {
          var area = document.createElement("div");

          let info = document.getElementsByClassName(name)[0];

          let title_label = document.createElement("div");
          let intro_label = document.createElement("div");

          let title, intro;
          area.classList.add("area");
          if (
            !new RegExp("czzy.fun").test(window.location.href) &&
            !new RegExp("6080").test(window.location.href)
          ) {
            title = info.children[1].innerHTML;
            intro = info.children[2].innerText.replace(/\s/g, "");
            if (!isNaN(Number(intro[3]))) {
              intro = intro.slice(0, 4) + "    " + intro.slice(4);
              const length = intro.length;
              intro = intro.substring(0, length - 1);
            }

            if (new RegExp("ylwt33").test(window.location.href)) {
              intro = document
                .getElementsByClassName("pull-left")[0]
                .innerText.replace(/\s/g, "");
              console.log(intro, 33);
            }
          }
          let arr = [];
          if (
            intro &&
            intro.split("").some((item) => item === " " || item === "/")
          ) {
            arr = intro.split("/")[0].split(" ");
            arr.push(intro.split("/")[1]);
            console.log(arr);
          }

          let title_node = document.createTextNode(title);
          title_label.classList.add("area_title");
          intro_label.classList.add("area_intro");
          title_label.appendChild(title_node);

          area.appendChild(title_label);
          area.appendChild(area_block);
          if (intro) {
            area.appendChild(intro_label);
          }

          // area.style.position = "absolute";
          //area.style.left = "82%";
          //area.style.top = "6%";
          document.body.appendChild(area);
          area.parentNode.replaceChild(page_right, area);
          page_right.appendChild(area);

          arr.forEach((item) => {
            let intro_item = document.createElement("div");
            let span = document.createElement("div");

            if (item) {
              intro_item.classList.add("intro_item");
              intro_item.appendChild(span);

              span.innerHTML = item;
              intro_label.appendChild(intro_item);
            }
          });
        }

        function NovipUniformed() {
          GM_addStyle(".page_right{z-index:999}");

          var area = document.createElement("div");

          let title_label = document.createElement("div");
          let intro_label = document.createElement("div");

          let title, intro;
          area.classList.add("area");

          title = document
            .getElementsByClassName("light-title")[0]
            .innerHTML.split("】")[1]
            .split("【")[0];
          intro = document
            .getElementsByClassName("light-title")[0]
            .innerHTML.split("】")[0]
            .split("【")[1]
            .split("/");

          let arr = intro;

          let title_node = document.createTextNode(title);
          title_label.classList.add("area_title");
          intro_label.classList.add("area_intro");
          title_label.appendChild(title_node);

          area.appendChild(title_label);
          area.appendChild(area_block);
          if (intro) {
            area.appendChild(intro_label);
          }

          // area.style.position = "absolute";
          //area.style.left = "82%";
          //area.style.top = "6%";
          document.body.appendChild(area);
          area.parentNode.replaceChild(page_right, area);
          page_right.appendChild(area);

          arr.forEach((item) => {
            let intro_item = document.createElement("div");
            let span = document.createElement("div");

            if (item) {
              intro_item.classList.add("intro_item");
              intro_item.appendChild(span);

              span.innerHTML = item;
              intro_label.appendChild(intro_item);
            }
          });
        }

        function gazeUniformed() {
          GM_addStyle(".page_right{z-index:999}");

          var area = document.createElement("div");

          let title_label = document.createElement("div");
          let intro_label = document.createElement("div");

          let title, intro;
          area.classList.add("area");

          title = document.getElementsByClassName("grade")[0].innerHTML;
          intro = [];
          for (const item of document.getElementsByClassName("badge-mts")) {
            intro.push(item.innerHTML);
          }

          let arr = intro;

          let title_node = document.createTextNode(title);
          title_label.classList.add("area_title");
          intro_label.classList.add("area_intro");
          title_label.appendChild(title_node);

          area.appendChild(title_label);
          area.appendChild(area_block);
          if (intro) {
            area.appendChild(intro_label);
          }

          // area.style.position = "absolute";
          //area.style.left = "82%";
          //area.style.top = "6%";
          document.body.appendChild(area);
          area.parentNode.replaceChild(page_right, area);
          page_right.appendChild(area);

          arr.forEach((item) => {
            let intro_item = document.createElement("div");
            let span = document.createElement("div");

            if (item) {
              intro_item.classList.add("intro_item");
              intro_item.appendChild(span);

              span.innerHTML = item;
              intro_label.appendChild(intro_item);
            }
          });
        }

        function hdmoliUniformed() {
          GM_addStyle(".page_right{z-index:999}");

          var area = document.createElement("div");

          let title_label = document.createElement("div");
          let intro_label = document.createElement("div");

          let title, intro;
          area.classList.add("area");

          title = document
            .getElementsByClassName("myui-panel-box")[1]
            .children[1].innerText.split("《")[1]
            .split("》")[0];
          intro = [];

          let arr = intro;

          let title_node = document.createTextNode(title);
          title_label.classList.add("area_title");
          intro_label.classList.add("area_intro");
          title_label.appendChild(title_node);

          area.appendChild(title_label);
          area.appendChild(area_block);
          if (intro) {
            area.appendChild(intro_label);
          }

          // area.style.position = "absolute";
          //area.style.left = "82%";
          //area.style.top = "6%";
          document.body.appendChild(area);
          area.parentNode.replaceChild(page_right, area);
          page_right.appendChild(area);

          arr.forEach((item) => {
            let intro_item = document.createElement("div");
            let span = document.createElement("div");

            if (item) {
              intro_item.classList.add("intro_item");
              intro_item.appendChild(span);

              span.innerHTML = item;
              intro_label.appendChild(intro_item);
            }
          });
        }
        function fqFunUniformed() {
          GM_addStyle(".page_right{z-index:999}");

          var area = document.createElement("div");

          let title_label = document.createElement("div");
          let intro_label = document.createElement("div");

          let title, intro;
          area.classList.add("area");

          title =
            document.getElementsByClassName("title")[0].firstChild.innerHTML;
          intro = [];

          for (const item of document.querySelectorAll(".data.margin-0 a")) {
            intro.push(item.innerHTML);
          }

          let arr = intro;

          let title_node = document.createTextNode(title);
          title_label.classList.add("area_title");
          intro_label.classList.add("area_intro");
          title_label.appendChild(title_node);

          area.appendChild(title_label);
          area.appendChild(area_block);
          if (intro) {
            area.appendChild(intro_label);
          }

          // area.style.position = "absolute";
          //area.style.left = "82%";
          //area.style.top = "6%";
          document.body.appendChild(area);
          area.parentNode.replaceChild(page_right, area);
          page_right.appendChild(area);

          arr.forEach((item) => {
            let intro_item = document.createElement("div");
            let span = document.createElement("div");

            if (item) {
              intro_item.classList.add("intro_item");
              intro_item.appendChild(span);

              span.innerHTML = item;
              intro_label.appendChild(intro_item);
            }
          });
        }
        function mvUniformed() {
          GM_addStyle(".page_right{z-index:999}");

          var area = document.createElement("div");

          let title_label = document.createElement("div");
          let intro_label = document.createElement("div");

          let title, intro;
          area.classList.add("area");

          title = document.querySelectorAll(".title strong")[0].innerHTML;
          intro = [];

          let arr = intro;

          let title_node = document.createTextNode(title);
          title_label.classList.add("area_title");
          intro_label.classList.add("area_intro");
          title_label.appendChild(title_node);

          area.appendChild(title_label);
          area.appendChild(area_block);
          if (intro) {
          }

          // area.style.position = "absolute";
          //area.style.left = "82%";
          //area.style.top = "6%";
          document.body.appendChild(area);
          area.parentNode.replaceChild(page_right, area);
          page_right.appendChild(area);

          arr.forEach((item) => {
            let intro_item = document.createElement("div");
            let span = document.createElement("div");

            if (item) {
              intro_item.classList.add("intro_item");
              intro_item.appendChild(span);

              span.innerHTML = item;
              intro_label.appendChild(intro_item);
            }
          });
        }
        function ttzjUniformed() {
          GM_addStyle(".page_right{z-index:999}");

          var area = document.createElement("div");

          let title_label = document.createElement("div");
          let intro_label = document.createElement("div");

          let title, intro;
          area.classList.add("area");

          title = document.querySelector(".title a").innerHTML;
          intro = [
            document
              .querySelectorAll(".data.margin-0")[0]
              .innerText.split("：")[1]
              .split(","),
            document
              .querySelectorAll(".data.margin-0")[0]
              .innerText.split("：")[1]
              .split(",")[1]
              .split(" ")[0],
          ];

          let arr = intro;

          let title_node = document.createTextNode(title);
          title_label.classList.add("area_title");
          intro_label.classList.add("area_intro");
          title_label.appendChild(title_node);

          area.appendChild(title_label);
          area.appendChild(area_block);
          if (intro) {
            area.appendChild(intro_label);
          }

          // area.style.position = "absolute";
          //area.style.left = "82%";
          //area.style.top = "6%";
          document.body.appendChild(area);
          area.parentNode.replaceChild(page_right, area);
          page_right.appendChild(area);

          arr.forEach((item) => {
            let intro_item = document.createElement("div");
            let span = document.createElement("div");

            if (item) {
              intro_item.classList.add("intro_item");
              intro_item.appendChild(span);

              span.innerHTML = item;
              intro_label.appendChild(intro_item);
            }
          });
        }
        function qiongUniformed() {
          GM_addStyle(".page_right{z-index:999}");

          var area = document.createElement("div");

          let title_label = document.createElement("div");
          let intro_label = document.createElement("div");

          let title, intro;
          area.classList.add("area");

          title = document.querySelectorAll(".player_title")[0].innerText;
          intro = [];

          let arr = intro;

          let title_node = document.createTextNode(title);
          title_label.classList.add("area_title");
          intro_label.classList.add("area_intro");
          title_label.appendChild(title_node);

          area.appendChild(title_label);
          area.appendChild(area_block);
          if (intro) {
          }

          // area.style.position = "absolute";
          //area.style.left = "82%";
          //area.style.top = "6%";
          document.body.appendChild(area);
          area.parentNode.replaceChild(page_right, area);
          page_right.appendChild(area);

          arr.forEach((item) => {
            let intro_item = document.createElement("div");
            let span = document.createElement("div");

            if (item) {
              intro_item.classList.add("intro_item");
              intro_item.appendChild(span);

              span.innerHTML = item;
              intro_label.appendChild(intro_item);
            }
          });
        }
        function libvioUniformed() {
          GM_addStyle(".page_right{z-index:999}");

          var area = document.createElement("div");

          let title_label = document.createElement("div");
          let intro_label = document.createElement("div");

          let title, intro;
          area.classList.add("area");

          title = document.querySelectorAll(".title")[0].innerText;
          intro = [];

          let arr = intro;

          let title_node = document.createTextNode(title);
          title_label.classList.add("area_title");
          intro_label.classList.add("area_intro");
          title_label.appendChild(title_node);

          area.appendChild(title_label);
          area.appendChild(area_block);
          if (intro) {
          }

          // area.style.position = "absolute";
          //area.style.left = "82%";
          //area.style.top = "6%";
          document.body.appendChild(area);
          area.parentNode.replaceChild(page_right, area);
          page_right.appendChild(area);

          arr.forEach((item) => {
            let intro_item = document.createElement("div");
            let span = document.createElement("div");

            if (item) {
              intro_item.classList.add("intro_item");
              intro_item.appendChild(span);

              span.innerHTML = item;
              intro_label.appendChild(intro_item);
            }
          });
        }

        function lyjxwlUniformed() {
          GM_addStyle(".page_right{z-index:999}");

          var area = document.createElement("div");

          let title_label = document.createElement("div");
          let intro_label = document.createElement("div");

          let title, intro;
          area.classList.add("area");

          title = document.querySelector(".pull-left .text-color").innerText;
          intro = [];

          let arr = intro;

          let title_node = document.createTextNode(title);
          title_label.classList.add("area_title");
          intro_label.classList.add("area_intro");
          title_label.appendChild(title_node);

          area.appendChild(title_label);
          area.appendChild(area_block);
          if (intro) {
          }

          // area.style.position = "absolute";
          //area.style.left = "82%";
          //area.style.top = "6%";
          document.body.appendChild(area);
          area.parentNode.replaceChild(page_right, area);
          page_right.appendChild(area);

          arr.forEach((item) => {
            let intro_item = document.createElement("div");
            let span = document.createElement("div");

            if (item) {
              intro_item.classList.add("intro_item");
              intro_item.appendChild(span);

              span.innerHTML = item;
              intro_label.appendChild(intro_item);
            }
          });
        }
        function fiveUniformed() {
          GM_addStyle(".page_right{z-index:999}");

          var area = document.createElement("div");

          let title_label = document.createElement("div");
          let intro_label = document.createElement("div");

          let title, intro;
          area.classList.add("area");

          title = document.querySelector(".module-info-heading h1").innerText;
          intro = [];

          let arr = intro;

          let title_node = document.createTextNode(title);
          title_label.classList.add("area_title");
          intro_label.classList.add("area_intro");
          title_label.appendChild(title_node);

          area.appendChild(title_label);
          area.appendChild(area_block);
          if (intro) {
          }

          // area.style.position = "absolute";
          //area.style.left = "82%";
          //area.style.top = "6%";
          document.body.appendChild(area);
          area.parentNode.replaceChild(page_right, area);
          page_right.appendChild(area);

          arr.forEach((item) => {
            let intro_item = document.createElement("div");
            let span = document.createElement("div");

            if (item) {
              intro_item.classList.add("intro_item");
              intro_item.appendChild(span);

              span.innerHTML = item;
              intro_label.appendChild(intro_item);
            }
          });
        }
        function Uniformed_6080() {
          GM_addStyle(".page_right{z-index:999}");

          var area = document.createElement("div");

          let title_label = document.createElement("div");
          let intro_label = document.createElement("div");

          let title, intro;
          area.classList.add("area");

          title = document.querySelector(".page-title a").innerText;
          intro = [];

          let arr = intro;

          let title_node = document.createTextNode(title);
          title_label.classList.add("area_title");
          intro_label.classList.add("area_intro");
          title_label.appendChild(title_node);

          area.appendChild(title_label);
          area.appendChild(area_block);
          if (intro) {
          }

          // area.style.position = "absolute";
          //area.style.left = "82%";
          //area.style.top = "6%";
          document.body.appendChild(area);
          area.parentNode.replaceChild(page_right, area);
          page_right.appendChild(area);

          arr.forEach((item) => {
            let intro_item = document.createElement("div");
            let span = document.createElement("div");

            if (item) {
              intro_item.classList.add("intro_item");
              intro_item.appendChild(span);

              span.innerHTML = item;
              intro_label.appendChild(intro_item);
            }
          });
        }

        function HundredUniformed() {
          GM_addStyle(".page_right{z-index:999}");

          var area = document.createElement("div");

          let title_label = document.createElement("div");
          let intro_label = document.createElement("div");

          let title, intro;
          area.classList.add("area");

          title = document.querySelector(".h2").children[2].innerText;
          intro = [];

          let arr = intro;

          let title_node = document.createTextNode(title);
          title_label.classList.add("area_title");
          intro_label.classList.add("area_intro");
          title_label.appendChild(title_node);

          area.appendChild(title_label);
          area.appendChild(area_block);
          if (intro) {
          }

          // area.style.position = "absolute";
          //area.style.left = "82%";
          //area.style.top = "6%";
          document.body.appendChild(area);
          area.parentNode.replaceChild(page_right, area);
          page_right.appendChild(area);

          arr.forEach((item) => {
            let intro_item = document.createElement("div");
            let span = document.createElement("div");

            if (item) {
              intro_item.classList.add("intro_item");
              intro_item.appendChild(span);

              span.innerHTML = item;
              intro_label.appendChild(intro_item);
            }
          });
        }

        if (new RegExp("3ayy").test(window.location.origin)) {
          GM_addStyle(
            ".player-box-main{position: fixed;top: 0;left: 0;height: 100vh;}"
          );

          setTimeout(() => {
            document.getElementsByClassName("header")[0].remove();
            document.getElementsByClassName("module")[1].remove();
            document
              .getElementsByClassName("module-player-handle-items")[0]
              .remove();
            document.getElementsByClassName("tips-box")[0].remove();
            document.getElementsByClassName("footer")[0].remove();
            document.getElementsByClassName("sidebar")[0].remove();

            document.getElementsByClassName("module-adslist")[0].remove();

            styleUniformed("module-info-heading");
          }, 1000);
        }

        if (new RegExp("smdyy1").test(window.location.href)) {
          GM_addStyle(
            ".player-box-main{position: fixed;top: 0;left: 0;height: 100vh;}"
          );

          window.setInterval(() => {
            if (document.getElementsByClassName("popup-btn")[0]) {
              document.getElementsByClassName("popup-btn")[0].click();
              clearInterval();
            }
          }, 600);

          setTimeout(() => {
            document.getElementsByClassName("stui-header clearfix")[0].remove();
            document.getElementsByClassName("stui-pannel")[0].remove();
            document
              .getElementsByClassName("stui-vodlist clearfix")[0]
              .remove();
            document
              .getElementsByClassName("stui-vodlist clearfix")[0]
              .remove();
            document.getElementsByClassName("container")[1].remove();
            document.getElementsByClassName("stui-vodlist__head")[0].remove();
            document.getElementsByClassName("stui-vodlist__head")[0].remove();

            smddyUniformed("stui-player__detail");
          }, 1900);
        }

        if (new RegExp("91free").test(window.location.href)) {
          if (new RegExp("static").test(window.location.pathname)) {
            const div = document.createElement("div");
            div.classList.add("cover");
            GM_addStyle(
              ".cover{width:200px; height:200px; background: red;z-index: 9999;position: fixed; top:0;}"
            );
          }

          GM_addStyle(
            ".player-box-main{position: fixed;top: 0;left: 0;height: 100vh;}"
          );
          GM_addStyle(".player-list{display:none}");
          GM_addStyle(".header{display:none}");
          GM_addStyle(".module-heading{display:none}");
          GM_addStyle(".module-items{display:none}");

          GM_addStyle(".footer{display:none}");
          GM_addStyle(".sidebar{display:none}");

          styleUniformed("module-info-heading");
        }
        if (new RegExp("88mv").test(window.location.href)) {
          setTimeout(() => {
            GM_addStyle(
              ".MacPlayer{position: fixed;top: 0;left: 0;width: 25rem;}"
            );
            GM_addStyle(".page_right{width: 20vw !important; height:100vh;}");
            GM_addStyle(".control_menu{ left: unset !important;}");
            GM_addStyle(
              ".barrage{z-index: 99999 !important;right: 0.8vw !important; left: unset !important; width:20vw !important}"
            );
            GM_addStyle(".b_item{width: unset !important;}");

            GM_addStyle(
              ".area{position:absolute;top:2vh; height: 8vh !important; width:18.5vw !important;}"
            );
            GM_addStyle("#sunky img{width: 19vw !important;}");
            GM_addStyle(".btn_one{font-size: 1.1vw !important;}");
            GM_addStyle(".btn_two{font-size: 1.1vw !important;}");

            mvUniformed();
          }, 2000);
        }
        if (new RegExp("freeok").test(window.location.href)) {
          styleUniformed("module-info-heading");
        } else if (new RegExp("dazhutizi").test(window.location.href)) {
          styleUniformed("module-info-heading");
          //var obj = JSON.stringify(document.getElementsByClassName("page_right"));
          //   window.location.href = encodeURI(
          //     `https://vip.tv1920.xyz/?url=https://vip.ffzy-play7.com/20230320/19146_04cdb4af/index.m3u8&tm=1679639616&key=c666b40a7be2337928178071dbbf1615&next=&title=%E6%AD%A3%E5%9C%A8%E6%92%AD%E6%94%BE%E3%80%8A%E5%A4%A9%E6%80%92%E3%80%8BHD%E4%B8%AD%E5%AD%97_%E9%AB%98%E6%B8%851080P%E5%9C%A8%E7%BA%BF%E8%A7%82%E7%9C%8B%E5%B9%B3%E5%8F%B0_%E7%94%B5%E5%BD%B1_%E9%AB%98%E6%B8%85%E7%89%88%E5%AE%8C%E6%95%B4%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E5%9C%A8%E7%BA%BF%E6%92%AD%E6%94%BE_%E8%93%9D%E5%85%89%E5%BD%B1%E8%A7%86%E5%90%84%E7%A7%8D%E5%89%A7?uname=zhangsan?uname=${obj}`
          //   );
        } else if (new RegExp("yanaifei").test(window.location.href)) {
          GM_addStyle(".tips-box{display: none !important;}");

          styleUniformed("module-info-heading");
        } else if (new RegExp("ylwt33").test(window.location.href)) {
          styleUniformed("col-pd clearfix");
        } else if (new RegExp("yixuewan").test(window.location.href)) {
          styleUniformed("module-info-heading");
        } else if (new RegExp("czzy.fun").test(window.location.href)) {
          //styleUniformed("ptit");
          // document.getElementsByClassName("page_right")[0].style.width =
          // "fit-content";

          setTimeout(() => {
            for (const dom of document.querySelectorAll(".b_item")) {
              console.log(dom);
              dom.style.width = "fit-content";
            }
          }, 500);
        } else if (new RegExp("6080").test(window.location.href)) {
          Uniformed_6080();
        } else if (new RegExp("gaze").test(window.location.href)) {
          GM_addStyle("#topnav{display: none !important;}");
          GM_addStyle(".d-flex{display: none !important;}");
          GM_addStyle(".lines{display: none !important;}");
          GM_addStyle("#topnav{display: none !important;}");
          GM_addStyle("#btngroup{display: none !important;}");

          GM_addStyle(".breadcrumb{display: none !important;}");
          GM_addStyle(".sidebar-card{display: none !important;}");
          GM_addStyle(".badge-primary{display: none !important;}");
          GM_addStyle(
            "#gaze_video{position: fixed;top: 0;left: 0;width: 80vw;}"
          );
          GM_addStyle(
            ".vjs-text-track-cue.vjs-text-track-cue-zh-cn div{top: -2rem !important;}"
          );

          gazeUniformed();
        } else if (new RegExp("fqfun").test(window.location.href)) {
          setTimeout(() => {
            if (
              document.getElementsByClassName(
                "layui-layer-btn layui-layer-btn-"
              )[0]
            ) {
              document
                .getElementsByClassName("layui-layer-btn layui-layer-btn-")[0]
                .children[0].click();
            }
          }, 1200);
          GM_addStyle("#header-top{display: none !important;}");

          GM_addStyle(".headroom--top{display: none !important;}");
          GM_addStyle(".hengfu{display: none !important;}");
          GM_addStyle("#HMRichBox{display: none !important;}");
          GM_addStyle(".stui-pannel-side{display: none !important;}");

          GM_addStyle(".stui-foot{display: none !important;}");
          GM_addStyle(".wrap-fixelist1{display: none !important;}");
          GM_addStyle(".gonggao{display: none !important;}");
          GM_addStyle(".stui-pannel-box.clearfix{display: none !important;}");
          GM_addStyle("#desc{display: none !important;}");
          GM_addStyle(
            ".MacPlayer{width: 80vw !important;height: 100vh;z-index: 99;top: 0;left: 0;position: fixed !important}"
          );

          GM_addStyle(".stui-extra{display: none !important;}");

          GM_addStyle("body{overflow: hidden !important;}");
          document.documentElement.scrollTop = 0;
          fqFunUniformed();
        } else if (new RegExp("hdmoli").test(window.location.href)) {
          GM_addStyle(".myui-header__top{display: none !important;}");
          GM_addStyle(
            ".container:not(:first-child){display: none !important;}"
          );

          GM_addStyle(".myui-foot{display: none !important;}");
          GM_addStyle(".tips{display: none !important;}");
          GM_addStyle(
            "#player-left{width: 80vw !important; top:0; left:0; position:fixed; height:100vh}"
          );
          GM_addStyle(".myui-topbg{display: none !important;}");
          GM_addStyle(".embed-responsive{height: 100vh !important;}");

          GM_addStyle("#player-sidebar{display: none !important;}");
          hdmoliUniformed();
        } else if (new RegExp("novipnoad").test(window.location.href)) {
          if (!document.getElementById("player-iframe")) {
            document.getElementsByClassName("multilink-btn")[0].click();
          }

          GM_addStyle(".video-player{min-height: unset;}");

          GM_addStyle("#body{display:none}");
          GM_addStyle("#headline{display:none}");
          GM_addStyle("#top-nav{display:none}");
          GM_addStyle("#bottom-nav{display:none}");
          GM_addStyle(".video-toolbar-inner{display:none}");
          GM_addStyle(".player-content{width:100vw; max-width: unset;}");
          GM_addStyle(".container{margin:0; padding:0;}");
          GM_addStyle(
            ".player-content-inner{width:80vw !important; margin:0 !important;}"
          );
          GM_addStyle("#player-embed{height:100vh !important;}");
          NovipUniformed();
        } else if (new RegExp("bdys10").test(window.location.href)) {
          if (document.getElementsByClassName("g-recaptcha")[0]) {
            document.getElementsByClassName("g-recaptcha")[0].click();
          }
          var Cla = {};
          var alert = function () {
            return 1;
          };
          var confirm = function () {
            return 1;
          };
          var prompt = function () {
            return 1;
          };
          var peertitle = "";
          var peerid = 0;
          var reflesh = 30 * 60; //刷新间隔秒
          debugger;
          var word = "测试";
          var time = 10; //时间间隔秒
          function videoPage() {
            //视频界面
            if (!location.href.includes("/play/")) return;
            let time = 0;

            let interval = window.setInterval(function () {
              time += 0.2;

              if ($(".artplayer-plugin-ads-close")[0]) {
                if (
                  $(".artplayer-plugin-ads-close")[0].innerHTML == "关闭广告"
                ) {
                  document
                    .getElementsByClassName("artplayer-plugin-ads-close")[0]
                    .click();
                  document.getElementsByClassName("box-l")[0].click();
                  clearInterval(interval);
                }
              }

              if (time > 25) {
                clearInterval(interval);
              }

              //    $('.container-xl>.row-cards>div').not(":first").remove();
            }, 0.2 * 1000);
          }
          videoPage();

          bydsUniformed("card-footer");
        } else if (
          new RegExp("dadagui.me/vodplay").test(window.location.href)
        ) {
          document.getElementsByTagName("iframe")[0].remove();
          document.getElementsByTagName("iframe")[0].remove();

          dadaGuiUniformed("stui-player__detail");
          let introWidth = 0;
          for (let item of document.getElementsByClassName("intro_item")) {
            introWidth += item.offsetWidth;
          }
          if (
            introWidth >
            document.getElementsByClassName("area_intro")[0].offsetWidth * 0.82
          ) {
            console.log(
              document.getElementsByClassName("intro_item")[2].innerText.length
            );
            if (
              document.getElementsByClassName("intro_item")[2].innerText
                .length > 4
            ) {
              GM_addStyle(
                ".intro_item >div {    max-width: 2rem;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}"
              );
            } else {
              GM_addStyle(
                ".intro_item >div {    max-width: 2.8rem;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}"
              );
            }
          }
          GM_addStyle(".dplayer{overflow：hidden;height: 100vh !important}");
        } else if (new RegExp("ttzj365").test(window.location.href)) {
          setTimeout(() => {
            GM_addStyle("#header-top{display: none !important;}");
            GM_addStyle(
              ".stui-player__detail.detail{display: none !important;}"
            );
            GM_addStyle(
              ".stui-pannel-side.visible-lg{display: none !important;}"
            );
            GM_addStyle(
              ".col-lg-wide-75.col-xs-1.padding-0{display: none !important;}"
            );
            GM_addStyle(".stui-foot.clearfix{display: none !important;}");
            GM_addStyle(".stui-extra.clearfix{display: none !important;}");

            GM_addStyle(".stui-player__item.clearfix{padding: 0 !important;}");
            GM_addStyle(".container{width: 30.4rem !important;}");

            ttzjUniformed();
          }, 2000);
        } else if (new RegExp("qionggedy").test(window.location.href)) {
          GM_addStyle("html{background: black;}");

          GM_addStyle("body{visibility: hidden;}");
          GM_addStyle("body{visibility: hidden;}");

          if (new RegExp("m.qionggedy.cc").test(window.location.href)) {
            GM_addStyle("body{visibility: hidden;}");
          }

          GM_addStyle(".site_container{margin: 0 !important;}");

          GM_addStyle(".player_template{margin: 0 !important;}");
          GM_addStyle(".body{padding: 0 !important;}");

          GM_addStyle(
            ".container{visibility: visible; background: black !important;}"
          );
          GM_addStyle(".w{visibility: visible;}");

          GM_addStyle(".menu-box{visibility: visible;}");
          GM_addStyle(".page_right{visibility: visible;}");

          GM_addStyle("#shortcut-2014{display: none !important;}");
          GM_addStyle("#nav-2014{display: none !important;}");
          GM_addStyle(
            ".mod_player{    top: 0;left: 0;position: fixed; height: 100vh;width:30.4rem}"
          );

          GM_addStyle(".mod_player_side{display: none !important;}");

          GM_addStyle(".w:nth-of-type(4) {display: none !important;}");
          GM_addStyle(".floor:nth-of-type(1) {display: none !important;}");

          GM_addStyle(".mod_titles{display: none !important;}");
          GM_addStyle("header{display: none !important;}");

          GM_addStyle(".action_wrap{display: none !important;}");

          GM_addStyle(".floor:nth-of-type(4) {display: none !important;}");
          GM_addStyle(".floor:nth-of-type(5) {display: none !important;}");
          GM_addStyle(".floor:nth-of-type(6) {display: none !important;}");
          GM_addStyle(".floor:nth-of-type(7) {display: none !important;}");
          GM_addStyle(".floor:nth-of-type(8) {display: none !important;}");

          GM_addStyle("#recommend-content{display: none !important;}");
          GM_addStyle("#footer-2014{display: none !important;}");

          GM_addStyle(".tempWrap{display: none !important;}");
          GM_addStyle("#PlayContainer{ padding-bottom: 0 !important;}");

          GM_addStyle(".page_right{height: 100vh; right: unset !important;}");
          GM_addStyle(".mod_action{display: none !important;}");
          GM_addStyle(
            ".area{position: absolute; top:1.5vh; height: 1.5rem !important; width:6.8rem !important;}"
          );
          qiongUniformed();
          console.log(6343);

          GM_addStyle(".b_item{width: fit-content !important;}");
        } else if (new RegExp("libvio.top").test(window.location.href)) {
          GM_addStyle(".stui-header.clearfix{display: none !important;}");
          GM_addStyle(".t-img-box{display: none !important;}");
          GM_addStyle("#HMcoupletDivleft{display: none !important;}");
          GM_addStyle(".play-bg{display: none !important;}");
          GM_addStyle("#HMhrefright{display: none !important;}");
          GM_addStyle(".yihrzd{display: none !important;}");
          GM_addStyle("#HMrichA{display: none !important;}");
          GM_addStyle(
            "a[id='HMrichA'] ~ a{display: none !important; width:666px;}"
          );
          GM_addStyle(
            "a[id='HMrichA'] ~ img{display: none !important; width:666px;}"
          );
          GM_addStyle(
            "a[id='HMrichA'] ~ div{display: none !important; width:666px;}"
          );
          GM_addStyle("#mui-player{display: none !important; width:30rem;}");

          setTimeout(() => {
            document.querySelector(".popup-btn").click();
          }, 2000);

          libvioUniformed();
        } else if (new RegExp("lyjxwl").test(window.location.href)) {
          GM_addStyle(".player-right{display: none !important;}");

          GM_addStyle("header{display: none !important;}");
          GM_addStyle(".top-weizhi{display: none !important;}");
          GM_addStyle(".row.static{display: none !important;}");
          GM_addStyle("footer{display: none !important;}");
          GM_addStyle(".details-tool.ml-xs-10{display: none !important;}");
          GM_addStyle(".yihrzd{display: none !important;}");
          GM_addStyle("#HMrichA{display: none !important;}");
          GM_addStyle(
            "a[id='HMrichA'] ~ a{display: none !important; width:666px;}"
          );
          GM_addStyle(
            "a[id='HMrichA'] ~ img{display: none !important; width:666px;}"
          );
          GM_addStyle(
            "a[id='HMrichA'] ~ div{display: none !important; width:666px;}"
          );
          GM_addStyle("#mui-player{display: none !important; width:30rem;}");
          GM_addStyle(
            "#zanpiancms_player{width: 30.4rem;position: fixed; z-index: 9; top:0;!important;}"
          );

          setTimeout(() => {
            $("body").unbind("keydown");
          }, 1000);

          lyjxwlUniformed();
        } else if (new RegExp("555zxdy").test(window.location.href)) {
          GM_addStyle(".sidebar{display: none !important;}");
          GM_addStyle(".header{display: none !important;}");
          GM_addStyle("#HMrichA{display: none !important;}");
          GM_addStyle(
            "a[id='HMrichA'] ~ a{display: none !important; width:666px;}"
          );
          GM_addStyle(
            "a[id='HMrichA'] ~ img{display: none !important; width:666px;}"
          );
          GM_addStyle(
            "a[id='HMrichA'] ~ div{display: none !important; width:666px;}"
          );

          GM_addStyle(".module-heading{display: none !important;}");
          GM_addStyle(".module-items{display: none !important;}");
          GM_addStyle(".footer{display: none !important;}");

          GM_addStyle(".fixedGroup{display: none !important;}");

          GM_addStyle(".tips-box {display: none !important;}");

          GM_addStyle(
            ".MacPlayer{width: 80vw !important;height: 100vh;z-index: 99;top: 0;left: 0;position: fixed !important}"
          );

          setInterval(() => {
            if (document.getElementById("dismiss-button")) {
              document.getElementById("dismiss-button").click();
            }
          }, 2000);

          fiveUniformed();
        } else if (new RegExp("100fyy1").test(window.location.href)) {
          GM_addStyle(".topall{display: none !important;}");

          GM_addStyle("body{visibility: hidden;}");
          GM_addStyle(
            ".player{visibility: visible; width:30.4rem; height:100vh; position:fixed;top:0; left: 0;}"
          );
          GM_addStyle(".menu-box{visibility: visible;}");
          GM_addStyle(".page_right{visibility: visible;}");
          GM_addStyle(".area{height: 1.7rem; width: 7rem;}");

          GM_addStyle(".h2{visibility: visible;}");
          GM_addStyle(".dramaNumList{visibility: visible;}");

          GM_addStyle("#playiframe{height: 100vh !important;}");

          HundredUniformed();
        } else if (new RegExp("udanmu").test(window.location.href)) {
          document.documentElement.scrollTop = 0
          GM_addStyle("body{overflow: hidden;}");
          
          GM_addStyle(".tips-box{display:none;}");
          GM_addStyle(".playon{display:none;}");
          GM_addStyle(".content{padding:0;}");
          GM_addStyle(".player-box{margin: unset;}");


          
          

        }

        //图片
        function parasunkyCreate() {
          GM_addStyle("body{overflow:hidden !important; }");

          let isIntro;
          if (document.getElementsByClassName("area_intro")[0]) {
            isIntro =
              document.getElementsByClassName("area_intro")[0].innerHTML;
          }

          let currentTop = 22;

          parasunky.classList.add("sunky");
          parasunky.setAttribute("id", "sunky");
          parasunky.style.position = "absolute";

          //parasunky.style.top = currentTop+'%';
          parasunky.style.top = "4.8rem";
          setTimeout(() => {
            let title_width = document.getElementsByClassName("area_title")[0]
              ? document.getElementsByClassName("area_title")[0].offsetWidth
              : 0;

            if (
              title_width /
                document.documentElement.style.fontSize.split("p")[0] >
              6.8
            ) {
              GM_addStyle(
                ".page_right>.area>.area_block{margin-top: 0.75rem;}"
              );
              GM_addStyle(".control_menu{top: 3.5rem !important;}");

              if (isIntro) {
                GM_addStyle(".area{height: 2.92rem;}");
              }
            }
          }, 600);
          parasunky.style.marginLeft = "-0.06rem";

          //parasunky.style.maxWidth = "20%";
          parasunky.innerHTML = `<img style="width:7.55rem" src="https://i.hd-r.cn/90d1812dae14a3a6312b690cd235a769.png">`;

          document.body.appendChild(parasunky);
          parasunky.parentNode.replaceChild(page_right, parasunky);
          page_right.appendChild(parasunky);

          document.body.appendChild(page_right);

          setTimeout(() => {
            const blockWidth = document.getElementsByClassName("area_title")[0]
              ? document.getElementsByClassName("area_title")[0].offsetWidth
              : 0;

            const blockLabel = document.getElementsByClassName("area_block")[0];
            if (blockLabel) blockLabel.style.width = blockWidth + "px";
          }, 600);
        }
        // 弹幕区域
        function barrageCreate() {
          let barrage = document.createElement("div");
          let title = document.createElement("div");
          title.classList.add("b_title");

          barrage.classList.add("barrage");

          title.innerHTML = "精彩弹幕";
          barrage.appendChild(title);

          GM_addStyle(
            ".b_title{ height: 60px; font-weight: 800; font-size: 0.65rem;font-family: YouSheBiaoTiHei;color: #FFFFFF;line-height: 60px;background: linear-gradient(180deg, #FF7000 0%, #FBBE8F 100%);-webkit-background-clip: text;-webkit-text-fill-color: transparent; display:flex; justify-content:center;}"
          );

          GM_addStyle(
            ".barrage{position:fixed; display:none; left: 30.75rem;z-index:999; top:23%; width:7.35rem; height:15rem; background-color:rgba(76, 63, 63, 1);  !important}"
          );

          let barrageArray = [
            {
              author: "哇哈哈",
              info: "终于有好看的电视剧追了！！！",
            },
            {
              author: "hsjhgb",
              info: "为安欣警官打call",
            },
            {
              author: "毋宁",
              info: "攒了好多集，终于可以一次看个够了。",
            },
            {
              author: "蒂娜师师是",
              info: "干嚼咖啡不加糖，我是建工高奇强",
            },
            {
              author: "蟒村李宏伟",
              info: "知道蟒村的蟒字是怎么来的吗？",
            },
          ];

          let barrageList = document.createElement("div");

          barrageArray.forEach((item) => {
            let barrageItem = document.createElement("div");
            let barrageAuthor = document.createElement("span");

            let barrageInfo = document.createElement("div");
            barrageItem.classList.add("b_item");
            barrageAuthor.classList.add("b_author");
            barrageInfo.classList.add("b_info");
            barrageAuthor.innerHTML = item.author + ": ";
            barrageInfo.appendChild(barrageAuthor);

            barrageInfo.innerHTML += item.info;
            barrageItem.appendChild(barrageInfo);
            barrageList.appendChild(barrageItem);
          });

          if (new RegExp("czzy.fun").test(window.location.href)) {
            GM_addStyle(
              ".b_item{width: 6rem;background: linear-gradient(90deg, #4E4E4E 0%, #242424 100%);border-radius: 0.5rem; display:flex; margin-top:0.4rem;margin-left:0.3rem; padding: 0.15rem 0.3rem;}"
            );
          } else {
            GM_addStyle(
              ".b_item{width: 7rem;background: linear-gradient(90deg, #4E4E4E 0%, #242424 100%);border-radius: 0.5rem; display:flex; margin-top:0.4rem;margin-left:0.3rem; padding: 0.15rem 0.3rem;}"
            );
          }

          GM_addStyle(
            ".b_author{ white-space: nowrap;height: 1rem;width: fit-content;font-size: 0.5rem;font-family: PingFangSC-Medium, PingFang SC;font-weight: 500;color: #FF7000;-webkit-background-clip: text;}"
          );
          GM_addStyle(
            ".b_info{ margin-left:0.2rem;width: fit-content;font-size: 0.5rem; color:white;line-height: 1.3; justify-content:center}"
          );
          barrage.appendChild(barrageList);
          page_right.appendChild(barrage);
        }
        //按钮
        function btnCreate() {
          let control = document.createElement("div");
          control.classList.add("control_menu");

          let btnOne = document.createElement("div");
          btnOne.classList.add("btn_one");
          btnOne.classList.add("btn_active");

          btnOne.innerHTML = "遥控器使用说明";

          let btnTwo = document.createElement("div");
          btnTwo.classList.add("btn_two");
          btnTwo.innerHTML = "弹幕";

          // btnOne.onclick = () => {
          //   btnTwo.classList.remove("btn_active");
          //   btnOne.classList.add("btn_active");
          //   document.getElementsByClassName("sunky")[0].style.display = "block";
          //   document.getElementsByClassName("barrage")[0].style.display =
          //     "none";
          // };

          // btnTwo.onclick = () => {
          //   btnOne.classList.remove("btn_active");
          //   btnTwo.classList.add("btn_active");

          //   document.getElementsByClassName("sunky")[0].style.display = "none";
          //   document.getElementsByClassName("barrage")[0].style.display =
          //     "block";
          // };

          control.appendChild(btnOne);
          control.appendChild(btnTwo);

          page_right.appendChild(control);

          GM_addStyle(
            ".control_menu{position:absolute; display:flex; z-index:9999; top:15vh;}"
          );
          if (new RegExp("88mv").test(window.location.href)) {
            GM_addStyle(
              ".btn_one{ text-align: center; width: 14vw;  letter-spacing: 0.15rem; padding:0 0.5rem; font-size:0.45rem; height:1.2rem; line-height:1rem;cursor:pointer; color:black;}"
            );
          } else if (new RegExp("czzy").test(window.location.href)) {
            GM_addStyle(
              ".btn_one{ text-align: center; width: 5.2rem;  letter-spacing: 0.15rem; padding:0 0.5rem; font-size:0.45rem; height:1.2rem; line-height:1rem;cursor:pointer; color:black;}"
            );
          } else {
            GM_addStyle(
              ".btn_one{ text-align: center; width: 6.3rem;  letter-spacing: 0.15rem; padding:0 0.5rem; font-size:0.45rem; height:1.2rem; line-height:1rem;cursor:pointer; color:black;}"
            );
          }

          GM_addStyle(
            ".btn_two{display:none; padding:0 0.5rem; font-size:0.45rem; height:1.2rem; line-height:1rem; margin-left:0.6rem;cursor:pointer; color:black;}"
          );
          GM_addStyle(
            ".btn_active{ background: no-repeat center url('https://i.hd-r.cn/e6a13733a3df1acbc8edfad86bcadd5c.png');  background-size: 100% 100%;}"
          );
        }

        if (
          urlArr.some((item) => new RegExp(item).test(window.location.href))
        ) {
          // setTimeout(() => {
          //   btnCreate();

          //   parasunkyCreate();

          //   barrageCreate();
          // }, 900);

          let isFUll = false;
          let isMenu = false;
          let num = 0;
          let webIframe;

          if (new RegExp("yanaifei").test(window.location.href)) {
            num = 3;
          } else if (new RegExp("88mv").test(window.location.href)) {
            num = 1;
          } else if (
            new RegExp("91free").test(window.location.href) ||
            new RegExp("3ayy").test(window.location.href) ||
            new RegExp("libvio.top").test(window.location.href)
          ) {
            num = 2;
          }

          setTimeout(() => {
            window.onkeyup = () => {
              if (
                document.getElementsByClassName("menu-box")[0] &&
                document.getElementsByClassName("menu-box")[0].style.display ==
                  "block"
              ) {
                isMenu = true;
              } else {
                isMenu = false;
              }

              var theEvent = window.event || e;
              var code =
                theEvent.keyCode || theEvent.which || theEvent.charCode;

              if (code == 13) {
                // if (
                //   new RegExp(
                //     "czzy.fun/v_play/v_play/bXZfODk2OS1ubV8x.html"
                //   ).test(window.location.href)
                // ) {
                //   console.log(434);
                //   document.getElementsByTagName("iframe")[0].focus();
                // }
                if (hasError) {
                  window.location.reload();
                }
              }

              if (code == 40 && isMenu == false) {
                function addParentClass(dom) {
                  if (dom.parentElement) {
                    dom.parentElement.classList.add("webfullscreen_style");
                    addParentClass(dom.parentElement);
                  } else {
                    return;
                  }
                }

                function removeParentClass(dom) {
                  if (dom.parentElement) {
                    dom.parentElement.classList.remove("webfullscreen_style");
                    removeParentClass(dom.parentElement);
                  } else {
                    return;
                  }
                }
                if (
                  document.documentElement.classList.contains(
                    "webfullscreen_style"
                  )
                ) {
                  if (document.getElementsByTagName("video")[0]) {
                    removeParentClass(
                      document.getElementsByTagName("video")[0]
                    );
                  } else {
                    for (const item of document.getElementsByTagName(
                      "iframe"
                    )) {
                      removeParentClass(item);
                    }
                  }
                } else {
                  if (document.getElementsByTagName("video")[0]) {
                    addParentClass(document.getElementsByTagName("video")[0]);
                  } else {
                    for (const item of document.getElementsByTagName(
                      "iframe"
                    )) {
                      addParentClass(item);
                    }
                  }
                }
              }
            };
          }, 1100);
        }
      }
    }, time);
  })();

  GM_addStyle(".popup,.popupShow{display:none!important}");
  if (document.getElementById("popup")) {
    var box = document.getElementById("popup");
    box.style.width = "0px";
    box.style.height = "0px";
    box.style.display = "none";
  }

  function alert(str) {}
}
