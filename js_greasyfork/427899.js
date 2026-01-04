// ==UserScript==
// @name        在B站动态添加热门和今日新番
// @description  B站动态添加热门和今日新番
// @description:en B站动态添加热门和今日新番
// @version       0.2.8
// @description  try to take over the world!
// @author       chancoki
// @include      /https:\/\/t\.bilibili\.com\/.*/
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @namespace https://greasyfork.org/users/754467
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/427899/%E5%9C%A8B%E7%AB%99%E5%8A%A8%E6%80%81%E6%B7%BB%E5%8A%A0%E7%83%AD%E9%97%A8%E5%92%8C%E4%BB%8A%E6%97%A5%E6%96%B0%E7%95%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/427899/%E5%9C%A8B%E7%AB%99%E5%8A%A8%E6%80%81%E6%B7%BB%E5%8A%A0%E7%83%AD%E9%97%A8%E5%92%8C%E4%BB%8A%E6%97%A5%E6%96%B0%E7%95%AA.meta.js
// ==/UserScript==
(function () {
  "use strict";
  window.onload = () => {
    setTimeout(() => {
      const rule = /(TF.*)/
      const body = document.body;
      const bili = document.querySelector(".left");
      const fan = document.querySelector(".right");
      const home = document.querySelector(".bili-dyn-home--member");
      const p = document.createElement("p");
      const ifr = document.createElement("iframe");
      let isShu = true;
      let isBig = true;
      home.style.width = "1300px";
      bili.innerHTML = "";
      bili.style.width = "332px";
      fan.innerHTML = "";
      fan.style.width = "305px";
      ifr.className = "ifr";
      ifr.noResize = true;
      body.appendChild(p);
      body.appendChild(ifr);
      bili.style.height = document.documentElement.clientHeight + "px";
      fan.style.height = document.documentElement.clientHeight + "px";
      p.innerHTML = `
<button class="c_btn1"><svg t="1619837738785" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3871" width="30" height="30"><path d="M170.666667 512a42.666667 42.666667 0 0 1-85.333334 0C85.333333 276.352 276.352 85.333333 512 85.333333a426.026667 426.026667 0 0 1 341.333333 170.624V213.333333a42.666667 42.666667 0 0 1 85.333334 0v170.666667a42.666667 42.666667 0 0 1-42.666667 42.666667h-170.666667a42.666667 42.666667 0 0 1 0-85.333334h82.346667A341.333333 341.333333 0 0 0 170.666667 512z m682.666666 0a42.666667 42.666667 0 0 1 85.333334 0c0 235.648-191.018667 426.666667-426.666667 426.666667a426.026667 426.026667 0 0 1-341.333333-170.624V810.666667a42.666667 42.666667 0 0 1-85.333334 0v-170.666667a42.666667 42.666667 0 0 1 42.666667-42.666667h170.666667a42.666667 42.666667 0 0 1 0 85.333334H216.32A341.333333 341.333333 0 0 0 853.333333 512z" fill="#fb2699" p-id="3872"></path></svg></button>
<button class="c_up" title="回到开始"><svg t="1619865187355" class="icon" viewBox="0 0 1819 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2872" width="30" height="30"><path d="M31.507692 986.865934v5.626374a112.527473 112.527473 0 0 0 154.162638 0l723.551648-719.05055 719.050549 719.05055a112.527473 112.527473 0 0 0 154.162638 0l5.626373-5.626374a112.527473 112.527473 0 0 0 0-154.162637L986.865934 31.507692a112.527473 112.527473 0 0 0-154.162637 0L31.507692 832.703297a112.527473 112.527473 0 0 0 0 154.162637z" fill="#fb2699" p-id="2873"></path></svg></button>
<button class="c_cha"><svg t="1619958534562" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2031" width="10" height="10"><path d="M886.528 908.032c-28.096 28.096-73.856 28.096-102.016 0L138.304 261.824c-28.096-28.16-28.16-73.856 0-102.016 28.032-28.16 73.792-28.16 102.08 0l646.144 646.144C914.624 834.24 914.752 879.872 886.528 908.032L886.528 908.032zM885.76 261.504 239.616 907.648c-28.224 28.224-73.92 28.224-102.08 0-28.16-28.096-28.16-73.728 0.064-102.016L783.744 159.552c28.224-28.16 73.984-28.16 102.016-0.064C913.984 187.648 913.856 233.344 885.76 261.504L885.76 261.504z" p-id="2032" fill="#515151"></path></svg></button>
<button class="c_cha c_big"><svg t="1619959851801" class="icon" viewBox="0 0 1028 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4352" width="10" height="10"><path d="M395.731085 571.196755l10.18176 10.18176q4.072704 4.072704 8.145408 7.63632t8.145408 7.63632l12.218112 12.218112q20.363521 20.363521 16.290817 35.636161t-25.454401 35.636161q-9.163584 10.18176-30.036193 31.054369t-44.799745 45.308833-46.32701 46.836098-34.617985 35.636161q-18.327169 18.327169-25.454401 32.072545t6.109056 26.981665q9.163584 9.163584 23.418049 24.436225t24.436225 25.454401q17.308993 17.308993 12.7272 30.545281t-30.036193 15.27264q-26.472577 3.054528-59.05421 7.127232t-67.199618 7.63632-67.708706 7.63632-60.581474 7.127232q-26.472577 3.054528-36.654337-6.618144t-8.145408-34.108897q2.036352-25.454401 5.599968-57.017858t7.63632-64.654178 7.63632-65.672354 6.618144-60.072386q3.054528-29.527105 16.799905-37.672513t31.054369 9.163584q10.18176 10.18176 26.472577 24.945313t27.490753 25.963489 21.381697 7.127232 23.418049-16.290817q13.236288-13.236288 36.145249-36.654337t47.854274-48.363362 48.363362-48.87245 37.672513-38.181601q6.109056-6.109056 13.745376-11.709024t16.799905-7.63632 18.836257 1.018176 20.872609 13.236288zM910.928158 58.036034q26.472577-3.054528 36.654337 6.618144t8.145408 34.108897q-2.036352 25.454401-5.599968 57.017858t-7.63632 64.654178-7.63632 66.181442-6.618144 60.581474q-3.054528 29.527105-16.799905 37.163425t-31.054369-9.672672q-10.18176-10.18176-27.999841-26.472577t-29.018017-27.490753-19.345345-9.672672-20.363521 13.745376q-14.254464 14.254464-37.163425 37.672513t-48.363362 49.381538-49.890626 50.399714l-37.672513 37.672513q-6.109056 6.109056-13.236288 12.218112t-15.781729 9.163584-18.327169 1.018176-19.854433-13.236288l-38.690689-38.690689q-20.363521-20.363521-17.818081-37.163425t22.908961-37.163425q9.163584-9.163584 30.545281-31.054369t45.817921-46.32701 47.345186-47.854274 36.145249-35.636161q18.327169-18.327169 22.908961-30.036193t-8.654496-24.945313q-9.163584-9.163584-21.890785-22.399873t-22.908961-23.418049q-17.308993-17.308993-12.7272-30.545281t30.036193-16.290817 58.545122-7.127232 67.708706-7.63632 67.708706-7.63632 60.581474-7.127232z" p-id="4353" fill="#707070"></path></svg></button>
<button class="c_cha c_shu"><svg t="1620011042461" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2256" width="10" height="10"><path d="M716.798 0.006H307.202c-79.049 0-143.358 64.309-143.358 143.358v737.271c0 79.049 64.309 143.357 143.358 143.357h409.596c79.049 0 143.357-64.309 143.357-143.357V143.364C860.155 64.315 795.847 0.006 716.798 0.006z m61.438 880.63c0 33.879-27.56 61.438-61.438 61.438H307.202c-33.879 0-61.438-27.56-61.438-61.438V143.364c0-33.879 27.56-61.439 61.438-61.439h409.596c33.879 0 61.438 27.56 61.438 61.439v737.272z" fill="#707070" p-id="2257"></path><path d="M378.882 133.125h266.236v81.919H378.882z" fill="#707070" p-id="2258"></path><path d="M512 839.676m-51.199 0a51.199 51.199 0 1 0 102.398 0 51.199 51.199 0 1 0-102.398 0Z" fill="#707070" p-id="2259"></path></svg></button>
<button class="c_btn"><svg t="1619837738785" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3871" width="30" height="30"><path d="M170.666667 512a42.666667 42.666667 0 0 1-85.333334 0C85.333333 276.352 276.352 85.333333 512 85.333333a426.026667 426.026667 0 0 1 341.333333 170.624V213.333333a42.666667 42.666667 0 0 1 85.333334 0v170.666667a42.666667 42.666667 0 0 1-42.666667 42.666667h-170.666667a42.666667 42.666667 0 0 1 0-85.333334h82.346667A341.333333 341.333333 0 0 0 170.666667 512z m682.666666 0a42.666667 42.666667 0 0 1 85.333334 0c0 235.648-191.018667 426.666667-426.666667 426.666667a426.026667 426.026667 0 0 1-341.333333-170.624V810.666667a42.666667 42.666667 0 0 1-85.333334 0v-170.666667a42.666667 42.666667 0 0 1 42.666667-42.666667h170.666667a42.666667 42.666667 0 0 1 0 85.333334H216.32A341.333333 341.333333 0 0 0 853.333333 512z" fill="#fb2699" p-id="3872"></path></svg></button>
<style>
  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  ::-webkit-scrollbar {
    width: 5px;
    /*滚动条宽度*/
    height: 5px;
    /*滚动条高度*/
  }

  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track {
    /*滚动条的背景区域的圆角*/
    background-color: rgba(255, 255, 255, 0.1);
    /*滚动条的背景颜色*/
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    /*滚动条的圆角*/
    border-radius: 2px;
    background-color: rgba(251, 114, 153, .7);
    backdrop-filter: saturate(180%) blur(20px);
    /*滚动条的背景颜色*/
  }

  .c_cha {
    position: fixed;
    z-index: 2023;
    right: 4px;
    top: 62px;
    border: none;
    outline: none;
    width: 20px;
    height: 20px;
    display: none;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: saturate(180%) blur(20px);
    border-radius: 0;
    cursor: pointer;
  }
  .svg1{
    position: relative;
    top:4px;
  }
   .svg2{
    position: relative;
    top:3px;
  }

  .c_big {
    top: 82px;
  }

  .c_shu {
    top: 102px;
  }

  .c_btn1:hover,
  .c_cha:hover,
  .c_up:hover {
    background-color: rgba(251, 114, 153, 0.6);
  }

  .pli {
    position: relative;
    list-style: none;
    height: 100px;
    margin-bottom: 7px;
  }

  .c_hot_li {
    height: 100px;
    background-color: #ffffff;
    width: 320px;
    display: flex;
    align-items: center;
    border-radius: 5px;
    transition: all 0.3s;
    transform-origin: 100% 100%;
  }

  .left,
  .right {
    overflow: auto;
    position: sticky;
    top: 0;
    font-family: 等线 ,'Helvetica Neue', Helvetica, Arial, 'Microsoft Yahei', 'Hiragino Sans GB', Heiti SC, 'WenQuanYi Micro Hei', sans-serif;
    font-weight: 900;
  }

  @media screen and (min-width: 1721px) {

    .c_btn1,
    .c_up {
      position: fixed;
      left: 165px;
      border: none;
      outline: none;
      width: 40px;
      height: 40px;
      background-color: rgba(235, 235, 235, 0.6);
      backdrop-filter: saturate(180%) blur(20px);
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 0 10px #aaa;
    }

    .c_btn1 {
      top: 65px;
    }

    .c_up {
      bottom: 100px;
    }
  }

  @media screen and (max-width: 1720px) {

    .c_hot,
    .c_btn1,
    .c_down,
    .c_up,
    .c_home {
      display: none;
    }
  }

  .c_hot_li img {
    height: 90px;
    margin-left: 5px;
    border-radius: 5px;
    cursor: pointer;
  }

  .c_hot_li .data {
    height: 90px;
    width: 160px;
    margin-left: 5px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .c_hot_li .data a {
    flex: 2;
    font-size: 12px;
    text-decoration: none;
    color: black;
    transition: all 0.5s;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    word-break: break-all;
    word-wrap: break-word;
  }

  .c_hot_li .data a:hover {
    color: #00B5E5;
  }

  .c_hot_li .data a.at {
    font-size: 13px;
    line-height: 22px
  }

  .c_hot_li .data a.a {
    color: #9a9a9a;
  }

  .c_hot_li .data h5,
  .c_hot_li .data h4 {
    margin: 0;
    flex: 1;
    font-size: 12px;
    color: #9a9a9a;
  }

  div.vt {
    position: relative;
    top: -25px;
    left: 8px;
    border-radius: 3px;
    height: 18px;
    width: 38px;
    font-size: 10px;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
  }
    span.tag111 {
    position: relative;
    left: 8px;
    top: -110px;
    font-size: 12px;
    height: 16px;
    padding: 0 2px;
    line-height: 16px;
    border-radius: 3px;
    background-color: #FC9D60;
    backdrop-filter: saturate(180%) blur(20px);
    color: #fff;
    z-index:9999;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 60px;
    font-weight: 300;
    transition: all 0.4s;

  }
  span.tag111:hover{
    max-width: 140px;
  }



  @keyframes run {

    0%,
    100% {
      top: -65px;
      opacity: .3;
    }

    40%,
    80% {
      top: 65px;
      opacity: 1;
    }
  }

  .ifr {
    position: fixed;
    top: 62px;
    right: 4px;
    height: 308px;
    width: 555px;
    border-radius: 5px;
    box-shadow: 0 10px 30px #333;
    z-index: 2022;
    display: none;
    border: none;
    transform-origin: 100% 100%;
    animation: disp1 1.5s ease;
    transition: all 1s;
  }

  .ifr_b {
    height: 735px;
    width: 1195px;
  }

  .ifr_s {
    height: 777px;
    width: 449px;
  }

  .scroll-content,
  .user-wrapper,
  .notice-panel {
    display: none;
  }

  @keyframes disp1 {
    0% {
      transform: rotateY(90deg);
    }

    100% {
      transform: rotateY(0deg);
    }
  }

  .c_btn:hover {
    background-color: rgba(251, 114, 153, .6);
  }

  .c_fan {
    font-size: 13px;
    list-style-type: none;
    height: 80px;
    width: 290px;
    background-color: #fff;
    display: flex;
    align-items: center;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    margin-bottom: 8px;
    cursor: pointer;
    border-left: 2px dotted #fd2699;
    transform-origin: 0 100%;
    animation: disp1 1s;
    transition: all .3s;
  }

  .c_fan img {
    height: 90%;
    margin: 0 5px;
    border-radius: 5px;
    cursor: pointer;
  }

  .c_fan div {
    margin-left: 5px;
    height: 90%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-right: 5px;
  }

  .c_fan div p {
    margin: 0;
  }

  .c_fan div p a {
    text-decoration: none;
    color: black;
    transition: all 0.3s;
  }

  .c_fan div p a:hover {
    color: #00B5E5;
  }

  @media screen and (min-width: 1721px) {
    .c_btn {
      position: fixed;
      right: 188px;
      top: 64px;
      border: none;
      outline: none;
      width: 40px;
      height: 40px;
      background-color: rgba(235, 235, 235, .6);
      backdrop-filter: saturate(180%) blur(20px);
      border-radius: 5px;
      cursor: pointer;
      transition: all .3s;
      box-shadow: 0 0 10px #aaa;
    }
  }

  @media screen and (max-width: 1720px) {
    .c_btn {
      display: none;
    }
  }

  @keyframes disp {
    from {
      transform: rotateX(90deg);
    }

    to {
      transform: rotateX(0deg);
    }
  }

  .c_fan div p.hua {
    color: #AAAAAA;
  }

  .c_fan div p.geng {
    color: #fd2699;
  }
  .f-tag{
    font-size: 12px;
    height: 18px;
    padding: 0 3px;
    line-height: 18px;
    border-radius: 2px;
    color: #fff;
    background:#FB7299;
    box-sizing: border-box;
  }
</style>
`;
      let isAction = true;
      let li = "";
      let flag = 1;
      async function a(num) {
        if (isAction) {
          isAction = false;
          const res = await fetch(
            `https://api.bilibili.com/x/web-interface/popular?ps=25&pn=${num}`,{
    method: 'GET',
    credentials: 'include'}
          );
          const data = await res.json();
          bili.innerHTML += send(data.data.list, li);
          isAction = true;
        }
      }

      function send(data, li) {
        for (let i of data) {
          if(!rule.test(i.owner.name)){

          li += `<li  class="pli"title="标题：${i.title}

简介：${i.desc}

点赞\t硬币\t收藏\t分享\t弹幕
${setView(i.stat.like)>0 ? setView(i.stat.like)+'万 ':i.stat.like}\t${setView(i.stat.coin)>0 ? setView(i.stat.coin)+'万 ':i.stat.coin}\t${setView(i.stat.favorite)>0?setView(i.stat.favorite)+'万 ':i.stat.favorite}\t${setView(i.stat.share)>0?setView(i.stat.share)+'万':i.stat.share}\t${setView(i.stat.danmaku)>0?setView(i.stat.danmaku)+'万':i.stat.danmaku}
" >
    <div class="c_hot_li" >
    <div style="width: 150px;height: 90px;overflow: hidden;border-radius: 5px;position: relative;">
    <img src="${i.pic}" loading='lazy' alt="${i.title}" id="${
            i.short_link_v2
          }" class="aid=${i.aid}&bvid=${i.bvid}&cid=${i.cid}&page=1&autoplay=1">
    </div>

    <div class="data">
      <a  class="at" href="${i.short_link_v2}"  target="_blank">${i.title}</a>
      <h4> <p></p><a class="a" href="https://space.bilibili.com/${i.owner.mid}"  target="_blank"><svg class='svg1' t="1619853252112" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="4324" width="15" height="15">
          <path
            d="M800 128H224C134.4 128 64 198.4 64 288v448c0 89.6 70.4 160 160 160h576c89.6 0 160-70.4 160-160V288c0-89.6-70.4-160-160-160z m96 608c0 54.4-41.6 96-96 96H224c-54.4 0-96-41.6-96-96V288c0-54.4 41.6-96 96-96h576c54.4 0 96 41.6 96 96v448z"
            p-id="4325" fill="#9A9A9A"></path>
          <path
            d="M419.2 544c0 51.2-3.2 108.8-83.2 108.8S252.8 595.2 252.8 544v-217.6H192v243.2c0 96 51.2 140.8 140.8 140.8 89.6 0 147.2-48 147.2-144v-240h-60.8V544zM710.4 326.4h-156.8V704h60.8v-147.2h96c102.4 0 121.6-67.2 121.6-115.2 0-44.8-19.2-115.2-121.6-115.2z m-3.2 179.2h-92.8V384h92.8c32 0 60.8 12.8 60.8 60.8 0 44.8-32 60.8-60.8 60.8z"
            p-id="4326" fill="#9A9A9A"></path>
        </svg> ${i.owner.name}</a></h4>
      <h5><svg class='svg2' t="1619853232683" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="3445" width="15" height="15">
          <path
            d="M408.768 765.056a43.52 43.52 0 0 1-23.488-6.4 48.192 48.192 0 0 1-23.488-41.344V350.976c0-17.536 9.408-33.472 23.488-41.408a49.088 49.088 0 0 1 46.912 0l311.36 183.168c14.08 7.936 23.424 23.872 23.424 41.408a47.68 47.68 0 0 1-23.424 41.408l-311.36 183.168c-7.808 3.2-15.616 6.4-23.424 6.4z m46.912-332.8v200.64L626.176 532.48 455.68 432.192z"
            fill="#9A9A9A" p-id="3446"></path>
          <path
            d="M821.76 938.688H203.776c-89.152 0-161.088-73.28-161.088-164.032v-482.56C42.688 201.152 114.56 128 203.776 128h617.984c87.616 0 159.552 73.28 159.552 164.032v484.16c0 89.216-71.936 162.496-159.552 162.496zM203.776 223.552c-37.504 0-67.2 30.272-67.2 68.48v484.16c0 38.272 29.696 68.48 67.2 68.48h617.984c37.568 0 67.264-30.208 67.264-68.48V292.032c-1.536-38.208-31.296-68.48-67.264-68.48H203.776z"
            fill="#9A9A9A" p-id="3447"></path>
        </svg> ${setView(i.stat.view)}万观看   ${getLocalTime(i.ctime)}</h5>
    </div>
  </div>
    <div class="vt">
      ${getVidieoTime(i.duration)}
    </div>
    <span class="tag111" style='display:${i.rcmd_reason.content!='' ? 'inline-block' : 'none'};' title='${i.rcmd_reason.content}'>${i.rcmd_reason.content}</span>
  </li>`;}
        }
        return li;
      }
      a(1);
      const btn = document.querySelector(".c_btn1");
      const up = document.querySelector(".c_up");
      const cha = document.querySelector(".c_cha");
      const big = document.querySelector(".c_big");
      const shu = document.querySelector(".c_shu");
      btn.addEventListener("click", (e) => {
        e.cancelBubble = true;
        li = "";
        bili.innerHTML = "";
        flag = 1;
        a(flag);
      });
      big.addEventListener("click", (e) => {
        if (isBig) {
          ifr.className = "ifr_b ifr";
        } else {
          ifr.className = "ifr";
        }
        isBig = !isBig;
      });
      shu.addEventListener("click", (e) => {
        if (isShu) {
          ifr.className = "ifr_s ifr";
        } else {
          ifr.className = "ifr";
        }
        isShu = !isShu;
      });
      up.addEventListener("click", (e) => {
        bili.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      });

      bili.addEventListener("click", (e) => {
        e.cancelBubble = true;
        if (e.target.nodeName.toLowerCase() == "img") {
          let query = e.target.className;
          ifr.src = "//player.bilibili.com/player.html?" + query;
          ifr.style.display = "block";
          cha.style.display = "block";
          big.style.display = "block";
          shu.style.display = "block";
        }
      });
      cha.addEventListener("click", () => {
        ifr.src = "";
        ifr.style.display = "none";
        cha.style.display = "none";
        big.style.display = "none";
        shu.style.display = "none";
      });

      function getVidieoTime(num) {
        const m = parseInt(num / 60)<10?'0'+parseInt(num / 60):parseInt(num / 60)
        const s = (num % 60)<10?'0'+(num % 60):(num % 60)
        return m+ ":" +s
      }

      function getLocalTime(nS) {
        let time = new Date(parseInt(nS) * 1000);
        let newTime = new Date()
          .toLocaleDateString()
          .replace(/\//g, "-")
          .substr(5, 10);
        let DataTime = time
          .toLocaleDateString()
          .replace(/\//g, "-")
          .substr(5, 10);
        if (newTime == DataTime) {
          DataTime = "";
        }
        return DataTime + " " + time.toTimeString().substr(0, 5);
      }

        function setView(data) {
        return parseInt(data / 10000);
      }

      bili.addEventListener("scroll", () => {
        var scrollTop = bili.scrollHeight - bili.scrollTop;
        if (scrollTop <= document.documentElement.clientHeight + 10) {
          if (flag <= 9 && isAction) {
            flag++;
            a(flag);
          }
        }
      });

      window.addEventListener("resize", () => {
        bili.style.height = document.documentElement.clientHeight + "px";
        fan.style.height = document.documentElement.clientHeight + "px";
      });

      let fli = "";
      async function a1() {
        const res = await fetch(
          `https://bangumi.bilibili.com/web_api/timeline_global`,{
    method: 'GET',
    credentials: 'include'}
        );
        const data = await res.json();
        fli = fsend(data.result, fli);
        b();
      }
      async function b() {
        const res = await fetch(
          `https://bangumi.bilibili.com/web_api/timeline_cn`,{
    method: 'GET',
    credentials: 'include'}
        );
        const data = await res.json();
        fan.innerHTML = fsend(data.result, fli);
      }

      function fsend(data, li) {
        let seasons = data[6].seasons;
        let time = Date.parse(new Date()) / 1000;
        for (let i of seasons) {
          li += `<li class="c_fan"  id="${i.url}"  title="${i.title}">
    <div  id="${i.url}">
      <p  id="${i.url}">${i.pub_time}</p>
      <p  id="${i.url}"></p>
    </div>
    <img src="${i.square_cover}" alt="" loading='lazy'  id="${i.url}">
    <div  id="${i.url}">
      <p><a href="${i.url}" target="_blank">${i.follow==1?'<span class="f-tag">已追番</span>':''} ${i.title}</a></p>
      <p class="${i.pub_ts <= time && i.pub_index ? "geng" : "hua"}"  id="${
            i.url
          }">${i.pub_index ? i.pub_index : i.delay_reason}</p>
    </div>
  </li>`;
        }
        return li;
      }
      function getPage(child, height) {
        return 87 * child >= height ? true : false;
      }
      a1();
      const fbtn = document.querySelector(".c_btn");
      fbtn.addEventListener("click", (e) => {
        e.cancelBubble = true;
        fli = "";
        fan.innerHTML = "";
        a1();
      });
      fan.addEventListener("click", (e) => {
        if (
          e.target.nodeName.toLowerCase() == "li" ||
          e.target.nodeName.toLowerCase() == "img" ||
          (e.target.nodeName.toLowerCase() == "div"&&e.target.className!='right-panel') ||
          e.target.nodeName.toLowerCase() == "p"
        ) {
          open(e.target.id, "_blank");
        }
      });
    }, 1000);
  };
  // Your code here...
})();
