// ==UserScript==
// @name         B站热门居中
// @description  B B站热门居中
// @version       0.1.4.7
// @description  try to take over the world!
// @author       chancoki
// @include      /https:\/\/t\.bilibili\.com\/.*/
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @namespace https://greasyfork.org/users/754467
// @note        v0.1.3.2 更新一些功能
// @note        v0.1.3 更新一些功能
// @note        v0.1.2.5 添加稍后播放
// @note        v0.1.2.4 优化一些细节
// @downloadURL https://update.greasyfork.org/scripts/429261/B%E7%AB%99%E7%83%AD%E9%97%A8%E5%B1%85%E4%B8%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/429261/B%E7%AB%99%E7%83%AD%E9%97%A8%E5%B1%85%E4%B8%AD.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const rule = /[.*]/;
  const body = document.body;
  const p = document.createElement("p");
  const load = document.createElement("div");
  const ul = document.createElement("ul");
  const ifr = document.createElement("iframe");
  const later = document.createElement("div");
  let isShu = true;
  let isBig = true;
  let isAction = true;
  let li = "";
  let flag = 1;
  let flag1 = true;
  let latrtList = "";
  let list = window.localStorage.getItem("later")
    ? JSON.parse(window.localStorage.getItem("later"))
    : [];
  later.className = "later";
  document.body.appendChild(later);
  ul.className = "v-ul";
  ifr.className = "ifr";
  load.className = "load";
  load.innerHTML = "正在加载...";
  body.appendChild(p);
  ul.style.height =
    (document.documentElement.clientHeight % 2 == 1
      ? document.documentElement.clientHeight + 1
      : document.documentElement.clientHeight) + "px";
  p.innerHTML = `
  <button class="v-btn" style='top:65px;z-index:9999'><svg t="1626091206579" class="icon" viewBox="0 0 1024 1024" version="1.1"
      xmlns="http://www.w3.org/2000/svg" p-id="2394" width="26" height="26">
      <path
        d="M929.623323 598.014206h-236.799289a94.463717 94.463717 0 0 0-94.463717 94.463717v237.311288a93.951718 93.951718 0 0 0 27.647917 66.5598A92.671722 92.671722 0 0 0 691.288038 1023.996928h237.311288A94.719716 94.719716 0 0 0 1024.08704 929.533211v-237.055288a94.975715 94.975715 0 0 0-27.647917-66.8158 93.43972 93.43972 0 0 0-66.8158-27.647917zM921.687347 698.109906a3.32799 3.32799 0 0 1 2.559993 0v221.183336s0 1.791995-3.071991 3.32799h-219.391342a3.32799 3.32799 0 0 1-3.32799-3.32799V701.437896a3.839988 3.839988 0 0 1 0-2.303993 3.071991 3.071991 0 0 1 2.303993 0zM94.297829 425.982722h237.055289A94.463717 94.463717 0 0 0 425.816835 332.799002V94.463717A94.975715 94.975715 0 0 0 331.353118 0H94.553829A94.719716 94.719716 0 0 0 0.090112 94.463717V332.799002a93.951718 93.951718 0 0 0 94.207717 94.207717z m5.887983-102.399693V102.399693A2.559992 2.559992 0 0 1 102.489805 102.399693a2.815992 2.815992 0 0 1 2.303993 0h218.623344a2.559992 2.559992 0 0 1 2.303993 0v223.743329a4.095988 4.095988 0 0 1-2.303993 0H102.489805a3.071991 3.071991 0 0 1-2.303993-3.58399zM586.328353 34.815896a53.759839 53.759839 0 0 0 5.631983 106.49568h2.559993A459.006623 459.006623 0 0 1 921.687347 389.630831a46.335861 46.335861 0 0 0 18.943943 19.96794 47.871856 47.871856 0 0 0 27.903917 9.727971H972.887194a51.199846 51.199846 0 0 0 35.327894-14.591956 49.407852 49.407852 0 0 0 15.871952-35.583893V166.143502a51.199846 51.199846 0 0 0-51.199846-51.199847h-4.095988a51.199846 51.199846 0 0 0-51.199847 51.199847v37.119888a556.79833 556.79833 0 0 0-298.239105-164.095508M439.384794 893.43732a459.006623 459.006623 0 0 1-338.430985-243.199271 51.199846 51.199846 0 0 0-46.59186-32.511902H51.289958a51.199846 51.199846 0 0 0-48.127855 35.583893 33.023901 33.023901 0 0 0-3.071991 9.727971 20.479939 20.479939 0 0 0 0 3.839988v204.799386a51.199846 51.199846 0 0 0 51.199846 51.199846h4.095988a51.199846 51.199846 0 0 0 51.199847-51.199846v-37.631887a558.334325 558.334325 0 0 0 312.319063 162.815511 61.695815 61.695815 0 0 0 19.199942 3.32799h3.839988a51.199846 51.199846 0 0 0 37.119889-15.359953 51.199846 51.199846 0 0 0 13.055961-37.631888 54.015838 54.015838 0 0 0-15.615953-38.143885 51.199846 51.199846 0 0 0-22.271933-13.567959M10.330081 668.413995z"
        p-id="2395" fill="#d4237a"></path>
    </svg></button>
  <button class="v-up" title="回到开始"><svg t="1619865187355" class="icon" viewBox="0 0 1819 1024" version="1.1"
      xmlns="http://www.w3.org/2000/svg" p-id="2872" width="30" height="30">
      <path
        d="M31.507692 986.865934v5.626374a112.527473 112.527473 0 0 0 154.162638 0l723.551648-719.05055 719.050549 719.05055a112.527473 112.527473 0 0 0 154.162638 0l5.626373-5.626374a112.527473 112.527473 0 0 0 0-154.162637L986.865934 31.507692a112.527473 112.527473 0 0 0-154.162637 0L31.507692 832.703297a112.527473 112.527473 0 0 0 0 154.162637z"
        fill="#fb2699" p-id="2873"></path>
    </svg></button>
  <button class="c_cha"><svg t="1619958534562" class="icon" viewBox="0 0 1024 1024" version="1.1"
      xmlns="http://www.w3.org/2000/svg" p-id="2031" width="10" height="10">
      <path
        d="M886.528 908.032c-28.096 28.096-73.856 28.096-102.016 0L138.304 261.824c-28.096-28.16-28.16-73.856 0-102.016 28.032-28.16 73.792-28.16 102.08 0l646.144 646.144C914.624 834.24 914.752 879.872 886.528 908.032L886.528 908.032zM885.76 261.504 239.616 907.648c-28.224 28.224-73.92 28.224-102.08 0-28.16-28.096-28.16-73.728 0.064-102.016L783.744 159.552c28.224-28.16 73.984-28.16 102.016-0.064C913.984 187.648 913.856 233.344 885.76 261.504L885.76 261.504z"
        p-id="2032" fill="#515151"></path>
    </svg></button>
  <button class="c_cha c_big"><svg t="1619959851801" class="icon" viewBox="0 0 1028 1024" version="1.1"
      xmlns="http://www.w3.org/2000/svg" p-id="4352" width="10" height="10">
      <path
        d="M395.731085 571.196755l10.18176 10.18176q4.072704 4.072704 8.145408 7.63632t8.145408 7.63632l12.218112 12.218112q20.363521 20.363521 16.290817 35.636161t-25.454401 35.636161q-9.163584 10.18176-30.036193 31.054369t-44.799745 45.308833-46.32701 46.836098-34.617985 35.636161q-18.327169 18.327169-25.454401 32.072545t6.109056 26.981665q9.163584 9.163584 23.418049 24.436225t24.436225 25.454401q17.308993 17.308993 12.7272 30.545281t-30.036193 15.27264q-26.472577 3.054528-59.05421 7.127232t-67.199618 7.63632-67.708706 7.63632-60.581474 7.127232q-26.472577 3.054528-36.654337-6.618144t-8.145408-34.108897q2.036352-25.454401 5.599968-57.017858t7.63632-64.654178 7.63632-65.672354 6.618144-60.072386q3.054528-29.527105 16.799905-37.672513t31.054369 9.163584q10.18176 10.18176 26.472577 24.945313t27.490753 25.963489 21.381697 7.127232 23.418049-16.290817q13.236288-13.236288 36.145249-36.654337t47.854274-48.363362 48.363362-48.87245 37.672513-38.181601q6.109056-6.109056 13.745376-11.709024t16.799905-7.63632 18.836257 1.018176 20.872609 13.236288zM910.928158 58.036034q26.472577-3.054528 36.654337 6.618144t8.145408 34.108897q-2.036352 25.454401-5.599968 57.017858t-7.63632 64.654178-7.63632 66.181442-6.618144 60.581474q-3.054528 29.527105-16.799905 37.163425t-31.054369-9.672672q-10.18176-10.18176-27.999841-26.472577t-29.018017-27.490753-19.345345-9.672672-20.363521 13.745376q-14.254464 14.254464-37.163425 37.672513t-48.363362 49.381538-49.890626 50.399714l-37.672513 37.672513q-6.109056 6.109056-13.236288 12.218112t-15.781729 9.163584-18.327169 1.018176-19.854433-13.236288l-38.690689-38.690689q-20.363521-20.363521-17.818081-37.163425t22.908961-37.163425q9.163584-9.163584 30.545281-31.054369t45.817921-46.32701 47.345186-47.854274 36.145249-35.636161q18.327169-18.327169 22.908961-30.036193t-8.654496-24.945313q-9.163584-9.163584-21.890785-22.399873t-22.908961-23.418049q-17.308993-17.308993-12.7272-30.545281t30.036193-16.290817 58.545122-7.127232 67.708706-7.63632 67.708706-7.63632 60.581474-7.127232z"
        p-id="4353" fill="#707070"></path>
    </svg></button>
  <button class="c_cha c_shu"><svg t="1620011042461" class="icon" viewBox="0 0 1024 1024" version="1.1"
      xmlns="http://www.w3.org/2000/svg" p-id="2256" width="10" height="10">
      <path
        d="M716.798 0.006H307.202c-79.049 0-143.358 64.309-143.358 143.358v737.271c0 79.049 64.309 143.357 143.358 143.357h409.596c79.049 0 143.357-64.309 143.357-143.357V143.364C860.155 64.315 795.847 0.006 716.798 0.006z m61.438 880.63c0 33.879-27.56 61.438-61.438 61.438H307.202c-33.879 0-61.438-27.56-61.438-61.438V143.364c0-33.879 27.56-61.439 61.438-61.439h409.596c33.879 0 61.438 27.56 61.438 61.439v737.272z"
        fill="#707070" p-id="2257"></path>
      <path d="M378.882 133.125h266.236v81.919H378.882z" fill="#707070" p-id="2258"></path>
      <path d="M512 839.676m-51.199 0a51.199 51.199 0 1 0 102.398 0 51.199 51.199 0 1 0-102.398 0Z" fill="#707070"
        p-id="2259"></path>
    </svg></button>
  <style>
    .load {
      width: 630px;
      height: 60px;
      background-color: transparent;
      text-align: center;
      line-height: 60px;
      border-radius: 5px;
      color: #99a2aa;
    }

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

    .c_big {
      top: 82px;
    }

    .c_shu {
      top: 102px;
    }

    .v-btn:hover,
    .v-up:hover,
    .c_cha:hover {
      background-color: rgba(251, 114, 153, 0.6);
    }


    .v-btn,
    .v-up {
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

    .v-up {
      display: none;
      bottom: 100px;
      animation: find .9s ease;
    }

    a {
      color: #000;
      transition: all 0.3s;
    }

    a:hover {
      color: #00A1D6;
    }

    .v-ul,
    .v-ul-h {
      overflow-y: scroll;
      scrollbar-color: rgba(251, 114, 153, .6) rgba(255, 255, 255, 0.1);
      scrollbar-width: thin;
      overflow: auto;
      z-index: 99;
      position: fixed;
      left: 125%;
      transform: translateX(-50%);
      width: 642px;
      background: rgba(160, 201, 243, .6);
      backdrop-filter: saturate(180%) blur(20px);
      transition: left 1s ease, top .3s, opacity 1s ease;
      animation: sua 1s ease;
      list-style:none;
      margin: 0;
      margin-top:8px;
      padding: 0;
    }

    .v-ul {
      top: 56px;
          box-shadow: 0 0 16px #ccc;
    }

    .v-ul-h {
      top: 0;
    }

    .v-card {
      width: 630px;
      mix-height: 255px;
      background-color: #fff;
      border-radius: 5px;
      box-sizing: border-box;
      padding: 10px 20px;
      position: relative;
      margin-top: 8px;
      background: rgb(255, 255, 255);
      margin-left: 6px;
    }

    .c-right {
      margin-left: 70px;
      margin-top: 20px;

    }

    .c-right>img {
      height: 48px;
      width: 48px;
      position: absolute;
      top: 30px;
      left: 30px;
      border-radius: 60px;
    }

    .c-a-img {
      height: 114px;
      width: 183px;
      display: block;
      overflow: hidden;
      border-radius: 5px;

    }

    .c-a-img img {
      height: 100%;
      border-radius: 5px;
    }

    .dy {
      margin-bottom: 10px;
      word-break: break-word;
      word-wrap: break-word;
      line-height: 22px;
    }

    .c-video {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px solid #F0F3F6;
      border-radius: 5px;
    }

    .v-say {
      flex: 2;
      height: 114px;
      padding: 5px 10px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .v-say .dm {
      display: flex;
      align-items: center;
      justify-content: start;
      gap: 10px;
      font-size: 12px;
      color: #9DA7AB;
    }

    .n-time {
      color: #9DA7AB;
      font-size: 12px;
      margin-bottom: 10px;
      margin-top: 5px;
    }

    .setting {
      background-color: #fff;
      width: 100%;
      height: 35px;
      display: flex;
      align-items: center;
      justify-content: start;
      gap: 50px;
      color: #98A1A8;
      font-size: 12px;
      margin-top: 5px;
    }

    .line2 {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      word-break: break-all;
      word-wrap: break-word;
    }

    .say {
      font-size: 12px;
      color: #6D6D6D;
    }

    @keyframes find {
      0% {
        opacity: 0;
      }

      100% {
        opacity: 1;
      }
    }

    svg {
      position: relative;
      top: 2px
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
      border: none;
      transform-origin: 100% 100%;
      animation: disp1 1.5s ease;
      transition: all .5s ease-in-out
    }

    .ifr_b {
      height: 735px;
      width: 1195px;
    }

    .ifr_s {
      height: 777px;
      width: 449px;
    }

    span.tag111 {
      position: absolute;
      right: 6px;
      top: 5px;
      font-size: 12px;
      height: 18px;
      padding: 0 3px;
      line-height: 18px;
      border-radius: 2px;
      background-color: #fb7299;
      color: #fff;
      z-index: 99;
      display: inline-block;
    }

    @keyframes disp1 {
      0% {
        transform: rotateY(90deg);
      }

      100% {
        transform: rotateY(0deg);
      }
    }

    .tag1 {
      position: relative;
      bottom: 1px;
      font-size: 12px;
      height: 18px;
      padding: 0 3px;
      line-height: 16px;
      border-radius: 2px;
      color: #fff;
      box-sizing: border-box;
    }

    @keyframes sua {
      0% {
        left: 125%;
        opacity: 0;
      }

      100% {
        left: 49.4%;
        opcity: 1;
      }
    }

    .win {
      position: absolute;
      top: 20px;
      right: 20px;
      cursor: pointer;
      background-color: red;
      height: 0px;
    }

    .later {
      position: fixed;
      top: 65px;
      right: 0;
      box-sizing: border-box;
      background-color: transparent;
      width: 50px;
      padding: 5px;
      border-radius: 5px;
    }

    .later a>img {
      border-radius: 50%;
      height: 40px;
      box-shadow: 0 0 5px #222;
    }
    .bp-svg-icon {
    font-size: 16px;
}
  </style>

`;
  const cha = document.querySelector(".c_cha");
  const big = document.querySelector(".c_big");
  const shu = document.querySelector(".c_shu");
  const up = document.querySelector(".v-up");
  const vbt = document.querySelector(".v-btn");
  openList();
  document.addEventListener("scroll", () => {
    let page = window.pageYOffset;
    if (page > 60) {
      ul.className = "v-ul-h";
    } else {
      ul.className = "v-ul";
    }
  });
  ul.addEventListener("scroll", () => {
    var scrollTop = ul.scrollHeight - ul.scrollTop;

    if (scrollTop <= document.documentElement.clientHeight + 10) {
      if (flag <= 25 && isAction) {
        flag++;
        a(flag);
      } else if (flag == 26) {
        load.innerText = "你已经到达了世界的尽头";
        load.style.height = "113px";
        load.style.background =
          "url(//s1.hdslb.com/bfs/seed/bplus-common/dynamic-assets/end.png) center center no-repeat";
        ul.appendChild(load);
      }
    }
  });
  up.addEventListener("click", (e) => {
    if (!flag1) {
      ul.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
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

  vbt.addEventListener("click", (e) => {
    hotG();
  });
  document.addEventListener("keyup", (e) => {
    e.cancelBubble = true;
    if (e.keyCode === 82 && e.path.length <= 4) {
      hotG();
    }
  });
  vbt.addEventListener("dblclick", (e) => {
    if (!flag1) {
      load.innerText = "正在加载...";
      load.style.height = "60px";
      load.removeAttribute("style");
      li = "";
      ul.innerHTML = "";
      flag = 1;
      a(flag);
    }
  });
  ul.addEventListener("click", (e) => {
    if (e.target.id == "win") {
      let query = e.target.className;
      ifr.src = "//player.bilibili.com/player.html?" + query.animVal;
      cha.style.display = "block";
      big.style.display = "block";
      shu.style.display = "block";
      body.appendChild(ifr);
    }
    if (e.target.id == "later") {
      let s = e.target.className.animVal.split("+");
      if (!list.some((i) => i.url == s[0])) {
        list.push({
          url: s[0],
          pic: s[1],
          title: s[2],
        });
      }

      window.localStorage.setItem("later", JSON.stringify(list));
      latrtList = "";
      openList();
    }
  });
  cha.addEventListener("click", () => {
    cha.style.display = "none";
    big.style.display = "none";
    shu.style.display = "none";
    body.removeChild(ifr);
  });
  window.addEventListener("resize", () => {
    ul.style.height =
      (document.documentElement.clientHeight % 2 == 1
        ? document.documentElement.clientHeight + 1
        : document.documentElement.clientHeight) + "px";
  });
  later.addEventListener("click", (e) => {
    const ele = e.target;
    if (ele.nodeName === "IMG") {
      removeImg(ele);
    }
  });
  later.addEventListener("contextmenu", (e) => {
    const ele = e.target;
    e.preventDefault();
    if (ele.nodeName === "IMG") {
      removeImg(ele);
    }
  });
  async function a(num) {
    if (isAction) {
      ul.appendChild(load);
      isAction = false;
      const res = await fetch(
        `https://api.bilibili.com/x/web-interface/popular?ps=25&pn=${num}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await res.json();
      ul.removeChild(load);
      ul.innerHTML += send(data.data.list, li);
      isAction = true;
    }
  }
  function send(data, li) {
    for (let i of data) {
      if (!rule.test(i.owner.name)) {
        li += `<li class="v-card">
      <div class='win'  >
      <svg t="1626789797248" id='later'  class="${i.short_link_v2}+${
          i.owner.face
        }+${
          i.owner.name + "：" + i.title
        }" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2870" width="28" height="28"><path id='later'  class="${
          i.short_link_v2
        }+${i.owner.face}+${
          i.owner.name + "：" + i.title
        }" d="M774.981818 570.181818c23.272727 0 39.563636 2.327273 60.509091 9.309091V286.254545C835.490909 204.8 768 139.636364 686.545455 139.636364h-418.909091C183.854545 139.636364 116.363636 204.8 116.363636 286.254545v418.909091c0 81.454545 67.490909 146.618182 148.945455 146.618182H558.545455c-6.981818-18.618182-9.309091-39.563636-9.309091-60.509091 0-118.690909 102.4-221.090909 225.745454-221.090909m-367.709091 90.763637c-11.636364 0-23.272727-11.636364-23.272727-20.945455V353.745455c0-11.636364 11.636364-20.945455 23.272727-20.945455 6.981818 0 9.309091 2.327273 13.963637 6.981818l193.163636 139.636364c6.981818 4.654545 9.309091 11.636364 9.309091 18.618182 0 9.309091-4.654545 13.963636-9.309091 18.618181l-193.163636 139.636364c-2.327273 2.327273-9.309091 4.654545-13.963637 4.654546m367.709091-44.218182c-97.745455 0-179.2 79.127273-179.2 179.2 0 97.745455 79.127273 179.2 179.2 179.2 97.745455 0 179.2-79.127273 179.2-179.2s-79.127273-179.2-179.2-179.2m86.109091 225.745454c-9.309091 13.963636-25.6 18.618182-39.563636 9.309091l-58.181818-30.254545h-2.327273c-2.327273 0-2.327273-2.327273-4.654546-2.327273l-2.327272-2.327273-2.327273-2.327272c0-2.327273-2.327273-2.327273-2.327273-4.654546-4.654545-4.654545-4.654545-9.309091-4.654545-11.636364v-60.50909c0-16.290909 11.636364-30.254545 30.254545-30.254546 16.290909 0 30.254545 11.636364 30.254546 30.254546v41.890909l46.545454 20.945454c11.636364 6.981818 16.290909 25.6 9.309091 41.890909" fill="#8A8A8A" p-id="2871"></path></svg>
      <svg class="aid=${i.aid}&bvid=${i.bvid}&cid=${
          i.cid
        }&page=1&autoplay=1" id='win' t="1626096608223" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8203" width="30" height="30"><path class="aid=${
          i.aid
        }&bvid=${i.bvid}&cid=${
          i.cid
        }&page=1&autoplay=1" id='win' d="M448 224a32 32 0 0 1 3.072 63.850667L448 288h-149.333333a53.333333 53.333333 0 0 0-53.226667 49.834667L245.333333 341.333333v426.666667a53.333333 53.333333 0 0 0 49.834667 53.226667L298.666667 821.333333h426.666666a53.333333 53.333333 0 0 0 53.226667-49.834666L778.666667 768v-149.333333a32 32 0 0 1 63.850666-3.072L842.666667 618.666667v149.333333a117.333333 117.333333 0 0 1-112.618667 117.248L725.333333 885.333333H298.666667a117.333333 117.333333 0 0 1-117.248-112.618666L181.333333 768V341.333333a117.333333 117.333333 0 0 1 112.618667-117.248L298.666667 224h149.333333z" fill="#8a8a8a" p-id="8204"></path><path d="M733.866667 224h-102.4a108.8 108.8 0 0 0-108.8 108.8v102.4a108.8 108.8 0 0 0 108.8 108.8h102.4a108.8 108.8 0 0 0 108.8-108.8v-102.4a108.8 108.8 0 0 0-108.8-108.8z m-102.4 64h102.4c24.746667 0 44.8 20.053333 44.8 44.8v102.4a44.8 44.8 0 0 1-44.8 44.8h-102.4a44.8 44.8 0 0 1-44.8-44.8v-102.4c0-24.746667 20.053333-44.8 44.8-44.8z" fill="#8a8a8a" p-id="8205"></path></svg></div>
      <div class="c-right">
        <img src="${i.owner.face}" alt="">
        <a class="u-name"style="color:#EA7999; font-size: 16px;" href="https://space.bilibili.com/${
          i.owner.mid
        }"  target="_blank">${i.owner.name}
        <span class="tag1" style='border: 1px solid #FC9D60 ; display:${
          i.rcmd_reason.content != "" ? "inline-block" : "none"
        }; ${
          i.rcmd_reason.content.split("·").length > 1
            ? "background:transparent;color:#FC9D60;"
            : "background:#FC9D60"
        }'};' title='${i.rcmd_reason.content}'>${
          i.rcmd_reason.content
        }</span></a>
        <div class='n-time'>${getLocalTime(i.ctime)}</div>
        <div class="dy">${bvReplace(ReplaceTopic(urlReplace(enterReplace(i.dynamic))))}</div>
        <div class="c-video" style="position: relative;">

        <div style="position: absolute; background-color: rgba(0, 0, 0, 0.7); padding: 0 4px; min-width: 40px; text-align: center;height: 18px; font-size: 12px; line-height: 18px;top: 91px; left: 5px;color: white; border-radius: 5px; z-index: 33;">${getVidieoTime(
          i.duration
        )}</div>
          <a class="c-a-img" href="${
            i.short_link_v2
          }" target="_blank" style="position: relative;">
            <img src="${i.pic}" alt="">
            <span class="tag111">${i.tname}</span>
          </a>
          <div class="v-say">
            <a class="line2" href="${i.short_link_v2}" target="_blank">${
          i.title
        }</a>
            <div class="line2 say">${enterReplace(i.desc)}</div>
            <div class="dm">
              <div><i style="position: relative; top: 2px;" data-v-0514ecc0="" data-v-2b044bfb="" class="bp-icon-font icon-play-a"></i> ${setView(
                i.stat.view
              )}万</div>
              <div><i style="position: relative; top: 2px;" data-v-0514ecc0="" data-v-2b044bfb="" class="bp-icon-font icon-danmu-a"></i> ${
                setView(i.stat.danmaku) > 0
                  ? setView(i.stat.danmaku) + "万"
                  : i.stat.danmaku
              }</div>
            </div>
          </div>
        </div>
        <div class="setting">
          <div><i data-v-60a2097c="" class="bp-svg-icon single-icon transmit"></i> ${
            setView(i.stat.share) > 0
              ? setView(i.stat.share) + "万"
              : i.stat.share
          } </div>
          <div><i data-v-60a2097c="" class="bp-svg-icon single-icon comment"></i> ${
            setView(i.stat.reply) > 0
              ? setView(i.stat.reply) + "万"
              : i.stat.reply
          } </div>
          <div style='position: relative;top: -2px;'><svg t="1626077978987" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11392" width="18" height="18"><path d="M598.354747 67.542626c-48.148687 0-90.130101 32.905051-98.960808 79.437576 0 0-14.312727 72.882424-21.798787 99.090101-12.308687 43.196768-55.363232 90.944646-86.522829 106.188283-23.531313 11.636364-110.99798 11.765657-116.350707 11.765656H155.707475c-32.762828 0-59.384242 26.479192-59.384243 59.384243v475.022222c0 32.762828 26.479192 59.384242 59.384243 59.384242h548.033939c88.126061 0 163.025455-64.452525 176.135758-151.647676l45.873131-305.713132c10.834747-71.809293-44.8-136.274747-117.423838-136.274747H673.254141s20.066263-66.469495 30.228687-178.669899c5.081212-56.837172-35.167677-110.99798-94.280404-117.152323-3.620202-0.54303-7.227475-0.814545-10.847677-0.814546zM333.705051 898.288485V421.533737c38.917172-2.534141 66.999596-8.016162 83.574949-16.316767 43.726869-21.669495 99.633131-81.040808 117.281616-143.088485 7.899798-27.681616 21.39798-96.155152 23.001212-104.184243 3.47798-17.92 20.596364-31.159596 40.649697-31.159596 1.603232 0 3.206465 0.129293 4.822627 0.271516 28.211717 2.947879 43.326061 29.698586 41.32202 52.686868-9.360808 103.912727-27.823838 166.503434-28.082425 166.904243l-23.130505 76.489697h215.182223c17.519192 0 33.564444 7.356768 45.071515 20.596363 11.507071 13.239596 16.316768 30.228687 13.640404 47.618586L821.294545 797.052121c-8.830707 58.569697-58.181818 101.094141-117.423838 101.094142h-370.165656v0.142222z m-177.997576 0v-475.022222h118.626262v475.022222H155.707475z m0 0" p-id="11393" fill="#99A2AA"></path></svg> ${
            setView(i.stat.like) > 0 ? setView(i.stat.like) + "万" : i.stat.like
          }</div>
        </div>
      </div>

    </li>`;
      }
    }
    return li;
  }
  function ReplaceTopic(str) {
    var r, re; // 声明变量。
    var ss = str;
    r = ss;
    re = /\#([^\#|.]+)\#/g;
    let reg = new RegExp("#([^#|.]+)#", "ig"); // 创建正则对象
    let result;
    if ((result = reg.exec(ss)) != null) {
      r = ss.replace(
        re,
        "<a href='//t.bilibili.com/topic/name/" +
          result[1] +
          "/feed' target='_blank' class='dynamic-link-hover-bg' style='cursor:pointer;color:#178bcf;'>" +
          result[0] +
          "</a>"
      );
    }

    return r; //返回替换后的字符串
  }
  function hotG() {
    if (flag1) {
      if (ul.innerHTML == "") {
        li = "";
        flag = 1;
        a(flag);
        body.appendChild(ul);
        up.style.display = "block";
      }
      ul.style.left = "49.4%";
      ul.style.opacity = "1";
      up.style.display = "block";
    } else {
      ul.style.left = "125%";
      ul.style.opacity = "0";
      up.style.display = "none";
    }
    flag1 = !flag1;
  }
  function openList() {
    for (let i of list) {
      latrtList += `
    <a href="${i.url}" target='_blank' title='${i.title}'>
  <img src="${i.pic}" alt="">
  </a>`;
    }
    later.innerHTML = latrtList;
  }
  function removeImg(ele) {
    list.splice(list.indexOf(list.filter((i) => i.pic == ele.src)[0]), 1);
    latrtList = "";
    openList();
    window.localStorage.setItem("later", JSON.stringify(list));
  }
  function getVidieoTime(num) {
    return (
      (parseInt(num / 60) < 10
        ? "0" + parseInt(num / 60)
        : parseInt(num / 60)) +
      ":" +
      (num % 60 < 10 ? "0" + (num % 60) : num % 60)
    );
  }
  function getLocalTime(nS) {
    let time = new Date(parseInt(nS) * 1000);
    let newTime = new Date()
      .toLocaleDateString()
      .replace(/\//g, "-")
      .substr(5, 10);
    let DataTime = time.toLocaleDateString().replace(/\//g, "-").substr(5, 10);
    if (newTime == DataTime) {
      DataTime = "";
    }
    return DataTime + " " + time.toTimeString().substr(0, 5);
  }
  function setView(data) {
    return parseInt(data / 10000);
  }
  function urlReplace(content) {
    const regexp = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|\&|-)+)/g;
    if(!regexp.test(content))return content
    return content.replace(regexp, function($url){
      return "<a href='" + $url + "' target='_blank' style='cursor:pointer;color:#178bcf;' class='dynamic-link-hover-bg'>网页链接</a>";
  })
}
  function bvReplace(content) {
  const regexp = /(BV[1-9a-zA-Z]{10})/g;
    if(!regexp.test(content))return content
  return content.replace(regexp, function($url){
    return "<a href='https://b23.tv/" + $url + "' target='_blank' style='cursor:pointer;color:#178bcf;' class='dynamic-link-hover-bg'>" + $url + "</a>";
  });
}
  function enterReplace(content) {
  const regexp = /\n/g;
    if(!regexp.test(content))return content
  return content.replace(regexp, '<br>');
}
})();
